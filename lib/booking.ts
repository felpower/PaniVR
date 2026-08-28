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

export function getSlotsForDate(dateString: string) {
  const date = new Date(`${dateString}T12:00:00`);
  if (Number.isNaN(date.getTime())) return [];
  return brand.booking.slotsByWeekday[date.getDay()] || [];
}

export function isBookableDate(dateString: string) {
  const candidate = new Date(`${dateString}T12:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const lastDay = new Date(today);
  lastDay.setDate(lastDay.getDate() + brand.booking.bookingWindowDays);
  return candidate > today && candidate <= lastDay && getSlotsForDate(dateString).length > 0;
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
  if (!getSlotsForDate(date).includes(slot)) return { ok: false, message: 'Bitte wähle eine verfügbare Uhrzeit.' };
  if (!Number.isInteger(players) || players < brand.booking.minimumPlayers || players > brand.booking.maximumPlayers) return { ok: false, message: `Die Gruppengröße muss zwischen ${brand.booking.minimumPlayers} und ${brand.booking.maximumPlayers} Personen liegen.` };
  if (name.length < 2 || name.length > 100) return { ok: false, message: 'Bitte gib deinen vollständigen Namen ein.' };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) return { ok: false, message: 'Bitte gib eine gültige E-Mail-Adresse ein.' };
  if (phone.replace(/\D/g, '').length < 7 || phone.length > 40) return { ok: false, message: 'Bitte gib eine gültige Telefonnummer ein.' };
  if (data.consent !== true) return { ok: false, message: 'Bitte stimme der Verarbeitung deiner Reservierungsdaten zu.' };

  return { ok: true, data: { date, slot, players, name, email, phone, occasion, notes, consent: true } };
}
