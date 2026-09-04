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
        <p><strong>Gasthaus „Zur Linde“</strong><br /><strong>{brand.legalName}</strong><br />{brand.address.street}<br />{brand.address.postalCode} {brand.address.city}<br />Österreich</p>
        <p>Telefon: <a href="tel:+43725230729">07252 / 30729</a><br />Mobil: <a href={`tel:${brand.phoneHref}`}>{brand.phoneDisplay}</a><br />E-Mail: <a href="mailto:markus.panholzer93@gmx.at">markus.panholzer93@gmx.at</a><br />UID-Nr.: ATU 60803759</p>
        <h2>Unternehmensgegenstand</h2><p>Gastgewerbe sowie Freizeitangebote (Free-Roam-VR). Weitere gesetzlich erforderliche Angaben, insbesondere Firmenbuch- und Aufsichtsbehördendaten, werden nach Betreiberfreigabe ergänzt.</p>
        <h2>Website</h2><p>Konzeption und technische Umsetzung: <a href="https://felpower-software.com/" target="_blank" rel="noreferrer">Felpower Software</a>.</p>
        <h2>Haftung</h2><p>Die Inhalte dieser Website werden mit größtmöglicher Sorgfalt erstellt. Für Inhalte externer Links sind ausschließlich deren Betreiber verantwortlich.</p>
      </article>
    </main>
  );
}
