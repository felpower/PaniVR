'use client';

import { FormEvent, useState } from 'react';
import { ArrowRight, LoaderCircle, LockKeyhole } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function DevelopmentLoginForm({ nextPath }: { nextPath: string }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    const form = new FormData(event.currentTarget);

    try {
      const response = await fetch('/api/access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: form.get('password'), next: nextPath }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(result.message || 'Der Zugang konnte nicht freigeschaltet werden.');
        return;
      }
      router.push(result.destination || '/');
      router.refresh();
    } catch {
      setError('Der Zugang konnte nicht freigeschaltet werden. Bitte versuche es erneut.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="development-login-form" action="/api/access" method="post" onSubmit={submit}>
      <label htmlFor="development-password">Development-Passwort</label>
      <div className="development-password-field">
        <LockKeyhole size={19} aria-hidden="true" />
        <input id="development-password" name="password" type="password" autoComplete="current-password" autoFocus required />
      </div>
      <input type="hidden" name="next" value={nextPath} />
      {error && <p className="development-login-error" role="alert">{error}</p>}
      <button type="submit" disabled={submitting}>
        {submitting ? <><LoaderCircle className="spin" size={18} /> Wird geprüft …</> : <>Vorschau öffnen <ArrowRight size={18} /></>}
      </button>
    </form>
  );
}
