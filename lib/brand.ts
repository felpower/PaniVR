export const brand = {
  name: 'VR Virtual Raiders',
  legalName: 'Josef Panholzer OG',
  tagline: 'Raus aus dem Alltag. Rein ins Spiel.',
  description:
    'Kabellose Free-Roam Virtual Reality in Kleinraming bei Steyr – für Freunde, Geburtstage, Polterer und Firmenevents.',
  address: {
    street: 'Ramingtalstraße 18',
    postalCode: '4442',
    city: 'Kleinraming',
    region: 'Oberösterreich',
    country: 'AT',
  },
  phoneDisplay: '0660 / 50 88 747',
  phoneHref: '+436605088747',
  email: 'gaestezimmer-pani@gmx.at',
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Ramingtalstraße+18,+4442+Kleinraming',
  venueName: 'Gasthaus zur Linde & Pani’s Gästezimmer',
  booking: {
    // Vorläufige Platzhalter bis der Betreiber die echten Spieldaten bestätigt.
    minimumPlayers: 2,
    maximumPlayers: 10,
    bookingWindowDays: 42,
    slotDurationMinutes: 120,
    // Startzeiten nach dem aktuellen VRFrag-Raster (2-Stunden-Sessions).
    // Die Öffnungszeiten/Slots können später im Admin-Bereich überschrieben werden.
    slotsByWeekday: {
      0: ['12:30', '14:30', '16:30', '18:30', '20:30'], // Sonntag
      1: ['16:30', '18:30', '20:30'], // Montag
      2: ['16:30', '18:30', '20:30'], // Dienstag
      3: ['16:30', '18:30', '20:30'], // Mittwoch
      4: ['16:30', '18:30', '20:30'], // Donnerstag
      5: ['12:30', '14:30', '16:30', '18:30', '20:30'], // Freitag
      6: ['08:30', '10:30', '12:30', '14:30', '16:30', '18:30', '20:30'], // Samstag
    } as Record<number, string[]>,
  },
} as const;

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
