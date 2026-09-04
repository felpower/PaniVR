import Image from 'next/image';
import { ArrowDown, ArrowRight, Building2, CalendarCheck, Check, CirclePlay, Crosshair, Gamepad2, Gift, MapPin, Sparkles, Users, UtensilsCrossed, WifiOff, Zap } from 'lucide-react';
import { BookingForm } from '@/components/booking-form';
import { BrandIdentity } from '@/components/brand-identity';
import { MobileBookingCta } from '@/components/mobile-booking-cta';
import { brand, siteUrl } from '@/lib/brand';

const facts = [
  { value: 'XX m²', label: 'freie Spielfläche' },
  { value: `${brand.booking.minimumPlayers}–${brand.booking.maximumPlayers}`, label: 'Spieler gleichzeitig' },
  { value: '100 %', label: 'exklusiv für euch' },
];

const faqs = [
  ['Was ist Free-Roam VR?', 'Ihr bewegt euch frei und ohne Kabel durch eine große reale Spielfläche. In der VR-Brille wird daraus eine virtuelle Arena – jede echte Bewegung wird direkt ins Spiel übertragen.'],
  ['Teilen wir die Arena mit anderen?', 'Nein. Euer gebuchter Termin gehört nur eurer Gruppe. Es werden keine fremden Spieler dazugebucht.'],
  ['Kann VR Übelkeit verursachen?', 'Bei Free-Roam bewegt ihr euch in der echten Halle genauso wie in der virtuellen Welt. Das reduziert den typischen Konflikt zwischen Augen und Gleichgewichtssinn deutlich.'],
  ['Was sollen wir mitbringen?', 'Bequeme Kleidung und saubere Hallenschuhe sind ideal. Die VR-Brillen und Controller bekommt ihr selbstverständlich von uns.'],
  ['Ist das auch für Firmen und größere Gruppen möglich?', 'Ja. Für Team-Events, Vereine und Gruppen außerhalb der regulären Größe stellen wir gerne ein individuelles Programm zusammen. Schreibt uns oder ruft kurz an.'],
  ['Müssen wir online bezahlen?', 'Nein. Die Reservierung ist kostenlos und ohne Online-Zahlung. Alle weiteren Details erhaltet ihr mit der Reservierungsbestätigung.'],
];

