import { Client, TablesDB } from 'node-appwrite';

const endpoint = process.env.PANIVR_APPWRITE_ENDPOINT || process.env.APPWRITE_ENDPOINT || process.env.APPWRITE_SITE_API_ENDPOINT;
const projectId = process.env.PANIVR_APPWRITE_PROJECT_ID || process.env.APPWRITE_PROJECT_ID || process.env.APPWRITE_SITE_PROJECT_ID;
const apiKey = process.env.PANIVR_APPWRITE_API_KEY || process.env.APPWRITE_API_KEY;

export const appwriteConfigured = Boolean(endpoint && projectId && apiKey);
export const databaseId = process.env.PANIVR_APPWRITE_DATABASE_ID || process.env.APPWRITE_DATABASE_ID || 'panivr';
export const reservationsTableId = process.env.PANIVR_APPWRITE_RESERVATIONS_TABLE_ID || process.env.APPWRITE_RESERVATIONS_TABLE_ID || 'reservations';
export const adminsTableId = process.env.PANIVR_APPWRITE_ADMINS_TABLE_ID || 'admins';
export const contactTableId = process.env.PANIVR_APPWRITE_CONTACT_TABLE_ID || 'contact_requests';

export async function sendMailgunEmail(input: { to: string; subject: string; text: string; html: string }) {
  const key = process.env.PANIVR_MAILGUN_API_KEY || process.env.MAILGUN_API_KEY;
  const domain = process.env.PANIVR_MAILGUN_DOMAIN || process.env.MAILGUN_DOMAIN;
  const region = (process.env.PANIVR_MAILGUN_REGION || process.env.MAILGUN_REGION || 'EU').toUpperCase();
  if (!key || !domain) throw new Error('Mailgun ist noch nicht konfiguriert.');
  const endpoint = region === 'US' ? 'https://api.mailgun.net/v3' : 'https://api.eu.mailgun.net/v3';
  const form = new URLSearchParams({ from: process.env.PANIVR_MAILGUN_FROM || process.env.MAILGUN_FROM || `VR Virtual Raiders <no-reply@${domain}>`, to: input.to, subject: input.subject, text: input.text, html: input.html });
  const response = await fetch(`${endpoint}/${domain}/messages`, { method: 'POST', headers: { Authorization: `Basic ${Buffer.from(`api:${key}`).toString('base64')}`, 'Content-Type': 'application/x-www-form-urlencoded' }, body: form });
  if (!response.ok) throw new Error(`Mailgun ${response.status}`);
}

export function getTablesDB() {
  if (!endpoint || !projectId || !apiKey) {
    throw new Error('Appwrite ist noch nicht konfiguriert.');
  }

  const client = new Client().setEndpoint(endpoint).setProject(projectId).setKey(apiKey);
  return new TablesDB(client);
}
