import 'server-only';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Account, Client } from 'node-appwrite';

export const adminSessionCookie = 'panivr_admin_session';

function appwriteClient() {
  const endpoint = process.env.PANIVR_APPWRITE_ENDPOINT || process.env.APPWRITE_ENDPOINT || process.env.APPWRITE_SITE_API_ENDPOINT;
  const projectId = process.env.PANIVR_APPWRITE_PROJECT_ID || process.env.APPWRITE_PROJECT_ID || process.env.APPWRITE_SITE_PROJECT_ID;
  if (!endpoint || !projectId) throw new Error('Appwrite Auth ist noch nicht konfiguriert.');
  return new Client().setEndpoint(endpoint).setProject(projectId);
}

export function getAdminApiAccount() {
  const apiKey = process.env.PANIVR_APPWRITE_API_KEY || process.env.APPWRITE_API_KEY;
  if (!apiKey) throw new Error('Der Appwrite API-Key fehlt.');
  return new Account(appwriteClient().setKey(apiKey));
}

export function getSessionAccount(sessionSecret: string) {
  return new Account(appwriteClient().setSession(sessionSecret));
}

export function getAllowedAdminEmails() {
  const configured = process.env.PANIVR_ADMIN_EMAILS || process.env.APPWRITE_ADMIN_EMAILS || 'info@felpower-software.com';
  return configured.split(',').map((email) => email.trim().toLowerCase()).filter(Boolean);
}

export function isAllowedAdmin(email: string) {
  return getAllowedAdminEmails().includes(email.trim().toLowerCase());
}

export async function getCurrentAdmin() {
  const sessionSecret = (await cookies()).get(adminSessionCookie)?.value;
  if (!sessionSecret) return null;
  try {
    const user = await getSessionAccount(sessionSecret).get();
    if (!isAllowedAdmin(user.email)) return null;
    return { user, sessionSecret };
  } catch {
    return null;
  }
}

export async function requireAdmin() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect('/admin/login');
  return admin;
}

export function trustedCallbackOrigin(requestOrigin: string) {
  if (process.env.NODE_ENV === 'development') return requestOrigin;
  const configured = process.env.NEXT_PUBLIC_SITE_URL;
  if (!configured || configured.includes('deine-domain')) throw new Error('Die öffentliche Site-URL ist noch nicht konfiguriert.');
  return new URL(configured).origin;
}
