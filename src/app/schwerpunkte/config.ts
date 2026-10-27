// ─── Schwerpunkte ─────────────────────────────────────────────────────────────
//
// Geteilte Konfiguration für /schwerpunkte/[slug]. Angaben zu Anbietern beruhen
// ausschließlich auf deren öffentlichen Informationen (Stand siehe `asOf`) und
// werden als Herstellerangaben gekennzeichnet. Keine Aussagen darüber, ob oder
// wie die Kanzlei ein Produkt einsetzt (keine internen Inhalte).

export interface SchwerpunktSection {
  title: string
  items: string[]
}

export interface SchwerpunktDef {
  slug: string
  name: string
  eyebrow: string
  headline: string
  intro: string
  vendor: { name: string; url: string; seat: string }
  relevance: string
  vendorFacts: SchwerpunktSection[]
  checks: string[]
  asOf: string
  sources: { label: string; url: string }[]
}

export const SCHWERPUNKTE: SchwerpunktDef[] = [
  {
    slug: 'langdock',
    name: 'Langdock',
    eyebrow: 'Schwerpunkt · Plattform',
    headline: 'Langdock: Sprachmodelle, Anleitungen und Integrationen an einem Ort',
    intro:
      'Langdock ist eine KI-Plattform für Unternehmen. Sie bündelt verschiedene Sprachmodelle in einer Oberfläche und lässt sich mit eigenen Anleitungen, Wissensquellen und Schnittstellen zu Agenten ausbauen.',
    vendor: { name: 'Langdock GmbH', url: 'https://www.langdock.com/de', seat: 'Berlin' },
    relevance:
      'Eine Skill-Bibliothek braucht einen Ort, an dem Arbeitsanleitungen, Sprachmodell und Datenquellen zusammenkommen. Langdock ist eine Plattform, die diese Ebenen bündelt und Anleitungen als Konfiguration von Agenten abbildet. Deshalb beobachtet LexLab sie genauer.',
    vendorFacts: [
      {
        title: 'Bausteine',
        items: [
          'Chat, modellunabhängig, für alle Nutzer im Unternehmen',
          'Agenten mit eigenen Anweisungen und angehängtem Wissen für wiederkehrende Aufgaben',
          'Workflows für mehrstufige Automatisierungen',
          'Integrationen zu bestehenden Werkzeugen, auch über das Model Context Protocol (MCP)',
          'API, um Langdock in eigene Anwendungen einzubetten',
        ],
      },
      {
        title: 'Betrieb',
        items: [
          'Hosting in Europa',
          'Betriebsmodelle: verwaltetes Hosting, eigene Cloud oder On-Premises',
          'Zertifizierungen nach ISO 27001 und SOC 2 Type II',
        ],
      },
    ],
    checks: [
      'Vertrag mit Verschwiegenheitsverpflichtung nach § 43e BRAO, bei Steuerberatern nach § 62a StBerG',
      'Auftragsverarbeitungsvertrag nach Art. 28 DSGVO',
      'Unterauftragsverarbeiter, insbesondere die Anbieter der jeweils genutzten Sprachmodelle',
      'Datenstandort und Speicherfristen je Modell, nicht nur für die Plattform',
      'Rechte- und Rollenkonzept: wer Agenten anlegen, ändern und freigeben darf',
      'Ob Werkzeugaufrufe über Integrationen vor der Ausführung bestätigt werden müssen',
    ],
    asOf: 'Oktober 2026',
    sources: [
      { label: 'langdock.com', url: 'https://www.langdock.com/de' },
      { label: 'Langdock-Dokumentation: Agenten', url: 'https://docs.langdock.com/en/using-langdock/agents/configuration' },
      { label: 'Langdock-Dokumentation: MCP', url: 'https://docs.langdock.com/en/using-langdock/guides/integrations/mcp/mcp' },
    ],
  },
  {
    slug: 'klardaten',
    name: 'Klardaten',
    eyebrow: 'Schwerpunkt · Daten',
    headline: 'Klardaten: DATEV-Daten für KI-Werkzeuge, über definierte Schnittstellen',
    intro:
      'Klardaten verbindet DATEV mit KI-Werkzeugen und eigenen Anwendungen. Statt Zahlen aus Dokumenten abzuschreiben, fragt ein KI-Assistent die Daten über eine Schnittstelle ab, im Rahmen der Berechtigungen, die in DATEV bestehen.',
    vendor: { name: 'Klardaten GmbH', url: 'https://klardaten.com', seat: 'Berlin' },
    relevance:
      'Haftungsrelevante Zahlen gehören nicht ins Gedächtnis eines Sprachmodells. Sie gehören in geprüfte Systeme, aus denen sie nachvollziehbar abgerufen werden. Ein Zugang zu DATEV über definierte Schnittstellen ist dafür eine Voraussetzung. Deshalb beobachtet LexLab Klardaten genauer.',
    vendorFacts: [
      {
        title: 'Produkte',
        items: [
          'Gateway und MCP-Server: KI-Werkzeuge wie Claude, ChatGPT oder Langdock können DATEV-Daten abfragen',
          'DATEVconnect Gateway: REST-API für eigene Software und direkte Integrationen',
          'Klarvos, in Entwicklung: vordefinierte Automationen für wiederkehrende Kanzleiaufgaben',
        ],
      },
      {
        title: 'Betrieb',
        items: [
          'Installation durch einen IT-Partner in der DATEV-Umgebung der Kanzlei',
          'Verfügbare Daten richten sich nach den eingesetzten DATEV-Modulen und Berechtigungen',
          'Anmeldung der KI-Werkzeuge per OAuth, ausgewählte Schreibaktionen nur nach ausdrücklicher Freigabe',
          'Protokollierung der Aktionen in einem Audit-Log',
          'Hosting von Gateway und MCP-Server in Deutschland',
        ],
      },
    ],
    checks: [
      'Das angebundene KI-Werkzeug hat eigene Verarbeitungs- und Hosting-Bedingungen, die gesondert zu prüfen sind',
      'Vertrag mit Verschwiegenheitsverpflichtung nach § 43e BRAO, bei Steuerberatern nach § 62a StBerG',
      'Auftragsverarbeitungsvertrag nach Art. 28 DSGVO, für Klardaten und für das KI-Werkzeug',
      'Berechtigungen in DATEV auf das Nötige beschränken, Schreibrechte bewusst vergeben',
      'Wer das Audit-Log auswertet und wie lange es aufbewahrt wird',
    ],
    asOf: 'Oktober 2026',
    sources: [
      { label: 'klardaten.com', url: 'https://klardaten.com/en' },
      { label: 'Klardaten: DATEVconnect Gateway', url: 'https://klardaten.com/en/products/datevconnect-gateway' },
    ],
  },
]

export function getSchwerpunkt(slug: string): SchwerpunktDef | undefined {
  return SCHWERPUNKTE.find(s => s.slug === slug)
}
