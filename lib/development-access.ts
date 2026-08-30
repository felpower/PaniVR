const accessCookie = 'panivr_development_access';
const tokenMessage = 'panivr-development-preview-v2';

export const developmentAccessCookie = accessCookie;

function configuredPassword() {
  return process.env.DEV_ACCESS_PASSWORD || '';
}

async function tokenFor(password: string) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(tokenMessage));
  return Array.from(new Uint8Array(signature), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

export async function validDevelopmentPassword(password: string) {
  const expected = configuredPassword();
  if (!expected || !password) return false;
  const [candidateToken, expectedToken] = await Promise.all([tokenFor(password), tokenFor(expected)]);
  return candidateToken === expectedToken;
}

export async function validDevelopmentAccess(cookieValue: string | undefined) {
  const password = configuredPassword();
  if (!password || !cookieValue) return false;
  return cookieValue === await tokenFor(password);
}

export async function createDevelopmentAccessToken() {
  const password = configuredPassword();
  if (!password) throw new Error('Der Development-Zugang ist nicht konfiguriert.');
  return tokenFor(password);
}
