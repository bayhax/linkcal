import type { VercelRequest, VercelResponse } from '@vercel/node';

const CREEM_API = 'https://test-api.creem.io';
const CREEM_API_KEY = process.env.CREEM_API_KEY || 'creem_test_3qWavV5aUN6biC1v6r3F2Q';

// Product IDs in Creem
const PRODUCTS = {
  monthly: process.env.CREEM_PRODUCT_MONTHLY || 'prod_monthly_5',
  lifetime: process.env.CREEM_PRODUCT_LIFETIME || 'prod_lifetime_29',
};

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

  const { plan } = req.body;

  if (!plan || !['monthly', 'lifetime'].includes(plan)) {
    return res.status(400).json({ error: 'Valid plan (monthly/lifetime) is required' });
  }

  const baseUrl = req.headers.origin || 'https://linkcal.link';

  try {
    const response = await fetch(`${CREEM_API}/v1/checkouts`, {
      method: 'POST',
      headers: {
        'x-api-key': CREEM_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        product_id: PRODUCTS[plan as keyof typeof PRODUCTS],
        success_url: `${baseUrl}/?checkout=success`,
      }),
    });

    const data = await response.json();

    if (response.ok && data.checkout_url) {
      return res.status(200).json({
        checkoutUrl: data.checkout_url,
      });
    } else {
      console.error('Creem checkout error:', data);
      return res.status(400).json({
        error: data.message || data.error || 'Failed to create checkout session',
      });
    }
  } catch (error) {
    console.error('Checkout creation error:', error);
    return res.status(500).json({
      error: 'Failed to create checkout session',
    });
  }
}
