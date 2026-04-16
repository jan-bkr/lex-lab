@AGENTS.md

## Stack & Technologien

| Bereich | Technologie | Version |
|---|---|---|
| Framework | Next.js (App Router) | 16.2.3 |
| UI | React | 19.2.4 |
| Styling | Tailwind CSS v4 | ^4 |
| Icons | lucide-react | ^1.8.0 |
| Fonts | DM Serif Display + DM Sans (via `next/font/google`) | — |
| Datenbank | Supabase (Postgres + Auth + RLS) | @supabase/supabase-js ^2 |
| Auth (Server) | @supabase/ssr | ^0.10.2 |
| E-Mail | Resend | ^6.10.0 |
| KI (Pipeline) | Claude Haiku via raw `fetch` | `claude-haiku-4-5-20251001` |
| KI (Prompt Builder) | Claude Haiku via `@anthropic-ai/sdk` | `claude-haiku-4-5` |
| Analytics | @vercel/analytics + @vercel/speed-insights | ^2 |
| RSS | rss-parser | ^3.13.0 |
| Rate Limiting | @upstash/ratelimit + @upstash/redis | ^2 / ^1 |
| Datum | date-fns (inkl. `de`-Locale) | ^4.1.0 |
| TypeScript | strict mode | ^5 |
| Linting | ESLint 9 (flat config) + eslint-config-next | ^9 |
| Deployment | Vercel | — |

> **Achtung:** Next.js 16 hat Breaking Changes gegenüber v14/v15. Vor Code-Änderungen Guide in `node_modules/next/dist/docs/` lesen!

---

## Package Manager

**npm** (erkannt via `package-lock.json`)

```bash
npm install          # Abhängigkeiten installieren
npm install <pkg>    # Paket hinzufügen
```

---

## Produkt-Kontext

**LexLab** (`https://www.lex-lab.de`) ist eine kuratierte Plattform für KI-Tools, Workflows und Prompts für den deutschen Rechtsmarkt. Zielgruppe: Kanzleien, Steuerberater, Inhouse-Teams.

**Vier Rechtsgebiete** durchziehen das gesamte System als zentrales Klassifikationsmerkmal:
- `Steuerrecht` · `M&A` · `Gesellschaftsrecht` · `Venture Capital`

**Tool-Lebenszyklus:** Einreichen (`/tools/submit`) → Status `pending` → Admin genehmigt/lehnt ab → Status `approved`/`rejected` → nur `approved` Tools sind öffentlich sichtbar.

---

## Projektstruktur

