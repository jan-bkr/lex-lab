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
│   ├── tools/                      # Tool-Verzeichnis
│   │   ├── page.tsx                # Server Component (adminSupabase, revalidate=3600) → ToolsContent
│   │   ├── ToolsContent.tsx        # Client Component — Filter/Suche/Sort (initialTools prop)
│   │   └── [slug]/                 # Detailseite: Server page.tsx + Client ToolDetailClient.tsx
│   ├── prompts/                    # Prompt-Bibliothek + Builder
│   │   ├── page.tsx                # Server Component (adminSupabase, revalidate=3600) → PromptsContent
│   │   ├── PromptsContent.tsx      # Client Component — Filter + Modal (initialPrompts prop)
│   │   └── builder/                # /prompts/builder — interaktiver Prompt-Generator
│   ├── news/                       # News-Feed
│   │   ├── page.tsx                # Server Component (adminSupabase, revalidate=3600) → NewsContent
│   │   └── NewsContent.tsx         # Client Component — Kategorie-Filter (initialArticles prop)
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
│   ├── ToolCard.tsx                # Karte für Tool-Listings — vollständig klickbar via Stretched-Link-Pattern
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
│   ├── lexlab-score.ts             # Score-Berechnung: Ø gewichtet (35/20/25/10/10)×10
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

**Cron-Job:** `/api/pipeline` täglich 06:00 UTC **und 12:00 UTC** (konfiguriert in `vercel.json`)
- Zwei Läufe pro Tag als Redundanz — Vercel Hobby-Cron feuert gelegentlich nicht zuverlässig
- Vercel Cron sendet **GET** — Route exportiert sowohl `GET` als auch `POST` (GET = Cron, POST = manueller Trigger)
- Auth: Vercel-Header `x-vercel-cron: 1` (automatisch) oder `Authorization: Bearer CRON_SECRET` (manuell)
- Limit: `maxDuration = 60` (Vercel Hobby Plan)
- Verarbeitet max. 3 Items pro RSS-Quelle, 11 Quellen parallel, Cutoff: **36h** (war 24h — erweitert damit Backup-Lauf keine Artikel verpasst)
- Duplikate verhindert via `source_url`-Dedup — mehrfache Läufe sind sicher

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

# Pipeline manuell triggern (lokal):
curl -X POST http://localhost:3000/api/pipeline \
  -H "Authorization: Bearer <CRON_SECRET>"

# Pipeline manuell triggern (Production — wenn Cron ausgefallen):
curl -X POST https://www.lex-lab.de/api/pipeline \
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

7. **`/tools`-, `/news`- und `/prompts`-Seiten sind server-seeded**: `page.tsx` ist jeweils Server Component (`adminSupabase`, `revalidate=3600`), der Client-Teil (`ToolsContent.tsx`, `NewsContent.tsx`, `PromptsContent.tsx`) erhält Daten als `initialTools`/`initialArticles`/`initialPrompts`-Prop und hat keinen eigenen Fetch-Lifecycle. Kein Skeleton auf First Load. Tool-Detailseite `/tools/[slug]` nutzt den Admin-Client im Server-Teil für `generateMetadata` und `fetchToolById`.

8. **Workflows + Events haben DB-Tabellen + Admin-UI** (`workflows`, `events` in Supabase). Die Listing-Seiten und Detailseiten zeigen bei leerem Ergebnis einen Empty-State und bei DB-Fehler einen Fehler-State — kein Mock-Fallback mehr. Admin-UIs unter `/admin/workflows` und `/admin/events` vorhanden.

9. **Newsletter-Abmeldung** ist HMAC-signiert (`NEWSLETTER_HMAC_SECRET` als Schlüssel, SHA-256). Token-Generierung via `makeToken(email)` in `unsubscribe/route.ts`, importiert von `subscribe/route.ts`. Beide Routen schlagen hart fehl wenn `NEWSLETTER_HMAC_SECRET` nicht gesetzt ist.

10. **Newsletter-Anmeldung: Mail vor DB-Write, kein DOI** — `api/newsletter/subscribe` sendet eine Welcome-Mail (`"Willkommen bei lex-lab.de"`) zuerst; DB-Insert nur bei erfolgreichem Mail-Versand. Der Nutzer ist nach dem API-Aufruf **sofort abonniert** (kein Double Opt-in, kein Bestätigungsklick nötig). Schlägt der DB-Insert nach erfolgter Mail fehl, wird `{ success: true }` zurückgegeben und der Fehler geloggt. Die UI-Erfolgsmeldung lautet deshalb "Angemeldet — eine Willkommens-E-Mail ist unterwegs." — **nicht** "bestätige deine Anmeldung".

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
- [ ] **Radar: DB-backed Signals** — aktuell statische Seed-Daten. Für echten Redaktionsbetrieb: `radar_signals`-Tabelle + Admin-UI aufbauen.
- [ ] **Collections: Admin-UI** — Collections-Inhalte sind statisch in `config.ts` definiert. Kein Admin-Flow für Neuanlage.

