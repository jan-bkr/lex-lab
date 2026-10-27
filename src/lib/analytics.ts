export const AnalyticsEvents = {
  // Newsletter
  NEWSLETTER_ATTEMPT: 'newsletter_attempt',
  NEWSLETTER_SUCCESS: 'newsletter_success',

  // Tools
  TOOL_VOTE:           'tool_vote',
  TOOL_UNVOTE:         'tool_unvote',
  TOOL_SUBMIT_START:   'tool_submit_start',
  TOOL_SUBMIT_SUCCESS: 'tool_submit_success',
} as const

export type AnalyticsEventName = (typeof AnalyticsEvents)[keyof typeof AnalyticsEvents]

export type AnalyticsEventProperties = {
  [AnalyticsEvents.NEWSLETTER_ATTEMPT]:        { source?: string }
  [AnalyticsEvents.NEWSLETTER_SUCCESS]:        { source?: string }
  [AnalyticsEvents.TOOL_VOTE]:                 { tool_slug: string; rechtsgebiet?: string }
  [AnalyticsEvents.TOOL_UNVOTE]:               { tool_slug: string; rechtsgebiet?: string }
  [AnalyticsEvents.TOOL_SUBMIT_START]:         Record<string, never>
  [AnalyticsEvents.TOOL_SUBMIT_SUCCESS]:       { tool_name: string }
}