```
src/
├── app/                            # Next.js App Router
│   ├── layout.tsx                  # Root Layout: DM Serif + DM Sans, Analytics, Navbar, Footer
│   ├── page.tsx                    # Startseite (Server Component, revalidate=3600)
│   ├── admin/                      # Admin-Bereich (Auth via Supabase in Layout, kein Middleware!)
│   │   ├── actions.ts              # Server Actions für alle Admin-CRUD-Operationen
│   │   ├── layout.tsx              # Auth-Guard (Supabase getUser) + AdminNav
│   │   ├── tools/                  # Tool-Verwaltung + Edit-Formular
│   │   │   └── [id]/edit/
│   │   │       ├── page.tsx        # Server Component — lädt Tool per fetchToolById(id)
│   │   │       └── EditForm.tsx    # Client Component — vollständiges Edit-Formular
│   │   ├── news/                   # News-Verwaltung
│   │   ├── comments/               # Kommentar-Moderation
│   │   ├── prompts/                # Prompt-Verwaltung
│   │   ├── workflows/              # Workflow-Verwaltung (Client, optimistic updates)
│   │   ├── events/                 # Termin-Verwaltung (Client, vergangene Termine gedimmt)
│   │   └── newsletter/             # Newsletter-Abonnenten (Client, Tabellen-View)
│   ├── api/                        # Route Handlers (alle POST-only, außer vote-status + pipeline)
│   │   ├── pipeline/               # RSS→Claude→Supabase-Cron (GET+POST, maxDuration=60)
│   │   ├── tools/submit/           # Tool-Einreichung (POST, Rate Limit: 5/Tag pro IP, schreibt via adminSupabase)
│   │   ├── tools/vote/             # Vote-Toggle (POST, IP-Ratelimit: 20/24h pro IP+Tool)
│   │   ├── tools/vote-status/      # Vote-Status abfragen (GET)
│   │   ├── tools/[id]/comments/    # Kommentare laden + speichern
│   │   ├── prompts/generate/       # Claude Prompt Builder (POST, 10/Tag pro IP)
│   │   ├── newsletter/subscribe/   # Newsletter-Anmeldung (POST, 5/h pro IP)
│   │   ├── newsletter/unsubscribe/ # Abmeldung via HMAC-Token (GET)
│   │   ├── kontakt/                # Kontaktformular → Resend (POST)
│   │   └── admin/cleanup/          # Daten-Bereinigung (CRON_SECRET-geschützt)
│   ├── tools/                      # Tool-Verzeichnis (Client, anon Supabase)
│   │   └── [slug]/                 # Detailseite: Server page.tsx + Client ToolDetailClient.tsx
│   ├── prompts/                    # Prompt-Bibliothek + Builder
│   │   └── builder/                # /prompts/builder — interaktiver Prompt-Generator
│   ├── news/                       # News-Feed
│   ├── workflows/                  # Workflow-Guides (DB, Fehler-/Leer-State)
│   ├── newsletter/                 # Anmeldung + /abgemeldet-Bestätigung
│   ├── events/                     # Rechtstermine (DB, Fehler-/Leer-State)
│   ├── beitraege/                  # Beiträge (Placeholder, kein Inhalt)
│   ├── state-of-legal-ai/          # Research Hub: "State of Legal AI Germany 2026" (pure Server Component)
│   ├── sitemap.ts                  # Dynamische Sitemap (Tools, News, Prompts, Workflows)
│   ├── robots.ts                   # /robots.txt — disallow /admin
│   ├── impressum/ datenschutz/ kontakt/ beitraege/
│   └── globals.css
├── components/                     # Shared UI-Komponenten
│   ├── Navbar.tsx · Footer.tsx
│   ├── ToolCard.tsx                # Karte für Tool-Listings
│   ├── RechtsgebietTag.tsx         # Farbige Tag-Pill pro Rechtsgebiet
│   ├── NewsletterForm.tsx          # Newsletter-Anmeldeformular (Client)
│   ├── PromptModal.tsx             # Modal-Overlay für Prompt-Details
│   ├── PromptOfDay.tsx             # "Prompt des Tages"-Widget
│   └── AdminNav.tsx                # Admin-Sidebar-Navigation
├── lib/
│   ├── supabase/
│   │   ├── client.ts               # Browser-Client (anon key, RLS aktiv)
│   │   ├── server.ts               # Server-Client (cookie-basiert, SSR)
│   │   └── admin.ts                # Service-Role-Client (nur Server, bypasses RLS)
│   ├── rate-limit.ts               # Shared Rate Limiter: Upstash Sliding Window + In-Memory-Fallback
│   ├── ip.ts                       # IP-Pseudonymisierung: HMAC-SHA256 (IP_HASH_SECRET) → 16-char hex
│   ├── lexlab-score.ts             # Score-Berechnung: Ø gewichtet (30/25/25/10/10)×10
│   ├── jurist-persona.ts           # JURIST_PERSONA — System-Prompt für Claude
│   ├── rss-sources.ts              # 11 RSS-Quellen (M&A, Steuer, LegalTech, VC)
│   ├── analytics.ts                # Vercel Analytics Helper
│   └── clean-text.ts               # Text-Bereinigung für Pipeline
├── hooks/
│   └── useAnalytics.ts
├── types/
│   └── index.ts                    # Tool, Workflow, Prompt, NewsArticle, Event, ToolComment
└── proxy.ts                        # Supabase Realtime Proxy

scripts/
└── bulk-import-tools.mjs           # Premium-Profile für 42 Tools (Node.js, direkt gegen Supabase)
                                    # Unterstützt --dry-run Flag. Zuletzt ausgeführt: 2026-04-14 (42/42 ✅)

supabase/
└── migrations/
    ├── 20260414000000_add_tool_votes.sql
    ├── 20260414000001_premium_tool_profiles.sql
    ├── 20260414000002_fix_tool_votes_privacy.sql  # DROP public SELECT policy (voter_ip ist PII)
    ├── 20260414000003_toggle_tool_vote_rpc.sql    # toggle_tool_vote() — atomare Vote-Funktion
    ├── 20260415000000_tool_comments_rls.sql       # INSERT-Policy für anon auf tool_comments (manuell ausführen!)
    └── RUN_IN_DASHBOARD.sql                       # Kombinations-Script für Supabase SQL Editor (bereits ausgeführt)
```

---

## Coding-Konventionen