## Erledigte Meilensteine

- [x] **Premium-Qualitäts- und SEO-Sprint** (2026-04-17) — Funktionale Fixes, Metadata-Härtung, Structured Data, Prompt Builder, SEO-Hub-Seiten:
  - **Event-Datumslogik** (`events/page.tsx`): ISO-Datumsstring-Vergleich `e.date >= todayStr` (todayStr = `new Date().toISOString().slice(0,10)`) statt Timestamp-Vergleich — kein UTC/CEST-Timezone-Fehler mehr. Homepage-Events-Query: `.gte('date', YYYY-MM-DD)`.
  - **Prompt Builder — Sachverhalt-Integration** (`api/prompts/generate/route.ts`): System-Prompt integriert Sachverhalt direkt, kein `[SACHVERHALT EINFÜGEN]`-Platzhalter. `max_tokens` 2000→2500. Fine Print: "pro IP-Adresse und Tag (24-Stunden-Fenster, kein festes Mitternachts-Reset)".
  - **Metadata-Doppelbranding behoben**: "— LexLab" aus `title`-Strings entfernt in `tools/page.tsx`, `news/page.tsx`, `prompts/page.tsx`, `collections/page.tsx`, `collections/[slug]/page.tsx`, `beitraege/page.tsx`. OG-Titles behalten "— LexLab" für Social Sharing.
  - **Homepage JSON-LD**: Zwei Blöcke — `WebSite` (mit `SearchAction potentialAction`) + `Organization` (DACH `areaServed`, `knowsAbout`).
  - **Tool-Detail Structured Data** (`tools/[slug]/page.tsx`): Emittiert `BreadcrumbList` + `SoftwareApplication` JSON-LD (mit `AggregateRating` wenn `lexlab_score` vorhanden). `ToolDetailClient.tsx` hat semantisches `<nav aria-label="Breadcrumb">`.
  - **2 SEO-Hub-Seiten**: `src/app/tools/steuerrecht/page.tsx` + `src/app/tools/ma/page.tsx` — Server Components, ISR 1h, rechtsgebiet-gefilterter Tool-Grid, BreadcrumbList JSON-LD, Collections/Finder/Research-CTAs.
  - **Sitemap**: `/tools/steuerrecht`, `/tools/ma`, `/prompts/builder` ergänzt.
  - **Prompt Builder UI**: Ergebnis-Block dark (`bg-[#111827]`), Copy-Button dark (`bg-[#111827]`), Qualitätsnote "Juristische Basis-Persona integriert · Sachverhalt direkt aufgenommen · Sofort einsetzbar", Reset → "Neu generieren".
  - Build clean: 40/40 Seiten, lint clean, tsc clean.

- [x] **Interaktions- & Score-Qualitätssprint** (2026-04-16) — Premium-Konsistenz und glaubwürdigere Produktbewertung:
  - **ToolCard vollständig klickbar**: Stretched-Link-Pattern (`absolute inset-0`) navigiert zur Detailseite. „Ansehen →" und Vote-Button bleiben per `relative z-10` eigenständig. HTML-valide, kein nested `<a>`.
  - **Event-Kacheln Homepage**: Konditionaler `<a>`-Wrapper (nur wenn `ev.url !== '#'`), Hover-State `group-hover:text-blue-600`. Konsistenz mit anderen klickbaren Kacheln der Plattform.
  - **LexLab Score Rebalancing**: Gewichte angepasst — Praxisreife 30→**35%**, Datenschutz 25→**20%**. Tools mit starkem Praxisnutzen aber Datenschutz-Kompromissen werden realistischer bewertet. DACH/UX/Preis unverändert. Operativer Nachschritt: `node scripts/bulk-import-tools.mjs` für DB-Neuberechnung.
  - **Methodik-Transparenz**: Dezente einzeilige Note in `LexLabScoreCard` — Perspektive (kleine Kanzlei, DACH-Fokus) und Gewichtungslogik als Vertrauensanker, kein Disclaimer-Ton.
  - Build clean: 38/38 Seiten, lint clean, tsc clean.

