# LexLab

Kuratierte Plattform für KI-Tools, Workflows und Prompts für den deutschen Rechtsmarkt.

**Live:** [lex-lab.de](https://www.lex-lab.de)

## Stack

| Bereich | Technologie |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19 + Tailwind CSS v4 |
| Datenbank | Supabase (Postgres + Auth + RLS) |
| KI | Claude Haiku (Anthropic) |
| E-Mail | Resend |
| Rate Limiting | Upstash Redis |
| Deployment | Vercel |

## Entwicklung

```bash
npm install
npm run dev       # http://localhost:3000
npm run build
npm run lint
```

## Umgebungsvariablen

Alle erforderlichen Variablen sind in `.env.local` (lokal) und in Vercel (Produktion) zu setzen.
Siehe Tabelle in `CLAUDE.md` für die vollständige Liste.

## Dokumentation

Architektur, Konventionen und offene TODOs sind in [`CLAUDE.md`](./CLAUDE.md) dokumentiert.
