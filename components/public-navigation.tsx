import Link from 'next/link';
import { BrandIdentity } from '@/components/brand-identity';
import { brand } from '@/lib/brand';

export function PublicNavigation({ home = false }: { home?: boolean }) {
  const prefix = home ? '' : '/';
  return <header className="site-header public-navigation">
    <Link className="brand" href={home ? '#top' : '/'} aria-label={`${brand.name} Startseite`}><BrandIdentity /></Link>
    <nav className="desktop-nav" aria-label="Hauptnavigation">
      <a href={`${prefix}#erlebnis`}>Erlebnis</a><a href={`${prefix}#ablauf`}>So läuft&apos;s</a><a href={`${prefix}#anlaesse`}>Für Gruppen</a><Link href="/event">Preise & Events</Link><Link href="/leaderboard">Leaderboard</Link><Link href="/spieler">Spielerbereich</Link><a href={`${prefix}#faq`}>FAQ</a>
    </nav>
    <a className="button button-small" href={`${prefix}#buchen`}>Termin sichern</a>
  </header>;
}