export default function Home() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'EntertainmentBusiness',
    name: brand.name,
    description: brand.description,
    url: siteUrl,
    telephone: brand.phoneHref,
    email: brand.email,
    image: `${siteUrl}/og.png`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: brand.address.street,
      postalCode: brand.address.postalCode,
      addressLocality: brand.address.city,
      addressRegion: brand.address.region,
      addressCountry: brand.address.country,
    },
    parentOrganization: { '@type': 'Organization', name: brand.legalName },
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <header className="site-header">
        <a className="brand" href="#top" aria-label={`${brand.name} Startseite`}>
          <BrandIdentity />
        </a>
        <nav className="desktop-nav" aria-label="Hauptnavigation">
          <a href="#erlebnis">Erlebnis</a><a href="#ablauf">So läuft&apos;s</a><a href="#anlaesse">Für Gruppen</a><a href="#faq">FAQ</a>
        </nav>
        <a className="button button-small" href="#buchen">Termin sichern</a>
      </header>

      <section className="hero" id="top">
        <div className="hero-grid" aria-hidden="true" /><div className="hero-glow hero-glow-one" aria-hidden="true" /><div className="hero-glow hero-glow-two" aria-hidden="true" />
        <div className="hero-copy">
          <p className="eyebrow"><span /> Free-Roam VR in Kleinraming</p>
          <h1>Raus aus dem Alltag.<br /><em>Rein ins Spiel.</em></h1>
          <p className="hero-lead">Eure Arena. Eure Mission. Völlige Bewegungsfreiheit in einer der größten Indoor-VR-Flächen der Region Steyr.</p>
          <div className="hero-actions">
            <a className="button" href="#buchen">Jetzt reservieren <ArrowRight size={18} /></a>
            <a className="text-link" href="#erlebnis">Erlebnis entdecken <ArrowDown size={17} /></a>
          </div>
        </div>

        <div className="arena-card" aria-label={`${brand.name} Free-Roam-VR-Arena`}>
          <div className="arena-scan" />
          <div className="arena-topline"><span>FREE-ROAM // VR</span><span className="live-dot">● ARENA</span></div>
          <div className="arena-visual"><span className="arena-line arena-line-one" /><span className="arena-line arena-line-two" /><span className="arena-node arena-node-one" /><span className="arena-node arena-node-two" /><span className="arena-node arena-node-three" /><strong className="arena-title">MOVE<br /><em>TOGETHER</em></strong></div>
          <div className="arena-bottom"><span>PRIVATE SESSION</span><span>NO CABLES. NO LIMITS.</span></div>
        </div>

        <div className="hero-stats" aria-label="Die wichtigsten Fakten">
          {facts.map((fact) => <div key={fact.label}><strong>{fact.value}</strong><span>{fact.label}</span></div>)}
          <div className="hosted-by"><span>Direkt beim</span><strong>Gasthaus zur Linde</strong></div>
        </div>
      </section>

      <div className="ticker" aria-hidden="true"><div><span>FREE-ROAM VR</span><i>✦</i><span>TEAM VS TEAM</span><i>✦</i><span>KABELLOS</span><i>✦</i><span>MITTEN IM RAMINGTAL</span><i>✦</i><span>FREE-ROAM VR</span><i>✦</i><span>TEAM VS TEAM</span></div></div>

      <section className="intro section-pad" id="erlebnis">
        <div className="section-heading">
          <p className="section-kicker">Das ist {brand.name}</p>
          <h2>Nicht nur zuschauen.<br />Ihr seid <span>mittendrin.</span></h2>
          <p>Vergesst Joystick und Bildschirm. Bei uns wird die ganze Halle zur Spielwelt – und ihr zur Hauptfigur.</p>
        </div>
        <div className="feature-grid">
          <article className="feature-card feature-dark"><div className="feature-number">01</div><WifiOff /><h3>Frei. Kabellos.<br />Ungebremst.</h3><p>Laufen, ducken, ausweichen und miteinander agieren – ohne Kabel und ohne Rucksack-PC.</p></article>
          <article className="feature-card feature-acid"><div className="feature-number">02</div><Crosshair /><h3>Gemeinsam<br />im Einsatz.</h3><p>Kommuniziert, plant eure Taktik und erlebt eine Mission, über die ihr noch lange sprecht.</p></article>
          <article className="feature-card feature-light"><div className="feature-number">03</div><Sparkles /><h3>Eure private<br />Arena.</h3><p>Kein Warten, keine fremden Mitspieler: Die gesamte Fläche ist für euren Termin reserviert.</p></article>
        </div>
      </section>

      <section className="experience-photo">
        <Image src="/og.png" alt="Vier Freunde spielen gemeinsam kabellose Free-Roam Virtual Reality in einer großen Halle" fill sizes="100vw" priority={false} />
        <div className="experience-overlay" />
        <div className="experience-copy"><p className="eyebrow"><span /> Seid ihr bereit?</p><h2>Die Halle wird zur<br /><em>anderen Welt.</em></h2><a href="#buchen" className="round-link" aria-label="Termin reservieren"><ArrowRight /></a></div>
        <div className="experience-badge"><CirclePlay /><span>Volle Bewegung<br /><strong>Volle Immersion</strong></span></div>
      </section>

      <section className="steps section-pad" id="ablauf">
        <div className="section-heading split"><div><p className="section-kicker">So läuft&apos;s</p><h2>Von 0 auf<br /><span>mittendrin.</span></h2></div><p>Keine Vorerfahrung? Perfekt. Wir kümmern uns um die Technik – ihr bringt nur euer Team und gute Laune mit.</p></div>
        <div className="steps-grid">
          <article><span>01</span><CalendarCheck /><h3>Termin wählen</h3><p>Freien Slot aussuchen und in zwei Minuten kostenlos reservieren.</p></article>
          <article><span>02</span><Gamepad2 /><h3>Einchecken</h3><p>15 Minuten früher da sein. Wir erklären euch Ausrüstung, Regeln und Mission.</p></article>
          <article><span>03</span><Zap /><h3>Abtauchen</h3><p>Headset auf, Team finden und gemeinsam in eine neue Welt starten.</p></article>
        </div>
      </section>

      <section className="occasions section-pad" id="anlaesse">
        <div className="occasion-intro"><p className="section-kicker">Für eure Crew</p><h2>Ein Erlebnis,<br />das <span>verbindet.</span></h2><p>Aus einer freien Halle wird euer nächstes Highlight – für kleine Teams genauso wie für den großen Anlass.</p></div>
        <div className="occasion-list">
          <article><Users /><div><h3>Freunde & Vereine</h3><p>Gemeinsam statt gegeneinander auf der Couch.</p></div><ArrowRight /></article>
          <article><Gift /><div><h3>Geburtstag & Polterer</h3><p>Adrenalin, Teamgeist und danach anstoßen.</p></div><ArrowRight /></article>
          <article><Building2 /><div><h3>Firmen & Teamevents</h3><p>Neue Rollen, echte Kommunikation, starkes Team.</p></div><ArrowRight /></article>
        </div>
      </section>

      <section className="venue-band">
        <div className="venue-copy"><p className="section-kicker">Mehr als VR</p><h2>Spielen. Essen.<br /><span>Bleiben.</span></h2><p>Direkt neben der Arena warten österreichische Gastlichkeit und gemütliche Gästezimmer. So wird aus einer Runde VR ein ganzer gemeinsamer Abend.</p><a href="https://www.gasthaus-panholzer.at/" target="_blank" rel="noreferrer" className="outline-button">Gasthaus entdecken <ArrowRight size={17} /></a></div>
        <div className="venue-cards"><article><Image className="venue-photo" src="https://www.gasthaus-panholzer.at/userupload/editorupload/files/files/Pani-Gasthaus-2025.jpg" alt="Gasthaus zur Linde in Kleinraming" width={900} height={650} /><UtensilsCrossed /><span>Nach dem Spiel</span><h3>Gasthaus<br />zur Linde</h3><p>Echte Wirtshausküche und kühle Getränke direkt vor Ort.</p></article><article><Image className="venue-photo" src="https://www.gasthaus-panholzer.at/userupload/editorupload/files/images/Panis-Gaestezimmer4.jpg" alt="Gemütliches Zimmer in Pani&apos;s Gästezimmern" width={900} height={650} /><MapPin /><span>Einfach bleiben</span><h3>Pani&apos;s<br />Gästezimmer</h3><p>Fünf gemütlich-moderne Zimmer im selben Haus.</p></article></div>
      </section>

      <section className="booking-section section-pad" id="buchen">
        <div className="booking-intro"><p className="section-kicker">Online reservieren</p><h2>Eure Mission<br />startet <span>hier.</span></h2><p>Wählt euren Wunschtermin. Keine Online-Zahlung, keine fremden Mitspieler – die Arena gehört euch.</p><ul><li><Check /> Kostenlos reservieren</li><li><Check /> Exklusiver Termin</li><li><Check /> Änderung telefonisch möglich</li></ul></div>
        <BookingForm />
      </section>

      <section className="faq section-pad" id="faq">
        <div className="faq-heading"><p className="section-kicker">Gut zu wissen</p><h2>Fragen?<br /><span>Antworten.</span></h2><p>Noch etwas unklar? Ruft uns einfach an unter <a href={`tel:${brand.phoneHref}`}>{brand.phoneDisplay}</a>.</p></div>
        <div className="faq-list">{faqs.map(([question, answer], index) => <details key={question}><summary><span>{String(index + 1).padStart(2, '0')}</span>{question}<i>+</i></summary><p>{answer}</p></details>)}</div>
      </section>

      <section className="location">
        <div className="location-grid" aria-hidden="true" /><div className="location-marker"><span>P</span><i /></div>
        <div className="location-layout"><div className="location-card"><p className="section-kicker">Hier findet ihr uns</p><h2>Mitten im<br /><span>Ramingtal.</span></h2><address>{brand.venueName}<br />{brand.address.street}<br />{brand.address.postalCode} {brand.address.city}</address><a className="button" href={brand.mapsUrl} target="_blank" rel="noreferrer">Route planen <ArrowRight size={17} /></a></div><div className="location-map"><iframe title="Karte: VR Virtual Raiders in Kleinraming" src="https://www.google.com/maps?q=Ramingtalstra%C3%9Fe+18,+4442+Kleinraming&output=embed" loading="lazy" referrerPolicy="no-referrer-when-downgrade" /></div></div>
      </section>

      <footer><div className="footer-main"><a className="brand footer-brand" href="#top" aria-label={`${brand.name} Startseite`}><BrandIdentity /></a><p>{brand.tagline}<br />Free-Roam VR bei Steyr.</p><a className="footer-cta" href="#buchen">Jetzt Termin sichern <ArrowRight /></a></div><div className="footer-bottom"><span>© {new Date().getFullYear()} {brand.name} · {brand.legalName}</span><nav><a href="/impressum">Impressum</a><a href="/datenschutz">Datenschutz</a><a href={`mailto:${brand.email}`}>Kontakt</a></nav></div></footer>
      <MobileBookingCta />
    </main>
  );
}
