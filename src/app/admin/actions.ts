'use server'

import { adminSupabase } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// ─── Auth guard ───────────────────────────────────────────────────────────────
// Server Actions are direct HTTP endpoints — the admin layout only protects the
// UI, not the action themselves. Every write action must call this guard first.

async function requireAdminSession(): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  // Optional email allowlist: set ADMIN_EMAIL in env to restrict access to one account.
  const allowedEmail = process.env.ADMIN_EMAIL
  if (allowedEmail && user.email !== allowedEmail) throw new Error('Forbidden')
}

// ─── Shared types ─────────────────────────────────────────────────────────────

export interface AdminTool {
  id: string
  name: string
  slug: string
  url: string
  tagline: string | null
  description: string | null
  rechtsgebiet: string[]
  category: string[]
  votes: number
  is_new: boolean
  status: 'pending' | 'approved' | 'rejected'
  submitted_by: string | null
  featured: boolean
  created_at: string
}

export interface AdminNewsArticle {
  id: string
  title: string
  slug: string
  summary: string | null
  source_url: string | null
  source_name: string | null
  category: string | null
  published_at: string
  ai_generated: boolean
}

export interface AdminPrompt {
  id: string
  title: string
  slug: string
  prompt_text: string
  use_case: string | null
  rechtsgebiet: string[]
  example_output: string | null
  is_prompt_of_day: boolean
  created_at: string
}

// ─── Tools ────────────────────────────────────────────────────────────────────

export async function fetchTools(status: 'pending' | 'approved' | 'rejected'): Promise<AdminTool[]> {
  await requireAdminSession()
  const { data, error } = await adminSupabase
    .from('tools')
    .select('*')
    .eq('status', status)
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return (data ?? []) as AdminTool[]
}

export async function fetchToolCounts(): Promise<{ pending: number; approved: number }> {
  await requireAdminSession()
  const [{ count: pending }, { count: approved }] = await Promise.all([
    adminSupabase.from('tools').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    adminSupabase.from('tools').select('*', { count: 'exact', head: true }).eq('status', 'approved'),
  ])
  return { pending: pending ?? 0, approved: approved ?? 0 }
}

export interface AdminToolFull extends AdminTool {
  pricing: string | null
  pricing_type: string | null
  pricing_url: string | null
  screenshot_url: string | null
  long_description: string | null
  best_for: string[] | null
  not_for: string[] | null
  verdict: string | null
  last_reviewed_at: string | null
  score_praxisreife: number | null
  score_datenschutz: number | null
  score_dach: number | null
  score_ux: number | null
  score_preis: number | null
  lexlab_score: number | null
}

export async function fetchToolById(id: string): Promise<AdminToolFull | null> {
  await requireAdminSession()
  const { data, error } = await adminSupabase
    .from('tools')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw new Error(error.message)
  return data as AdminToolFull | null
}


export interface UpdateToolPayload {
  slug: string
  name: string
  tagline: string
  url: string
  rechtsgebiet: string[]
  category: string[]
  pricing_type: string
  pricing_url: string
  is_new: boolean
  featured: boolean
  description: string
  long_description: string
  best_for: string[]
  not_for: string[]
  verdict: string
  last_reviewed_at: string
  score_praxisreife: number | null
  score_datenschutz: number | null
  score_dach: number | null
  score_ux: number | null
  score_preis: number | null
  lexlab_score: number | null
}

export async function updateTool(id: string, payload: UpdateToolPayload): Promise<void> {
  await requireAdminSession()
  const { error } = await adminSupabase
    .from('tools')
    .update({
      name:              payload.name,
      tagline:           payload.tagline || null,
      url:               payload.url,
      rechtsgebiet:      payload.rechtsgebiet,
      category:          payload.category,
      pricing_type:      payload.pricing_type || null,
      pricing_url:       payload.pricing_url || null,
      is_new:            payload.is_new,
      featured:          payload.featured,
      description:       payload.description || null,
      long_description:  payload.long_description || null,
      best_for:          payload.best_for.length ? payload.best_for : null,
      not_for:           payload.not_for.length ? payload.not_for : null,
      verdict:           payload.verdict || null,
      last_reviewed_at:  payload.last_reviewed_at || null,
      score_praxisreife: payload.score_praxisreife,
      score_datenschutz: payload.score_datenschutz,
      score_dach:        payload.score_dach,
      score_ux:          payload.score_ux,
      score_preis:       payload.score_preis,
      lexlab_score:      payload.lexlab_score,
    })
    .eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/tools')
  revalidatePath(`/tools/${payload.slug}`)
  revalidatePath('/tools')
}

