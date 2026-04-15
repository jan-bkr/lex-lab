import { createHash, createHmac } from 'crypto'

/**
 * Extracts the client IP and returns a pseudonymous hash — never the raw IP.
 *
 * With IP_HASH_SECRET set (recommended in production):
 *   HMAC-SHA256(secret, ip) — non-reversible even if the hash list leaks.
 *
 * Without IP_HASH_SECRET (local dev / misconfigured prod):
 *   SHA-256(ip) — still pseudonymous (non-trivially reversible for real IPs)
 *   but logs a warning so the misconfiguration is visible.
 *
 * Result is truncated to 16 hex chars (64 bits): unambiguous as an identifier,
 * clearly not a raw IP address in logs / DB.
 *
 * This matches the approach used by Plausible Analytics and Fathom.
 */
export function getHashedIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const raw = forwarded ? forwarded.split(',')[0].trim() : 'unknown'

  const secret = process.env.IP_HASH_SECRET

  if (!secret && process.env.NODE_ENV === 'production') {
    console.warn('[ip] IP_HASH_SECRET is not set — IPs are hashed but not HMAC-protected')
  }

  const hash = secret
    ? createHmac('sha256', secret).update(raw).digest('hex')
    : createHash('sha256').update(raw).digest('hex')

  return hash.slice(0, 16)
}
