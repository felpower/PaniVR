import type { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/brand';

export default function robots(): MetadataRoute.Robots {
  const isLive = process.env.SITE_ACCESS_MODE === 'public' && process.env.BOOKING_MODE === 'live';
  return isLive
    ? { rules: { userAgent: '*', allow: '/', disallow: ['/api/'] }, sitemap: `${siteUrl}/sitemap.xml`, host: siteUrl }
    : { rules: { userAgent: '*', disallow: '/' } };
}
