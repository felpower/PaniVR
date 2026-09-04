import { Client, TablesDB } from 'node-appwrite';

const endpoint = process.env.PANIVR_APPWRITE_ENDPOINT || process.env.APPWRITE_ENDPOINT || process.env.APPWRITE_SITE_API_ENDPOINT;
const projectId = process.env.PANIVR_APPWRITE_PROJECT_ID || process.env.APPWRITE_PROJECT_ID || process.env.APPWRITE_SITE_PROJECT_ID;
const apiKey = process.env.PANIVR_APPWRITE_API_KEY || process.env.APPWRITE_API_KEY;

export const appwriteConfigured = Boolean(endpoint && projectId && apiKey);
export const databaseId = process.env.PANIVR_APPWRITE_DATABASE_ID || process.env.APPWRITE_DATABASE_ID || 'panivr';
export const reservationsTableId = process.env.PANIVR_APPWRITE_RESERVATIONS_TABLE_ID || process.env.APPWRITE_RESERVATIONS_TABLE_ID || 'reservations';
export const adminsTableId = process.env.PANIVR_APPWRITE_ADMINS_TABLE_ID || 'admins';
export const contactTableId = process.env.PANIVR_APPWRITE_CONTACT_TABLE_ID || 'contact_requests';

export function getTablesDB() {
  if (!endpoint || !projectId || !apiKey) {
    throw new Error('Appwrite ist noch nicht konfiguriert.');
  }

  const client = new Client().setEndpoint(endpoint).setProject(projectId).setKey(apiKey);
  return new TablesDB(client);
}
