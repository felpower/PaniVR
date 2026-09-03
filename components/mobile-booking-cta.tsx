'use client';

import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';

export function MobileBookingCta() {
  const [bookingVisible, setBookingVisible] = useState(false);

  useEffect(() => {
    const bookingSection = document.getElementById('buchen');
    if (!bookingSection) return;

    const observer = new IntersectionObserver(
      ([entry]) => setBookingVisible(entry.isIntersecting),
      { threshold: 0.05 },
    );
    observer.observe(bookingSection);
    return () => observer.disconnect();
  }, []);

  if (bookingVisible) return null;

  return <a className="mobile-booking" href="#buchen">Termin reservieren <ArrowRight size={16} /></a>;
}
