import type { Metadata } from 'next';
import { DevelopmentLoginForm } from '@/components/development-login-form';

export const metadata: Metadata = {
  title: 'Development-Zugang',
  robots: { index: false, follow: false },
};

function safeNextPath(value: string | undefined) {
  return value?.startsWith('/') && !value.startsWith('//') ? value : '/';
}

export default async function DevelopmentAccessPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  return (
    <main className="development-login-page">
      <section className="development-login-card">
        <div className="development-login-brand"><span>P</span>Pani<strong>VR</strong></div>
        <p className="development-login-kicker">Interne Vorschau</p>
        <h1>Hier entsteht<br />etwas Neues.</h1>
        <p>Diese Website befindet sich im Development. Reservierungen und Inhalte dienen ausschließlich zum Testen und sind nicht verbindlich.</p>
        <DevelopmentLoginForm nextPath={safeNextPath(next)} />
      </section>
    </main>
  );
}
