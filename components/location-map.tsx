'use client';
import Link from 'next/link';
import { useState } from 'react';
import { MapPin } from 'lucide-react';
import { brand } from '@/lib/brand';

const embedUrl = `https://www.google.com/maps?q=${encodeURIComponent(`${brand.address.street}, ${brand.address.postalCode} ${brand.address.city}`)}&output=embed`;

// Die Karte wird erst nach einem Klick geladen, damit beim Seitenaufruf keine
// Daten (z. B. IP-Adresse) an Google übertragen werden.
export function LocationMap() {
  const [loaded, setLoaded] = useState(false);
  if (loaded) return <iframe title={`Karte: ${brand.name} in ${brand.address.city}`} src={embedUrl} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />;
  return (
    <div className="map-consent">
      <MapPin size={30} aria-hidden="true" />
      <p>Beim Laden der Karte werden Daten wie eure IP-Adresse an Google übertragen. Mehr dazu in der <Link href="/datenschutz">Datenschutzerklärung</Link>.</p>
      <button type="button" className="button" onClick={() => setLoaded(true)}>Karte laden</button>
      <a className="map-consent-link" href={brand.mapsUrl} target="_blank" rel="noreferrer">Direkt in Google Maps öffnen</a>
    </div>
  );
}
