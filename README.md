# PaniVR

Moderne, SEO-optimierte Website mit einem reservierungsfähigen Appwrite-Backend für die geplante Free-Roam-VR-Halle beim Gasthaus zur Linde in Kleinraming.

## Lokal starten

```bash
npm install
npm run dev
```

Ohne Appwrite-Zugangsdaten läuft der komplette Buchungsablauf lokal im Demo-Modus. In einer Production-Build-Konfiguration werden Reservierungen erst angenommen, sobald Appwrite korrekt verbunden ist.

Die Development-Version arbeitet mit `SITE_ACCESS_MODE=protected` und `BOOKING_MODE=test`. Dadurch ist die gesamte Site inklusive APIs passwortgeschützt, Suchmaschinen werden abgewiesen und gespeicherte Reservierungen sind eindeutig als `test` markiert. Erst für den echten Livegang werden beide Werte bewusst auf `public` beziehungsweise `live` geändert.

Lokale Secrets gehören ausschließlich in eine ignorierte `.env` oder `.env.local`. Es wird absichtlich keine `.env.example` versioniert. Benötigte Variablennamen:

| Variable | Zweck |
|---|---|
| `DEV_ACCESS_PASSWORD` | Passwort der internen Vorschau |
| `SITE_ACCESS_MODE` | `protected` oder später `public` |
| `BOOKING_MODE` | `test`, `disabled` oder später `live` |
| `NEXT_PUBLIC_SITE_URL` | öffentliche HTTPS-URL der Site |
| `APPWRITE_ENDPOINT` | lokaler Appwrite-Endpunkt |
| `APPWRITE_PROJECT_ID` | lokale Projekt-ID |
| `APPWRITE_API_KEY` | lokaler geheimer Server-Key |
| `APPWRITE_DATABASE_ID` | standardmäßig `panivr` |
| `APPWRITE_RESERVATIONS_TABLE_ID` | standardmäßig `reservations` |
| `APPWRITE_ADMIN_EMAILS` | freigeschaltete Admin-Adressen, kommasepariert |

Auf Appwrite Sites dürfen eigene Variablen nicht mit `APPWRITE_` beginnen. Dort werden deshalb die Aliase `PANIVR_APPWRITE_ENDPOINT`, `PANIVR_APPWRITE_PROJECT_ID`, `PANIVR_APPWRITE_API_KEY`, `PANIVR_APPWRITE_DATABASE_ID`, `PANIVR_APPWRITE_RESERVATIONS_TABLE_ID` und `PANIVR_ADMIN_EMAILS` verwendet. Der API-Key und das Development-Passwort müssen als Secret markiert werden.

## Branding und noch offene Fakten

Name, Kontaktdaten, Adresse, Gruppengröße, Buchungsfenster und Zeitslots werden zentral in `lib/brand.ts` gepflegt. Dadurch kann `PaniVR` später mit einer einzigen Änderung umbenannt werden. Vor dem Livegang sind vor allem diese Werte zu bestätigen:

- endgültiger Name und Domain
- genaue Hallengröße statt `XX m²`
- Mindestalter und Gruppengröße
- echte Spiel- und Öffnungszeiten
- Preis, Dauer, Storno- und Bekleidungsregeln
- separate VR-Telefonnummer und E-Mail-Adresse

## Appwrite einrichten

1. In Appwrite Cloud ein Projekt und darin eine Datenbank mit der ID `panivr` anlegen.
2. Eine Tabelle mit der ID `reservations` anlegen. Öffentliche Tabellen- und Zeilenberechtigungen bleiben leer; der Browser schreibt nie direkt in die Datenbank.
3. Folgende Spalten anlegen:

| Schlüssel | Typ | Größe | Pflicht |
|---|---|---:|---|
| `date` | String | 10 | ja |
| `slot` | String | 5 | ja |
| `players` | Integer | – | ja |
| `name` | String | 100 | ja |
| `email` | E-Mail oder String | 254 | ja |
| `phone` | String | 40 | ja |
| `occasion` | String | 60 | ja |
| `notes` | String | 1000 | nein |
| `status` | String | 20 | ja |
| `source` | String | 30 | ja |
| `createdAt` | Datetime | – | ja |

4. Key-Indizes auf `date`, `status`, `date + status` und `date + slot` anlegen.
5. Einen Server-API-Key mit ausschließlich `rows.read` und `rows.write` erstellen.
6. Die Werte lokal in einer ignorierten `.env` oder `.env.local` einsetzen. Den API-Key niemals mit `NEXT_PUBLIC_` kennzeichnen.

Für mehrere Administratoren werden die freigeschalteten E-Mail-Adressen kommasepariert in `APPWRITE_ADMIN_EMAILS` eingetragen. Die Anmeldung erfolgt über einen einmaligen Appwrite-Magic-Link; es werden keine Admin-Passwörter in dieser Anwendung gespeichert.

Die Reservierungsroute validiert alle Felder serverseitig und verwendet Datum plus Uhrzeit als eindeutige Row-ID. Damit kann derselbe Slot auch bei nahezu gleichzeitigen Anfragen nicht doppelt vergeben werden.

## Auf Appwrite Sites deployen

Das Projekt ist eine reguläre Next.js-App. In Appwrite Sites das Git-Repository verbinden und `Next.js` auswählen. Die Standardwerte sind:

- Install: `npm install`
- Build: `npm run build`
- Output: `.next`
- Runtime: Node.js 22

Danach die oben genannten Site-Aliase sowie `DEV_ACCESS_PASSWORD`, `SITE_ACCESS_MODE=protected`, `BOOKING_MODE=test` und `NEXT_PUBLIC_SITE_URL` als Site-Variablen hinterlegen. `NEXT_PUBLIC_SITE_URL` muss der endgültigen HTTPS-Domain entsprechen, damit Canonical URL, Sitemap, Open Graph und strukturierte SEO-Daten korrekt sind. Änderungen an Site-Variablen erfordern ein neues Deployment.

## Sicherheit und Betrieb

- Der Appwrite-Key bleibt ausschließlich auf dem Server.
- Direkte öffentliche Schreibrechte auf die Reservierungstabelle sind nicht nötig.
- Doppelbuchungen werden atomar durch die eindeutige Slot-ID verhindert.
- Ein Honeypot und strikte serverseitige Eingabeprüfung filtern einfache Spam-Anfragen.
- Für den Echtbetrieb empfiehlt sich zusätzlich eine Appwrite Function, die bei neuen Rows eine Bestätigung an Gast und Betreiber sendet, sobald der gewünschte E-Mail-Provider feststeht.

Die Seiten `Impressum` und `Datenschutz` sind als technische Entwürfe angelegt und müssen vor Veröffentlichung rechtlich geprüft und mit den finalen Betriebsdetails vervollständigt werden.
