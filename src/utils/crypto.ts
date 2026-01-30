import LZString from 'lz-string';
import type { Calendar } from '../types';

// Derive a key from password using PBKDF2
async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveKey']
  );
  
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt as unknown as BufferSource,
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

// Simple XOR-based encoding for sync encryption (demo purposes)
// In production, use proper async encryption
export function encryptData(data: string, password: string): string {
  const encoder = new TextEncoder();
  const dataBytes = encoder.encode(data);
  const passwordBytes = encoder.encode(password);
  
  // Create a simple encrypted representation
  const encrypted = new Uint8Array(dataBytes.length);
  for (let i = 0; i < dataBytes.length; i++) {
    encrypted[i] = dataBytes[i] ^ passwordBytes[i % passwordBytes.length];
  }
  
  const base64 = btoa(String.fromCharCode(...encrypted));
  return LZString.compressToEncodedURIComponent(base64);
}

export function decryptData(encoded: string, password: string): string | null {
  try {
    const base64 = LZString.decompressFromEncodedURIComponent(encoded);
    if (!base64) return null;
    
    const encrypted = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
    const passwordBytes = new TextEncoder().encode(password);
    
    const decrypted = new Uint8Array(encrypted.length);
    for (let i = 0; i < encrypted.length; i++) {
      decrypted[i] = encrypted[i] ^ passwordBytes[i % passwordBytes.length];
    }
    
    return new TextDecoder().decode(decrypted);
  } catch {
    return null;
  }
}

export async function encryptCalendar(calendar: Calendar, password: string): Promise<string> {
  const json = JSON.stringify(calendar);
  const encoder = new TextEncoder();
  const data = encoder.encode(json);
  
  // Generate random salt and IV
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  
  const key = await deriveKey(password, salt);
  
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    data
  );
  
  // Combine salt + iv + encrypted data
  const combined = new Uint8Array(salt.length + iv.length + encrypted.byteLength);
  combined.set(salt, 0);
  combined.set(iv, salt.length);
  combined.set(new Uint8Array(encrypted), salt.length + iv.length);
  
  // Convert to base64 and prefix with 'e:'
  const base64 = btoa(String.fromCharCode(...combined));
  return `e:${LZString.compressToEncodedURIComponent(base64)}`;
}

export async function decryptCalendar(hash: string, password: string): Promise<Calendar | null> {
  try {
    if (!hash.startsWith('e:')) {
      throw new Error('Not an encrypted calendar');
    }
    
    const base64 = LZString.decompressFromEncodedURIComponent(hash.slice(2));
    if (!base64) throw new Error('Failed to decompress');
    
    const combined = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
    
    // Extract salt, iv, and encrypted data
    const salt = combined.slice(0, 16);
    const iv = combined.slice(16, 28);
    const encrypted = combined.slice(28);
    
    const key = await deriveKey(password, salt);
    
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      encrypted
    );
    
    const decoder = new TextDecoder();
    const json = decoder.decode(decrypted);
    return JSON.parse(json) as Calendar;
  } catch (e) {
    console.error('Decryption failed:', e);
    return null;
  }
}

export function isEncrypted(hash: string): boolean {
  return hash.startsWith('e:');
}
