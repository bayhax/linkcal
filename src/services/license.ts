// License service for Pro features

const API_BASE = '';

export interface LicenseInfo {
  valid: boolean;
  key?: string;
  status?: string;
  expiresAt?: string;
  error?: string;
}

export interface CheckoutResult {
  checkoutUrl?: string;
  error?: string;
}

// Verify a license key with the server
export async function verifyLicense(licenseKey: string): Promise<LicenseInfo> {
  try {
    const response = await fetch(`${API_BASE}/api/license/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ licenseKey }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('License verification failed:', error);
    return { valid: false, error: 'Network error' };
  }
}

// Create a checkout session (email collected by Creem)
export async function createCheckout(plan: 'monthly' | 'lifetime'): Promise<CheckoutResult> {
  try {
    const response = await fetch(`${API_BASE}/api/checkout/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ plan }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Checkout creation failed:', error);
    return { error: 'Network error' };
  }
}

// Local storage key for license
const LICENSE_STORAGE_KEY = 'linkcal-license';

export function getStoredLicense(): string | null {
  return localStorage.getItem(LICENSE_STORAGE_KEY);
}

export function setStoredLicense(licenseKey: string): void {
  localStorage.setItem(LICENSE_STORAGE_KEY, licenseKey);
}

export function clearStoredLicense(): void {
  localStorage.removeItem(LICENSE_STORAGE_KEY);
}
