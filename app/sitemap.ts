import type { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/brand';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteUrl, changeFrequency: 'weekly', priority: 1 },
    { url: `${siteUrl}/event`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${siteUrl}/leaderboard`, changeFrequency: 'daily', priority: 0.7 },
    { url: `${siteUrl}/spieler`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${siteUrl}/kontakt`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${siteUrl}/agb`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${siteUrl}/impressum`, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${siteUrl}/datenschutz`, changeFrequency: 'yearly', priority: 0.2 },
  ];
}