- [x] **Trust- und Produktwahrheits-Sprint** (2026-04-16) — Chirurgische Produktwahrheits-Korrekturen über alle sichtbaren Flächen:
  - **Newsletter-Erfolgsmeldung**: War `"Fast geschafft — bestätige deine Anmeldung"` (implizierte DOI, der nicht existiert) → `"Angemeldet — eine Willkommens-E-Mail ist unterwegs."` (korrekt: Nutzer ist sofort abonniert, bekommt Welcome-Mail).
  - **News**: "Täglich aktualisiert" → "Täglich kuratiert". Header-Subtext + Footer explizit: "Zusammenfassungen sind KI-generiert" — Transparenz als Vertrauensanker.
  - **Radar**: Hardcodiertes "April 2026" → dynamisches Stand-Datum aus dem neuesten Signal (`sorted[0].date`). Grüner Live-Punkt → grauer Punkt + "Stand:" Prefix. "Wöchentlich" aus Newsletter-CTA entfernt.
  - **Homepage**: "Tools der Woche" → "Meist empfohlen" (query ist votes-basiertes All-time-Ranking, kein wöchentliches Picking).
  - **Collections**: "Redaktionell zusammengestellte Listen" → "Von LexLab zusammengestellte Shortlists... nach Anforderungsprofil gefiltert" (Collections sind DB-Filter, keine redaktionellen Einzelentscheidungen).
  - **Workflows**: "In Vorbereitung"-Eyebrow; Filter-Aktiv-Farbe `bg-blue-600` → `bg-[#111827]` (systemkonsistent mit News/Prompts).
  - **Beiträge**: Neuer hochwertiger Founder/Editor-Block "Hinter LexLab" — Jan Becker mit Foto (112×112), professionelle Bio (Rechtsanwalt, Steuerrecht/M&A/GesR), drei Absätze zur Plattform-Entstehung, Slogan `"building a platform. to learn more."` als Display-Italic. Header-Eyebrow "In Vorbereitung". Newsletter-CTA visuell angepasst.
  - Build clean: 38/38 Seiten, lint clean, tsc clean.

- [x] **Premium-Qualitätssprint: SSR, Trust, Konsistenz** (2026-04-16) — Zusammenhängender Produkt-Sprint für Premium-Reife:
  - **Server-seeding für Tools, News, Prompts**: Alle drei Kernseiten nutzen jetzt `adminSupabase` auf dem Server (page.tsx) und übergeben `initialTools/initialArticles/initialPrompts` als Props an Client-Komponenten (`ToolsContent.tsx`, `NewsContent.tsx`, `PromptsContent.tsx`). Kein Skeleton mehr auf dem First Load. Alle drei Seiten sind jetzt `○ (Static)` mit `revalidate=3600`. Metadata wurde ergänzt.
  - **News — Vertrauenspaket**: Editorial-Framing überarbeitet: Header zeigt "Täglich aktualisiert"-Eyebrow + ruhigeren Subtext. KI-Badge aus Artikel-Karten entfernt. Footer-Note über Quellenherkunft. Filter-Active-State auf `bg-[#111827]` für Konsistenz mit Premium-Sprache. Redaktioneller Fußnotenhinweis.
  - **Homepage**: "KI-Zusammenfassung"-Label aus News-Snippets entfernt — untergrub Vertrauen.
  - **Newsletter**: Erfolgs-Message → "✓ Fast geschafft — bestätige deine Anmeldung per E-Mail." (später korrigiert — kein DOI, s. Trust-Sprint).
  - **Radar**: "Wöchentlich aktualisiert" (faktisch falsch) → "Kuratiert von LexLab".
  - **Status-Labels**: "Bald verfügbar" (Workflow-Teaser) + "Wird bald veröffentlicht" (Beiträge) → einheitlich `bald`-Badge (amber, konsistent mit Navbar).
  - Build clean: 38/38 Seiten, lint clean, tsc clean.

