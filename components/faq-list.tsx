'use client';
import { useState } from 'react';

export function FaqList({ items }: { items: readonly (readonly [string, string])[] }) {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? items : items.slice(0, 6);
  return <div className="faq-list">{visible.map(([question, answer], index) => <details key={question}><summary><span>{String(index + 1).padStart(2, '0')}</span>{question}<i>+</i></summary><p>{answer}</p></details>)}{items.length > 6 && <button className="faq-more" type="button" onClick={() => setShowAll((value) => !value)}>{showAll ? 'Weniger Fragen anzeigen' : `${items.length - 6} weitere Fragen anzeigen`}</button>}</div>;
}
