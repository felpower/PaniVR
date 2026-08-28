import type { Metadata } from 'next';
import Link from 'next/link';
import { brand } from '@/lib/brand';

export const metadata: Metadata = { title: 'Impressum', description: `Impressum und Anbieterinformationen von ${brand.name}.`, alternates: { canonical: '/impressum' } };

export default function Impressum() {
  return (
    <main className="legal-page">
      <Link className="legal-brand" href="/">← {brand.name}</Link>
      <article>
        <p className="section-kicker">Rechtliches</p><h1>Impressum</h1>
        <h2>Medieninhaber und Diensteanbieter</h2>
        <p><strong>{brand.legalName}</strong><br />Gasthaus „Zur Linde“<br />{brand.address.street}<br />{brand.address.postalCode} {brand.address.city}<br />Österreich</p>
        <p>Telefon: <a href={`tel:${brand.phoneHref}`}>{brand.phoneDisplay}</a><br />E-Mail: <a href={`mailto:${brand.email}`}>{brand.email}</a><br />UID-Nr.: ATU 60803759</p>
        <h2>Unternehmensgegenstand</h2><p>Gastgewerbe und Freizeitangebote. Zuständige Aufsichtsbehörde und Kammerzugehörigkeit sind vor Veröffentlichung mit dem Betreiber zu ergänzen bzw. zu prüfen.</p>
        <h2>Haftung</h2><p>Die Inhalte dieser Website werden mit größtmöglicher Sorgfalt erstellt. Für Inhalte externer Links sind ausschließlich deren Betreiber verantwortlich.</p>
        <p className="legal-note">Hinweis: Diese Seite ist ein redaktioneller Entwurf und muss vor dem Livegang rechtlich geprüft und vervollständigt werden.</p>
      </article>
    </main>
  );
}
