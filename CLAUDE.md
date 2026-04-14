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
│   │   └── prompts/                # Prompt-Verwaltung
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
│   ├── workflows/                  # Workflow-Guides (DB + Mock-Fallback)
│   ├── newsletter/                 # Anmeldung + /abgemeldet-Bestätigung
│   ├── events/                     # Rechtstermine (DB + Mock-Fallback)
│   ├── beitraege/                  # Beiträge (Placeholder, kein Inhalt)
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
│   ├── lexlab-score.ts             # Score-Berechnung: Ø gewichtet (30/25/25/10/10)×10
│   ├── jurist-persona.ts           # JURIST_PERSONA — System-Prompt für Claude
│   ├── rss-sources.ts              # 11 RSS-Quellen (M&A, Steuer, LegalTech, VC)
│   ├── analytics.ts                # Vercel Analytics Helper
│   ├── clean-text.ts               # Text-Bereinigung für Pipeline
│   └── mock-data.ts                # Mock-Fallbacks für Tools, Workflows, Events, Prompts
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
| `CRON_SECRET` | Server only | Auth für Pipeline + Cleanup + Newsletter-HMAC |
| `UPSTASH_REDIS_REST_URL` | Server only | Upstash Redis — Rate Limiting (Vote, Comments, Prompts, Newsletter, Kontakt, Tool-Submit) |
| `UPSTASH_REDIS_REST_TOKEN` | Server only | Upstash Redis — Rate Limiting |

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

8. **Workflows + Events haben DB-Tabellen** (`workflows`, `events` in Supabase), aber die Seiten fallen auf `mock-data.ts` zurück solange die DB leer ist. Beide Tabellen haben noch kein eigenes Admin-UI.

9. **Newsletter-Abmeldung** ist HMAC-signiert (CRON_SECRET als Schlüssel, SHA-256). Token-Generierung via `makeToken(email)` in `unsubscribe/route.ts`, importiert von `subscribe/route.ts`.

10. **Tool-Routing-Inkonsistenz:** Öffentliche Routen nutzen `slug` (`/tools/[slug]`), Admin-Edit nutzt `id` (`/admin/tools/[id]/edit`). Beim Verlinken korrekte ID vs. Slug verwenden.

11. **Startseite nutzt Admin-Client** (`adminSupabase`) direkt in einem Server Component — das ist korrekt (Server-seitig), aber ungewöhnlich. Begründung: öffentliche Daten ohne RLS-Overhead lesen.

12. **JSON-LD Schema.org** auf der Startseite via `<script dangerouslySetInnerHTML>`. Bei neuen Seiten ggf. ergänzen.

13. **Vercel-Deploy-Verzögerung** — Nach `git push` startet das Vercel-Deployment automatisch, aber mit ~30–60s Verzögerung. Status prüfen mit `npx vercel ls`. Kein manueller Trigger nötig solange GitHub-Integration aktiv ist.

---

## Offene TODOs

- [ ] **Workflows-Admin-UI** — DB-Tabelle existiert, aber kein `/admin/workflows`-Page
- [ ] **Events-Admin-UI** — DB-Tabelle existiert, aber kein `/admin/events`-Page
- [ ] **Newsletter-Admin-UI** — `newsletter_subscribers`-Tabelle hat keine Admin-Ansicht
- [ ] **Beiträge-Seite** (`/beitraege`) ist vollständiger Placeholder ohne Inhalt
- [ ] **Screenshot-Upload** — `screenshot_url` im Schema, aber kein Upload-Flow (Storage-Bucket fehlt). Platzhalter auf Detailseite wurde bereits entfernt — Screenshot wird nur gerendert wenn URL vorhanden.
- [ ] **Supabase Migrationen CI** — kein `supabase link` / automatischer Migrations-Deploy
- [ ] **Prompt-Detailseiten** — `/prompts/[slug]` im Sitemap referenziert, aber keine entsprechende Page-Datei gefunden
- [ ] **News-Detailseiten** — `/news/[slug]` im Sitemap, Seite zu prüfen
- [ ] **Tool-Submit-Flow** — `/tools/submit` existiert, aber Moderation-Notifications fehlen

