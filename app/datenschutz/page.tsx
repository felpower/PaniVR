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
        <h2>Speicherdauer</h2><p>Offene Reservierungen werden bis zur Durchführung oder Stornierung des Termins gespeichert. Danach löschen wir die Reservierungsdaten grundsätzlich innerhalb von 12 Monaten. Wenn gesetzliche Aufbewahrungspflichten oder die Abwehr bzw. Durchsetzung von Ansprüchen eine längere Speicherung erfordern, werden die Daten bis zum Ablauf dieser Fristen aufbewahrt und anschließend gelöscht. Kontaktanfragen löschen wir spätestens 12 Monate nach der letzten Kommunikation, sofern kein Vertragsverhältnis oder gesetzlicher Grund für eine längere Aufbewahrung besteht. Technische Server- und Sicherheitsprotokolle werden grundsätzlich spätestens nach 30 Tagen gelöscht.</p>
        <h2>Eingesetzte Dienstleister</h2><p><strong>Appwrite</strong> (Appwrite Inc.) stellt Hosting, Datenbank und Authentifizierung bereit. Das Projekt wird in der EU-Region betrieben. Appwrite beschreibt seine DSGVO-Maßnahmen in der <a href="https://appwrite.io/docs/advanced/security/gdpr" target="_blank" rel="noreferrer">DSGVO-Dokumentation</a>; ein Auftragsverarbeitungsvertrag kann in den Organisationseinstellungen abgeschlossen werden.</p><p><strong>Mailgun</strong> (Mailgun Technologies/Sinch) versendet Reservierungsbestätigungen und Kontaktantworten. Für dieses Projekt ist die EU-Region aktiviert. Mailgun stellt Informationen zur <a href="https://www.mailgun.com/gdpr/" target="_blank" rel="noreferrer">DSGVO-Konformität und zum DPA</a> bereit.</p>
        <h2>Eure Rechte</h2><p>Ihr könnt Auskunft, Berichtigung, Löschung oder Einschränkung der Verarbeitung verlangen und einer Verarbeitung widersprechen. Wendet euch dazu an die oben genannte E-Mail-Adresse. Außerdem besteht ein Beschwerderecht bei der zuständigen Datenschutzbehörde.</p>
        <h2>Cookies und eingebettete Inhalte</h2><p>Die aktuelle Version setzt keine Marketing- oder Analyse-Cookies ein. Auf der Kontaktseite ist eine Google-Maps-Karte eingebettet. Beim Laden der Karte kann Google technische Daten wie IP-Adresse und Browserinformationen erhalten.</p>
      </article>
    </main>
  );
}
