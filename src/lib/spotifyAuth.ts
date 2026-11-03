const STORAGE_KEYS = {
  CLIENT_ID: 'spotify_ai_client_id',
  GEMINI_KEY: 'spotify_ai_gemini_key',
  CODE_VERIFIER: 'spotify_pkce_verifier',
  ACCESS_TOKEN: 'spotify_access_token',
  REFRESH_TOKEN: 'spotify_refresh_token',
  EXPIRES_AT: 'spotify_expires_at',
} as const;

const DEFAULT_CLIENT_ID = '69029b97a6c247c2a80b926be374c05c';

export const SPOTIFY_SCOPES = [
  'user-read-private',
  'user-read-email',
  'user-top-read',
  'user-read-recently-played',
  'user-read-currently-playing',
  'user-read-playback-state',
  'playlist-read-private',
  'playlist-read-collaborative',
  'playlist-modify-private',
  'playlist-modify-public',
  'user-library-read',
].join(' ');

export function getRedirectUri(): string {
  if (typeof window === 'undefined') {
    return 'http://127.0.0.1:5173/callback';
  }
  const url = new URL(window.location.origin);
  if (url.hostname === 'localhost') {
    url.hostname = '127.0.0.1';
  }
  return `${url.origin}/callback`;
}

export function getSavedClientId(): string {
  if (typeof window === 'undefined') return DEFAULT_CLIENT_ID;
  return (
    localStorage.getItem(STORAGE_KEYS.CLIENT_ID) ||
    process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID ||
    DEFAULT_CLIENT_ID
  ).trim();
}

export function saveClientId(clientId: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.CLIENT_ID, clientId.trim());
}

export function getSavedGeminiKey(): string {
  if (typeof window === 'undefined') return '';
  return (
    localStorage.getItem(STORAGE_KEYS.GEMINI_KEY) ||
    process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
    ''
  ).trim();
}

export function saveGeminiKey(key: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.GEMINI_KEY, key.trim());
}

function generateRandomString(length: number): string {
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  const values = crypto.getRandomValues(new Uint8Array(length));
  return Array.from(values)
    .map((x) => possible[x % possible.length])
    .join('');
}

async function sha256(plain: string): Promise<ArrayBuffer> {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return crypto.subtle.digest('SHA-256', data);
}

function base64UrlEncode(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export async function startSpotifyLogin(clientId: string): Promise<void> {
  const cleanClientId = clientId.trim() || DEFAULT_CLIENT_ID;
  saveClientId(cleanClientId);

  if (window.location.hostname === 'localhost') {
    const target = new URL(window.location.href);
    target.hostname = '127.0.0.1';
    window.location.href = target.toString();
    return;
  }

  const codeVerifier = generateRandomString(64);
  const hashed = await sha256(codeVerifier);
  const codeChallenge = base64UrlEncode(hashed);

  localStorage.setItem(STORAGE_KEYS.CODE_VERIFIER, codeVerifier);

  const authUrl = new URL('https://accounts.spotify.com/authorize');
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('client_id', cleanClientId);
  authUrl.searchParams.set('scope', SPOTIFY_SCOPES);
  authUrl.searchParams.set('code_challenge_method', 'S256');
  authUrl.searchParams.set('code_challenge', codeChallenge);
  authUrl.searchParams.set('redirect_uri', getRedirectUri());

  window.location.href = authUrl.toString();
}

export async function exchangeCodeForToken(code: string): Promise<string> {
  const clientId = getSavedClientId();
  const codeVerifier = localStorage.getItem(STORAGE_KEYS.CODE_VERIFIER);

  if (!clientId || !codeVerifier) {
    throw new Error(
      'Sesi PKCE tidak ditemukan. Silakan klik Log in Spotify kembali.'
    );
  }

  const body = new URLSearchParams({
    client_id: clientId,
    grant_type: 'authorization_code',
    code,
    redirect_uri: getRedirectUri(),
    code_verifier: codeVerifier,
  });

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(
      data.error_description || data.error || 'Gagal menukar kode OAuth Spotify.'
    );
  }

  storeTokenResponse(data);
  localStorage.removeItem(STORAGE_KEYS.CODE_VERIFIER);
  return data.access_token;
}

function storeTokenResponse(data: {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
}): void {
  const expiresAt = Date.now() + (data.expires_in - 60) * 1000;
  localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, data.access_token);
  localStorage.setItem(STORAGE_KEYS.EXPIRES_AT, String(expiresAt));
  if (data.refresh_token) {
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, data.refresh_token);
  }
}

export async function getValidAccessToken(): Promise<string | null> {
  if (typeof window === 'undefined') return null;
  const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  const expiresAt = Number(localStorage.getItem(STORAGE_KEYS.EXPIRES_AT) || '0');

  if (accessToken && Date.now() < expiresAt) {
    return accessToken;
  }

  const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  const clientId = getSavedClientId();
  if (!refreshToken || !clientId) {
    return null;
  }

  try {
    const body = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: clientId,
    });
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    });
    if (!response.ok) {
      logoutSpotify();
      return null;
    }
    const data = await response.json();
    storeTokenResponse(data);
    return data.access_token;
  } catch {
    return null;
  }
}

export function logoutSpotify(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.EXPIRES_AT);
  localStorage.removeItem(STORAGE_KEYS.CODE_VERIFIER);
}