### Dateinamen
- Pages/Layouts: `page.tsx`, `layout.tsx` (Next.js-Standard)
- Client-Komponenten mit Logik: PascalCase, z.B. `EditForm.tsx`, `ToolDetailClient.tsx`
- Lib-Utilities: kebab-case, z.B. `lexlab-score.ts`, `clean-text.ts`

### Komponenten
- `'use client'` am Dateianfang nur wenn nötig; Default = Server Component
- Server Actions in `actions.ts` mit `'use server'`-Direktive oben
- Sub-Komponenten (`Section`, `Field`, `ScoreSlider`) inline in der Datei definiert — nicht auslagern
- Klassen-Konstanten extrahieren: `const inputCls = '...'`, `const textareaCls = \`${inputCls} ...\``
- Kommentarsektionen: `// ─── Titel ────` (em-dash + Leerzeichen)

### TypeScript
- `strict: true` — keine `any` ohne `// eslint-disable-next-line` + Begründung
- DB-Types als Interfaces manuell definiert (kein generierter Supabase-Typ-Client)
- Payload-Interfaces für Server Actions explizit typisieren (`UpdateToolPayload`)
- Pfad-Alias `@/*` → `./src/*`

### Datenbank → Domain Mapping
Die DB verwendet `snake_case`, die Domain-Types `camelCase`. **Immer explizite Mapper-Funktionen** schreiben:

```typescript
function mapTool(r: any): Tool {
  return { id: r.id, isNew: r.is_new, createdAt: r.created_at, ... }
}
```

Niemals DB-Rohdaten direkt als Domain-Types verwenden.

### Fehler- und Leer-Zustände (kein Mock-Fallback!)
Öffentliche Seiten zeigen bei DB-Fehler einen Fehler-State, bei leerem Ergebnis einen Empty-State.
**Niemals Mock-Daten als Fallback auf Live-Seiten verwenden** — das täuscht Nutzer und untergräbt das Vertrauen.

```typescript
// Server Component (Homepage):
const tools: Tool[] = toolsRes.data?.length ? toolsRes.data.map(mapTool) : []
// → Sektion wird nur gerendert wenn tools.length > 0

// Client Component (Tools-/Prompts-/Workflows-/Events-Page):
if (error) {
  setLoadError(true)      // → Fehler-State: "… konnten nicht geladen werden"
} else {
  setItems(data ? data.map(mapRow) : [])  // → Empty-State wenn leer
}
```

### Styling
- Tailwind CSS v4 (PostCSS-Plugin `@tailwindcss/postcss`) — **kein `tailwind.config.js`**
- `font-display` → DM Serif Display; `font-sans` → DM Sans
- Hintergrundfarbe Root: `bg-[#F7F7F5]`, Text: `text-[#111827]`
- Design-Tokens: `rounded-xl`, `border-gray-100`, `text-xs` als durchgängiges Grundmuster
- Inline-Klassen, keine CSS-Module, kein `@apply`

### Next.js 16 Breaking Changes (wichtig!)
- **`params` ist ein `Promise`** — immer awaiten: `const { slug } = await params`
- **`cookies()`** ist asynchron — `const cookieStore = await cookies()`
- Vor Routing/Caching/Middleware-Änderungen: Guide in `node_modules/next/dist/docs/` lesen

### Caching-Konventionen
- Server-Pages mit häufig wechselnden Daten: `export const revalidate = 3600`
- Route Handlers ohne Caching: `export const dynamic = 'force-dynamic'`
- Admin-Pages: `export const dynamic = 'force-dynamic'` (immer frisch)

### Suspense für Client-Pages mit `useSearchParams`
```typescript
export default function Page() {
  return <Suspense fallback={<Skeleton />}><PageInner /></Suspense>
}
```
`useSearchParams()` darf nur in Komponenten verwendet werden, die in `<Suspense>` eingebettet sind.

### Fehlerbehandlung in Route Handlers
- Unbekannte Fehler: `instanceof Error ? e.message : String(e)`
- Keine Stacktraces in API-Responses ausgeben (Security)
- `console.error('[routename] ...')` für Server-Logs mit Präfix
- Pipeline-Cron: strukturiertes Logging mit `[pipeline][runId]`-Präfix

---

## Deployment & Infrastruktur

**Produktions-URL:** `https://www.lex-lab.de`

**Plattform:** Vercel — automatischer Deploy bei Push auf `main`