export async function approveTool(id: string): Promise<void> {
  await requireAdminSession()
  const { error } = await adminSupabase
    .from('tools')
    .update({ status: 'approved' })
    .eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/tools')
  revalidatePath('/tools')
}

export async function rejectTool(id: string): Promise<void> {
  await requireAdminSession()
  const { error } = await adminSupabase
    .from('tools')
    .update({ status: 'rejected' })
    .eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/tools')
  revalidatePath('/tools')
}

// ─── News ─────────────────────────────────────────────────────────────────────

export async function fetchAllNews(): Promise<AdminNewsArticle[]> {
  await requireAdminSession()
  const { data, error } = await adminSupabase
    .from('news_articles')
    .select('*')
    .order('published_at', { ascending: false })
  if (error) throw new Error(error.message)
  return (data ?? []) as AdminNewsArticle[]
}

export async function deleteNewsArticle(id: string): Promise<void> {
  await requireAdminSession()
  const { error } = await adminSupabase.from('news_articles').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/news')
  revalidatePath('/news')
}

interface NewsInsert {
  title: string
  summary: string
  source_name: string
  source_url: string
  category: string
  published_at: string
}

export async function addNewsArticle(data: NewsInsert): Promise<void> {
  await requireAdminSession()
  const slug =
    data.title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') +
    '-' +
    Date.now()

  const { error } = await adminSupabase.from('news_articles').insert({
    ...data,
    slug,
    ai_generated: false,
  })
  if (error) throw new Error(error.message)
  revalidatePath('/admin/news')
  revalidatePath('/news')
}

// ─── Comments ─────────────────────────────────────────────────────────────────

export interface AdminComment {
  id: string
  tool_id: string
  name: string
  role: string
  rechtsgebiet: string[]
  comment: string | null
  rating: number | null
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  tools?: { name: string; slug: string }
}

export async function fetchComments(status: 'pending' | 'approved'): Promise<AdminComment[]> {
  await requireAdminSession()
  const { data, error } = await adminSupabase
    .from('tool_comments')
    .select('*, tools(name, slug)')
    .eq('status', status)
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return (data ?? []) as AdminComment[]
}

export async function approveComment(id: string): Promise<void> {
  await requireAdminSession()
  // Fetch tool slug before updating so we can revalidate the detail page
  const { data: commentData } = await adminSupabase
    .from('tool_comments')
    .select('tools(slug)')
    .eq('id', id)
    .maybeSingle()
  const toolSlug = (commentData?.tools as unknown as { slug: string } | null)?.slug

  const { error } = await adminSupabase
    .from('tool_comments')
    .update({ status: 'approved' })
    .eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/comments')
  if (toolSlug) revalidatePath(`/tools/${toolSlug}`)
}

export async function rejectComment(id: string): Promise<void> {
  await requireAdminSession()
  // Fetch tool slug before deleting so we can revalidate the detail page
  const { data: commentData } = await adminSupabase
    .from('tool_comments')
    .select('tools(slug)')
    .eq('id', id)
    .maybeSingle()
  const toolSlug = (commentData?.tools as unknown as { slug: string } | null)?.slug

  const { error } = await adminSupabase
    .from('tool_comments')
    .delete()
    .eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/comments')
  if (toolSlug) revalidatePath(`/tools/${toolSlug}`)
}

// ─── Prompts ──────────────────────────────────────────────────────────────────

export async function fetchAllPrompts(): Promise<AdminPrompt[]> {
  await requireAdminSession()
  const { data, error } = await adminSupabase
    .from('prompts')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return (data ?? []) as AdminPrompt[]
}

export async function setPromptOfDay(id: string): Promise<void> {
  await requireAdminSession()
  // Clear all first
  const { error: clearError } = await adminSupabase
    .from('prompts')
    .update({ is_prompt_of_day: false })
    .not('id', 'is', null)
  if (clearError) throw new Error(clearError.message)

  const { error } = await adminSupabase
    .from('prompts')
    .update({ is_prompt_of_day: true })
    .eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/prompts')
  revalidatePath('/prompts')
}

