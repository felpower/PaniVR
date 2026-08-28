import { Client, TablesDB } from 'node-appwrite';

const endpoint = process.env.APPWRITE_ENDPOINT;
const projectId = process.env.APPWRITE_PROJECT_ID;
const apiKey = process.env.APPWRITE_API_KEY;

export const appwriteConfigured = Boolean(endpoint && projectId && apiKey);
export const databaseId = process.env.APPWRITE_DATABASE_ID || 'panivr';
export const reservationsTableId = process.env.APPWRITE_RESERVATIONS_TABLE_ID || 'reservations';

export function getTablesDB() {
  if (!endpoint || !projectId || !apiKey) {
    throw new Error('Appwrite ist noch nicht konfiguriert.');
  }

  const client = new Client().setEndpoint(endpoint).setProject(projectId).setKey(apiKey);
  return new TablesDB(client);
}
