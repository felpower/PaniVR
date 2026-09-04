import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Gamepad2 } from 'lucide-react';
import { brand } from '@/lib/brand';
import { PlayerAuth } from '@/components/player-auth';
export const metadata:Metadata={title:'Spielerbereich',description:`Spielerkonto und Statistiken bei ${brand.name}.`,alternates:{canonical:'/spieler'}};
export default function PlayerPage(){return <main className="player-page"><header><Link className="legal-brand" href="/">← {brand.name}</Link><Gamepad2 size={34}/><p className="section-kicker">Spielerbereich</p><h1>Dein Profil.<br/><em>Deine Stats.</em></h1><p>Erstelle dein Konto, sammle Highscores und verfolge deine Matches.</p></header><section className="player-panel"><PlayerAuth/></section><Link className="player-back" href="/"><ArrowLeft size={16}/> Zur Website</Link></main>}
