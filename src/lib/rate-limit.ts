// ─── Shared rate limiter ──────────────────────────────────────────────────────
// Uses Upstash Redis (sliding window) when UPSTASH_REDIS_REST_URL +
// UPSTASH_REDIS_REST_TOKEN are set in the environment.
// Falls back to a single-instance in-memory Map for local development.
//
// Required env vars for production (add to Vercel project settings):
//   UPSTASH_REDIS_REST_URL   — REST endpoint from Upstash console
//   UPSTASH_REDIS_REST_TOKEN — read-write token from Upstash console
//
// Upstash free tier is sufficient for LexLab's current traffic.

import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

// ─── Limit configurations ────────────────────────────────────────────────────

type Duration = Parameters<typeof Ratelimit.slidingWindow>[1]

const LIMITS = {
  vote:       { max: 20, window: '24 h' as Duration, windowMs: 24 * 60 * 60 * 1000 },
  comments:   { max: 5,  window: '1 h'  as Duration, windowMs:      60 * 60 * 1000 },
  prompts:    { max: 10, window: '1 d'  as Duration, windowMs: 24 * 60 * 60 * 1000 },
  newsletter: { max: 5,  window: '1 h'  as Duration, windowMs:      60 * 60 * 1000 },
  kontakt:    { max: 5,  window: '1 h'  as Duration, windowMs:      60 * 60 * 1000 },
} as const

export type RateLimitKey = keyof typeof LIMITS

// ─── Upstash (lazy, singleton) ───────────────────────────────────────────────

let _limiters: Map<RateLimitKey, Ratelimit> | null = null

function getUpstashLimiters(): Map<RateLimitKey, Ratelimit> | null {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return null
  }
  if (_limiters) return _limiters

  const redis = Redis.fromEnv()
  _limiters = new Map(
    (Object.entries(LIMITS) as [RateLimitKey, typeof LIMITS[RateLimitKey]][]).map(
      ([key, cfg]) => [
        key,
        new Ratelimit({
          redis,
          limiter: Ratelimit.slidingWindow(cfg.max, cfg.window),
          prefix:  `lex-lab:rl:${key}`,
        }),
      ]
    )
  )
  return _limiters
}

// ─── In-memory fallback (local dev / no Upstash configured) ──────────────────

const _memStore = new Map<string, { count: number; resetAt: number }>()

// Periodic cleanup so the Map doesn't grow unboundedly on long-running dev servers
setInterval(() => {
  const now = Date.now()
  for (const [k, v] of _memStore) {
    if (now >= v.resetAt) _memStore.delete(k)
  }
}, 5 * 60 * 1000)

function checkMemLimit(key: RateLimitKey, identifier: string): RateLimitResult {
  const { max, windowMs } = LIMITS[key]
  const storeKey = `${key}:${identifier}`
  const now = Date.now()
  const entry = _memStore.get(storeKey)

  if (!entry || now >= entry.resetAt) {
    _memStore.set(storeKey, { count: 1, resetAt: now + windowMs })
    return { allowed: true, remaining: max - 1 }
  }
  if (entry.count >= max) return { allowed: false, remaining: 0 }
  _memStore.set(storeKey, { count: entry.count + 1, resetAt: entry.resetAt })
  return { allowed: true, remaining: max - entry.count - 1 }
}

// ─── Public API ───────────────────────────────────────────────────────────────

export interface RateLimitResult {
  allowed:   boolean
  remaining: number   // requests remaining in the current window (0 when blocked)
}

/**
 * Check whether the caller is within the rate limit for the given endpoint.
 *
 * @param key        - Named limiter (vote / comments / prompts / newsletter / kontakt)
 * @param identifier - Unique key for this caller, e.g. IP or `${ip}:${toolId}`
 */
export async function checkRateLimit(
  key: RateLimitKey,
  identifier: string
): Promise<RateLimitResult> {
  const limiters = getUpstashLimiters()

  if (limiters) {
    const limiter = limiters.get(key)!
    const { success, remaining } = await limiter.limit(identifier)
    return { allowed: success, remaining }
  }

  return checkMemLimit(key, identifier)
}
