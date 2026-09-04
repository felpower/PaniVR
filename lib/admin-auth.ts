import 'server-only';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Account, Client, Query } from 'node-appwrite';
import { adminsTableId, databaseId, getTablesDB } from '@/lib/appwrite-server';

export const adminSessionCookie = 'virtual_raiders_admin_session';

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

export async function isAdminEmail(email: string) {
  const normalized = email.trim().toLowerCase();
  if (isAllowedAdmin(normalized)) return true;
  try {
    const result = await getTablesDB().listRows({ databaseId, tableId: adminsTableId, queries: [Query.equal('email', [normalized]), Query.equal('status', ['active']), Query.limit(1)], total: false, ttl: 0 });
    return result.rows.length > 0;
  } catch {
    // The table is optional during bootstrap; the environment allowlist remains valid.
    return false;
  }
}

export async function getAdminRole(email: string) {
  if (isAllowedAdmin(email)) return 'owner' as const;
  try {
    const result = await getTablesDB().listRows({ databaseId, tableId: adminsTableId, queries: [Query.equal('email', [email.trim().toLowerCase()]), Query.equal('status', ['active']), Query.limit(1)], total: false, ttl: 0 });
    return String(result.rows[0]?.role || 'admin') as 'owner' | 'admin' | 'readonly';
  } catch { return null; }
}

export async function getCurrentAdmin() {
  // Local-only escape hatch for testing the admin UI without sending a magic
  // link. Production builds can never use this path, even if the variable is
  // accidentally present in the hosting environment.
  if (process.env.NODE_ENV === 'development' && process.env.DEV_ADMIN_BYPASS === 'true') {
    return { user: { name: 'Development Admin', email: getAllowedAdminEmails()[0] || 'info@felpower-software.com' }, sessionSecret: '' };
  }

  const sessionSecret = (await cookies()).get(adminSessionCookie)?.value;
  if (!sessionSecret) return null;
  try {
    const user = await getSessionAccount(sessionSecret).get();
    if (!(await isAdminEmail(user.email))) return null;
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
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured && !/deine-domain|example\.(com|at)/i.test(configured)) {
    const url = new URL(configured);
    if (url.protocol !== 'https:' && !['localhost', '127.0.0.1'].includes(url.hostname)) {
      throw new Error('Die öffentliche Site-URL muss HTTPS verwenden.');
    }
    return url.origin;
  }

  const fallback = new URL(requestOrigin);
  if (process.env.NODE_ENV === 'development' && ['localhost', '127.0.0.1'].includes(fallback.hostname)) {
    return fallback.origin;
  }

  throw new Error('NEXT_PUBLIC_SITE_URL muss auf die öffentliche HTTPS-Adresse der Website gesetzt werden.');
}