export async function clearPromptOfDay(id: string): Promise<void> {
  await requireAdminSession()
  const { error } = await adminSupabase
    .from('prompts')
    .update({ is_prompt_of_day: false })
    .eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/prompts')
  revalidatePath('/prompts')
}

export async function deletePrompt(id: string): Promise<void> {
  await requireAdminSession()
  const { error } = await adminSupabase.from('prompts').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/prompts')
  revalidatePath('/prompts')
}

interface PromptInsert {
  title: string
  slug: string
  prompt_text: string
  use_case: string
  rechtsgebiet: string[]
  example_output: string
}

export async function addPrompt(data: PromptInsert): Promise<void> {
  await requireAdminSession()
  const { error } = await adminSupabase.from('prompts').insert({
    ...data,
    is_prompt_of_day: false,
  })
  if (error) throw new Error(error.message)
  revalidatePath('/admin/prompts')
  revalidatePath('/prompts')
}

// ─── Workflows ────────────────────────────────────────────────────────────────

export interface AdminWorkflow {
  id: string
  title: string
  slug: string
  rechtsgebiet: string[] | null
  reading_time: number | null
  excerpt: string | null
  published: boolean
  created_at: string
}

export async function fetchAllWorkflows(): Promise<AdminWorkflow[]> {
  await requireAdminSession()
  const { data, error } = await adminSupabase
    .from('workflows')
    .select('id, title, slug, rechtsgebiet, reading_time, excerpt, published, created_at')
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return (data ?? []) as AdminWorkflow[]
}

interface WorkflowInsert {
  title: string
  slug: string
  rechtsgebiet: string[]
  reading_time: number
  excerpt: string
}

export async function addWorkflow(data: WorkflowInsert): Promise<void> {
  await requireAdminSession()
  const { error } = await adminSupabase.from('workflows').insert({ ...data, published: false })
  if (error) throw new Error(error.message)
  revalidatePath('/admin/workflows')
  revalidatePath('/workflows')
}

export async function toggleWorkflowPublished(id: string, published: boolean): Promise<void> {
  await requireAdminSession()
  const { error } = await adminSupabase.from('workflows').update({ published }).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/workflows')
  revalidatePath('/workflows')
}

export async function deleteWorkflow(id: string): Promise<void> {
  await requireAdminSession()
  const { error } = await adminSupabase.from('workflows').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/workflows')
  revalidatePath('/workflows')
}

// ─── Events ───────────────────────────────────────────────────────────────────

export interface AdminEvent {
  id: string
  title: string
  date: string
  type: string
  url: string | null
  description: string | null
  created_at: string
}

export async function fetchAllEvents(): Promise<AdminEvent[]> {
  await requireAdminSession()
  const { data, error } = await adminSupabase
    .from('events')
    .select('*')
    .order('date', { ascending: true })
  if (error) throw new Error(error.message)
  return (data ?? []) as AdminEvent[]
}

interface EventInsert {
  title: string
  date: string
  type: string
  url: string
  description: string
}

export async function addEvent(data: EventInsert): Promise<void> {
  await requireAdminSession()
  const { error } = await adminSupabase.from('events').insert(data)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/events')
  revalidatePath('/events')
}

export async function deleteEvent(id: string): Promise<void> {
  await requireAdminSession()
  const { error } = await adminSupabase.from('events').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/events')
  revalidatePath('/events')
}

// ─── Newsletter subscribers ───────────────────────────────────────────────────

export interface AdminSubscriber {
  id: string
  email: string
  confirmed: boolean
  created_at: string
}

export async function fetchAllSubscribers(): Promise<AdminSubscriber[]> {
  await requireAdminSession()
  const { data, error } = await adminSupabase
    .from('newsletter_subscribers')
    .select('id, email, confirmed, created_at')
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return (data ?? []) as AdminSubscriber[]
}

export async function deleteSubscriber(id: string): Promise<void> {
  await requireAdminSession()
  const { error } = await adminSupabase.from('newsletter_subscribers').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/newsletter')
}
