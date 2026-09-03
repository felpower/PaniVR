import Link from 'next/link';
import { redirect } from 'next/navigation';
import { AdminLoginForm } from '@/components/admin-login-form';
import { BrandIdentity } from '@/components/brand-identity';
import { getCurrentAdmin } from '@/lib/admin-auth';
import { brand } from '@/lib/brand';

export const dynamic = 'force-dynamic';

const errors: Record<string, string> = { invalid: 'Der Anmeldelink ist ungültig.', denied: 'Diese Adresse besitzt keinen Adminzugriff.', expired: 'Der Anmeldelink ist abgelaufen oder wurde bereits verwendet.' };

export default async function AdminLogin({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  if (await getCurrentAdmin()) redirect('/admin');
  const { error } = await searchParams;
  return (
    <main className="admin-login-page">
      <div className="admin-login-brand"><Link href="/" aria-label={`${brand.name} Startseite`}><BrandIdentity /></Link><small>Administration</small></div>
      <section className="admin-login-card"><p className="admin-kicker">Geschützter Bereich</p><h1>Willkommen<br />zurück.</h1><p>Gib deine freigeschaltete E-Mail-Adresse ein. Du erhältst einen einmaligen Anmeldelink.</p>{error && <div className="admin-login-error">{errors[error] || errors.invalid}</div>}<AdminLoginForm /></section>
      <p className="admin-login-footer">Nur für autorisierte Mitarbeiter · <Link href="/">Zur Website</Link></p>
    </main>
  );
}
