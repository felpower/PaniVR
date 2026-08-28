export const brand = {
  name: 'PaniVR',
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
    slotsByWeekday: {
      0: ['11:00', '14:00'],
      1: ['16:00', '19:00'],
      5: ['16:00', '19:00'],
      6: ['11:00', '14:00', '17:00', '20:00'],
    } as Record<number, string[]>,
  },
} as const;

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
