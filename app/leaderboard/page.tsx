import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Crosshair, Target, Trophy } from 'lucide-react';
import { brand } from '@/lib/brand';
import { LeaderboardTable } from '@/components/leaderboard-table';
import { PublicNavigation } from '@/components/public-navigation';
export const metadata: Metadata = { title: 'Leaderboard', description: `Die besten Spieler und Teams von ${brand.name}.`, alternates: { canonical: '/leaderboard' } };
export default function LeaderboardPage(){return <main className="leaderboard-page"><PublicNavigation /><header className="leaderboard-header"><Link className="legal-brand" href="/">← {brand.name}</Link><p className="section-kicker">Arena-Rangliste</p><h1>Wer führt<br/><em>die Arena an?</em></h1><p>Die besten Spieler mit ihren wichtigsten Statistiken – live aus der Arena.</p></header><section className="leaderboard-panel"><div className="leaderboard-panel-head"><div><Trophy size={21}/><h2>Top-Spieler</h2></div><span>Live aus der Arena</span></div><LeaderboardTable/></section><section className="leaderboard-stats"><article><Target/><strong>KDA</strong><span>Kills, Deaths & Assists</span></article><article><Crosshair/><strong>Trefferquote</strong><span>Präzision pro Match</span></article><article><Trophy/><strong>Highscore</strong><span>Punkte und Siege</span></article></section><Link className="leaderboard-back" href="/"><ArrowLeft size={16}/> Zur Website</Link></main>}