## Erledigte Meilensteine

- [x] **Premium-Profile Bulk-Import** (2026-04-14) — 42 Tools mit `long_description`, `best_for`, `not_for`, `verdict`, LexLab-Scores und `last_reviewed_at` befüllt. Score-Spanne: 35 (quickbooks-claude) – 91 (datev-ki).
- [x] **Premium-Profil UI auf Tool-Detailseiten** (2026-04-14) — `ToolDetailClient.tsx` zeigt jetzt alle Premium-Felder: lange Beschreibung (ersetzt Kurztext), „Für wen geeignet?" (Best-for/Not-for zweispaltig mit ✓/✕), „Redaktionelles Fazit" (Verdict, blauer Kasten) und „LexLab Score" in der Sidebar (Gesamtscore + 5 Sub-Score-Balken, farbcodiert grün/amber/rot). Felder werden nur gerendert wenn in DB vorhanden (null-safe).
- [x] **LexLab Score auf Tools-Übersichtsseite** (2026-04-14) — `ToolCard.tsx` zeigt farbcodierten Score-Badge (grün ≥80 / amber ≥60 / rot <60) oben rechts. Tools-Seite lädt `lexlab_score` aus Supabase, sortiert standardmäßig nach Score absteigend. Neues Dropdown-Option „LexLab Score" als Default-Sortierung.
- [x] **Kontaktformular gehärtet** (2026-04-14) — `api/kontakt`: Rate Limiting (5/h pro IP), Origin-Check, HTML-Escaping aller User-Inputs, Feldlängenlimits.
- [x] **Cleanup-Route auf POST+Auth umgestellt** (2026-04-14) — `api/admin/cleanup`: von GET auf POST, CRON_SECRET-Pflichtcheck.
- [x] **Sicherheits- und Betriebs-Paket** (2026-04-14) — Admin Server Actions intern mit `requireAdminSession()` abgesichert; `tool_votes` SELECT-Policy entfernt (voter_ip = PII); Pipeline-Route exportiert GET+POST (Vercel Cron sendet GET); Vote-Zählung atomar via `toggle_tool_vote()` RPC (Migration 000003); Rate Limiting auf Upstash Redis migriert (`src/lib/rate-limit.ts`, Sliding Window, 5 Endpunkte, In-Memory-Fallback für lokale Entwicklung).
- [x] **Public Truth & Submit Hardening** (2026-04-14) — `/tools/submit` von Browser-Anon-Write auf serverseitigen API-Route-Handler (`/api/tools/submit`) umgestellt: Validierung, Rate Limit (5/Tag pro IP), schreibt via `adminSupabase`. Mock-Fallbacks auf allen öffentlichen Seiten (Homepage, Tools, Prompts, Workflows, Events) durch echte Fehler-/Leer-States ersetzt. Sitemap bereinigt: `/prompts/[slug]` und `/news/[slug]` entfernt (Seiten existieren nicht). Navbar: `/beitraege` mit „bald"-Badge markiert statt leerem Link.

> **Langfristig für `/tools/submit`:** Der aktuelle schmale Fix (API Route) ist korrekt, aber nicht optimal. Die sauberere Langzeitlösung ist ein vollständiger Server Action mit Moderationsbenachrichtigung (E-Mail an Admin via Resend), dedizierter Slug-Kollisionsprüfung und optionalem Double-Opt-In für den Einreicher. Priorität: mittel — erst nach Workflow-Content-Modell und pricing/pricing_type-Bereinigung.

---

## Verhaltensregeln für Claude

- Nach **jeder Code-Änderung** `npm run lint` ausführen und alle Fehler beheben
- Vor größeren Umstrukturierungen (Routen, Schema, Refactorings) nachfragen
- **Nie** `admin.ts`-Supabase-Client in Client-Komponenten (`'use client'`) verwenden
- **Nie** Secrets, API-Keys oder `.env`-Werte in Code, Logs oder diese Datei schreiben
- **Jede write-only Server Action** muss `await requireAdminSession()` als erste Zeile haben — Layout-Schutz allein reicht nicht (Actions sind direkte HTTP-Endpunkte)
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