**Cron-Job:** `/api/pipeline` täglich 06:00 UTC (konfiguriert in `vercel.json`)
- Vercel Cron sendet **GET** — Route exportiert sowohl `GET` als auch `POST` (GET = Cron, POST = manueller Trigger)
- Auth: Vercel-Header `x-vercel-cron: 1` (automatisch) oder `Authorization: Bearer CRON_SECRET` (manuell)
- Limit: `maxDuration = 60` (Vercel Hobby Plan)
- Verarbeitet max. 3 Items pro RSS-Quelle, 11 Quellen parallel, Cutoff: 24h

**SEO:** `sitemap.ts` + `robots.ts` erzeugen `/sitemap.xml` und `/robots.txt` dynamisch beim Build. `/admin` ist disallowed.

**Supabase:** Postgres mit Row-Level Security
- Tabellen: `tools`, `tool_votes`, `tool_comments`, `news_articles`, `prompts`, `workflows`, `events`, `newsletter_subscribers`
- Migrationen lokal unter `supabase/migrations/` — kein CI-Deploy-Workflow eingerichtet
- Admin-UI: Supabase Dashboard

**Umgebungsvariablen (nur Namen, keine Werte):**

| Variable | Scope | Verwendung |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Public | Supabase-Projekt-URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public | Supabase anon Key (RLS aktiv) |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only | Admin-Client (bypasses RLS) |
| `ANTHROPIC_API_KEY` | Server only | Claude API — Pipeline + Prompt Builder |
| `RESEND_API_KEY` | Server only | Newsletter-E-Mails + Kontaktformular |
| `CRON_SECRET` | Server only | Auth für Pipeline + Cleanup |
| `NEWSLETTER_HMAC_SECRET` | Server only | HMAC-Key für Newsletter-Abmelde-Token (SHA-256) |
| `IP_HASH_SECRET` | Server only | HMAC-Key für IP-Pseudonymisierung (`getHashedIp()`) — ohne diesen Key: SHA-256-Fallback + Prod-Warning |
| `UPSTASH_REDIS_REST_URL` | Server only | Upstash Redis — Rate Limiting (Vote, Comments, Prompts, Newsletter, Kontakt, Tool-Submit) |
| `UPSTASH_REDIS_REST_TOKEN` | Server only | Upstash Redis — Rate Limiting |
| `ADMIN_EMAIL` | Server only | Optional: E-Mail-Allowlist für Admin-Zugriff — `requireAdminSession()` prüft `user.email === ADMIN_EMAIL` wenn gesetzt |

---

## Wichtige Befehle

```bash
npm run dev      # Dev-Server (http://localhost:3000)
npm run build    # Production Build
npm run start    # Production Server lokal
npm run lint     # ESLint v9 (Flat Config)

# Pipeline manuell triggern:
curl -X POST http://localhost:3000/api/pipeline \
  -H "Authorization: Bearer <CRON_SECRET>"

# Bulk-Import Tools (Premium-Profile, Scores, Beschreibungen):
node scripts/bulk-import-tools.mjs --dry-run   # Vorschau ohne Schreibzugriff
node scripts/bulk-import-tools.mjs             # Live gegen Supabase
# Voraussetzung: .env.local mit NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY

# Vercel Deployment-Status prüfen:
npx vercel ls                                  # Zeigt aktuelle Deployments (Building/Ready/Error)
```

---

## Bekannte Eigenheiten & Fallstricke

1. **Next.js 16: `params` ist ein `Promise`** — `const { slug } = await params` in allen Pages und `generateMetadata`. Vergessen → TypeScript-Fehler zur Laufzeit.

2. **Keine `middleware.ts`** — Admin-Auth läuft ausschließlich im `src/app/admin/layout.tsx` via `supabase.auth.getUser()`. Kein Next.js Middleware-File vorhanden.

3. **Drei Supabase-Clients — nie falsch mischen:**
   - `client.ts` → Browser (anon key, RLS aktiv) — nur in `'use client'`-Komponenten
   - `server.ts` → Server Components + Route Handlers (cookie-basiert)
   - `admin.ts` → Service Role (bypasses RLS) — nur serverseitig, nie im Client-Bundle

4. **Tailwind CSS v4** — kein `tailwind.config.js`, kein `@apply`. Konfiguration via PostCSS. Plugin heißt `@tailwindcss/postcss`.

