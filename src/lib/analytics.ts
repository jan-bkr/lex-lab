export const AnalyticsEvents = {
  // Newsletter
  NEWSLETTER_ATTEMPT: 'newsletter_attempt',
  NEWSLETTER_SUCCESS: 'newsletter_success',

  // Prompt Builder
  PROMPT_BUILDER_START:    'prompt_builder_start',
  PROMPT_BUILDER_GENERATE: 'prompt_builder_generate',
  PROMPT_BUILDER_COPY:     'prompt_builder_copy',
  PROMPT_BUILDER_LIMIT_HIT: 'prompt_builder_limit_hit',

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
  [AnalyticsEvents.PROMPT_BUILDER_START]:      Record<string, never>
  [AnalyticsEvents.PROMPT_BUILDER_GENERATE]:   { rechtsgebiet: string; aufgabe: string; detailtiefe: string }
  [AnalyticsEvents.PROMPT_BUILDER_COPY]:       Record<string, never>
  [AnalyticsEvents.PROMPT_BUILDER_LIMIT_HIT]:  Record<string, never>
  [AnalyticsEvents.TOOL_VOTE]:                 { tool_slug: string; rechtsgebiet?: string }
  [AnalyticsEvents.TOOL_UNVOTE]:               { tool_slug: string; rechtsgebiet?: string }
  [AnalyticsEvents.TOOL_SUBMIT_START]:         Record<string, never>
  [AnalyticsEvents.TOOL_SUBMIT_SUCCESS]:       { tool_name: string }
}