- [x] **Premium-Qualitätspass: Finder, Radar, Collections** (2026-04-16) — Gezielte Design-Verbesserungen nach kritischer Produktanalyse:
  - **FinderPanel**: Badge „Empfohlen" → „Persönliche Empfehlung" (semantisch korrekt); Du-Form konsistent mit FinderClient; CTA `bg-[#111827]` statt Blau; Border neutraler (gray-200 statt blue-100).
  - **FinderClient Results**: Antworten-Summary als Kontext-Pills über den Ergebnissen; `getAnswerLabel()`-Helper; Top-Pick-Badge (schwarz) auf Ergebnis #1; subtile Border-Differenzierung für ersten Treffer; Restart als echter Button (nicht Textlink).
  - **Radar**: Kategorie-Legende entfernt (war Wikipedia-artig); `ImpactDots` zeigt „Hohe Relevanz"-Label als lesbaren Text statt nur Tooltip; Header-Beschreibung gekürzt; „Frühere Signale" als dimmed Uppercase-Subheading.
  - **Collections Listing**: Benefit-Zeile `text-xs → text-sm font-semibold text-gray-800` (Value-Prop als visueller Anker); „Liste ansehen" → „Shortlist ansehen"; Bottom-CTA → „Persönliche Empfehlung →".
  - **Collections Detail**: Top-Tool mit dunkler Outline-Border + Box-Shadow; identisches Top-Pick-Badge wie Finder (gemeinsame Design-DNA); unbenutzter Import bereinigt; CTA vereinfacht.
  - Lint clean, Build clean (38/38 Seiten).
- [x] **Drei neue Premium-Module** (2026-04-16) — Radar, Collections, Finder-Integration:
  - `/radar` (LexLab Radar): Premium-Marktmonitor als Server Component. 9 Signale mit Kategorie (Tool/Feature/Pricing/Regulation/Markt), Impact-Dots (hoch/mittel/niedrig), LexLab-Einschätzung-Boxen, farbige Left-Border pro Kategorie. Statischer Seed, `revalidate: 86400`. Navbar-Eintrag „Radar" mit `isNew: true`-Badge.
  - `/collections` + `/collections/[slug]` (Kuratierte Listen): 5 öffentliche Collections (M&A Due Diligence, Datenschutzstark, Steuerrecht Essentials, Inhouse Stack, Einsteiger Stack). Jede Collection hat statischen Filter (rechtsgebietOverlaps, minScore, minDatenschutz), der als Supabase-Query im [slug]-Page ausgeführt wird. `generateStaticParams` + `generateMetadata`. Tool-Cards analog zu FinderClient-Results für Konsistenz. Leerer DB → Empty State ohne Mock-Fallback.
  - Tools-Seite: Kompakter Collections-Strip (Shortlists-Links) unter FinderPanel.
  - Footer: neue „Entdecken"-Spalte mit Tool Finder, Radar, Kuratierte Listen.
  - Sitemap: alle neuen Routen + `/state-of-legal-ai` ergänzt. Lint clean, Build clean.