5. **Rate Limiting via Upstash Redis** — `src/lib/rate-limit.ts`, Sliding Window, multi-instance-safe:
   - Vote: 20/24h pro `IP:toolId`
   - Comments: 5/h pro IP
   - Prompt Builder: 10/Tag pro IP
   - Newsletter: 5/h pro IP
   - Kontaktformular: 5/h pro IP
   - Tool-Einreichung: 5/Tag pro IP (`toolsubmit`)
   - Fallback auf In-Memory-Map wenn `UPSTASH_REDIS_REST_URL` nicht gesetzt (lokale Dev-Umgebung)

6. **Claude-Modelle:**
   - Pipeline (`/api/pipeline`): direkte `fetch`-Aufrufe, Modell `claude-haiku-4-5-20251001`
   - Prompt Builder (`/api/prompts/generate`): Anthropic SDK, Modell `claude-haiku-4-5`
   - `JURIST_PERSONA` (`lib/jurist-persona.ts`) wird als System-Prompt übergeben UND dem Output für die UI vorangestellt — zwei verschiedene Verwendungszwecke.

7. **`/tools`-Seite verwendet anon Client** (`lib/supabase/client.ts`), nicht den Admin-Client. Tool-Detailseite `/tools/[slug]` nutzt hingegen den Admin-Client im Server-Teil für `generateMetadata`.

8. **Workflows + Events haben DB-Tabellen + Admin-UI** (`workflows`, `events` in Supabase). Die Listing-Seiten und Detailseiten zeigen bei leerem Ergebnis einen Empty-State und bei DB-Fehler einen Fehler-State — kein Mock-Fallback mehr. Admin-UIs unter `/admin/workflows` und `/admin/events` vorhanden.

9. **Newsletter-Abmeldung** ist HMAC-signiert (`NEWSLETTER_HMAC_SECRET` als Schlüssel, SHA-256). Token-Generierung via `makeToken(email)` in `unsubscribe/route.ts`, importiert von `subscribe/route.ts`. Beide Routen schlagen hart fehl wenn `NEWSLETTER_HMAC_SECRET` nicht gesetzt ist.

10. **Newsletter-Anmeldung: Mail vor DB-Write** — `api/newsletter/subscribe` sendet die Bestätigungsmail zuerst. DB-Insert erfolgt nur bei erfolgreichem Mail-Versand. Schlägt der DB-Insert nach erfolgter Mail fehl, wird `{ success: true }` zurückgegeben (Nutzer hat E-Mail erhalten) und der Fehler geloggt.

11. **Tool-Routing-Inkonsistenz:** Öffentliche Routen nutzen `slug` (`/tools/[slug]`), Admin-Edit nutzt `id` (`/admin/tools/[id]/edit`). Beim Verlinken korrekte ID vs. Slug verwenden.

12. **Startseite nutzt Admin-Client** (`adminSupabase`) direkt in einem Server Component — das ist korrekt (Server-seitig), aber ungewöhnlich. Begründung: öffentliche Daten ohne RLS-Overhead lesen.

13. **JSON-LD Schema.org** auf der Startseite via `<script dangerouslySetInnerHTML>`. Bei neuen Seiten ggf. ergänzen.

14. **Vercel-Deploy-Verzögerung** — Nach `git push` startet das Vercel-Deployment automatisch, aber mit ~30–60s Verzögerung. Status prüfen mit `npx vercel ls`. Kein manueller Trigger nötig solange GitHub-Integration aktiv ist.

15. **IP-Pseudonymisierung via `getHashedIp()`** — Alle 6 öffentlichen Route Handlers nutzen `src/lib/ip.ts` statt roher IPs. HMAC-SHA256 mit `IP_HASH_SECRET`, auf 16-char hex gekürzt (Plausible/Fathom-Pattern). Deterministisch (Rate Limiting funktioniert), nicht umkehrbar. Ohne Secret: SHA-256-Fallback + Prod-Warning. Niemals rohe IPs im Rate-Limiting-Code schreiben.

16. **`tool_comments` INSERT via `adminSupabase`** — Die Route `/api/tools/[id]/comments` (POST) verwendet `adminSupabase` direkt für den INSERT, nicht den anon Client. Begründung: Der Route Handler erzwingt selbst alle Sicherheitsprüfungen (same-origin, rate limit, Validierung, `status: 'pending'` hardcoded) — RLS ist daher nicht nötig. Die Migration `20260415000000_tool_comments_rls.sql` ist obsolet für diesen Use Case.

17. **`tool_comments` hat `tool_slug` NOT NULL** — Die Tabelle hat eine `tool_slug`-Spalte mit NOT NULL-Constraint. Bei jedem INSERT muss zuerst der Slug via `adminSupabase.from('tools').select('slug').eq('id', toolId).maybeSingle()` geladen und als `tool_slug` übergeben werden. Fehlt das Feld, schlägt der INSERT mit Fehlercode `23502` fehl.

