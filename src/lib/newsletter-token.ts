import { createHmac } from 'crypto'

/**
 * Generiert ein HMAC-SHA256-Token für Newsletter-Abmelde-Links.
 * Deterministisch (per E-Mail-Adresse), nicht umkehrbar.
 */
export function makeToken(email: string): string {
  const secret = process.env.NEWSLETTER_HMAC_SECRET
  if (!secret) throw new Error('NEWSLETTER_HMAC_SECRET is not set')
  return createHmac('sha256', secret).update(email.toLowerCase()).digest('hex')
}
