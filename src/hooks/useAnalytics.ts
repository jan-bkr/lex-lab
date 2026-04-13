'use client'

import { track } from '@vercel/analytics/react'
import { AnalyticsEvents, type AnalyticsEventName, type AnalyticsEventProperties } from '@/lib/analytics'

export function useAnalytics() {
  function trackEvent<T extends AnalyticsEventName>(
    event: T,
    properties?: AnalyticsEventProperties[T]
  ) {
    try {
      track(event, properties as Record<string, string | number | boolean>)
    } catch {
      // Analytics darf nie die Produktlogik brechen
    }
  }

  return { trackEvent, AnalyticsEvents }
}
