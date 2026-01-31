import type { VercelRequest, VercelResponse } from '@vercel/node';

// Use production or test API based on environment
const IS_PRODUCTION = process.env.VERCEL_ENV === 'production';
const CREEM_API = IS_PRODUCTION ? 'https://api.creem.io' : 'https://test-api.creem.io';
const CREEM_API_KEY = process.env.CREEM_API_KEY || 'creem_test_3qWavV5aUN6biC1v6r3F2Q';

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
    // Call Creem API to validate license
    const response = await fetch(`${CREEM_API}/v1/licenses/validate`, {
      method: 'POST',
      headers: {
        'x-api-key': CREEM_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        key: licenseKey,
      }),
    });

    const data = await response.json();

    if (response.ok && data.valid) {
      return res.status(200).json({
        valid: true,
        license: {
          key: data.key,
          status: data.status,
          activations: data.activations,
          maxActivations: data.max_activations,
          expiresAt: data.expires_at,
          metadata: data.metadata,
        },
      });
    } else {
      // License invalid or expired
      return res.status(200).json({
        valid: false,
        error: data.error || 'Invalid license key',
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
