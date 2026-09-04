import type { Metadata } from 'next';
import Link from 'next/link';
import { brand } from '@/lib/brand';

export const metadata: Metadata = { title: 'Datenschutz', description: `Informationen zum Datenschutz bei ${brand.name}.`, alternates: { canonical: '/datenschutz' } };

export default function Datenschutz() {
  return (
    <main className="legal-page">
      <Link className="legal-brand" href="/">← {brand.name}</Link>
      <article>
        <p className="section-kicker">Rechtliches</p><h1>Datenschutz</h1>
        <h2>Verantwortlicher</h2><p>Markus Panholzer<br />{brand.legalName}<br />{brand.address.street}, {brand.address.postalCode} {brand.address.city}<br />Telefon: <a href="tel:+43725230729">07252 / 30729</a><br />E-Mail: <a href="mailto:markus.panholzer93@gmx.at">markus.panholzer93@gmx.at</a></p>
        <h2>Reservierungsdaten</h2><p>Wenn ihr online reserviert, verarbeiten wir Name, Kontaktdaten, Termin, Gruppengröße, Anlass und freiwillige Hinweise. Diese Angaben werden ausschließlich zur Bearbeitung und Durchführung der Reservierung, zur Kontaktaufnahme bei Änderungen und zur Vermeidung von Doppelbuchungen verwendet.</p>
        <h2>Hosting und technische Daten</h2><p>Die Website und das Reservierungssystem werden über Appwrite in der europäischen Region betrieben. Beim Aufruf können technisch notwendige Verbindungsdaten wie IP-Adresse, Zeitpunkt, aufgerufene Seite und Browserinformationen in Serverprotokollen verarbeitet werden. Diese Verarbeitung dient dem sicheren und stabilen Betrieb der Website.</p>
        <h2>E-Mail-Versand</h2><p>Für Reservierungsbestätigungen und Antworten auf Kontaktanfragen verwenden wir den E-Mail-Dienst Mailgun. Dabei werden die für den Versand erforderlichen Empfängerdaten und Nachrichteninhalte an Mailgun übermittelt. Die Verarbeitung erfolgt auf Grundlage der Vertragserfüllung bzw. unseres berechtigten Interesses an einer zuverlässigen Kommunikation.</p>
        <h2>Speicherdauer</h2><p>Reservierungsdaten werden nur so lange gespeichert, wie sie für die Durchführung, gesetzliche Aufbewahrungspflichten oder die Abwehr möglicher Ansprüche benötigt werden. Konkrete Löschfristen sind vor Veröffentlichung mit dem Betreiber festzulegen.</p>
        <h2>Eure Rechte</h2><p>Ihr könnt Auskunft, Berichtigung, Löschung oder Einschränkung der Verarbeitung verlangen und einer Verarbeitung widersprechen. Wendet euch dazu an die oben genannte E-Mail-Adresse. Außerdem besteht ein Beschwerderecht bei der zuständigen Datenschutzbehörde.</p>
        <h2>Cookies und eingebettete Inhalte</h2><p>Die aktuelle Version setzt keine Marketing- oder Analyse-Cookies ein. Auf der Kontaktseite ist eine Google-Maps-Karte eingebettet. Beim Laden der Karte kann Google technische Daten wie IP-Adresse und Browserinformationen erhalten.</p>
        <p className="legal-note">Hinweis: Diese Datenschutzerklärung ist ein technischer Entwurf. Vor dem Livegang müssen insbesondere Appwrite-Region, Löschfristen und alle tatsächlich eingesetzten Dienste rechtlich geprüft und ergänzt werden.</p>
      </article>
    </main>
  );
}
