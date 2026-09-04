'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { CalendarDays, Check, ChevronLeft, ChevronRight, Clock3, LoaderCircle, Minus, Plus, ShieldCheck, Users } from 'lucide-react';
import { brand } from '@/lib/brand';
import { getSlotsForDate } from '@/lib/booking';

type Availability = { booked: string[]; slots: string[]; configured?: boolean };

function toLocalDateString(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function buildDates() {
  const dates: Date[] = [];
  const cursor = new Date();
  for (let i = 1; i <= brand.booking.bookingWindowDays; i += 1) {
    cursor.setDate(cursor.getDate() + 1);
    if (getSlotsForDate(toLocalDateString(cursor)).length) dates.push(new Date(cursor));
  }
  return dates;
}

export function BookingForm() {
  const dates = useMemo(() => buildDates(), []);
  const [step, setStep] = useState(1);
  const [date, setDate] = useState(toLocalDateString(dates[0]));
  const [slot, setSlot] = useState('');
  const [players, setPlayers] = useState(4);
  const [availability, setAvailability] = useState<Availability>({ booked: [], slots: getSlotsForDate(date) });
  const [loadingSlots, setLoadingSlots] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [reference, setReference] = useState('');
  const [demo, setDemo] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(() => new Date(dates[0].getFullYear(), dates[0].getMonth(), 1));

  useEffect(() => {
    let active = true;
    fetch(`/api/availability?date=${date}`)
      .then((response) => response.json())
      .then((data) => active && setAvailability({ booked: Array.isArray(data.booked) ? data.booked : [], slots: Array.isArray(data.slots) ? data.slots : getSlotsForDate(date), configured: data.configured }))
      .catch(() => active && setAvailability({ booked: [], slots: getSlotsForDate(date) }))
      .finally(() => active && setLoadingSlots(false));
    return () => { active = false; };
  }, [date]);

  const selectedDate = new Date(`${date}T12:00:00`);
  const formattedDate = new Intl.DateTimeFormat('de-AT', { weekday: 'long', day: '2-digit', month: 'long' }).format(selectedDate);
  const slots = availability.slots;
  const firstMonth = new Date(dates[0].getFullYear(), dates[0].getMonth(), 1).getTime();
  const lastMonth = new Date(dates[dates.length - 1].getFullYear(), dates[dates.length - 1].getMonth(), 1).getTime();
  const calendarCells = useMemo(() => {
    const first = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 1);
    const offset = (first.getDay() + 6) % 7;
    const count = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 0).getDate();
    return [...Array(offset).fill(null), ...Array.from({ length: count }, (_, index) => new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), index + 1))];
  }, [calendarMonth]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    const form = new FormData(event.currentTarget);
    const response = await fetch('/api/reservations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        date,
        slot,
        players,
        name: form.get('name'),
        email: form.get('email'),
        phone: form.get('phone'),
        occasion: form.get('occasion'),
        notes: form.get('notes'),
        consent: form.get('consent') === 'on',
        company: form.get('company'),
      }),
    });
    const data = await response.json().catch(() => ({}));
    setSubmitting(false);
    if (!response.ok) {
      setError(data.message || 'Das hat leider nicht geklappt. Bitte versuche es erneut.');
      return;
    }
    setReference(data.reference || 'VRR');
    setDemo(Boolean(data.demo));
    setStep(3);
  }

  if (step === 3) {
    return (
      <div className="booking-success" role="status">
        <div className="success-icon"><Check size={34} /></div>
        <p className="booking-label">{demo ? 'Demo erfolgreich' : 'Termin reserviert'}</p>
        <h3>{formattedDate}<br />um {slot} Uhr</h3>
        <p>{demo ? 'Die Testreservierung wurde gespeichert. Sie ist nicht verbindlich und löst keine echte Buchung oder Bestätigung aus.' : 'Geschafft! Wir haben euren Termin eingetragen. Die Details schicken wir euch per E-Mail.'}</p>
        <div className="reference">Reservierungsnummer <strong>{reference}</strong></div>
        <button className="booking-reset" type="button" onClick={() => { setStep(1); setReference(''); setSlot(''); }}>Weiteren Termin reservieren</button>
      </div>
    );
  }

  return (
    <div className="booking-shell">
      <div className="booking-progress" aria-label={`Schritt ${step} von 2`}>
        <span className="active">1</span><i className={step === 2 ? 'active' : ''} /><span className={step === 2 ? 'active' : ''}>2</span>
        <small>{step === 1 ? 'Termin wählen' : 'Kontaktdaten'}</small>
      </div>

      {step === 1 ? (
        <div className="booking-step">
          <div className="booking-heading">
            <span><CalendarDays size={18} /> Verfügbare Termine</span>
            <small>Bis 6 Wochen im Voraus</small>
          </div>
          <div className="calendar"><div className="calendar-head"><button type="button" onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1))} disabled={calendarMonth.getTime() <= firstMonth} aria-label="Vorheriger Monat"><ChevronLeft size={18}/></button><strong>{new Intl.DateTimeFormat('de-AT', { month: 'long', year: 'numeric' }).format(calendarMonth)}</strong><button type="button" onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1))} disabled={calendarMonth.getTime() >= lastMonth} aria-label="Nächster Monat"><ChevronRight size={18}/></button></div><div className="calendar-weekdays">{['Mo','Di','Mi','Do','Fr','Sa','So'].map(day => <span key={day}>{day}</span>)}</div><div className="calendar-grid">{calendarCells.map((item, index) => { if (!item) return <span className="calendar-empty" key={`empty-${index}`}/>; const value=toLocalDateString(item); const enabled=dates.some(d=>toLocalDateString(d)===value); return <button key={value} type="button" disabled={!enabled} className={date===value?'selected':''} onClick={()=>{setDate(value);setSlot('');setLoadingSlots(true)}}><span>{item.getDate()}</span>{enabled&&<small/>}</button>; })}</div></div>

          <div className="slot-block">
            <span className="field-label"><Clock3 size={16} /> Uhrzeit</span>
            <div className="slot-grid">
              {loadingSlots ? <span className="slot-loading"><LoaderCircle className="spin" size={18} /> Termine werden geladen</span> : slots.map((time) => {
                const booked = availability.booked.includes(time);
                return <button key={time} type="button" disabled={booked} className={slot === time ? 'selected' : ''} onClick={() => setSlot(time)}>{time}<small>{booked ? 'belegt' : 'frei'}</small></button>;
              })}
            </div>
          </div>

          <div className="player-row">
            <span><Users size={17} /><span><strong>Gruppengröße</strong><small>{brand.booking.minimumPlayers}–{brand.booking.maximumPlayers} Personen</small></span></span>
            <div className="counter">
              <button type="button" aria-label="Eine Person weniger" onClick={() => setPlayers(Math.max(brand.booking.minimumPlayers, players - 1))}><Minus size={17} /></button>
              <strong>{players}</strong>
              <button type="button" aria-label="Eine Person mehr" onClick={() => setPlayers(Math.min(brand.booking.maximumPlayers, players + 1))}><Plus size={17} /></button>
            </div>
          </div>

          <button className="booking-next" type="button" disabled={!slot} onClick={() => setStep(2)}>Weiter zu den Kontaktdaten <span>↗</span></button>
          <p className="booking-hint"><ShieldCheck size={15} /> Keine Zahlung nötig · Der Termin ist exklusiv für eure Gruppe</p>
        </div>
      ) : (
        <form className="booking-step contact-step" onSubmit={submit}>
          <button className="back-button" type="button" onClick={() => { setStep(1); setError(''); }}><ChevronLeft size={17} /> Termin ändern</button>
          <div className="booking-summary">
            <span><CalendarDays size={18} /><strong>{formattedDate}</strong></span>
            <span><Clock3 size={18} /><strong>{slot} Uhr</strong></span>
            <span><Users size={18} /><strong>{players} Personen</strong></span>
          </div>
          <div className="form-grid">
            <label>Vollständiger Name<input name="name" required autoComplete="name" placeholder="Max Mustermann" /></label>
            <label>E-Mail-Adresse<input name="email" type="email" required autoComplete="email" placeholder="max@beispiel.at" /></label>
            <label>Telefonnummer<input name="phone" type="tel" required autoComplete="tel" placeholder="+43 660 1234567" /></label>
            <label>Anlass<select name="occasion" defaultValue="Freunde"><option>Freunde</option><option>Geburtstag</option><option>Firmenevent</option><option>Polterer</option><option>Verein</option><option>Sonstiges</option></select></label>
            <label className="full-width">Noch etwas, das wir wissen sollen?<textarea name="notes" rows={3} placeholder="Optional" /></label>
            <label className="honey" aria-hidden="true">Firma<input name="company" tabIndex={-1} autoComplete="off" /></label>
          </div>
          <label className="consent"><input type="checkbox" name="consent" required /><span>Ich stimme der Verarbeitung meiner Angaben zur Durchführung der Reservierung zu und habe die <a href="/datenschutz" target="_blank">Datenschutzerklärung</a> gelesen.</span></label>
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="booking-next" type="submit" disabled={submitting}>{submitting ? <><LoaderCircle className="spin" size={19} /> Wird reserviert …</> : <>Kostenlos reservieren <span>↗</span></>}</button>
        </form>
      )}
    </div>
  );
}
