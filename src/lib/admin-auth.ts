export function normalizeEmail(email: string | null | undefined): string {
  return (email ?? '').trim().toLowerCase()
}

export function getAllowedAdminEmails(): string[] {
  return (process.env.ADMIN_EMAIL ?? '')
    .split(/[,\n;]+/)
    .map(normalizeEmail)
    .filter(Boolean)
}

export function isAllowedAdminEmail(email: string | null | undefined): boolean {
  const allowedEmails = getAllowedAdminEmails()
  if (!allowedEmails.length) return true
  return allowedEmails.includes(normalizeEmail(email))
}