---

## Offene TODOs

- [ ] **Screenshot-Upload** — `screenshot_url` im Schema, aber kein Upload-Flow (Storage-Bucket fehlt). Screenshot wird nur gerendert wenn URL vorhanden.
- [ ] **Supabase Migrationen CI** — kein `supabase link` / automatischer Migrations-Deploy
- [ ] **Prompt-Detailseiten** — `/prompts/[slug]` existiert nicht; Seite noch nicht gebaut
- [ ] **News-Detailseiten** — `/news/[slug]` existiert nicht; Seite noch nicht gebaut
- [ ] **State of Legal AI: Sitemap-Eintrag** — `/state-of-legal-ai` ist noch nicht in `sitemap.ts` erfasst

## Erledigte Meilensteine

- [x] **State of Legal AI Germany 2026** (2026-04-16) — Signature Research Hub `/state-of-legal-ai`: pure Server Component, full-bleed dark Hero (`bg-[#111827]`), sticky Anchor-Nav, 9 Module (Executive Summary, Market Map, Marktbeobachtungen, Red Flags nach Persona, Shortlists mit Must/Should/Could, 5-Schritte-Framework, Vendor Watch, CTA-Grid, Newsletter). Entry Points: Homepage dark Callout-Card + Footer „Research"-Sektion. Kein Navbar-Eintrag (bewusste Entscheidung). `revalidate: 86400`, lint- und build-clean.
- [x] **Tool Finder Premium-Inszenierung** (2026-04-16) — `FinderPanel` als Shared Component, Homepage-Platzierung zwischen Hero und Tools, compact-Prop für Tools-Seite.
- [x] **Workflow Premium UI-Paket** (2026-04-16) — Karten vollständig klickbar, WORKFLOW_TEASERS überarbeitet, `WorkflowStepsTeaser` mit Opacity-Fade + Newsletter-CTA.
- [x] **Phase B — Produktreife** (2026-04-16) — `/beitraege` als professionelles Teaser-Format, Workflow-Detailseiten mit intentionellem Lock-Teaser, `not-found.tsx` + `error.tsx` brand-konsistent.
- [x] **Admin-UIs + IP-Pseudonymisierung** (2026-04-15) — `/admin/workflows`, `/admin/events`, `/admin/newsletter` gebaut; zentrales `src/lib/ip.ts` mit HMAC-SHA256; alle 6 öffentlichen Route Handlers auf `getHashedIp()` umgestellt.
- [x] **Sicherheits- und Qualitätspakete I + II** (2026-04-14–15) — Security Headers, Admin-Allowlist, RLS-Härtung, Vote-Atomarität via RPC, Rate Limiting auf Upstash Redis, IP-Hashing, `requireAdminSession()` auf alle Actions ausgeweitet.
- [x] **Public Read Contracts** (2026-04-15) — kein `select('*')` mehr in öffentlichen Queries, explizite Spaltenlisten überall, `submitted_by` via column-level REVOKE gesperrt.
- [x] **Premium-Profile Bulk-Import** (2026-04-14) — 42 Tools mit `long_description`, `best_for`, `not_for`, `verdict`, LexLab-Scores befüllt. Score-Spanne: 35–91.


---

## Verhaltensregeln für Claude

- Nach **jeder Code-Änderung** `npm run lint` ausführen und alle Fehler beheben
- Vor größeren Umstrukturierungen (Routen, Schema, Refactorings) nachfragen
- **Nie** `admin.ts`-Supabase-Client in Client-Komponenten (`'use client'`) verwenden
- **Nie** Secrets, API-Keys oder `.env`-Werte in Code, Logs oder diese Datei schreiben
- **Jede Server Action** (read und write) muss `await requireAdminSession()` als erste Zeile haben — Layout-Schutz allein reicht nicht (Actions sind direkte HTTP-Endpunkte)
- Server Actions in `actions.ts` immer mit `revalidatePath()` für betroffene Routen abschließen
- Bei Tailwind-Änderungen: v4-Syntax (kein `tailwind.config.js`, kein `@apply`)
- Bei neuen Pages mit `useSearchParams()`: in `<Suspense>` einbetten
- Bei neuen dynamischen Route Handlers: `export const dynamic = 'force-dynamic'` setzen
- **`params` immer awaiten** in Next.js 16 Pages und `generateMetadata`
- CLAUDE.md am Ende jeder Session aktualisieren wenn sich Struktur/Konventionen geändert haben

