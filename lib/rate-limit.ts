const buckets = new Map<string, { count: number; resetAt: number }>();

function clientIp(request: Request) {
  const forwarded = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  return forwarded || request.headers.get('x-real-ip')?.trim() || '';
}

// Best-effort-Schutz pro Server-Instanz gegen Brute-Force und Spam. Ohne
// erkennbare Client-IP wird nicht begrenzt, damit nicht alle Besucher einen
// gemeinsamen Zähler teilen.
export function rateLimited(request: Request, scope: string, limit: number, windowMs: number) {
  const ip = clientIp(request);
  if (!ip) return false;
  const now = Date.now();
  if (buckets.size > 5000) {
    for (const [key, entry] of buckets) if (entry.resetAt <= now) buckets.delete(key);
  }
  const key = `${scope}:${ip}`;
  const entry = buckets.get(key);
  if (!entry || entry.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }
  entry.count += 1;
  return entry.count > limit;
}
