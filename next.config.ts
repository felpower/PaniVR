import type { NextConfig } from 'next';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  turbopack: { root: projectRoot },
  // Permit the current LAN device to load HMR and dev chunks when testing
  // the site from a phone. This only affects `next dev`, never production.
  allowedDevOrigins: ['192.168.88.131'],
  // Appwrite Sites serves bundled public assets correctly, but its current
  // Next.js SSR image endpoint rejects those same assets during optimization.
  // Serving our local, already-sized assets directly avoids broken images.
  images: { unoptimized: true, remotePatterns: [{ protocol: 'https', hostname: 'www.gasthaus-panholzer.at', pathname: '/userupload/**' }] },
  async headers() {
    return [{
      source: '/(.*)',
      headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
      ],
    }];
  },
};

export default nextConfig;
