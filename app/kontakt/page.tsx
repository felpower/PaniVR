import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { ContactForm } from '@/components/contact-form';
import { BrandIdentity } from '@/components/brand-identity';
import { Suspense } from 'react';
export const metadata: Metadata = { title: 'Kontakt', description: 'Kontakt, Event-Anfragen und individuelle Termine bei VR Virtual Raiders in Kleinraming bei Steyr.', alternates: { canonical: '/kontakt' } };
export default function ContactPage(){return <main className="contact-page"><Link className="contact-brand" href="/"><BrandIdentity/></Link><div className="contact-layout"><section><p className="section-kicker">Kontakt</p><h1>Erzählt uns von<br/><span>eurer Idee.</span></h1><p>Ob Firmenevent, Geburtstag oder eine ganz andere Frage: Schreibt uns. Wir melden uns persönlich.</p></section><Suspense fallback={<div className="contact-form" /> }><ContactForm/></Suspense></div><Link className="contact-back" href="/"><ArrowLeft size={16}/> Zur Website</Link></main>}
