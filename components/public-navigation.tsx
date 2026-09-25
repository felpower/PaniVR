'use client';

import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { BrandIdentity } from '@/components/brand-identity';
import { brand } from '@/lib/brand';

export function PublicNavigation({ home = false }: { home?: boolean }) {
  const [open, setOpen] = useState(false);
  const prefix = home ? '' : '/';
  const close = () => setOpen(false);
  const links = <><a href={`${prefix}#erlebnis`} onClick={close}>Erlebnis</a><a href={`${prefix}#ablauf`} onClick={close}>So läuft&apos;s</a><a href={`${prefix}#anlaesse`} onClick={close}>Für Gruppen</a><Link href="/event" onClick={close}>Preise & Events</Link><Link href="/leaderboard" onClick={close}>Leaderboard</Link><Link href="/spieler" onClick={close}>Spielerbereich</Link><a href={`${prefix}#faq`} onClick={close}>FAQ</a><Link href="/kontakt" onClick={close}>Kontakt</Link></>;
  return <header className="site-header public-navigation">
    <Link className="brand" href={home ? '#top' : '/'} onClick={close} aria-label={`${brand.name} Startseite`}><BrandIdentity /></Link>
    <nav className="desktop-nav" aria-label="Hauptnavigation">{links}</nav>
    <a className="button button-small" href={`${prefix}#buchen`}>Termin sichern</a>
    <button className="mobile-menu-toggle" type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-controls="mobile-navigation" aria-label={open ? 'Menü schließen' : 'Menü öffnen'}>{open ? <X /> : <Menu />}</button>
    {open && <nav id="mobile-navigation" className="mobile-nav" aria-label="Mobile Hauptnavigation"><div className="mobile-nav-links">{links}</div><a className="button" href={`${prefix}#buchen`} onClick={close}>Termin sichern</a></nav>}
  </header>;
}
