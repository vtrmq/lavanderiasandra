import crypto from 'node:crypto';
import { SESSION_SECRET } from '$env/static/private';

export const CLIENTAUTHINFO = 'client-auth-info';

export const SESSION_CONFIG = {
  maxAge: 60 * 60 * 24 * 30,
  secure: process.env.NODE_ENV === 'production',
  httpOnly: true,
  sameSite: 'lax' as const, // Compatible con firmas
  path: '/'
};

export function signSession(data: object): string {
  const dataStr = JSON.stringify(data);
  const signature = crypto
  .createHmac('sha256', SESSION_SECRET)
  .update(dataStr)
  .digest('base64');
  return `${btoa(dataStr)}.${signature}`;
}

export function verifySession(signedData: string): object | null {
  const [encodedData, signature] = signedData.split('.');
  const dataStr = atob(encodedData);
  const expectedSignature = crypto
  .createHmac('sha256', SESSION_SECRET)
  .update(dataStr)
  .digest('base64');
  return signature === expectedSignature ? JSON.parse(dataStr) : null;
}

export function getDateTime() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');

  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}


