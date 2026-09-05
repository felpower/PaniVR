import { NextResponse } from 'next/server';
import { Query } from 'node-appwrite';
import { appwriteConfigured, databaseId, getTablesDB, getUsers, playerScoresTableId } from '@/lib/appwrite-server';
export const runtime = 'nodejs';

export async function GET() {
  if (!appwriteConfigured) return NextResponse.json({ players: [] });
  try {
    const result = await getTablesDB().listRows({ databaseId, tableId: playerScoresTableId, queries: [Query.limit(500)], total: false, ttl: 0 });
    const totals = new Map<string, any>();
    for (const row of result.rows) { const id = String(row.playerId || row.displayName || row.$id); const player = totals.get(id) || { playerId: id, name: String(row.displayName || 'Spieler'), games: 0, kills: 0, deaths: 0, assists: 0, headshots: 0, shotsHit: 0, shotsFired: 0, score: 0 }; player.name = String(row.displayName || player.name); player.games += Number(row.gamesPlayed || 1); player.kills += Number(row.kills || 0); player.deaths += Number(row.deaths || 0); player.assists += Number(row.assists || 0); player.headshots += Number(row.headshots || 0); player.shotsHit += Number(row.shotsHit || 0); player.shotsFired += Number(row.shotsFired || 0); player.score += Number(row.score || 0); totals.set(id, player); }
    const entries = [...totals.values()];
    const visibility = await Promise.all(entries.map(async (player) => { try { return !(await getUsers().get(player.playerId)).prefs?.leaderboardOptOut; } catch { return true; } }));
    const players = entries.filter((_, index) => visibility[index]).map((p) => ({ ...p, kda: Number(((p.kills + p.assists / 2) / Math.max(1, p.deaths)).toFixed(2)), accuracy: p.shotsFired ? Number((p.shotsHit / p.shotsFired * 100).toFixed(1)) : 0 })).sort((a, b) => b.score - a.score || b.kills - a.kills).slice(0, 100).map((p, index) => ({ ...p, rank: index + 1 }));
    return NextResponse.json({ players });
  } catch { return NextResponse.json({ message: 'Das Leaderboard konnte nicht geladen werden.' }, { status: 503 }); }
}
