import { brand } from './brand';

export type BookingPayload = {
  date: string;
  slot: string;
  players: number;
  name: string;
  email: string;
  phone: string;
  occasion: string;
  notes: string;
  consent: boolean;
  company?: string;
};

const timeZone = 'Europe/Vienna';
const slotPattern = /^([01]\d|2[0-3]):[0-5]\d$/;

function todayInVienna() {
  return new Intl.DateTimeFormat('en-CA', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
}

function addDays(dateString: string, days: number) {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day + days)).toISOString().slice(0, 10);
}

export function getSlotsForDate(dateString: string) {
  const date = new Date(`${dateString}T12:00:00`);
  if (Number.isNaN(date.getTime())) return [];
  return brand.booking.slotsByWeekday[date.getDay()] || [];
}

export function isBookableDate(dateString: string) {
  // Nur echte Kalendertage (kein 2026-02-31) zulassen.
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString) || addDays(dateString, 0) !== dateString) return false;
  // Server (UTC) und Browser können in unterschiedlichen Zeitzonen laufen.
  // Maßgeblich ist der Kalendertag in Österreich; wie im Formular kann ab
  // morgen gebucht werden, damit keine bereits vergangenen Slots möglich sind.
  const today = todayInVienna();
  return dateString > today && dateString <= addDays(today, brand.booking.bookingWindowDays) && getSlotsForDate(dateString).length > 0;
}

export function validateBooking(value: unknown): { ok: true; data: BookingPayload } | { ok: false; message: string } {
  if (!value || typeof value !== 'object') return { ok: false, message: 'Ungültige Anfrage.' };
  const data = value as Record<string, unknown>;
  const date = String(data.date || '');
  const slot = String(data.slot || '');
  const players = Number(data.players);
  const name = String(data.name || '').trim();
  const email = String(data.email || '').trim().toLowerCase();
  const phone = String(data.phone || '').trim();
  const occasion = String(data.occasion || 'Freunde').trim().slice(0, 60);
  const notes = String(data.notes || '').trim().slice(0, 1000);
  const company = String(data.company || '').trim();

  if (company) return { ok: false, message: 'Die Anfrage konnte nicht verarbeitet werden.' };
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !isBookableDate(date)) return { ok: false, message: 'Bitte wähle einen verfügbaren Tag.' };
  // Ob der Slot an diesem Tag angeboten wird, prüft die API anhand der im
  // Admin-Bereich gepflegten Zeiten (siehe getAvailableSlots).
  if (!slotPattern.test(slot)) return { ok: false, message: 'Bitte wähle eine verfügbare Uhrzeit.' };
  if (!Number.isInteger(players) || players < brand.booking.minimumPlayers || players > brand.booking.maximumPlayers) return { ok: false, message: `Die Gruppengröße muss zwischen ${brand.booking.minimumPlayers} und ${brand.booking.maximumPlayers} Personen liegen.` };
  if (name.length < 2 || name.length > 100) return { ok: false, message: 'Bitte gib deinen vollständigen Namen ein.' };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) return { ok: false, message: 'Bitte gib eine gültige E-Mail-Adresse ein.' };
  if (phone.replace(/\D/g, '').length < 7 || phone.length > 40) return { ok: false, message: 'Bitte gib eine gültige Telefonnummer ein.' };
  if (data.consent !== true) return { ok: false, message: 'Bitte stimme der Verarbeitung deiner Reservierungsdaten zu.' };

  return { ok: true, data: { date, slot, players, name, email, phone, occasion, notes, consent: true } };
}