- [x] **State of Legal AI Germany 2026** (2026-04-16) — Signature Research Hub `/state-of-legal-ai`: pure Server Component, full-bleed dark Hero (`bg-[#111827]`), sticky Anchor-Nav, 9 Module (Executive Summary, Market Map, Marktbeobachtungen, Red Flags nach Persona, Shortlists mit Must/Should/Could, 5-Schritte-Framework, Vendor Watch, CTA-Grid, Newsletter). Entry Points: Homepage dark Callout-Card + Footer „Research"-Sektion. Kein Navbar-Eintrag (bewusste Entscheidung). `revalidate: 86400`, lint- und build-clean.
- [x] **Premium Recovery Paket** (2026-04-16) — Hero wieder souverän (FinderPanel nach Top-Tools verschoben, redundante Persona-Zeile entfernt). Navbar: `Workflows` erhält `soon: true` Badge. Workflow-Karten im Listing + Startseite: `Vorschau`-Badge. Workflow-Detailseiten: dezenter Preview-Banner zwischen Metadaten und Excerpt. Workflow-Listing mit Info-Note wenn DB-Daten vorhanden. Alle Änderungen lint- und tsc-sauber.
- [x] **Tool Finder Premium-Inszenierung** (2026-04-16) — `FinderPanel` als Shared Component, Homepage-Platzierung nach „Tools der Woche" (nicht mehr zwischen Hero und Research), compact-Prop für Tools-Seite.
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
- **`FinderPanel`** (`src/components/FinderPanel.tsx`): Wiederverwendbares Premium-CTA-Panel für den Tool Finder. Props: `compact?: boolean`. Zeigt „Persönliche Empfehlung"-Eyebrow (kein Icon), Display-Headline in **Du-Form** (konsistent mit FinderClient), Subtext und dunklen CTA-Button (`bg-[#111827]`). `compact=true` für Tools-Seite (kleinere Schrift/Padding), default für Homepage. Keine `'use client'`-Direktive — reine Server Component mit `<Link>`. **Reihenfolge auf der Startseite**: Hero → Research-Callout → Top-Tools → FinderPanel (mit `border-t`-Trenner) → Kategorien → Workflows/Prompt → News → Newsletter. FinderPanel steht bewusst nach den Tools, damit der Hero keine konkurrierende CTA direkt darunter hat.
- **FinderClient Results-Design**: Ergebnis #1 bekommt `border-[#111827]/20` + `shadow-[0_1px_4px_rgba(0,0,0,0.06)]` + schwarzes „Top-Pick"-Badge (oben rechts in Title-Row). Antworten-Summary als Pills (`getAnswerLabel()` aus STEPS-Array) über dem Heading. Alle anderen Cards: `border-gray-100`. Dieses Top-Pick-Muster wird **auch in Collections Detail** eingesetzt — konsistente Design-DNA.
- **Du-Form im Finder**: FinderClient und FinderPanel verwenden durchgehend „du"-Form. Nicht auf „Sie" wechseln — das wurde bewusst entschieden und ist konsistent ausgerichtet.
- **WorkflowDetailClient hat keinen WORKFLOW_STEPS-Hardcode mehr** — alle Workflow-Detailseiten zeigen `WorkflowStepsTeaser` (generische Lock-Icon-Schritte + Newsletter-CTA). Kein slug-spezifischer Content-Hardcode. `WorkflowStepsTeaser` ist als Sub-Komponente inline in `WorkflowDetailClient.tsx` definiert — nicht auslagern.
- **Workflow-Karten auf `/workflows` sind vollständig klickbar** — der `<Link>` wraps die gesamte Karte (group-Hover, Titelfarbe ändert sich bei Hover). Keine separaten Klickbereiche. Die WORKFLOW_TEASERS (Empty-State wenn DB leer) sind NICHT als Link umgesetzt — sie haben kein Ziel. **Statussystem**: Echte Workflow-Karten (DB-Daten) tragen ein dezentes `Vorschau`-Badge (slate, oben rechts); CTA-Text ist "Vorschau" statt "Lesen". Wenn DB-Daten vorhanden, erscheint eine schlanke Info-Note mit Lock-Icon und Newsletter-Link oben auf der Listing-Seite. Workflow-Detailseiten haben einen Preview-Banner (slate, Lock-Icon, "Workflow-Vorschau") zwischen Metadaten und Excerpt-Block. Navbar: `Workflows` hat `soon: true` (wie Beiträge).
- **`/beitraege`**: Teaser-Format mit zwei Artikel-Cards + Founder/Editor-Block "Hinter LexLab" am Ende (Jan Becker, Foto, Bio, Slogan). Artikel-Array in `ARTICLES` konstante in `page.tsx` — neue Teaser dort ergänzen. Foto-Pfad: `/jan-becker.jpg`.
- **`ANTHROPIC_API_KEY` 401-Fehler**: Wenn `/api/pipeline` oder `/api/prompts/generate` mit `401 Invalid authentication credentials` schlagen, ist der Key in Vercel abgelaufen oder falsch gesetzt. Prüfen: console.anthropic.com → API Keys + Vercel → Settings → Environment Variables → `ANTHROPIC_API_KEY`. Nach Änderung: neues Deployment nötig.
- **`sitemap.ts`**: Erfasst Tools, News, Prompts, Workflows, Radar, alle 5 Collections-Slugs, `/state-of-legal-ai`. Nur `/beitraege` fehlt noch (kein eigener Inhalt).
- **Radar-Signale (`/radar`)**: Statische Seed-Daten in `src/app/radar/page.tsx` (SIGNALS-Array). Stand-Datum wird dynamisch aus `sorted[0].date` berechnet — bei neuen Signalen im Array zieht es automatisch mit. Für Redaktionsbetrieb: `radar_signals`-Tabelle + Admin-UI bauen, Page auf DB-Fetch umstellen.
- **Collections-Config (`src/app/collections/config.ts`)**: Geteilte Konfiguration für `/collections` (Listing) und `/collections/[slug]` (Detail). 5 Collections: `ma-due-diligence`, `datenschutzstark`, `steuerrecht-essentials`, `inhouse-stack`, `einsteiger-stack`. Filter via `rechtsgebietOverlaps`, `minScore`, `minDatenschutz`. Neue Collections → Config ergänzen, `generateStaticParams` updaten.
- **Navbar**: `Radar` hat `isNew: true` Badge (blau). `isNew` ist jetzt in der `NavLink`-Interface definiert. Badge-Rendering in Desktop-Nav und Mobile-Menü vorhanden.
- **Footer**: Neue Spalte „Entdecken" mit Tool Finder, Radar (Neu-Badge), Kuratierte Listen (Neu-Badge). Steht vor „Research" und „Rechtliches".
- **Homepage Top-Tools-Label**: Heißt "Meist empfohlen" (nicht "Tools der Woche") — Semantik entspricht dem tatsächlichen votes-basierten All-time-Ranking. Nicht zurückändern.
- **Newsletter-Erfolg**: `NewsletterForm` zeigt `"Angemeldet — eine Willkommens-E-Mail ist unterwegs."` — es gibt **kein** Double Opt-in, die Anmeldung ist nach API-Aufruf sofort aktiv. Success-Message darf das nicht anders kommunizieren.
- **News-Eyebrow**: "Täglich kuratiert" (nicht "Täglich aktualisiert"). Footer-Note: "Zusammenfassungen sind KI-generiert" — so lassen, Transparenz ist hier Produktentscheidung.
- **Workflows-Filter-Aktiv**: `bg-[#111827]` (wie News/Prompts/Tools), nicht `bg-blue-600`.
- **Collections-Beschreibung**: "Von LexLab zusammengestellte Shortlists... nach Anforderungsprofil gefiltert" — **nicht** "redaktionell zusammengestellte" (wäre Overstatement, Collections sind DB-Filter-Konfigurationen).
- **ToolCard Stretched-Link-Pattern**: `ToolCard.tsx` nutzt ein absolut positioniertes `<Link>` (`absolute inset-0 rounded-xl`) als primäres Klickziel für die Detailseite. „Ansehen →" (`<a>`) und der Vote-Button (`<button>`) liegen im `relative z-10`-Container darunter und bleiben eigenständig klickbar. Kein `<a>` in `<a>` — HTML-valide. Nicht auf `onClick`-Navigation am div umbauen.
- **Event-Kacheln Homepage**: Kacheln werden in `<a target="_blank">` gerendert wenn `ev.url !== '#'`, sonst `<div>`. Hover-State (`group-hover:text-blue-600`) nur wenn URL vorhanden. Nicht als `<Link>` — Events verlinken auf externe Seiten.
- **LexLab Score — Gewichte**: `src/lib/lexlab-score.ts` — Praxisreife **35%**, Datenschutz **20%**, DACH-Relevanz **25%**, UX **10%**, Preis **10%**. Summe = 100. Nicht auf alte 30/25-Verteilung zurücksetzen — Datenschutz-Defizit soll ein insgesamt starkes Tool nicht unverhältnismäßig bestrafen. Nach Gewichtsänderung: `node scripts/bulk-import-tools.mjs` ausführen, um `lexlab_score` in der DB neu zu berechnen.
- **LexLabScoreCard Methodik-Note**: Am Ende der Score-Card in `ToolDetailClient.tsx` steht eine einzeilige Transparenznotiz (Perspektive, DACH-Fokus, Gewichtungslogik). Nicht entfernen — sie macht den Score glaubwürdiger statt defensiver.
- **Metadata-Titel-Muster**: Seiten-`title` darf **kein** "— LexLab" enthalten (führt zu "Page — LexLab | LexLab" durch den Title-Template in `layout.tsx`). Nur `openGraph.title` erhält "— LexLab" für Social-Sharing-Qualität. Dieses Muster gilt für alle neuen Pages.
- **Event-Datumsvergleich**: Immer `todayStr = new Date().toISOString().slice(0,10)` und `e.date >= todayStr` (String-Vergleich) — niemals `new Date(e.date) >= new Date()` (UTC/CEST-Fehler: date-only strings parsen als UTC-Mitternacht, erscheinen in CEST 2h zu früh als vergangen).
- **SEO-Hub-Seiten** für Rechtsgebiete: `src/app/tools/steuerrecht/page.tsx` + `src/app/tools/ma/page.tsx` existieren als statische Server Components (ISR 1h). Muster für neue Rechtsgebiets-Hubs: gleiche Datei-Struktur, `.overlaps('rechtsgebiet', ['<Gebiet>'])`, BreadcrumbList JSON-LD, thematische Resource-CTAs. Statische Routen haben in App Router immer Vorrang vor `[slug]`.
- **`sitemap.ts`**: Erfasst jetzt auch `/tools/steuerrecht`, `/tools/ma`, `/prompts/builder`. Insgesamt 40 Seiten im Build.
