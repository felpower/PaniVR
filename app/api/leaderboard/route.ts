import { NextResponse } from 'next/server';
import { Query } from 'node-appwrite';
import { appwriteConfigured, databaseId, getTablesDB, getUsers, playerScoresTableId } from '@/lib/appwrite-server';
export const runtime = 'nodejs';

type ScoreRow = Record<string, unknown> & { $id: string };
type PlayerTotals = { playerId: string; name: string; games: number; kills: number; deaths: number; assists: number; headshots: number; shotsHit: number; shotsFired: number; score: number };

// Seitenweise laden, damit auch nach vielen Matches alle Ergebnisse zählen
// (vorher wurden nur die ersten 500 Einträge berücksichtigt).
async function listAllScoreRows() {
  const db = getTablesDB();
  const rows: ScoreRow[] = [];
  let cursor = '';
  for (let page = 0; page < 50; page += 1) {
    const result = await db.listRows({ databaseId, tableId: playerScoresTableId, queries: [Query.limit(1000), ...(cursor ? [Query.cursorAfter(cursor)] : [])], total: false, ttl: 0 });
    rows.push(...(result.rows as unknown as ScoreRow[]));
    if (result.rows.length < 1000) break;
    cursor = result.rows[result.rows.length - 1].$id;
  }
  return rows;
}

export async function GET() {
  if (!appwriteConfigured) return NextResponse.json({ players: [] });
  try {
    const rows = await listAllScoreRows();
    const totals = new Map<string, PlayerTotals>();
    for (const row of rows) { const id = String(row.playerId || row.displayName || row.$id); const player = totals.get(id) || { playerId: id, name: String(row.displayName || 'Spieler'), games: 0, kills: 0, deaths: 0, assists: 0, headshots: 0, shotsHit: 0, shotsFired: 0, score: 0 }; player.name = String(row.displayName || player.name); player.games += Number(row.gamesPlayed || 1); player.kills += Number(row.kills || 0); player.deaths += Number(row.deaths || 0); player.assists += Number(row.assists || 0); player.headshots += Number(row.headshots || 0); player.shotsHit += Number(row.shotsHit || 0); player.shotsFired += Number(row.shotsFired || 0); player.score += Number(row.score || 0); totals.set(id, player); }
    const entries = [...totals.values()];
    const visibility = await Promise.all(entries.map(async (player) => { try { return !(await getUsers().get(player.playerId)).prefs?.leaderboardOptOut; } catch { return true; } }));
    const players = entries.filter((_, index) => visibility[index]).map((p) => ({ ...p, kda: Number(((p.kills + p.assists / 2) / Math.max(1, p.deaths)).toFixed(2)), accuracy: p.shotsFired ? Number((p.shotsHit / p.shotsFired * 100).toFixed(1)) : 0 })).sort((a, b) => b.score - a.score || b.kills - a.kills).slice(0, 100).map((p, index) => ({ ...p, rank: index + 1 }));
    return NextResponse.json({ players });
  } catch { return NextResponse.json({ message: 'Das Leaderboard konnte nicht geladen werden.' }, { status: 503 }); }
}
