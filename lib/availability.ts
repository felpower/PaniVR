import { Query } from 'node-appwrite';
import { appwriteConfigured, availabilityTableId, databaseId, getTablesDB } from './appwrite-server';
import { getSlotsForDate } from './booking';

export async function getAvailableSlots(date: string) {
  const fallback = getSlotsForDate(date);
  if (!appwriteConfigured) return fallback;
  try {
    const result = await getTablesDB().listRows({ databaseId, tableId: availabilityTableId, queries: [Query.equal('date', [date]), Query.limit(100)], total: false, ttl: 0 });
    if (!result.rows.length) return fallback;
    return result.rows.filter((row) => String(row.status || 'open') === 'open').map((row) => String(row.slot)).sort();
  } catch { return fallback; }
}

export async function hasConfiguredDate(date: string) {
  if (!appwriteConfigured) return false;
  try {
    const result = await getTablesDB().listRows({ databaseId, tableId: availabilityTableId, queries: [Query.equal('date', [date]), Query.limit(1)], total: false, ttl: 0 });
    return result.rows.length > 0;
  } catch { return false; }
}
