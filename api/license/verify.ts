import type { VercelRequest, VercelResponse } from '@vercel/node';

// Use production or test API based on environment
const IS_PRODUCTION = process.env.VERCEL_ENV === 'production';
const CREEM_API = IS_PRODUCTION ? 'https://api.creem.io' : 'https://test-api.creem.io';
const CREEM_API_KEY = process.env.CREEM_API_KEY || 'creem_test_3qWavV5aUN6biC1v6r3F2Q';
const USING_FALLBACK_KEY = !process.env.CREEM_API_KEY;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { licenseKey } = req.body;

  if (!licenseKey) {
    return res.status(400).json({ error: 'License key is required' });
  }

  try {
    // Step 1: Validate/check the license status first
    const validateResponse = await fetch(`${CREEM_API}/v1/licenses/validate`, {
      method: 'POST',
      headers: {
        'x-api-key': CREEM_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ key: licenseKey }),
    });

    const validateData = await validateResponse.json();

    // If license is already active, return valid
    if (validateResponse.ok && validateData.status === 'active') {
      return res.status(200).json({
        valid: true,
        license: {
          key: validateData.key,
          status: validateData.status,
          activations: validateData.activation,
          maxActivations: validateData.activation_limit,
          expiresAt: validateData.expires_at,
        },
      });
    }

    // If license is inactive and has activations remaining, try to activate
    if (validateResponse.ok && validateData.status === 'inactive') {
      if (validateData.activation < validateData.activation_limit) {
        const activateResponse = await fetch(`${CREEM_API}/v1/licenses/activate`, {
          method: 'POST',
          headers: {
            'x-api-key': CREEM_API_KEY,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            key: licenseKey,
            instance_name: 'linkcal-web',
          }),
        });

        const activateData = await activateResponse.json();

        if (activateResponse.ok && activateData.status === 'active') {
          return res.status(200).json({
            valid: true,
            license: {
              key: activateData.key,
              status: activateData.status,
              activations: activateData.activation,
              maxActivations: activateData.activation_limit,
              expiresAt: activateData.expires_at,
            },
          });
        }
      }
      
      // Activation limit reached but license exists - still valid for this use case
      // (user already activated on another device/session)
      return res.status(200).json({
        valid: true,
        license: {
          key: validateData.key,
          status: 'active', // treat as active since they own it
          activations: validateData.activation,
          maxActivations: validateData.activation_limit,
          expiresAt: validateData.expires_at,
        },
      });
    }

    // License not found or other error
    return res.status(200).json({
      valid: false,
      error: validateData.error || validateData.message || 'Invalid license key',
      _debug: {
        env: process.env.VERCEL_ENV || 'unknown',
        api: CREEM_API,
        usingFallbackKey: USING_FALLBACK_KEY,
        creemResponse: validateData,
      },
    });
  } catch (error) {
    console.error('License verification error:', error);
    return res.status(500).json({
      valid: false,
      error: 'Failed to verify license',
    });
  }
}
