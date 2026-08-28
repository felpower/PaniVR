'use client';

import { FormEvent, useState } from 'react';
import { ArrowRight, LoaderCircle, Mail, ShieldCheck } from 'lucide-react';

export function AdminLoginForm() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    const response = await fetch('/api/admin/magic-link', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const data = await response.json().catch(() => ({}));
    setLoading(false);
    setMessage(data.message || 'Die Anfrage konnte nicht verarbeitet werden.');
  }

  return (
    <form className="admin-login-form" onSubmit={submit}>
      <label htmlFor="admin-email">Admin-E-Mail-Adresse</label>
      <div className="admin-email-input"><Mail size={18} /><input id="admin-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="email" placeholder="name@firma.at" /></div>
      <button type="submit" disabled={loading}>{loading ? <><LoaderCircle className="spin" size={18} /> Wird gesendet …</> : <>Anmeldelink senden <ArrowRight size={18} /></>}</button>
      {message && <p className="admin-form-message" role="status">{message}</p>}
      <p className="admin-security-note"><ShieldCheck size={15} /> Anmeldung ohne Passwort über einen einmaligen Link.</p>
    </form>
  );
}