---

## Hinweise für neue Sessions

**Sofort arbeitsfähig mit:**
- Stack: Next.js 16 App Router + Supabase + Tailwind v4 + TypeScript strict + Claude Haiku
- Package Manager: **npm** · Dev starten: `npm run dev`
- Produktions-URL: `https://www.lex-lab.de`
- Admin-Bereich: `/admin/login` (Supabase Email/Password Auth, Credentials in `.env.local`)
- DB-Operationen: Server Actions in `src/app/admin/actions.ts` oder direkt in Route Handlers mit `adminSupabase`
- Typen: `src/types/index.ts` (Frontend-Domain-Types) + Inline-Interfaces in `actions.ts` (Admin-Payload-Types)
- Kein Prettier, kein `tailwind.config.js`, keine `middleware.ts` — alles bewusst weggelassen
- Git: direkte Commits auf `main`, automatischer Vercel-Deploy
- Breaking Change: `params` in Pages ist `Promise` → immer `await params` schreiben
- Rate Limiting: zentrales Modul `src/lib/rate-limit.ts` — `checkRateLimit(key, identifier)` gibt `{ allowed, remaining }` zurück. Kein inline Map-Code in Routen schreiben.
- Neue DB-Funktionen über `adminSupabase.rpc('funktionsname', { ...params })` aufrufen (Beispiel: `toggle_tool_vote`)
- IP-Hashing: immer `getHashedIp(req)` aus `src/lib/ip.ts` verwenden — nie rohe IPs im Rate-Limiting-Code
- Supabase Join-Types in `actions.ts`: bei TypeScript-Fehler durch ambiguous Join-Types `as unknown as { field: type } | null` verwenden
- `tool_comments` RLS INSERT-Policy (`20260415000000_tool_comments_rls.sql`) ist obsolet und **nicht** auszuführen — Migration `20260415000002` entfernt die Policy wieder
- `tool_comments` INSERT: immer `tool_slug` aus `tools`-Tabelle vorab laden und mitsenden — NOT NULL-Constraint, fehlt es → Fehlercode `23502`
- Supabase-Migrationen `20260415000001` + `20260415000002` **wurden im Supabase SQL Editor ausgeführt**: REVOKE anon-Execute auf `toggle_tool_vote` + DROP anon-INSERT-Policy auf `tool_comments` ✅
- Supabase-Migrationen `20260415000003` + `20260415000004` **wurden im Supabase SQL Editor ausgeführt** ✅: DROP anon-INSERT-Policy auf `tools` + DROP anon-SELECT-Policy (`"Service role can read"`) auf `newsletter_subscribers`. Verifiziert: `newsletter_subscribers` hat nur noch INSERT-Policy `"Anyone can subscribe"`; `tools` hat nur noch SELECT-Policy `"Public read approved tools"`.
- **`tools` anon INSERT**: nach Migration `000003` ist die einzige gültige Schreib-Route `/api/tools/submit` via `adminSupabase`. Kein anon-Client darf mehr direkt in `tools` schreiben.
- **`newsletter_subscribers` anon SELECT**: nach Migration `000004` ist kein Read-Access für anon/authenticated mehr möglich. Alle Zugriffe ausschließlich via `adminSupabase` (service role bypasses RLS).
- Security Headers: `next.config.ts` setzt `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Strict-Transport-Security` für alle Routen
- `ADMIN_EMAIL` env var: in Vercel gesetzt und aktiv — `proxy.ts`, `admin/layout.tsx` und `requireAdminSession()` erzwingen alle drei dieselbe Prüfung ✅
- **Öffentliche Supabase-Selects**: niemals `select('*')` in öffentlichen Queries verwenden — gilt für alle Tabellen, alle Client-Komponenten und die Homepage. Explizite Spaltenliste ist Pflicht. Für `tools` zusätzlich: `submitted_by` ist via column-level REVOKE für `anon` gesperrt (nur noch INSERT/UPDATE/REFERENCES).
- **`ToolDetailClient.tsx`** lädt das Tool per `.eq('slug', slug).maybeSingle()` (kein fetch-all mehr). Ähnliche Tools kommen aus einer separaten `.overlaps('rechtsgebiet', ...)` Abfrage mit minimalen Spalten. `SimilarToolsList` akzeptiert `Pick<Tool, 'id' | 'name' | 'slug' | 'rechtsgebiet'>[]`.
- **`vote/route.ts`**: prüft `status = 'approved'` via DB-Lookup vor dem `toggle_tool_vote`-RPC — Votes auf nicht-öffentliche Tools werden mit 404 abgewiesen.
- **`tools`-Spaltenname `pricing`**: Die DB-Spalte für den Preistyp heißt `pricing` (nicht `pricing_type`). Code in `ToolDetailClient.tsx`, `actions.ts` (`UpdateToolPayload`, `updateTool`) und `EditForm.tsx` verwenden `pricing`. Niemals `pricing_type` schreiben — die Spalte existiert nicht in der DB (Fehlercode `42703`).
- **Eigene 404- und Error-Seiten**: `src/app/not-found.tsx` (Server Component) und `src/app/error.tsx` (`'use client'`) existieren. Bei Routing-Änderungen nicht vergessen, dass diese globalen Fehlerseiten das Framework-Default ersetzen. `error.tsx` zeigt `error.digest` dem User, aber keinen Stack Trace.
- **`/state-of-legal-ai`**: Pure Server Component, kein `'use client'`. Hero ist full-bleed dark (`bg-[#111827]`), kein `max-w` auf dem äußeren `<div>`. Sticky Anchor-Nav bei `top-14` (40px Höhe, `z-40` unter Navbar `z-50`). Alle Sections haben `scroll-mt-[100px]` (deckt 56px Navbar + 40px Anchor-Nav ab). Entry Points: Homepage (dark Callout-Card zwischen Finder + Tools-Sektion) + Footer (neue „Research"-Sektion). Nicht in primärer Navbar verlinkt — bewusste Entscheidung zur Nav-Entlastung. Inline Sub-Komponenten: `SectionLabel`, `InsightCard`, `SegmentCard` — nicht auslagern.
- **Tool Finder** (`/tools/finder`): `FinderClient.tsx` lädt alle approved Tools client-seitig, berechnet pro Tool einen `matchScore` aus 4 Antworten (Besucher-Typ, Use Case, Datenschutz, Teamgröße) und zeigt die Top 5. Entry Points: `FinderPanel` auf `/tools` (compact) und auf der Startseite (full). Besucher-Typen: `anwalt | steuerberater | interdisziplinaer | inhouse` — diese 4 Kategorien sind kanonisch für LexLab, werden ggf. site-weit eingebaut.
- **`FinderPanel`** (`src/components/FinderPanel.tsx`): Wiederverwendbares Premium-CTA-Panel für den Tool Finder. Props: `compact?: boolean`. Zeigt "Empfohlen"-Badge, Display-Headline, Subtext und blauen CTA-Button. `compact=true` für Tools-Seite (kleinere Schrift/Padding), default für Homepage. Keine `'use client'`-Direktive — reine Server Component mit `<Link>`.
- **WorkflowDetailClient hat keinen WORKFLOW_STEPS-Hardcode mehr** — alle Workflow-Detailseiten zeigen `WorkflowStepsTeaser` (generische Lock-Icon-Schritte + Newsletter-CTA). Kein slug-spezifischer Content-Hardcode. `WorkflowStepsTeaser` ist als Sub-Komponente inline in `WorkflowDetailClient.tsx` definiert — nicht auslagern.
- **Workflow-Karten auf `/workflows` sind vollständig klickbar** — der `<Link>` wraps die gesamte Karte (group-Hover, Titelfarbe ändert sich bei Hover). Keine separaten Klickbereiche. Die WORKFLOW_TEASERS (Empty-State wenn DB leer) sind NICHT als Link umgesetzt — sie haben kein Ziel.
- **`/beitraege`**: Professionelles Teaser-Format mit zwei Artikel-Cards. Artikel-Array in `ARTICLES` konstante in `page.tsx` — neue Teaser dort ergänzen.
- **`ANTHROPIC_API_KEY` 401-Fehler**: Wenn `/api/pipeline` oder `/api/prompts/generate` mit `401 Invalid authentication credentials` schlagen, ist der Key in Vercel abgelaufen oder falsch gesetzt. Prüfen: console.anthropic.com → API Keys + Vercel → Settings → Environment Variables → `ANTHROPIC_API_KEY`. Nach Änderung: neues Deployment nötig.
- **`sitemap.ts`**: Erfasst derzeit Tools, News, Prompts, Workflows — `/state-of-legal-ai` und `/beitraege` sind **nicht** in der Sitemap. Bei SEO-Relevanz manuell ergänzen.
