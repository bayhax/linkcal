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
    // First, try to activate the license (idempotent - won't double-activate)
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

    const data = await activateResponse.json();

    // Check if license is now active or was already active
    if (activateResponse.ok && data.status === 'active') {
      return res.status(200).json({
        valid: true,
        license: {
          key: data.key,
          status: data.status,
          activations: data.activation,
          maxActivations: data.activation_limit,
          expiresAt: data.expires_at,
        },
      });
    } else if (data.status === 'inactive' && data.activation >= data.activation_limit) {
      // Activation limit reached
      return res.status(200).json({
        valid: false,
        error: 'License activation limit reached',
      });
    } else {
      // License invalid or other error
      return res.status(200).json({
        valid: false,
        error: data.error || data.message || 'Invalid license key',
        _debug: {
          env: process.env.VERCEL_ENV || 'unknown',
          api: CREEM_API,
          usingFallbackKey: USING_FALLBACK_KEY,
          creemResponse: data,
        },
      });
    }
  } catch (error) {
    console.error('License verification error:', error);
    return res.status(500).json({
      valid: false,
      error: 'Failed to verify license',
    });
  }
}
