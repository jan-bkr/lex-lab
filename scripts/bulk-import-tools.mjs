/**
 * Redaktioneller Tool-Katalog: Profile und Scores aktualisieren, neue Tools anlegen.
 * Vorschau:  node scripts/bulk-import-tools.mjs --dry-run
 * Anwenden:  node scripts/bulk-import-tools.mjs
 *
 * Bestehende Datensätze werden anhand des Slugs aktualisiert. Neue, redaktionell
 * vollständig beschriebene Tools werden als approved angelegt.
 */

import { readFileSync } from 'fs'

// ─── Env laden ────────────────────────────────────────────────────────────────
const env = Object.fromEntries(
  readFileSync('.env.local', 'utf8').split('\n')
    .filter(l => l.includes('='))
    .map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] })
)
const SUPABASE_URL = env['NEXT_PUBLIC_SUPABASE_URL']
const SERVICE_KEY  = env['SUPABASE_SERVICE_ROLE_KEY']
const REVIEW_DATE  = '2026-07-31'

// ─── Score-Berechnung (Gewichte: Praxisreife 35%, DS 20%, DACH 25%, UX 10%, Preis 10%) ─────
// Muss mit src/lib/lexlab-score.ts synchron bleiben!
function lexlabScore(p, d, dach, ux, pr) {
  const scores = [
    { v: p,    w: 35 },  // Praxisreife
    { v: d,    w: 20 },  // Datenschutz
    { v: dach, w: 25 },  // DACH-Relevanz
    { v: ux,   w: 10 },  // UX
    { v: pr,   w: 10 },  // Preis
  ]
  let total = 0, totalWeight = 0
  for (const { v, w } of scores) {
    if (v != null && v > 0) { total += v * w; totalWeight += w }
  }
  return totalWeight === 0 ? null : Math.round((total / totalWeight) * 10)
}

// ─── Tool-Daten ───────────────────────────────────────────────────────────────
const TOOLS = [
  {
    slug: 'aiwyn-tax',
    url: 'https://www.aiwyn.ai',
    category: ['Steuerautomatisierung', 'Kanzleisoftware', 'Abrechnungsautomatisierung'],
    long_description: 'Aiwyn ist eine KI-Plattform für Wirtschaftsprüfungs- und Steuerberatungskanzleien, die Kernprozesse wie Mandantenabrechnung, Zahlungsabwicklung und Engagement-Management automatisiert. Die Lösung integriert sich in bestehende Praxismanagementsysteme (z. B. CCH, Thomson Reuters) und beschleunigt den Order-to-Cash-Zyklus erheblich. KI-gestütztes automatisches Rechnungsversand, Zahlungsportal und Echtzeit-Analytics stehen im Mittelpunkt. Aiwyn richtet sich primär an mittelgroße bis große CPA-Kanzleien im amerikanischen Markt.',
    best_for: ['Automatisierung von Rechnungsstellung und Mahnwesen in Steuer-/WP-Kanzleien', 'Verkürzung des Zahlungseinzugs durch digitale Mandantenportale', 'Echtzeit-Einblick in Kanzleiperformance und offene Posten', 'Integration mit US-zentrischen Kanzleisoftware-Stacks (CCH Axcess, QuickBooks)'],
    not_for: ['Deutsche oder europäische Steuerberatungskanzleien (keine DATEV-Integration, kein deutsches Steuerrecht)', 'Kleine Einzelkanzleien mit begrenztem Budget', 'Kanzleien, die DSGVO-konforme EU-Datenhaltung benötigen'],
    verdict: 'Aiwyn löst echte Effizienzprobleme in Steuerberatungskanzleien, ist aber klar auf den US-Markt ausgerichtet. Für DACH-Steuerberater fehlen DATEV-Integration, deutschsprachiger Support und europäische Datenhaltung vollständig. Nicht empfehlenswert für deutsche Kanzleien.',
    score_praxisreife: 7, score_datenschutz: 3, score_dach: 1, score_ux: 7, score_preis: 5,
  },
  {
    slug: 'avvoka',
    url: 'https://avvoka.com',
    category: ['Vertragsautomatisierung', 'Document Drafting', 'Due Diligence'],
    long_description: 'Avvoka ist eine cloudbasierte Plattform für Vertragsautomatisierung und -zusammenarbeit, die von Großkanzleien und Unternehmensjuristinabteilungen weltweit eingesetzt wird. Die Software ermöglicht die Erstellung intelligenter Vertragsvorlagen mit bedingter Logik, kollaboratives Vertragsverhandeln in Echtzeit und detailliertes Vertragsanalytics. Avvoka hat seinen Ursprung im Londoner Legal-Tech-Ökosystem und wird von renommierten Magic-Circle-Kanzleien genutzt. Seit 2023/2024 werden zunehmend KI-Funktionen für Vertragsanalyse und Risikoerkennung integriert.',
    best_for: ['Automatisierung wiederkehrender Vertragstypen (NDA, SPA, SHA) in Großkanzleien', 'Kollaboratives Verhandeln und Redlining mit Mandanten in Echtzeit', 'Aufbau von Wissensdatenbanken aus abgeschlossenen Verträgen', 'M&A- und VC-Transaktionsprozesse mit standardisierten Dokumenten'],
    not_for: ['Kleine Kanzleien mit geringem Vertragsvolumen (Implementierungsaufwand zu hoch)', 'Kanzleien ohne dediziertes Legal-Tech-Budget und IT-Ressourcen', 'Rein deutschsprachige Kanzleien (Plattform primär englischsprachig)'],
    verdict: 'Avvoka gehört zu den ausgereiftesten Vertragsautomatisierungs-Plattformen für internationale Großkanzleien. Für den DACH-Markt ist die Plattform grundsätzlich nutzbar, aber die englischsprachige Ausrichtung und die fehlende Integration in deutsche Rechtsstrukturen schränken den Nutzen für kleinere Kanzleien ein.',
    score_praxisreife: 8, score_datenschutz: 7, score_dach: 5, score_ux: 7, score_preis: 5,
  },
  {
    slug: 'briefpoint',
    url: 'https://briefpoint.ai',
    category: ['Document Drafting', 'Vertragsautomatisierung'],
    long_description: 'Briefpoint ist ein KI-gestütztes Tool, das speziell auf die Automatisierung juristischer Schriftsätze und Antwortdokumente ausgerichtet ist. Es analysiert eingehende Klageschriften oder Vertragsdokumente und generiert automatisch strukturierte Erwiderungen. Das Tool reduziert den Zeitaufwand für das Erstellen von Antwortschriftsätzen erheblich und richtet sich primär an Litigation-Anwälte im US-amerikanischen Rechtsraum. Die Integration in MS Word ist ein zentrales Merkmal.',
    best_for: ['Automatisierte Generierung von Antwortschriftsätzen auf Basis eingehender Klagen', 'Zeitersparnis bei repetitiven prozessualen Dokumenten in Litigation-Kanzleien', 'Erstanalyse und Strukturierung eingehender juristischer Dokumente'],
    not_for: ['Deutsche Kanzleien (kein deutsches Prozessrecht, keine ZPO-Logik)', 'Beratende Tätigkeit (M&A, Vertragsgestaltung, Steuerrecht)', 'Kanzleien, die DSGVO-konforme Datenverarbeitung auf EU-Servern benötigen'],
    verdict: 'Briefpoint löst ein sehr spezifisches US-amerikanisches Litigation-Problem und hat für den deutschen Markt faktisch keine Relevanz. Das deutsche Prozessrecht und die ZPO-Strukturen werden nicht abgebildet. Für deutsche Anwaltskanzleien aktuell nicht empfehlenswert.',
    score_praxisreife: 6, score_datenschutz: 3, score_dach: 1, score_ux: 7, score_preis: 6,
  },
  {
    slug: 'captable-io',
    url: 'https://captable.io',
    category: ['Cap Table Management', 'Equity Management'],
    long_description: 'Captable.io ist eine moderne, cloudbasierte Cap-Table-Management-Software für Startups und ihre Investoren. Die Plattform ermöglicht die Verwaltung von Gesellschafterstrukturen, die Simulation von Finanzierungsrunden, die Ausgabe und Verwaltung von Mitarbeiterbeteiligungen (ESOPs/Optionen) sowie automatisierte 409A-Bewertungen (US-spezifisch). Das Tool positioniert sich als kostengünstige Alternative zu Carta und richtet sich an frühe Startups. Die Plattform ist auf US-amerikanisches Gesellschaftsrecht ausgerichtet.',
    best_for: ['Frühe Startups, die eine einfache und kostengünstige Cap-Table-Lösung suchen', 'Simulation von Finanzierungsrunden und Verwässerungsszenarien', 'Verwaltung von Mitarbeiterbeteiligungsprogrammen (ESOP/Optionen)', 'VC-Investoren, die einheitliche Cap-Table-Sichten über ihr Portfolio benötigen'],
    not_for: ['Deutsche GmbHs und AGs (keine Integration mit Handelsregister, keine GmbH-Gesellschafterlisten nach deutschem Recht)', 'Steuerliche und notarielle Anforderungen im DACH-Raum nicht abgedeckt', 'Kanzleien, die rechtssichere Gesellschafterlisten für deutsche Kapitalgesellschaften führen müssen'],
    verdict: 'Captable.io ist für den deutschen Markt bedingt nutzbar — als Planungs- und Simulationstool für internationale Startups mit US-Strukturen durchaus sinnvoll, aber für die rechtssichere Verwaltung deutscher GmbH-Gesellschafterlisten ungeeignet. Für DACH gibt es besser geeignete Alternativen wie Ledgy oder Capdesk.',
    score_praxisreife: 5, score_datenschutz: 4, score_dach: 2, score_ux: 8, score_preis: 9,
  },
  {
    slug: 'chatgpt-plus',
    url: 'https://chat.openai.com',
    category: ['Allgemeine KI-Assistenz', 'Document Drafting', 'Recherche'],
    long_description: 'ChatGPT Plus ist das kostenpflichtige Abonnement von OpenAIs ChatGPT-Dienst und gewährt Zugang zu GPT-4o sowie weiteren fortgeschrittenen Modellen, Plugins und der Websuche-Integration. Im Rechtsbereich wird es für Rechtsrecherche, Dokumentenanalyse, Vertragsentwürfe und die Vorbereitung juristischer Argumentation genutzt. Mit dem Custom-GPT-Feature können kanzleiinterne Wissensbasen und spezialisierte juristische Assistenten aufgebaut werden. OpenAI bietet für Unternehmenskunden eine ChatGPT-Team/Enterprise-Option mit stärkeren Datenschutzgarantien an.',
    best_for: ['Schnelle Recherche und Zusammenfassung juristischer Sachverhalte', 'Ersterstellung von Vertragsentwürfen, Memos und Schriftstücken', 'Aufbau kanzleiinterner Custom GPTs für wiederkehrende juristische Aufgaben', 'Vorbereitung auf Mandantengespräche und Sachverhaltsanalyse'],
    not_for: ['Verlässliche Rechtsdatenbank-Recherche (halluziniert Urteile und Normen)', 'Verarbeitung hochsensibler Mandantendaten ohne Enterprise-Vertrag (DSGVO-Risiko)', 'Vollständiger Ersatz spezialisierter juristischer Software wie Westlaw oder juris'],
    verdict: 'ChatGPT Plus ist das meistgenutzte KI-Tool auch in deutschen Kanzleien und bietet ein breites Anwendungsspektrum. Die DSGVO-Situation ist bei der Standard-Plus-Version kritisch — für professionellen Kanzleieinsatz ist mindestens die Team-Version mit Datenschutzvertrag nötig. Das Halluzinationsrisiko bei Rechtsrecherchen erfordert stets manuellen Verifikationsprozess.',
    score_praxisreife: 7, score_datenschutz: 5, score_dach: 6, score_ux: 9, score_preis: 8,
  },
  {
    slug: 'claude-code',
    url: 'https://claude.ai/code',
    category: ['Softwareentwicklung', 'Legal Tech Entwicklung'],
    long_description: 'Claude Code ist Anthropics agentenbasiertes Coding-Tool, das direkt in die Entwicklungsumgebung integriert wird und komplexe Programmieraufgaben autonom ausführen kann. Es liest und schreibt Dateien, führt Terminal-Befehle aus und navigiert eigenständig durch Codebasen. Im juristischen Kontext ist es vor allem für Legal-Tech-Entwickler interessant, die juristische Automatisierungs-Tools, Vertragsgeneratoren oder Kanzleisoftware entwickeln. Für reine Rechtspraktiker ohne Programmierhintergrund ist es nicht direkt nutzbar.',
    best_for: ['Legal-Tech-Entwickler, die juristische Automatisierungslösungen bauen', 'Kanzleien mit eigener IT-Abteilung, die interne Tools entwickeln wollen', 'Erstellung von Skripten für Dokumentenverarbeitung und Dateimanagement', 'Prototypentwicklung für kanzleiinterne KI-Anwendungen'],
    not_for: ['Rechtsanwälte ohne Programmierkenntnisse (kein direkter Mehrwert)', 'Juristische Recherche oder Vertragsprüfung (kein juristisches Tool)', 'Mandatssensible Datenverarbeitung ohne geprüfte Datenschutzvereinbarung'],
    verdict: 'Claude Code ist für den juristischen Endnutzer kein direkt einsetzbares Tool, sondern ein Entwicklerwerkzeug. Für DACH-Kanzleien mit eigenen Entwicklungsressourcen kann es sehr wertvoll sein, um juristische Prozesse zu automatisieren. Die Datenschutzlage entspricht Anthropics allgemeinen Bedingungen — eine EU-Datenhaltung ist nicht standardmäßig garantiert.',
    score_praxisreife: 3, score_datenschutz: 5, score_dach: 3, score_ux: 6, score_preis: 7,
  },
  {
    slug: 'claude-legal',
    url: 'https://claude.ai',
    category: ['Allgemeine KI-Assistenz', 'Document Drafting', 'Recherche'],
    long_description: 'Claude von Anthropic ist ein leistungsfähiger KI-Assistent mit herausragenden Fähigkeiten in Textanalyse, juristischer Argumentation und Dokumentenverarbeitung. Im Rechtsbereich wird Claude für Vertragsprüfung, Rechtsgutachten-Entwürfe, Zusammenfassungen langer Dokumente und juristische Recherche eingesetzt. Claude zeichnet sich durch besondere Genauigkeit bei komplexen Analyse- und Argumentationsaufgaben aus und verfügt über ein großes Kontextfenster (200.000 Token), das die Analyse ganzer Verträge ermöglicht. Anthropic vermarktet Claude auch über API-Zugänge an Kanzleien und Legal-Tech-Anbieter.',
    best_for: ['Analyse und Zusammenfassung langer juristischer Dokumente und Verträge', 'Erstellung von Rechtsgutachten-Entwürfen und strukturierten Rechtsanalysen', 'Prüfung und Kommentierung von Vertragsentwürfen auf Risikopunkte', 'Mehrsprachige juristische Arbeit (besonders stark in Deutsch und Englisch)'],
    not_for: ['Verlässliche Zitierung konkreter Urteile (Verifikation stets notwendig)', 'Verarbeitung hochsensibler Mandantendaten ohne Enterprise-Vertrag', 'Vollständiger Ersatz spezialisierter Legal-Research-Datenbanken'],
    verdict: 'Claude ist im Bereich der allgemeinen KI-Assistenten einer der stärksten Kandidaten für juristische Aufgaben in deutschen Kanzleien, insbesondere bei der Dokumentenanalyse und Argumentation. Das große Kontextfenster macht es besonders nützlich für M&A-Due-Diligence. Für professionellen Einsatz ist ein Claude for Work-Account mit Datenschutzvertrag unbedingt erforderlich.',
    score_praxisreife: 7, score_datenschutz: 6, score_dach: 6, score_ux: 8, score_preis: 8,
  },
  {
    slug: 'claude-legal-plugin',
    url: 'https://claude.ai/download',
    category: ['Allgemeine KI-Assistenz', 'KI-Integration'],
    long_description: 'Die Claude Desktop-Anwendung ist die native App-Version von Anthropics Claude-KI für macOS und Windows. Sie ermöglicht die lokale Nutzung von Claude mit erweiterten Integrationsmöglichkeiten über das Model Context Protocol (MCP), über das externe Datenquellen, Dateisysteme und Tools angebunden werden können. Für Kanzleien eröffnet dies die Möglichkeit, Claude direkt mit lokalen Dokumenten, Kanzleisoftware und Datenbanken zu verbinden, ohne alle Daten in die Cloud hochladen zu müssen. Besonders interessant für datenschutzsensible Workflows mit Mandantendaten.',
    best_for: ['Kanzleien, die Claude mit lokalen Dokumenten und Systemen verbinden wollen (via MCP)', 'Datenschutzsensible Anwendungsfälle mit lokalem Dateizugriff', 'Integration mit Kanzleisoftware über benutzerdefinierte MCP-Server', 'Power-User, die erweiterte Claude-Funktionen gegenüber der Web-Version benötigen'],
    not_for: ['Einsteiger ohne technisches Verständnis von MCP-Konfiguration', 'Kanzleien, die eine fertige juristische Lösung suchen (erfordert Konfigurationsaufwand)', 'Vollständiger Ersatz für spezialisierte Rechtssoftware'],
    verdict: 'Die Claude Desktop-App mit MCP-Integration ist ein interessantes Tool für technikaffine Kanzleien, die Datenschutzkontrolle mit KI-Leistung verbinden wollen. Der Konfigurationsaufwand ist jedoch erheblich. Für den typischen deutschen Kanzleialltag ist die Web-Version von Claude der einfachere Einstieg.',
    score_praxisreife: 5, score_datenschutz: 7, score_dach: 5, score_ux: 5, score_preis: 8,
  },
  {
    slug: 'clio',
    url: 'https://www.clio.com',
    category: ['Kanzleisoftware', 'Kanzleiverwaltung'],
    long_description: 'Clio ist eine der meistverbreiteten cloudbasierten Kanzleiverwaltungsplattformen weltweit und bietet Funktionen für Zeiterfassung, Abrechnung, Mandantenverwaltung, Dokumentenmanagement und Kanzlei-Analytics. Mit Clio Duo wurde 2024 ein KI-Assistent integriert, der Juristen bei Recherche, Dokumentenerstellung und Aufgabenmanagement unterstützt. Clio ist primär auf den nordamerikanischen Markt ausgerichtet, hat aber durch Akquisitionen und Partnerschaften seine globale Reichweite erweitert. Für europäische Kanzleien existiert eine DSGVO-konforme Datenhaltungsoption.',
    best_for: ['Kleine bis mittelgroße Kanzleien, die eine All-in-One-Kanzleiverwaltung suchen', 'Zeiterfassung und automatische Abrechnung mit Mandantenportal', 'Dokumentenmanagement und -automatisierung (Lawyaw-Integration)', 'KI-gestützte Aufgaben- und Mandatsorganisation via Clio Duo'],
    not_for: ['Große deutsche Kanzleien mit spezifischen DATEV- oder beA-Anforderungen', 'Kanzleien, die tiefe Integration in das deutsche Gerichtssystem benötigen', 'Steuerberater (primär auf Rechtsanwaltskanzleien ausgerichtet)'],
    verdict: 'Clio ist eine international ausgereifte Kanzleimanagement-Lösung, die für deutsche Kanzleien interessant sein kann, aber spezifische deutsche Anforderungen (beA, DATEV, RVG, BRAK) nicht nativ abdeckt. Für DACH-Kanzleien sind oft spezialisiertere Lösungen wie AnNoText oder RA-MICRO besser geeignet.',
    score_praxisreife: 6, score_datenschutz: 6, score_dach: 3, score_ux: 8, score_preis: 6,
  },
  {
    slug: 'clocktimizer',
    url: 'https://www.clocktimizer.com',
    category: ['Legal Analytics', 'Kanzleimanagement', 'Abrechnung'],
    long_description: 'Clocktimizer ist eine spezialisierte Legal-Analytics-Plattform, die Zeiterfassungsdaten von Kanzleien analysiert und dabei KI nutzt, um Timekeeping-Qualität zu verbessern, Abrechnungsnarrative zu optimieren und Projektmanagement in der Kanzlei zu professionalisieren. Das niederländische Unternehmen hat seinen Schwerpunkt auf europäische Großkanzleien und wurde von mehreren renommierten internationalen Kanzleien eingesetzt. Clocktimizer wurde 2022 von Thomson Reuters übernommen und in deren Produktökosystem integriert.',
    best_for: ['Großkanzleien, die die Qualität ihrer Zeiterfassung und Abrechnungsnarrative verbessern wollen', 'Kanzlei-Management, das datenbasierte Erkenntnisse über Projektprofitabilität benötigt', 'Analyse von Matter-Budgets und frühe Warnung bei Kostenüberschreitungen', 'Benchmarking der Kanzleiperformance auf Basis historischer Abrechnungsdaten'],
    not_for: ['Kleine Kanzleien mit wenigen Zeiterfassungsdaten (zu wenig Datenbasis)', 'Kanzleien ohne strukturierte Zeiterfassungssysteme', 'Steuerberater und Wirtschaftsprüfer (auf Anwaltskanzleien ausgerichtet)'],
    verdict: 'Clocktimizer ist ein ausgereiftes Legal-Analytics-Tool, das nach der Übernahme durch Thomson Reuters in deren Produktökosystem integriert wurde. Die europäische Herkunft und die Ausrichtung auf internationale Großkanzleien macht es für DACH-Großkanzleien prinzipiell relevant. Der ROI ist erst ab einer gewissen Kanzleigröße und Zeiterfassungsvolumen realisierbar.',
    score_praxisreife: 7, score_datenschutz: 7, score_dach: 6, score_ux: 7, score_preis: 5,
  },
  {
    slug: 'cursor',
    url: 'https://www.cursor.com',
    category: ['Softwareentwicklung', 'Legal Tech Entwicklung'],
    long_description: 'Cursor ist ein KI-gestützter Code-Editor (Fork von VS Code), der KI-Funktionen tief in die Entwicklungsumgebung integriert und damit die Softwareentwicklung beschleunigt. Im juristischen Kontext ist Cursor relevant für Legal-Tech-Entwickler und Kanzleien, die eigene juristische Automatisierungstools, Dokumentengeneratoren oder interne KI-Anwendungen entwickeln. Die KI kann Codebasen verstehen, Fehler erklären und ganze Funktionen auf Basis natürlichsprachiger Beschreibungen implementieren. Cursor ist kein juristisches Tool und hat keine rechtsgebietsspezifischen Funktionen.',
    best_for: ['Legal-Tech-Entwickler beim Bau juristischer Automatisierungslösungen', 'Kanzleien mit eigener IT, die interne Tools und Integrationen entwickeln', 'Rapid Prototyping von juristischen KI-Anwendungen', 'Erstellung von Dokumenten-Templates und automatisierten Workflows'],
    not_for: ['Rechtsanwälte ohne Programmierkenntnisse', 'Direkte juristische Arbeit wie Recherche oder Vertragsanalyse', 'Kanzleien, die eine fertige Lösung suchen'],
    verdict: 'Cursor ist wie Claude Code ein Entwicklerwerkzeug, das für Juristen ohne Programmierhintergrund keinen direkten Mehrwert bietet. Es ist jedoch sehr leistungsfähig für Legal-Tech-Entwicklung. Datenschutztechnisch sind Cloud-Anfragen an die KI-Backend-Anbieter zu berücksichtigen.',
    score_praxisreife: 2, score_datenschutz: 4, score_dach: 2, score_ux: 8, score_preis: 8,
  },
  {
    slug: 'datev-ki',
    url: 'https://www.datev.de',
    category: ['Steuerautomatisierung', 'Kanzleisoftware', 'Buchhaltungsautomatisierung'],
    long_description: 'DATEV ist das führende Softwarehaus für Steuerberater, Wirtschaftsprüfer und Rechtsanwälte in Deutschland und integriert zunehmend KI-Funktionen in sein umfangreiches Produktportfolio. DATEV KI umfasst unter anderem automatische Belegverarbeitung, intelligente Buchungsvorschläge, KI-gestützte Auswertungen und Beratungsunterstützung. Als Genossenschaft mit deutschen Rechenzentren bietet DATEV höchste DSGVO-Konformität und ist tief in die deutschen Steuer- und Rechtsprozesse integriert. DATEV ist für über 40.000 Kanzleien in Deutschland das Rückgrat der digitalen Kanzleiinfrastruktur.',
    best_for: ['Steuerberater und WP-Kanzleien in Deutschland, die DATEV bereits nutzen', 'Automatisierte Belegverarbeitung und Buchungsvorschläge im Kanzleialltag', 'Rechtssichere Datenverarbeitung mit deutschen Rechenzentren und DSGVO-Konformität', 'Mandantenkommunikation und -datenaustausch über das DATEV-Ökosystem'],
    not_for: ['Kanzleien außerhalb Deutschlands (Österreich und Schweiz haben eigene Systeme)', 'Reine Rechtsanwaltskanzleien ohne steuerrechtliche Beratung', 'Organisationen, die ausschließlich englischsprachige Tools bevorzugen'],
    verdict: 'DATEV KI ist für deutsche Steuerberatungskanzleien die relevanteste und sicherste KI-Integration auf dem Markt, da sie nahtlos in bestehende DATEV-Workflows eingebettet ist und höchste Datenschutzstandards mit deutschen Servern garantiert. Kein anderes Tool bietet vergleichbare DACH-Spezifität und regulatorische Sicherheit für den deutschen Steuermarkt.',
    score_praxisreife: 9, score_datenschutz: 10, score_dach: 10, score_ux: 7, score_preis: 7,
  },
  {
    slug: 'doxly',
    url: 'https://legal.thomsonreuters.com/de/products/highq',
    category: ['Transaction Management', 'M&A', 'Due Diligence'],
    long_description: 'Doxly war eine auf Transaktionsmanagement spezialisierte Legal-Tech-Plattform, die 2018 von Thomson Reuters übernommen und in die HighQ-Plattform integriert wurde. Die Funktionalitäten — Transaktionschecklisten, Dokumentenverwaltung, Closing-Management und elektronische Signaturen — leben heute unter dem Thomson Reuters HighQ-Brand weiter. HighQ ist eine kollaborative Plattform für Kanzleien und Rechtsabteilungen, die Deals, Projekträume und Mandantenkommunikation auf einer sicheren Plattform bündelt.',
    best_for: ['Transaktionsmanagement bei M&A-Deals mit mehreren Parteien und langen Checklisten', 'Koordination von Closing-Prozessen und Signaturschleifen', 'Nutzern, die bereits im Thomson Reuters/HighQ-Ökosystem arbeiten', 'Dokumentenverwaltung und Zugriffssteuerung bei komplexen Transaktionen'],
    not_for: ['Kanzleien, die ein eigenständiges Doxly-Produkt suchen (wurde in HighQ integriert)', 'Kleine Kanzleien mit gelegentlichem Transaktionsbedarf', 'Standalone-Einsatz ohne Thomson Reuters Vertragsbeziehung'],
    verdict: 'Doxly existiert als eigenständiges Produkt nicht mehr — alle Funktionen sind in Thomson Reuters HighQ aufgegangen. HighQ ist eine solide Transaktionsmanagement-Lösung für Großkanzleien, die auch im DACH-Raum genutzt wird. Für neue Implementierungen sollte direkt auf HighQ verwiesen werden.',
    score_praxisreife: 7, score_datenschutz: 7, score_dach: 6, score_ux: 7, score_preis: 5,
  },
  {
    slug: 'evisort',
    url: 'https://www.evisort.com',
    category: ['Vertragsmanagement', 'Contract Analytics', 'Due Diligence'],
    long_description: 'Evisort ist eine KI-gestützte Contract-Intelligence-Plattform, die Unternehmen dabei hilft, juristische Risiken in großen Vertragsportfolios zu identifizieren, Klauseln zu extrahieren und Vertragsdaten für strategische Entscheidungen nutzbar zu machen. Das Tool wurde 2023 von Workday übernommen und ist nun Teil des Workday-Ökosystems. Evisort setzt Machine Learning ein, um Verträge automatisch zu klassifizieren, kritische Fristen zu erkennen und Compliance-Risiken zu melden. Die Plattform richtet sich primär an große Unternehmen mit umfangreichen Vertragsbeständen.',
    best_for: ['Inhouse-Rechtsabteilungen mit großen Vertragsportfolios', 'Automatische Extraktion und Indexierung von Klauseln aus Tausenden von Verträgen', 'Integration in Workday-Enterprise-Umgebungen', 'Vertragsrisikomanagement und Fristenüberwachung auf Enterprise-Niveau'],
    not_for: ['Externe Anwaltskanzleien (auf Inhouse-Teams ausgerichtet)', 'Kleine Unternehmen und mittelständische Kanzleien (Enterprise-Preisgestaltung)', 'Kanzleien ohne Workday-Umgebung (zunehmend in Workday integriert)'],
    verdict: 'Evisort ist nach der Workday-Akquisition vor allem für große Unternehmen attraktiv, die bereits in der Workday-Welt operieren. Als eigenständiges Legal-Tech-Tool für deutsche Kanzleien ist es weniger relevant geworden. Für DACH-Inhouse-Abteilungen in Workday-Umgebungen kann es dennoch interessant sein.',
    score_praxisreife: 7, score_datenschutz: 6, score_dach: 4, score_ux: 7, score_preis: 4,
  },
  {
    slug: 'gemini-advanced',
    url: 'https://gemini.google.com',
    category: ['Allgemeine KI-Assistenz', 'Document Drafting', 'Recherche'],
    long_description: 'Gemini Advanced ist Googles Premium-KI-Assistenten-Dienst, der Zugang zu Googles leistungsfähigstem Gemini-Modell bietet. Im juristischen Kontext kann Gemini Advanced für Recherche, Dokumentenanalyse, Vertragsentwürfe und Sachverhaltsanalysen eingesetzt werden. Die tiefe Integration in Google Workspace ermöglicht es, KI-Funktionen direkt in bestehende Arbeitsprozesse einzubetten. Google bietet für Unternehmenskunden DSGVO-konforme Datenverarbeitungsverträge und EU-Datenhaltung an.',
    best_for: ['Kanzleien, die Google Workspace als primäres Produktivitätstool nutzen', 'Integration von KI direkt in Google Docs für kollaboratives Dokumentenarbeiten', 'Multimodale Analyse (Text, Bilder, Tabellen) in juristischen Dokumenten', 'Webrecherche und aktuelle Rechtsinformationen durch Google-Suchintegration'],
    not_for: ['Verlässliche juristische Datenbank-Recherche (Halluzinationsrisiko bei Urteilen)', 'Kanzleien, die Microsoft 365 als primäres Ökosystem nutzen', 'Hochsensible Mandantendaten ohne geprüfte Enterprise-Datenschutzvereinbarung'],
    verdict: 'Gemini Advanced ist für Google-Workspace-affine deutsche Kanzleien eine attraktive Option, da die Workspace-Integration die Nutzungshürde erheblich senkt. Google bietet für Enterprise-Kunden DSGVO-Konformität und EU-Datenhaltung. Im Vergleich zu Claude und ChatGPT ist die juristische Argumentation etwas schwächer, aber die Google-Integration ist ein echter Mehrwert.',
    score_praxisreife: 6, score_datenschutz: 7, score_dach: 6, score_ux: 8, score_preis: 7,
  },
  {
    slug: 'harvey-ai',
    name: 'Harvey',
    url: 'https://www.harvey.ai',
    tagline: 'Enterprise Legal AI für komplexe Wissens- und Transaktionsarbeit',
    description: 'Globale Legal-AI-Plattform für Recherche, Drafting, Dokumentenanalyse, agentische Workflows und die Arbeit mit großen Mandats- und Deal-Datenbeständen.',
    rechtsgebiet: ['M&A', 'Gesellschaftsrecht', 'Venture Capital'],
    category: ['Rechtsrecherche', 'Document Drafting', 'Due Diligence', 'Vertragsanalyse'],
    pricing: 'enterprise',
    pricing_url: 'https://www.harvey.ai',
    is_new: false,
    featured: true,
    long_description: 'Harvey hat sich von einem spezialisierten Chat-Assistenten zu einer breiten Enterprise-Plattform für juristische Wissensarbeit entwickelt. Die Lösung unterstützt Recherche, Drafting, Dokumentenanalyse, große Vault-Datenbestände und agentische Workflows und wird international von zahlreichen Großkanzleien und Rechtsabteilungen eingesetzt. Integrationen in Microsoft- und DMS-Umgebungen sowie Deal-Plattformen machen Harvey besonders für transaktionsintensive Teams relevant. Für deutsche Primär- und Premium-Rechtsquellen bleibt die Content-Tiefe jedoch stärker vom konkreten Daten- und Integrationssetup abhängig als bei lokalen Fachverlagslösungen.',
    best_for: ['Große und mittelgroße Kanzleien mit internationaler Mandatsarbeit', 'Due Diligence, Vertragsanalyse und Drafting in komplexen Transaktionen', 'Enterprise-Rollouts mit DMS-, Microsoft- und Deal-Plattform-Integration'],
    not_for: ['Solo- und Kleinkanzleien mit begrenztem Budget', 'Ausschließlich deutsche Rechtsrecherche mit Premium-Kommentarbedarf', 'Teams ohne Ressourcen für Governance, Einführung und Qualitätssicherung'],
    verdict: 'Die bisherige LexLab-Bewertung von 59 Punkten unterschätzte Harveys heutige Produktreife deutlich. Harvey gehört global zur Spitzengruppe; Abzüge bleiben wegen Enterprise-Preis, US-Herkunft und gegenüber lokalen Angeboten geringerer deutscher Quellenverankerung.',
    last_reviewed_at: '2026-07-31',
    score_praxisreife: 9, score_datenschutz: 8, score_dach: 7, score_ux: 9, score_preis: 3,
  },
  {
    slug: 'imanage-claude',
    url: 'https://imanage.com',
    category: ['Dokumentenmanagement', 'KI-Integration', 'Wissensmanagement'],
    long_description: 'iManage ist das führende Dokumenten- und E-Mail-Managementsystem für Kanzleien weltweit und hat 2024 eine tiefe Integration mit Anthropics Claude-KI ausgerollt. Diese Integration ermöglicht es Kanzleien, direkt innerhalb von iManage KI-gestützte Dokumentenanalyse, Zusammenfassungen, Vertragsvergleiche und Recherchen durchzuführen — mit dem entscheidenden Vorteil, dass die Daten im sicheren iManage-System verbleiben. iManage Cloud bietet DSGVO-konforme Datenhaltung in europäischen Rechenzentren.',
    best_for: ['Große Kanzleien, die bereits iManage als DMS nutzen und KI integrieren wollen', 'DSGVO-konforme KI-Nutzung ohne Datenweitergabe an externe Dienste', 'Dokumentensuche, -analyse und -zusammenfassung direkt im Kanzlei-DMS', 'M&A Due Diligence und Vertragsmanagement in einer sicheren Umgebung'],
    not_for: ['Kanzleien ohne iManage-Lizenz (Investition in DMS-Infrastruktur erforderlich)', 'Kleine Kanzleien (iManage ist Enterprise-Software mit entsprechenden Kosten)', 'Sofort einsatzbereite Lösung (erfordert Implementierung und Konfiguration)'],
    verdict: 'Die iManage + Claude-Integration ist eine der vielversprechendsten Enterprise-Legal-KI-Lösungen für große DACH-Kanzleien, da sie höchste Datenschutzstandards mit modernster KI verbindet. Die Tatsache, dass Mandantendaten das sichere iManage-System nicht verlassen müssen, ist für europäische Kanzleien ein entscheidendes Argument.',
    score_praxisreife: 8, score_datenschutz: 9, score_dach: 7, score_ux: 7, score_preis: 4,
  },
  {
    slug: 'ironclad',
    url: 'https://ironcladapp.com',
    category: ['Vertragsmanagement', 'CLM', 'Vertragsautomatisierung'],
    long_description: 'Ironclad ist eine führende Contract-Lifecycle-Management-(CLM)-Plattform, die den gesamten Vertragslebenszyklus von der Erstellung über Verhandlung und Genehmigung bis zur Verwaltung und Analyse abdeckt. Die Plattform bietet visuelles Workflow-Design, KI-gestützte Vertragsanalyse, ein zentrales Vertragsarchiv und umfangreiche Integrationen mit CRM-, ERP- und HR-Systemen. Ironclad hat sich 2023/2024 stark auf KI-Funktionen fokussiert und bietet einen KI-Assistenten für Vertragsverhandlungen und Klauselempfehlungen.',
    best_for: ['Inhouse-Rechtsabteilungen, die einen vollständigen CLM-Prozess digitalisieren wollen', 'Automatisierung von Vertragsworkflows mit Self-Service-Optionen für Geschäftsbereiche', 'KI-gestützte Vertragsverhandlung und Standardklausel-Empfehlungen', 'Integration mit Salesforce, Workday und anderen Enterprise-Systemen'],
    not_for: ['Externe Anwaltskanzleien (primär für Inhouse-Teams konzipiert)', 'Kleine Unternehmen (Enterprise-Preisgestaltung)', 'Kanzleien mit spezifischen DACH-Compliance-Anforderungen (US-Unternehmen)'],
    verdict: 'Ironclad ist eine der ausgereiftesten CLM-Plattformen und besonders für große deutsche Inhouse-Rechtsabteilungen interessant, die Vertragsworkflows automatisieren wollen. Für DACH-spezifische Anforderungen sollten Datenschutzvereinbarungen und EU-Datenhaltung sorgfältig geprüft werden.',
    score_praxisreife: 8, score_datenschutz: 6, score_dach: 5, score_ux: 8, score_preis: 5,
  },
  {
    slug: 'josef',
    url: 'https://www.josef.ai',
    category: ['Rechtsautomatisierung', 'Document Automation', 'No-Code'],
    long_description: 'Josef ist eine australische No-Code-Plattform, mit der Juristen ohne Programmierkenntnisse automatisierte juristische Tools, Dokumentengeneratoren und Rechtsberatungs-Chatbots erstellen können. Kanzleien und Rechtshilfeanbieter nutzen Josef, um repetitive Rechtsberatungsprozesse zu automatisieren und als Self-Service-Tools für Mandanten bereitzustellen. Die Plattform ermöglicht die Erstellung von interaktiven Fragebögen, die am Ende strukturierte Rechtsdokumente oder Erstanalysen generieren.',
    best_for: ['Kanzleien, die repetitive Rechtsberatungsprozesse als Self-Service automatisieren wollen', 'Erstellung von Mandanten-Chatbots für die Ersterkundung von Rechtsfragen', 'Automatisierung von Standarddokumenten ohne IT-Entwicklungsaufwand', 'Legal-Aid-Organisationen und Rechtsberatungsportale'],
    not_for: ['Komplexe juristische Aufgaben, die individuelle Beratung erfordern', 'Kanzleien mit deutschem Rechtsschwerpunkt (kein deutsches Rechtssystem integriert)', 'Enterprise-Anwender mit hohen Compliance- und Datenschutzanforderungen nach DSGVO'],
    verdict: 'Josef ist ein interessantes No-Code-Automatisierungstool für Kanzleien, die Mandanten-Self-Service aufbauen wollen, aber die australische Herkunft und der Common-Law-Fokus schränken die Relevanz für den DACH-Markt erheblich ein. Für den deutschen Markt gibt es spezialisiertere Alternativen.',
    score_praxisreife: 5, score_datenschutz: 4, score_dach: 2, score_ux: 8, score_preis: 6,
  },
  {
    slug: 'kira-systems',
    url: 'https://kirasystems.com',
    category: ['Due Diligence', 'Contract Analytics', 'Vertragsanalyse'],
    long_description: 'Kira Systems ist eine der bekanntesten KI-Plattformen für automatisierte Vertragsanalyse und Due Diligence und wurde 2021 von Litera übernommen. Das Tool nutzt Machine Learning, um juristische Dokumente zu analysieren, spezifische Klauseln zu identifizieren und strukturierte Berichte zu erstellen. Kira wird von einer Vielzahl internationaler Großkanzleien für M&A Due Diligence eingesetzt und unterstützt über 1.000 vordefinierte Klausel-Erkennungsmodelle. Nach der Litera-Akquisition ist Kira Teil eines breiteren Legal-Tech-Portfolios.',
    best_for: ['M&A Due Diligence mit großen Dokumentenvolumina (hunderte bis tausende Verträge)', 'Automatische Erkennung und Extraktion spezifischer Vertragsklauseln', 'Großkanzleien, die Due-Diligence-Effizienz und -Qualität gleichzeitig verbessern wollen', 'Immobilien- und Finanzierungstransaktionen mit standardisierten Dokumententypen'],
    not_for: ['Kleine Kanzleien (Kosten und Implementierungsaufwand zu hoch)', 'Einmalige Transaktionen ohne wiederholenden DD-Bedarf', 'Rein deutschsprachige Klauselanalyse (historisch englischsprachig dominiert)'],
    verdict: 'Kira Systems ist ein bewiesener Marktführer für M&A Due Diligence in Großkanzleien und wird auch von deutschen Kanzleien mit internationalem M&A-Schwerpunkt genutzt. Die deutschsprachige Klauselerkennung hat sich verbessert, ist aber noch nicht auf dem Niveau der englischsprachigen Analyse.',
    score_praxisreife: 8, score_datenschutz: 7, score_dach: 5, score_ux: 7, score_preis: 4,
  },
  {
    slug: 'klarity',
    url: 'https://www.klarity.ai',
    category: ['Contract Analytics', 'Due Diligence', 'Vertragsmanagement'],
    long_description: 'Klarity ist eine KI-gestützte Vertragsanalyse-Plattform, die sich auf die automatische Extraktion und Überprüfung von Vertragsdaten spezialisiert hat, insbesondere für wiederkehrende Vertragstypen wie SaaS-Agreements, NDAs und kommerzielle Standardverträge. Das Tool richtet sich vor allem an Finanz- und Buchhaltungsteams sowie Inhouse-Legal-Teams und differenziert sich durch seinen Fokus auf finanziell relevante Vertragsklauseln (Revenue Recognition, IFRS 15/ASC 606).',
    best_for: ['Inhouse-Teams, die Revenue-Recognition-Compliance aus Verträgen automatisieren', 'Automatische Extraktion finanziell relevanter Klauseln aus großen Vertragsportfolios', 'Schnelle Due-Diligence-Analyse kommerzieller Standardverträge'],
    not_for: ['Externe Kanzleien (primär auf Inhouse-Finance- und Legal-Teams ausgerichtet)', 'Hochkomplexe M&A-Transaktionsverträge (nicht der Schwerpunkt)', 'Kanzleien mit deutschem Gesellschaftsrecht-Fokus (US-amerikanische Accounting-Standards im Vordergrund)'],
    verdict: 'Klarity hat eine klare Nische in der finanziell relevanten Vertragsanalyse. Für den DACH-Markt ist die Relevanz eingeschränkt, da der Fokus auf US-GAAP-Accounting-Standards liegt. Für internationale DACH-Unternehmen mit US-Vertragsportfolio kann es dennoch wertvoll sein.',
    score_praxisreife: 6, score_datenschutz: 5, score_dach: 3, score_ux: 7, score_preis: 5,
  },
  {
    slug: 'legalese-decoder',
    url: 'https://legalesedecoder.com',
    category: ['Vertragsanalyse', 'Dokumentenverständnis'],
    long_description: 'Legalese Decoder ist ein KI-gestütztes Tool, das komplexe juristische Texte in verständliche Alltagssprache übersetzt. Nutzer können Verträge, AGB und sonstige Rechtsdokumente hochladen und erhalten eine vereinfachte Erklärung der wichtigsten Klauseln. Das Tool richtet sich primär an Laien und Gründer, die ohne tiefes Rechtswissen Vertragsrisiken einschätzen möchten. Für den Venture-Capital-Kontext eignet es sich zum schnellen Erfassen von Term Sheets und Beteiligungsverträgen.',
    best_for: ['Startups und Gründer, die Term Sheets oder Gesellschaftervereinbarungen verstehen wollen', 'Inhouse-Juristen für schnelle Ersteinschätzung unbekannter Vertragstypen', 'Mandantenberatung: Erklärung komplexer Klauseln in einfacher Sprache'],
    not_for: ['Professionelle Due-Diligence-Prozesse, die tiefe strukturierte Analyse erfordern', 'Kanzleien, die belastbare juristische Gutachten benötigen', 'DACH-spezifische Rechtsfragen (primär US-rechtlich trainiert)'],
    verdict: 'Legalese Decoder ist ein nützliches Erklär-Tool für Nicht-Juristen, ersetzt aber keine anwaltliche Beratung. Für den deutschen Rechtsmarkt ist die DSGVO-Konformität unklar, und das Training auf US-amerikanisches Recht schränkt den Nutzen für deutsche Vertragstypen erheblich ein.',
    score_praxisreife: 4, score_datenschutz: 3, score_dach: 3, score_ux: 7, score_preis: 6,
  },
  {
    slug: 'legalyze',
    url: 'https://legalyze.ai',
    category: ['Vertragsanalyse', 'Due Diligence', 'M&A'],
    long_description: 'Legalyze ist eine KI-Plattform für automatisierte Vertragsanalyse und Due Diligence, speziell für M&A- und Gesellschaftsrechtsprozesse konzipiert. Das Tool extrahiert relevante Klauseln, Risikopositionen und Abweichungen vom Marktstandard aus großen Dokumentenmengen. Es unterstützt mehrsprachige Dokumente und ermöglicht teambasiertes Arbeiten mit Kommentar- und Freigabeworkflows. Kanzleien und Unternehmensrechtsteams können damit den Review-Aufwand bei Transaktionen deutlich reduzieren.',
    best_for: ['M&A-Teams bei der Analyse von Datenraumdokumenten', 'Gesellschaftsrechtliche Due Diligence mit hohem Dokumentenvolumen', 'Identifikation von Klauselabweichungen gegenüber Verhandlungsstandards'],
    not_for: ['Kleine Einzelkanzleien ohne regelmäßige Transaktionsmandate', 'Steuerrechtliche Detailanalyse (kein Schwerpunkt)', 'Vollständige Automatisierung ohne juristischen Review'],
    verdict: 'Legalyze positioniert sich als ernsthafter Mitbewerber zu Luminance und Kira in der Vertragsanalyse. Für den DACH-Markt ist die Frage der Serverstandorte und DSGVO-Konformität entscheidend — diese Informationen sind öffentlich nicht vollständig einsehbar. Das Tool bietet echten Mehrwert bei transaktionsintensiven Mandaten.',
    score_praxisreife: 6, score_datenschutz: 4, score_dach: 5, score_ux: 6, score_preis: 5,
  },
  {
    slug: 'lexfusion',
    url: 'https://lexfusion.ai',
    category: ['Legal Tech Beratung', 'Tool-Aggregation'],
    long_description: 'LexFusion ist ein Aggregator für Legal-Tech-Lösungen und zugleich eine Plattform, die verschiedene KI-gestützte Rechtswerkzeuge unter einer einheitlichen Oberfläche bündelt. Das Konzept richtet sich an Kanzleien, die mehrere Spezialtools integrieren möchten, ohne für jedes eine separate Lizenz zu verhandeln. LexFusion übernimmt dabei auch Beschaffungs- und Implementierungsberatung und positioniert sich als strategischer Partner für Kanzleien beim Legal-Tech-Einkauf.',
    best_for: ['Kanzleien, die Legal-Tech-Stack-Entscheidungen strukturiert treffen wollen', 'IT-Verantwortliche in größeren Sozietäten bei der Tool-Auswahl', 'Großkanzleien mit Bedarf an gebündelter Lizenzierung mehrerer KI-Tools'],
    not_for: ['Einzelanwälte oder kleine Kanzleien (zu komplex und kostenintensiv)', 'Direktes juristisches Arbeiten — LexFusion ist kein Analyse-Tool selbst', 'Kurzfristige Einzelprojekte ohne strategisches Legal-Tech-Interesse'],
    verdict: 'LexFusion adressiert ein echtes Problem — die Fragmentierung des Legal-Tech-Markts — ist aber selbst kein operatives Arbeitswerkzeug. Für den DACH-Markt ist das Angebot noch wenig bekannt und primär auf US-Kanzleien ausgerichtet.',
    score_praxisreife: 4, score_datenschutz: 4, score_dach: 3, score_ux: 5, score_preis: 4,
  },
  {
    slug: 'lexis-plus',
    name: 'Lexis+ mit Protégé',
    url: 'https://www.lexisnexis.com/en-us/products/lexis-plus.page',
    tagline: 'Legal-AI-Plattform auf Basis der LexisNexis-Rechtsinhalte',
    description: 'Internationale Plattform für quellenbasierte Rechtsrecherche, Drafting, Analyse und agentische Workflows mit LexisNexis-Inhalten und Organisationswissen.',
    rechtsgebiet: ['M&A', 'Gesellschaftsrecht', 'Venture Capital'],
    category: ['Rechtsdatenbank', 'Rechtsrecherche'],
    pricing: 'enterprise',
    pricing_url: 'https://www.lexisnexis.com/en-us/products/lexis-plus.page',
    is_new: false,
    featured: false,
    long_description: 'Lexis+ mit Protégé ist die aktuelle Legal-AI-Plattform von LexisNexis für Recherche, Analyse, Drafting und mehrstufige juristische Arbeitsabläufe. Das System verbindet generative KI mit den umfangreichen LexisNexis-Rechtsinhalten und kann Organisationswissen einbeziehen. 2026 wurde Protégé als zentrale Plattformschicht von Lexis+ deutlich ausgebaut. Im DACH-Markt bleibt die inhaltliche Relevanz stark vom jeweiligen Länderprodukt und Lizenzbestand abhängig; für internationales und Common-Law-Geschäft ist die Quellenbasis besonders stark.',
    best_for: ['Umfangreiche internationale Rechtsrecherche (US, UK, EU-Recht)', 'Vergleichende Analyse von Fallrechtsprechung über Jurisdiktionen hinweg', 'Großkanzleien mit internationalem Mandatsschwerpunkt'],
    not_for: ['Alleinige Abdeckung deutschen Rechts (dafür besser juris oder beck-online)', 'Kleine Kanzleien mit begrenztem Budget (hohe Lizenzkosten)', 'Steuerberater mit Fokus auf nationales deutsches Steuerrecht'],
    verdict: 'Protégé hebt Lexis+ funktional klar über den Stand der bisherigen LexLab-Bewertung. Für internationale Kanzleien ist es ein Spitzenprodukt; als primäre deutsche Recherchelösung bleibt es hinter lokal verankerten Content-Angeboten.',
    last_reviewed_at: '2026-07-31',
    score_praxisreife: 9, score_datenschutz: 7, score_dach: 4, score_ux: 8, score_preis: 3,
  },
  {
    slug: 'luminance',
    url: 'https://www.luminance.com',
    category: ['Due Diligence', 'Vertragsanalyse', 'M&A', 'Vertragsmanagement'],
    long_description: 'Luminance ist eine etablierte KI-Plattform für automatisierte Vertragsanalyse und Due Diligence, die auf eigenem Machine-Learning-Modell (nicht rein GPT-basiert) aufbaut. Das System liest und kategorisiert Verträge aller Art, erkennt Anomalien und Abweichungen vom Marktstandard und ermöglicht strukturierte Reviews in Transaktionsprojekten. Luminance wird weltweit von mehreren Hundert Großkanzleien eingesetzt und bietet mit Luminance Autopilot zunehmend auch Vertragsverhandlungs-Features.',
    best_for: ['M&A Due Diligence mit großen Dokumentenvolumina (Datenraumanalyse)', 'Großkanzleien und Rechtsabteilungen mit regelmäßigen Transaktionsmandaten', 'Vertragsstandardisierung und Abweichungsanalyse in internationalen Projekten'],
    not_for: ['Kleinere Kanzleien ohne regelmäßige M&A-Mandate (zu kostenintensiv)', 'Einzelne Vertragsprüfungen ohne strukturierten Workflow-Bedarf', 'Deutsches Steuerrecht oder spezifische nationale Rechtsfragen'],
    verdict: 'Luminance gehört zur ersten Liga der Legal-Tech-Plattformen und ist auch in DACH bei mehreren Großkanzleien im Einsatz. Die DSGVO-Konformität ist dokumentiert, Serveroptionen in Europa verfügbar. Das Tool überzeugt durch technische Reife und breiten Einsatz, ist jedoch für mittelgroße Kanzleien preislich oft schwer darstellbar.',
    last_reviewed_at: '2026-07-31',
    score_praxisreife: 9, score_datenschutz: 8, score_dach: 6, score_ux: 8, score_preis: 4,
  },
  {
    slug: 'midpage',
    url: 'https://www.midpage.ai',
    category: ['Rechtsrecherche', 'Zitationsverifikation'],
    long_description: 'Midpage ist ein KI-Tool speziell für die Verifikation juristischer Zitate und Quellenrecherche in Rechtsdokumenten. Das System prüft, ob zitierte Fälle, Gesetze und Klauseln korrekt wiedergegeben und noch gültig sind — ein häufiges Problem bei KI-generierten juristischen Texten. Midpage ist primär auf US-amerikanisches Fallrecht ausgerichtet, bietet aber auch Dokumentenanalyse für M&A-Kontext. Die Plattform positioniert sich als Halluzinations-Check für KI-gestützte Rechtsarbeit.',
    best_for: ['Qualitätssicherung von KI-generierten juristischen Texten und Schriftsätzen', 'Verifikation von Fallzitaten und Quellenangaben vor Einreichung', 'Anwälte, die andere KI-Tools nutzen und eine Gegenkontrolle benötigen'],
    not_for: ['Deutsches oder österreichisches Recht (primär US Common Law)', 'Eigenständige Vertragsanalyse oder Due Diligence', 'Kanzleien ohne bisherige KI-Tool-Nutzung'],
    verdict: 'Midpage löst ein echtes Problem im KI-Rechtskontext — unkorrekte Quellenzitate — ist aber nahezu ausschließlich auf US-Recht zugeschnitten. Für den DACH-Markt hat das Tool derzeit kaum praktische Relevanz, da deutsche Rechtsdatenbanken eigene Verifizierungsmechanismen mitbringen.',
    score_praxisreife: 3, score_datenschutz: 4, score_dach: 2, score_ux: 7, score_preis: 5,
  },
  {
    slug: 'n8n-legal',
    url: 'https://n8n.io',
    category: ['Workflow-Automatisierung', 'No-Code', 'Kanzleiautomatisierung'],
    long_description: 'n8n ist eine Open-Source-Workflow-Automatisierungsplattform, die rechtliche Prozesse durch visuelle Workflows ohne tiefe Programmierkenntnisse automatisieren kann. Im Legal-Kontext lassen sich damit Mandantenaufnahmen, Dokumentenrouting, Fristüberwachung, CRM-Integrationen und Rechnungsworkflows automatisieren. n8n kann selbst gehostet werden, was volle Datenkontrolle ermöglicht — ein entscheidender Vorteil für datenschutzbewusste Kanzleien. Besonders interessant in Kombination mit KI-APIs für intelligente Dokumentenverarbeitung.',
    best_for: ['Kanzleien mit IT-affinen Mitarbeitern, die Prozesse ohne Programmierkenntnisse automatisieren wollen', 'Selbstgehostete Umgebung für maximale Datensouveränität (DSGVO-konform on-premise)', 'Integration verschiedener Kanzleisoftware-Systeme (CRM, DMS, Abrechnungstools)'],
    not_for: ['Kanzleien ohne technisches Personal oder IT-Dienstleister', 'Sofortige Out-of-the-Box-Lösung für juristische Aufgaben (erfordert Konfiguration)', 'Juristische Inhaltserstellung oder Dokumentenanalyse (n8n ist kein KI-Rechtstool)'],
    verdict: 'n8n ist kein juristisches KI-Tool im engeren Sinne, aber eine mächtige Infrastrukturplattform für Kanzleiautomatisierung. Die Selbst-Hosting-Option macht es zum datenschutzfreundlichsten Automatisierungstool am Markt. Für technisch aufgeschlossene Kanzleien ein hervorragendes Fundament für maßgeschneiderte Legal-Ops-Automatisierung.',
    score_praxisreife: 6, score_datenschutz: 9, score_dach: 7, score_ux: 5, score_preis: 9,
  },
  {
    slug: 'notebooklm',
    url: 'https://notebooklm.google.com',
    category: ['Dokumentenanalyse', 'Wissensmanagement', 'Recherche'],
    long_description: 'NotebookLM ist Googles KI-gestütztes Recherche- und Analyse-Tool, das eigene Dokumente als Wissensbasis nutzt und darüber kontextbezogene Fragen beantwortet. Im Rechtskontext eignet es sich für die Analyse und Zusammenfassung großer Dokumentenmengen ohne dass Daten für das Modelltraining genutzt werden. Das Tool generiert automatisch Audio-Zusammenfassungen, Briefings und FAQs aus hochgeladenen Quellen. Für steuerrechtliche Recherche und Gesellschaftsrechtsprüfungen bietet es ein schnelles Navigationswerkzeug.',
    best_for: ['Schnelle Analyse und Zusammenfassung großer Dokumentenbestände', 'Vorbereitung auf Mandantengespräche anhand eigener Unterlagen', 'Steuerrechtliche Recherche innerhalb selbst importierter BMF-Schreiben und Urteile'],
    not_for: ['Nutzung sensibler Mandantendaten (Google-Infrastruktur, DSGVO-Bedenken)', 'Strukturierte Vertragsanalyse oder Due-Diligence-Workflows', 'Kanzleien mit strikten IT-Security-Richtlinien gegen Cloud-Dienste'],
    verdict: 'NotebookLM ist überraschend leistungsfähig als persönliches Recherche-Werkzeug. Für den professionellen Kanzleieinsatz ist jedoch der Datenschutz der entscheidende Vorbehalt: Google-Infrastruktur macht den Umgang mit Mandantendaten problematisch. Für anonymisierte oder öffentliche Quellen ein empfehlenswertes, kostenloses Tool.',
    score_praxisreife: 6, score_datenschutz: 3, score_dach: 5, score_ux: 9, score_preis: 9,
  },
  {
    slug: 'nwb-neo',
    url: 'https://www.nwb.de/neo',
    category: ['Steuerrecht', 'Rechtsdatenbank', 'Steuerrecherche'],
    long_description: 'NWB NEO ist seit Ende 2025 eine eigenständige KI-Arbeitsplattform für Steuerberater, Steuerjuristen, Wirtschaftsprüfer und Steuerabteilungen. Gemeinsam mit PwC-Prozessexpertise führt sie von der strukturierten Sachverhaltsaufnahme über die Recherche bis zu steuerlichen Memoranden und Protokollen. Die Ergebnisse greifen auf geprüfte NWB-Inhalte zurück, verlinken Quellen und lassen sich nach fachlicher Prüfung nach Word exportieren. Daneben bleibt NWB KIRA als Recherche-Chat in den klassischen Datenbankpaketen verfügbar.',
    best_for: ['Steuerberater und Wirtschaftsprüfer für tägliche steuerrechtliche Recherche', 'Belegbare KI-Antworten mit NWB-Quellenverweis (Kommentare, BMF-Schreiben)', 'Schnelle Orientierung in komplexen steuerrechtlichen Sachverhalten (UStG, EStG, KStG)'],
    not_for: ['Gesellschafts- oder Zivilrecht ohne steuerrechtlichen Bezug', 'Internationale Steuerrechtsfragen jenseits des DACH-Raums', 'Vollständige Substitution manueller Steuerrechtsprüfung'],
    verdict: 'NWB NEO hat sich von der Recherche-Erweiterung zu einer geführten Tax-Work-Plattform entwickelt und gehört damit in die DACH-Spitzengruppe. Der hohe Einstiegspreis und das Credit-Modell begrenzen die Wirtschaftlichkeit für kleine Kanzleien, die fachliche und prozessuale Passung ist jedoch außergewöhnlich stark.',
    last_reviewed_at: '2026-07-31',
    score_praxisreife: 9, score_datenschutz: 9, score_dach: 10, score_ux: 8, score_preis: 5,
  },
  {
    slug: 'perplexity-legal',
    url: 'https://www.perplexity.ai',
    category: ['Rechtsrecherche', 'KI-Suche'],
    long_description: 'Perplexity AI ist eine KI-gestützte Suchmaschine, die Antworten mit Quellenverweisen aus dem Web generiert und damit klassische Websuche und KI-Zusammenfassung verbindet. Im juristischen Kontext kann es für allgemeine Rechtsrecherche, Marktübersichten und nicht-mandatsbezogene Fragestellungen eingesetzt werden. Perplexity bietet seit 2024 auch eine Pro-Version mit tieferer Recherchefähigkeit und verschiedenen Modelloptionen. Für den deutschen Rechtsmarkt fehlen spezifische Rechtsdatenbankintegrationen.',
    best_for: ['Schnelle Übersichtsrecherche zu rechtlichen Themen und Gesetzgebungsvorhaben', 'Markt- und Wettbewerbsrecherche im Legal-Tech-Umfeld', 'Erste Orientierung bei unbekannten Rechtsgebieten vor tiefergehender Recherche'],
    not_for: ['Verlässliche juristische Recherche mit belastbaren Fundstellen (Halluzinierungsgefahr)', 'Mandantenbezogene Rechtsarbeit (Datenschutz, keine Quellengarantie)', 'Ersatz für Fachdatenbanken wie juris, beck-online oder NWB'],
    verdict: 'Perplexity ist ein nützliches allgemeines Recherchetool, aber kein juristisches Fachsystem. Die Quellentransparenz ist besser als bei reinen Chatbots, reicht aber nicht an lizenzierte Rechtsdatenbanken heran. Taugt allenfalls als erste Orientierung — niemals als Primärquelle für rechtserhebliche Aussagen.',
    score_praxisreife: 4, score_datenschutz: 3, score_dach: 4, score_ux: 8, score_preis: 7,
  },
  {
    slug: 'pulley',
    url: 'https://pulley.com',
    category: ['Cap Table Management', 'Equity Management'],
    long_description: 'Pulley ist eine moderne Cap-Table-Management-Plattform, die als Alternative zu Carta positioniert wird und sich besonders an wachstumsstarke Startups und deren rechtliche Berater richtet. Das Tool ermöglicht die Verwaltung von Gesellschafteranteilen, ESOP-Programmen, Wandeldarlehen und SAFEs sowie die Modellierung von Finanzierungsrunden. Pulley bietet eine transparente Preisstruktur und positioniert sich als gründerfreundlicher als Carta. Für Venture-Capital-Transaktionen bietet es Investoren-Dashboards und Datenraumfunktionen.',
    best_for: ['Startups in der Seed- bis Series-B-Phase für Cap-Table-Management', 'VC-Anwälte, die Mandanten bei der Anteilsverwaltung beraten', 'Modellierung von Finanzierungsszenarien und Verwässerungsberechnungen'],
    not_for: ['Deutsche GmbH-spezifische Gesellschafterlistenpflichten (§ 40 GmbHG nicht nativ unterstützt)', 'Reife Unternehmen jenseits der Growth-Stage ohne VC-Struktur', 'Steuerberatung oder steuerliche Bewertungsfragen'],
    verdict: 'Pulley ist im US-amerikanischen Startup-Ökosystem ein starker Carta-Konkurrent, hat aber im deutschen Markt erhebliche Lücken: Die GmbH-spezifischen Anforderungen werden nicht abgedeckt. Für deutsche Startups mit internationaler Kapitalstruktur (z.B. Delaware-Holding) kann Pulley jedoch sinnvoll sein.',
    score_praxisreife: 4, score_datenschutz: 4, score_dach: 3, score_ux: 8, score_preis: 6,
  },
  {
    slug: 'quickbooks-claude',
    url: 'https://quickbooks.intuit.com',
    category: ['Buchhaltungsautomatisierung', 'Steuerautomatisierung'],
    long_description: 'QuickBooks ist eine weit verbreitete Buchhaltungssoftware von Intuit, die in Kombination mit KI-Assistenten wie Claude für steuerrechtliche Aufgaben eingesetzt werden kann. Die Kombination ermöglicht automatisierte Belegverarbeitung, Kategorisierung von Transaktionen und die Vorbereitung steuerlicher Abschlüsse. In den USA ist QuickBooks Marktführer für KMU-Buchhaltung; in Deutschland ist die Marktdurchdringung deutlich geringer, da DATEV dominiert.',
    best_for: ['International tätige Kanzleien oder Mandanten mit US-Buchhaltungsanforderungen', 'Steuerberater mit Mandanten, die QuickBooks bereits nutzen', 'Automatisierung von Belegverarbeitung und Kategorisierung'],
    not_for: ['Deutsche Steuerberater mit DATEV-zentrierter Kanzlei (Kompatibilitätsprobleme)', 'GoBD-konforme Buchführung in Deutschland (QuickBooks nicht GoBD-zertifiziert)', 'Unternehmen mit deutschen Bilanzierungsanforderungen nach HGB'],
    verdict: 'QuickBooks mit KI-Integration ist für den deutschen Steuerberatungsmarkt weitgehend irrelevant, da DATEV dominiert und QuickBooks die deutschen Anforderungen (GoBD, ELSTER, SKR-Kontenrahmen) nicht nativ unterstützt. Für Steuerberater mit internationalen Mandanten kann es ein Nischenwerkzeug sein.',
    score_praxisreife: 3, score_datenschutz: 4, score_dach: 2, score_ux: 6, score_preis: 5,
  },
  {
    slug: 'relativity',
    url: 'https://www.relativity.com',
    category: ['eDiscovery', 'Litigation Support', 'Dokumentenmanagement'],
    long_description: 'Relativity ist die marktführende eDiscovery-Plattform, die in Großverfahren weltweit für die Verwaltung, Analyse und Produktion von Dokumentenmengen eingesetzt wird. Das Tool bietet KI-gestützte Dokumentenpriorisierung (Technology-Assisted Review / TAR), Suchfunktionen und kollaborative Review-Workflows. RelativityOne ist die Cloud-Version mit kontinuierlicher KI-Erweiterung. Im Unternehmensrecht wird es bei Untersuchungen, Kartellverfahren und regulatorischen Ermittlungen eingesetzt.',
    best_for: ['Großkanzleien mit Litigation-Schwerpunkt und umfangreichen eDiscovery-Mandaten', 'Interne Untersuchungen (Internal Investigations) mit großen Dokumentenmengen', 'Technologie-gestützter Review (TAR) zur Kostenreduzierung bei Massendaten'],
    not_for: ['Transaktionsberatung oder M&A Due Diligence (falsche Plattform)', 'Kleine und mittlere Kanzleien ohne Litigation-Abteilung', 'Routinemäßige Vertragsarbeit oder Steuerrecht'],
    verdict: 'Relativity ist der De-facto-Standard für eDiscovery und Litigation Support — auch in Deutschland für internationale Verfahren im Einsatz. RelativityOne bietet EU-Serveroptionen für DSGVO-Konformität. Für Kanzleien ohne Litigation-Schwerpunkt ist Relativity überdimensioniert.',
    score_praxisreife: 7, score_datenschutz: 7, score_dach: 5, score_ux: 5, score_preis: 3,
  },
  {
    slug: 'spellbook',
    url: 'https://www.spellbook.legal',
    category: ['Vertragsautomatisierung', 'Vertragsanalyse', 'M&A'],
    long_description: 'Spellbook ist ein KI-gestützter Vertragsassistent, der direkt als Microsoft-Word-Add-in integriert wird und Anwälten beim Entwurf, der Überprüfung und der Verhandlung von Verträgen hilft. Das Tool schlägt Klauseln vor, identifiziert riskante Formulierungen und erklärt komplexe Vertragssprache. Spellbook nutzt LLM-Technologie (GPT-basiert) und ist speziell für den Kanzleialltag optimiert. Besonders beliebt für M&A-Standardverträge, NDAs, SaaS-Verträge und Gesellschaftervereinbarungen.',
    best_for: ['Anwälte, die täglich in Microsoft Word Verträge erstellen und prüfen', 'M&A-Teams für schnelles Markieren von Klauselabweichungen und Gegenvorschläge', 'Erstellung erster Vertragsentwürfe auf Basis beschriebener Sachverhalte'],
    not_for: ['Kanzleien ohne Microsoft-Word-Infrastruktur', 'Hochvolumige Due-Diligence-Prozesse (besser: Luminance, Kira)', 'Spezifisch deutsches Vertragsrecht ohne Anpassung (primär US/UK-rechtlich trainiert)'],
    verdict: 'Spellbook gehört zu den meistgenutzten KI-Vertragstools weltweit und überzeugt durch die nahtlose Word-Integration. Für den deutschen Markt gilt: sehr nützlich für internationale Vertragsarbeit auf Englisch, stößt aber bei deutschsprachigen Verträgen und DACH-spezifischen Klauselstandards an Grenzen.',
    score_praxisreife: 6, score_datenschutz: 5, score_dach: 5, score_ux: 8, score_preis: 6,
  },
  {
    slug: 'taxdome',
    url: 'https://taxdome.com',
    category: ['Kanzleisoftware', 'Mandantenportal', 'Steuerautomatisierung'],
    long_description: 'TaxDome ist eine All-in-One-Kanzleimanagementsoftware für Steuerberater und Wirtschaftsprüfer, die CRM, Mandantenportal, Dokumentenmanagement, Aufgabenverwaltung, Zeiterfassung und Rechnungsstellung in einer Plattform vereint. Das Tool richtet sich an Steuerkanzleien jeder Größe und ermöglicht papierlose Mandatsprozesse von der Auftragserteilung bis zur Abrechnung. TaxDome wird in über 25 Ländern genutzt und hat eine wachsende DACH-Nutzerbasis.',
    best_for: ['Steuerkanzleien, die ihre Mandantenkommunikation und Prozesse digitalisieren wollen', 'Kleinere und mittlere Steuerberatungsgesellschaften ohne großes IT-Budget', 'Mandantenportale für sichere Dokumentenübermittlung und E-Signatur'],
    not_for: ['DATEV-zentrierte Kanzleien, die eine vollständige DATEV-Integration benötigen', 'Anwaltskanzleien ohne steuerrechtlichen Schwerpunkt', 'Hochkomplexe Konzernsteuerberatung mit spezialisierten ERP-Anforderungen'],
    verdict: 'TaxDome hat sich als ernstzunehmende Alternative zu fragmentierten Kanzleisoftware-Lösungen etabliert und gewinnt auch in DACH Marktanteile. Die Stärke liegt im vollständigen Kanzlei-Workflow-Management. Für Kanzleien, die weg von DATEV-Eigenentwicklungen wollen oder internationale Mandanten haben, ist TaxDome eine prüfenswerte Option.',
    score_praxisreife: 7, score_datenschutz: 6, score_dach: 6, score_ux: 8, score_preis: 7,
  },
  {
    slug: 'taxdoo',
    url: 'https://www.taxdoo.com',
    category: ['Steuerautomatisierung', 'Umsatzsteuer', 'E-Commerce-Steuerrecht'],
    long_description: 'Taxdoo ist eine deutsche SaaS-Plattform spezialisiert auf die automatisierte Umsatzsteuer-Compliance für E-Commerce-Unternehmen und Online-Händler im europäischen Binnenmarkt. Das Tool aggregiert Transaktionsdaten aus allen relevanten Marktplätzen (Amazon, eBay, Shopify etc.), berechnet USt-Pflichten in allen EU-Mitgliedstaaten automatisch und übermittelt Meldungen. Als deutsches Unternehmen mit Hamburg als Hauptsitz ist Taxdoo DSGVO-nativ aufgestellt. Besonders relevant nach der EU-OSS-Reform und für Händler mit grenzüberschreitendem Verkauf.',
    best_for: ['Steuerberater mit E-Commerce-Mandanten und grenzüberschreitendem EU-Handel', 'Online-Händler und Marktplatz-Verkäufer mit komplexen USt-Pflichten in mehreren EU-Ländern', 'Automatisierte EU-One-Stop-Shop (OSS)-Meldungen und Fiskalregistrierung'],
    not_for: ['Klassische Steuerberatung ohne E-Commerce-Mandanten', 'Körperschafts- oder Einkommensteuerthemen (außerhalb des USt-Fokus)', 'Unternehmen ausschließlich mit nationalem deutschem Vertrieb'],
    verdict: 'Taxdoo ist in seiner Nische — EU-Umsatzsteuer-Compliance für E-Commerce — eines der stärksten deutschen Lösungen am Markt. Die vollständige DSGVO-Konformität und der deutsche Unternehmenshintergrund machen es zu einem der datenschutzfreundlichsten Tools. Für Steuerberater mit wachsendem E-Commerce-Mandantenportfolio nahezu unverzichtbar.',
    score_praxisreife: 9, score_datenschutz: 9, score_dach: 9, score_ux: 7, score_preis: 7,
  },
  {
    slug: 'taxfully',
    url: 'https://taxfully.de',
    category: ['Steuerautomatisierung', 'Umsatzsteuer', 'E-Commerce-Steuerrecht'],
    long_description: 'Taxfully ist eine deutsche Compliance-Plattform für Umsatzsteuer-Automatisierung, die sich ähnlich wie Taxdoo auf E-Commerce-Händler und deren steuerliche Registrierungs- und Meldepflichten in Europa spezialisiert. Das Tool übernimmt USt-Registrierungen in verschiedenen EU-Ländern, berechnet Steuerpflichten und erstellt Voranmeldungen. Taxfully richtet sich sowohl an Händler direkt als auch an Steuerberater als Partner-Plattform. Als deutsches Unternehmen mit Fokus auf den DACH-Markt ist Taxfully DSGVO-konform aufgestellt.',
    best_for: ['Steuerberater als Partnerplattform für E-Commerce-Mandanten-USt-Verwaltung', 'Online-Händler mit Verkäufen in mehreren EU-Mitgliedstaaten', 'Umsatzsteuer-Registrierungen und -Meldungen in Nicht-DACH-EU-Ländern'],
    not_for: ['Traditionelle Steuerberatung ohne E-Commerce-Bezug', 'Körperschafts- oder Einkommensteuerthemen', 'Sehr große Konzerne mit eigenem globalen Tax-Team'],
    verdict: 'Taxfully ist ein solides deutsches Tool für die Nische EU-Umsatzsteuer im E-Commerce und positioniert sich ähnlich wie Taxdoo, jedoch mit stärkerem Fokus auf das Steuerberater-Partnernetz. Für Steuerberater mit E-Commerce-Mandaten eine prüfenswerte Alternative zu Taxdoo.',
    score_praxisreife: 7, score_datenschutz: 9, score_dach: 9, score_ux: 7, score_preis: 7,
  },
  {
    slug: 'taxgraph',
    url: 'https://tax-graph.com',
    category: ['Steuerrecherche', 'KI-Integration', 'Wissensmanagement'],
    long_description: 'TaxGraph ist ein spezialisiertes Tool, das steuerrechtliches Wissen in einem semantischen Wissensgraphen strukturiert und über eine MCP-Schnittstelle (Model Context Protocol) für KI-Systeme zugänglich macht. Das Konzept ermöglicht es, KI-Assistenten mit verlässlichem, strukturiertem Steuerrechtswissen zu versorgen und damit Halluzinierungen zu reduzieren. TaxGraph ist damit weniger ein Endnutzer-Tool als eine technische Infrastruktur für KI-gestützte Steuerberatungsanwendungen mit explizitem DACH-Fokus.',
    best_for: ['Entwickler und Kanzleien, die eigene KI-gestützte Steuerberatungsanwendungen bauen', 'Integration verlässlichen Steuerrechtswissens in LLM-basierte Anwendungen via MCP', 'Technisch affine Steuerberater, die KI-Workflows mit Rechtsquellen-Anbindung aufbauen'],
    not_for: ['Direktnutzung als Recherche-Endanwender-Tool ohne technischen Hintergrund', 'Steuerberater ohne API/KI-Integrationsbedarf', 'Vollständige Steuerberatung ohne menschliche Prüfung der KI-Ausgaben'],
    verdict: 'TaxGraph ist ein innovativer Ansatz, der das Problem der KI-Halluzinierungen im Steuerrecht durch strukturierte Wissensgraphen adressiert. Der praktische Einsatz setzt technisches Know-how voraus, weshalb das Tool für die breite Steuerberaterschaft noch nicht praxisreif ist. Für Pioniere und Kanzleien mit Entwicklungsressourcen dagegen hochinteressant.',
    score_praxisreife: 4, score_datenschutz: 6, score_dach: 8, score_ux: 3, score_preis: null,
  },
  {
    slug: 'visible',
    url: 'https://visible.vc',
    category: ['Investor Relations', 'Venture Capital', 'Reporting'],
    long_description: 'Visible ist eine Investor-Relations- und Portfolio-Reporting-Plattform für Startups und VC-Fonds, die das Management von Investorenupdates, KPI-Tracking und Datenraumfunktionen vereint. Gründer nutzen Visible für regelmäßige Investoreninformationen, Fundraising-Datenzimmer und Portfolio-Dashboards. VC-Fonds setzen es für das Portfolio-Monitoring ein. Für den rechtlichen Bereich ist es indirekt relevant als Compliance-Tool für Investorenberichtspflichten.',
    best_for: ['Startups für strukturierte, professionelle Investorenupdates und Fundraising-Datenzimmer', 'VC-Fonds für Portfolio-Monitoring und KPI-Aggregation', 'VC-Anwälte, die Mandanten bei Investor-Relations-Prozessen begleiten'],
    not_for: ['Cap-Table-Management (dafür besser Carta oder Pulley)', 'Rechtliche Dokumentenprüfung oder Vertragsarbeit', 'Unternehmen jenseits der Wachstumsphase ohne VC-Investoren'],
    verdict: 'Visible ist ein solides Reporting-Tool für das VC-Ökosystem. Für Rechtsanwälte im VC-Umfeld ist es weniger ein direktes Arbeitswerkzeug als ein Tool, das Mandanten nutzen — das Verständnis hilft bei der Beratung zu Investorenberichtspflichten und Informationsrechten.',
    score_praxisreife: 6, score_datenschutz: 5, score_dach: 5, score_ux: 8, score_preis: 6,
  },
  {
    slug: 'westlaw',
    url: 'https://legal.thomsonreuters.com/en/products/westlaw',
    category: ['Rechtsdatenbank', 'Rechtsrecherche', 'M&A'],
    long_description: 'Westlaw ist die Premium-Rechtsdatenbank von Thomson Reuters und gilt neben LexisNexis als einer der zwei globalen Marktführer in der juristischen Recherche. Die Plattform bietet Zugang zu Fallrecht, Gesetzen, Kommentaren und Sekundärliteratur in über 50 Ländern. Westlaw Precision integriert KI-Funktionen (CoCounsel) für intelligente Dokumentenanalyse, Vertragsreviews und juristische Fragestellungen. Im M&A-Kontext ist Westlaw besonders für US-amerikanisches und britisches Transaktionsrecht relevant.',
    best_for: ['Internationale Großkanzleien mit US/UK-Transaktionsrecht-Schwerpunkt', 'Umfangreiche Fallrechtsrecherche mit analytischen Verknüpfungen', 'CoCounsel KI-Integration für dokumentenbasierte juristische Analyse'],
    not_for: ['Deutsche Kanzleien mit rein nationalem Mandatsfokus (juris/beck-online sind besser)', 'Kleine Kanzleien ohne transatlantisches Geschäft (Preis-Leistung nicht darstellbar)', 'Österreichisches oder Schweizer Recht (geringe Abdeckung)'],
    verdict: 'Westlaw ist international unangefochtener Standard für Common-Law-Jurisdiktionen, spielt aber im deutschen Rechtsmarkt eine untergeordnete Rolle. Mit der CoCounsel KI-Integration hat Thomson Reuters erheblich in KI investiert. Die Lizenzkosten rechtfertigen sich nur für Kanzleien mit regelmäßigem Bedarf an US/UK-Rechtsrecherche.',
    score_praxisreife: 7, score_datenschutz: 7, score_dach: 3, score_ux: 7, score_preis: 3,
  },
  {
    slug: 'zapier-legal',
    url: 'https://zapier.com',
    category: ['Workflow-Automatisierung', 'No-Code', 'Kanzleiautomatisierung'],
    long_description: 'Zapier ist eine No-Code-Automatisierungsplattform, die über 6.000 App-Integrationen ermöglicht und damit auch für juristische Kanzleiprozesse nutzbar ist. Im Legal-Kontext können damit Mandantenaufnahmen, Dokumentenweiterleitung, Kalenderintegration, CRM-Synchronisation und Rechnungsworkflows automatisiert werden. Zapier bietet seit 2023 auch KI-Funktionen für intelligentere Workflows. Anders als n8n ist Zapier cloud-only, was Datenschutzsensibilität bei Mandantendaten erfordert.',
    best_for: ['Kanzleien, die schnell ohne technisches Wissen Softwareintegrationen aufbauen wollen', 'Automatisierung von Mandantenkommunikation (E-Mail, CRM, Kalender)', 'Verbindung von Kanzleisoftware mit externen Diensten (DocuSign, Calendly, Slack)'],
    not_for: ['Verarbeitung sensibler Mandantendaten (Cloud-only, US-Infrastruktur, DSGVO-Risiken)', 'Juristische Inhaltserstellung oder Dokumentenanalyse', 'Komplexe, individuelle Kanzleiprozesse (n8n oder Custom-Entwicklung besser geeignet)'],
    verdict: 'Zapier ist für Kanzleien mit einfachen Automatisierungsbedürfnissen ein sehr zugängliches Tool. Das Hauptproblem für den deutschen Rechtsmarkt ist die DSGVO: Die Cloud-only-Infrastruktur und US-Server machen den Einsatz mit echten Mandantendaten rechtlich riskant. Für sensible Rechtsdaten ist die selbst gehostete Alternative n8n vorzuziehen.',
    score_praxisreife: 5, score_datenschutz: 4, score_dach: 4, score_ux: 9, score_preis: 6,
  },
  {
    slug: 'noxtua',
    name: 'Noxtua',
    url: 'https://www.noxtua.com',
    tagline: 'Souveräne europäische Rechts-KI für vertrauliche Mandatsarbeit',
    description: 'Legal-AI-Plattform für Recherche, Analyse und Drafting auf souveräner europäischer Infrastruktur — mit besonderem Fokus auf Berufsgeheimnis und Datenschutz.',
    rechtsgebiet: ['Steuerrecht', 'M&A', 'Gesellschaftsrecht', 'Venture Capital'],
    category: ['Legal AI Workspace', 'Rechtsrecherche', 'Dokumentenanalyse', 'Document Drafting'],
    pricing: 'enterprise',
    pricing_url: 'https://www.noxtua.com',
    is_new: true,
    featured: true,
    long_description: 'Noxtua ist eine in Europa entwickelte Legal-AI-Plattform für juristische Recherche, Dokumentenanalyse und Texterstellung. Der Anbieter betreibt Modell, Datenverarbeitung und Produktoberfläche auf souveräner europäischer Infrastruktur und adressiert ausdrücklich die Anforderungen aus DSGVO, Berufsgeheimnis und § 203 StGB. Nutzerdaten werden nach Anbieterangaben nicht zum Training verwendet; Verschlüsselung, Zugriffsprotokollierung und europäische Hosting-Partner gehören zum Sicherheitskonzept. Damit ist Noxtua vor allem für Kanzleien und Rechtsabteilungen interessant, die leistungsfähige generative KI ohne US-Hyperscaler-Abhängigkeit einsetzen wollen.',
    best_for: ['Kanzleien mit hohen Anforderungen an Berufsgeheimnis und europäische Datensouveränität', 'Recherche, Analyse und Drafting mit vertraulichen Mandatsunterlagen', 'DACH-Teams, die eine breit einsetzbare Legal-AI-Plattform suchen'],
    not_for: ['Teams mit Bedarf an transparenten Self-Service-Preisen', 'Solo-Anwälte, die nur gelegentlich generische Texte erstellen', 'Organisationen, die zwingend Inhalte einer bestimmten Rechtsdatenbank benötigen'],
    verdict: 'Noxtua gehört 2026 zur Spitzengruppe der europäischen Legal-AI-Anbieter. Besonders stark sind Datensouveränität und DACH-Compliance; die konkrete fachliche Quellenabdeckung hängt jedoch vom gebuchten Produkt- und Content-Setup ab.',
    score_praxisreife: 8, score_datenschutz: 10, score_dach: 10, score_ux: 8, score_preis: 5,
  },
  {
    slug: 'beck-noxtua',
    name: 'Beck-Noxtua',
    url: 'https://www.beck-noxtua.de',
    tagline: 'Legal AI mit beck-online-Inhalten und souveräner EU-Infrastruktur',
    description: 'Gemeinsamer Legal-AI-Workspace von C.H.BECK und Noxtua für deutsche Rechtsrecherche, Dokumentenanalyse und Drafting mit belegten beck-online-Quellen.',
    rechtsgebiet: ['Steuerrecht', 'M&A', 'Gesellschaftsrecht', 'Venture Capital'],
    category: ['Rechtsrecherche', 'Rechtsdatenbank', 'Dokumentenanalyse', 'Document Drafting'],
    pricing: 'enterprise',
    pricing_url: 'https://www.beck-noxtua.de',
    is_new: true,
    featured: true,
    long_description: 'Beck-Noxtua verbindet Noxtuas souveräne Legal-AI-Technologie mit den juristischen Fachinhalten von beck-online. Die Plattform unterstützt Recherche, Dokumentenanalyse, Matrix-Reviews und Drafting im Workspace sowie in Microsoft Word und verlinkt Ergebnisse auf überprüfbare Fundstellen. Das Hosting erfolgt nach Anbieterangaben ausschließlich auf europäischer Infrastruktur; die Lösung adressiert DSGVO, BRAO und § 203 StGB. Für den deutschen Rechtsmarkt ist die Kombination aus etablierter Fachliteratur, aktueller Rechtsprechung und einem spezialisierten KI-System besonders relevant.',
    best_for: ['Deutsche Kanzleien mit bestehender beck-online-Arbeitspraxis', 'Quellenbasierte Rechtsrecherche und Entwurfserstellung', 'Vertrauliche Dokumentenanalysen mit hohen Compliance-Anforderungen'],
    not_for: ['Teams ohne Bedarf an deutschen Premium-Rechtsinhalten', 'Sehr preissensitive Solo-Kanzleien', 'Internationale Recherche mit Schwerpunkt auf Common-Law-Jurisdiktionen'],
    verdict: 'Beck-Noxtua setzt für deutsche quellenbasierte Legal AI einen neuen Referenzpunkt. Die Kombination aus beck-online und souveräner Infrastruktur ist außergewöhnlich stark; Preis und Zugang bleiben typische Enterprise-Hürden.',
    score_praxisreife: 8, score_datenschutz: 10, score_dach: 10, score_ux: 8, score_preis: 4,
  },
  {
    slug: 'libra',
    name: 'Libra',
    url: 'https://libratech.ai/de/',
    tagline: 'All-in-one Legal AI für Recherche, Review und Drafting',
    description: 'Deutscher Legal-AI-Workspace mit Quellen aus Rechtsprechung, Handelsregister und juristischen Fachverlagen sowie Integrationen für Word, Outlook und SharePoint.',
    rechtsgebiet: ['Steuerrecht', 'M&A', 'Gesellschaftsrecht', 'Venture Capital'],
    category: ['Legal AI Workspace', 'Rechtsrecherche', 'Vertragsanalyse', 'Document Drafting'],
    pricing: 'paid',
    pricing_url: 'https://libratech.ai/de/',
    is_new: true,
    featured: true,
    long_description: 'Libra ist ein in Berlin entwickelter Legal-AI-Workspace für Recherche, Review, Drafting und die Analyse großer Dokumentenmengen. Die Plattform verbindet deutsche Gesetze und Rechtsprechung mit Handelsregisterdaten und lizenzierten Inhalten unter anderem von Wolters Kluwer und Otto Schmidt. Word-, Outlook-, SharePoint- und Kleos-Integrationen bringen die Funktionen in bestehende Arbeitsabläufe. Libra gehört seit Ende 2025 zu Wolters Kluwer und wird nach Anbieterangaben im EWR gehostet, ist ISO-27001-zertifiziert und auf berufsrechtlich vertrauliche Nutzung ausgerichtet.',
    best_for: ['Deutsche Kanzleien und Rechtsabteilungen mit breitem Recherche- und Drafting-Bedarf', 'Teams, die Legal AI direkt in Word, Outlook oder SharePoint nutzen möchten', 'Quellenbasierte Recherche mit deutschen Fachinhalten'],
    not_for: ['Teams, die ausschließlich lokale On-Premise-Verarbeitung verlangen', 'Nutzer ohne Bedarf an einem umfassenden Workspace', 'Organisationen, die nur eine einzelne, eng begrenzte Automatisierung suchen'],
    verdict: 'Libra ist 2026 einer der vollständigsten DACH-Legal-AI-Workspaces. Quellenabdeckung, Integrationen und Sicherheitsniveau sind stark; welche Premium-Inhalte verfügbar sind, hängt teilweise von zusätzlichen Lizenzen ab.',
    score_praxisreife: 9, score_datenschutz: 9, score_dach: 10, score_ux: 9, score_preis: 7,
  },
  {
    slug: 'legora',
    name: 'Legora',
    url: 'https://legora.com',
    tagline: 'Kollaborativer Legal-AI-Workspace für Kanzleien und Inhouse-Teams',
    description: 'Enterprise-Plattform für Recherche, Review, Drafting, agentische Workflows und Zusammenarbeit mit Word-, Outlook- und DMS-Integrationen.',
    rechtsgebiet: ['M&A', 'Gesellschaftsrecht', 'Venture Capital'],
    category: ['Legal AI Workspace', 'Vertragsanalyse', 'Due Diligence', 'Document Drafting'],
    pricing: 'enterprise',
    pricing_url: 'https://legora.com',
    is_new: true,
    featured: true,
    long_description: 'Legora ist eine schwedische Enterprise-Plattform für juristische Recherche, Dokumentenprüfung, Drafting und kollaborative Workflows. Zum Produkt gehören ein Word- und Outlook-Add-in, tabellarische Reviews, Workflows, Portale und agentische Funktionen. Die Plattform kann interne Dokumente und öffentliche Rechtsinformationen verbinden und richtet sich vor allem an größere Kanzleien und Rechtsabteilungen. Legora arbeitet unter der DSGVO und weist unter anderem ISO-27001-, ISO-42001- und SOC-2-Nachweise aus.',
    best_for: ['Große und mittelgroße Kanzleien mit internationaler Mandatsarbeit', 'M&A- und Vertrags-Teams mit hohem Review-Volumen', 'Organisationen, die Legal AI kollaborativ und in bestehende Systeme integriert ausrollen'],
    not_for: ['Solo-Kanzleien und sehr kleine Teams mit begrenztem Budget', 'Rein deutsche Rechtsrecherche ohne gesicherte lokale Content-Abdeckung', 'Teams, die einen sofort buchbaren Self-Service-Tarif erwarten'],
    verdict: 'Legora zählt funktional zur internationalen Spitzengruppe und überzeugt bei Zusammenarbeit, Review und Workflow-Integration. Für DACH ist die Plattform gut einsetzbar, erreicht bei deutschen Premium-Rechtsquellen aber nicht automatisch die Tiefe lokaler Content-Allianzen.',
    score_praxisreife: 9, score_datenschutz: 8, score_dach: 7, score_ux: 9, score_preis: 4,
  },
  {
    slug: 'pandektes',
    name: 'Pandektes',
    url: 'https://pandektes.com',
    tagline: 'KI-Rechtsrecherche über EU- und nationale Rechtsquellen',
    description: 'Europäische Rechercheplattform mit täglich aktualisierten und validierten Rechtsquellen, länderübergreifender Analyse sowie API- und Own-Data-Funktionen.',
    rechtsgebiet: ['Steuerrecht', 'M&A', 'Gesellschaftsrecht', 'Venture Capital'],
    category: ['Rechtsrecherche', 'Rechtsdatenbank', 'EU-Recht', 'Wissensmanagement'],
    pricing: 'paid',
    pricing_url: 'https://pandektes.com',
    is_new: true,
    featured: true,
    long_description: 'Pandektes ist eine in Kopenhagen entwickelte KI-Plattform für europäische Rechtsrecherche. Sie bündelt öffentliche und proprietäre Rechtsprechung, konsolidierte Gesetzgebung und EU-Rechtsquellen und aktualisiert den Bestand nach Anbieterangaben täglich. Die Recherche berücksichtigt juristische Hierarchien und verlinkt Antworten auf überprüfbare Quellen; zusätzlich lassen sich interne Materialien einbinden und Daten über eine API nutzen. Die besondere Stärke liegt in grenzüberschreitenden EU-Fragen und im Vergleich nationaler Auslegungspraxis.',
    best_for: ['EU-rechtliche und grenzüberschreitende Rechtsrecherche', 'Kanzleien und Rechtsabteilungen mit mehreren europäischen Jurisdiktionen', 'Teams, die öffentliche Quellen und internes Wissen gemeinsam durchsuchen wollen'],
    not_for: ['Recherche, die zwingend deutsche Premium-Kommentare voraussetzt', 'Reines Vertragsdrafting ohne Recherchebedarf', 'Teams, die ausschließlich ein deutsches Fachverlagsprodukt suchen'],
    verdict: 'Pandektes ist eine der spannendsten europäischen Rechercheplattformen und besonders stark bei EU-weiten Fragestellungen. Für deutsche Standardrecherche ist die Quellenbreite attraktiv, ersetzt aber nicht in jedem Mandat etablierte deutsche Premium-Literatur.',
    score_praxisreife: 8, score_datenschutz: 9, score_dach: 7, score_ux: 8, score_preis: 6,
  },
  {
    slug: 'jupus',
    name: 'JUPUS',
    url: 'https://www.jupus.de',
    tagline: 'KI-Sekretariat von Mandatsannahme bis Aktenvorbereitung',
    description: 'Deutsche Kanzlei-KI für Telefon, Chat, digitale Mandatsannahme, Dokumentenaufnahme, Aktenanlage und erste juristische Arbeitsentwürfe.',
    rechtsgebiet: ['Steuerrecht', 'M&A', 'Gesellschaftsrecht', 'Venture Capital'],
    category: ['Mandatsannahme', 'Telefon-KI', 'Kanzleiautomatisierung', 'Dokumentenanalyse'],
    pricing: 'paid',
    pricing_url: 'https://www.jupus.de',
    is_new: true,
    featured: false,
    long_description: 'JUPUS positioniert sich als KI-Sekretariat für deutsche Anwaltskanzleien. Die Plattform verbindet Telefon- und Website-KI mit strukturierter Mandatsaufnahme, Dokumentenerfassung, Interessenkollisionsprüfung, Mandatierung und Aktenanlage. Damit adressiert sie weniger die Großkanzlei-Recherche als den operativen Engpass kleiner und mittlerer Kanzleien zwischen Erstkontakt und bearbeitbarer Akte. Der Anbieter weist die Lösung als DSGVO- und berufsrechtskonform aus und entwickelt Funktionen speziell für deutsche Kanzleiabläufe.',
    best_for: ['Kleine und mittlere Kanzleien mit hohem Anfrage- und Telefonaufkommen', 'Standardisierte digitale Mandatsannahme und Vorqualifizierung', 'Entlastung von Sekretariat und Sachbearbeitung'],
    not_for: ['Großkanzleien auf der Suche nach einer globalen Research-Plattform', 'Komplexe M&A-Due-Diligence oder Massendokumentenreviews', 'Teams, die nur einen allgemeinen Chat-Assistenten benötigen'],
    verdict: 'JUPUS ist kein Harvey-Klon, sondern löst ein sehr konkretes DACH-Kanzleiproblem. Für kleinere Kanzleien kann die operative Entlastung wertvoller sein als zusätzliche Drafting-Funktionen; für komplexe Wissensarbeit braucht es ergänzende Systeme.',
    score_praxisreife: 8, score_datenschutz: 9, score_dach: 10, score_ux: 8, score_preis: 7,
  },
  {
    slug: 'deepjudge',
    name: 'DeepJudge',
    url: 'https://www.deepjudge.ai',
    tagline: 'KI-Suche und Workflows über das interne Kanzleiwissen',
    description: 'Enterprise Knowledge Search für DMS, Mandate und Dokumente mit Berechtigungsübernahme, Hybrid-/On-Premise-Optionen und juristischen KI-Workflows.',
    rechtsgebiet: ['M&A', 'Gesellschaftsrecht', 'Venture Capital'],
    category: ['Wissensmanagement', 'Enterprise Search', 'Dokumentenmanagement', 'KI-Workflows'],
    pricing: 'enterprise',
    pricing_url: 'https://www.deepjudge.ai',
    is_new: true,
    featured: false,
    long_description: 'DeepJudge ist eine Schweizer Plattform für KI-gestützte Suche und Workflows über das interne Wissen von Kanzleien und Rechtsabteilungen. Die Lösung indexiert Dokumente, Mandate, Personen und Metadaten über bestehende Systeme hinweg, ohne deren Berechtigungen und Ethical Walls zu umgehen. Neben semantischer Suche bietet DeepJudge agentische Workflows auf Basis des eigenen Wissensbestands. Cloud-, Private-Cloud- und On-Premise-Varianten sowie ISO-27001- und SOC-2-Nachweise machen das Produkt für besonders sensible Enterprise-Umgebungen interessant.',
    best_for: ['Große Kanzleien mit umfangreichen DMS- und Wissensbeständen', 'Sichere Wiederverwendung von Präzedenzfällen und internem Know-how', 'Organisationen mit strikten Berechtigungen, Ethical Walls oder On-Premise-Anforderungen'],
    not_for: ['Kleine Kanzleien ohne strukturierten internen Dokumentenbestand', 'Öffentliche Rechtsrecherche ohne eigene Content-Quellen', 'Teams, die eine günstige sofort nutzbare Einzelplatzlösung suchen'],
    verdict: 'DeepJudge ist besonders stark, wenn das wertvollste Wissen bereits in der Kanzlei liegt. Die Sicherheits- und Deployment-Optionen sind überzeugend; Aufwand und Preis rechnen sich vor allem bei großen Wissensbeständen.',
    score_praxisreife: 8, score_datenschutz: 9, score_dach: 7, score_ux: 7, score_preis: 3,
  },
  {
    slug: 'bryter',
    name: 'BRYTER',
    url: 'https://bryter.com',
    tagline: 'Legal-AI-Agents und regelbasierte Workflows ohne Code',
    description: 'Deutsche Plattform für juristische KI-Assistenten, Hybrid Agents und deterministische End-to-End-Workflows in Kanzleien und Rechtsabteilungen.',
    rechtsgebiet: ['Steuerrecht', 'M&A', 'Gesellschaftsrecht', 'Venture Capital'],
    category: ['No-Code', 'KI-Workflows', 'Legal AI Workspace', 'Kanzleiautomatisierung'],
    pricing: 'enterprise',
    pricing_url: 'https://bryter.com',
    is_new: true,
    featured: false,
    long_description: 'BRYTER ist eine in Deutschland gegründete Produktivitätssuite für juristische Teams. Sie kombiniert generative KI-Assistenten mit regelbasierten Workflows, sodass Ergebnisse nicht nur formuliert, sondern in nachvollziehbare Prozesse eingebettet werden können. Teams können eigene Agents und Self-Service-Anwendungen für wiederkehrende Beratungs-, Compliance- und Vertragsabläufe konfigurieren. Die Stärke liegt in der Verbindung flexibler Sprachmodelle mit deterministischen Regeln und Freigabeschritten.',
    best_for: ['Rechtsabteilungen mit wiederkehrenden Beratungs- und Compliance-Prozessen', 'Kanzleien, die eigene Legal-AI-Workflows ohne klassische Softwareentwicklung bauen wollen', 'Standardisierte Self-Service- und Intake-Anwendungen'],
    not_for: ['Teams, die nur eine fertige Rechtsrecherche ohne Konfiguration suchen', 'Sehr kleine Kanzleien ohne Prozessverantwortliche', 'Einmalige Dokumentenaufgaben ohne Automatisierungspotenzial'],
    verdict: 'BRYTER ist besonders dann stark, wenn Legal AI in kontrollierte Prozesse übersetzt werden soll. Die Lern- und Einführungsphase ist höher als bei einem Chat-Tool, dafür sind wiederholbare Workflows und Governance deutlich belastbarer.',
    score_praxisreife: 8, score_datenschutz: 8, score_dach: 8, score_ux: 7, score_preis: 4,
  },
  {
    slug: 'lawlift',
    name: 'LAWLIFT',
    url: 'https://www.lawlift.com',
    tagline: 'Dokumentenautomatisierung mit regelbasierter Präzision und Legal AI',
    description: 'Deutsche Plattform für intelligente Vorlagen und agentisches Drafting, Review, Übersetzung und Anonymisierung direkt in Microsoft Word.',
    rechtsgebiet: ['M&A', 'Gesellschaftsrecht', 'Venture Capital'],
    category: ['Vertragsautomatisierung', 'Document Drafting', 'Word Add-in', 'Dokumentenanalyse'],
    pricing: 'paid',
    pricing_url: 'https://www.lawlift.com',
    is_new: true,
    featured: false,
    long_description: 'LAWLIFT kombiniert deterministische Dokumentenautomatisierung mit generativer Legal AI. Regelbasierte Vorlagen sichern wiederholbare und nachvollziehbare Standarddokumente; Lawlift Intelligence unterstützt Drafting, Überarbeitung, Übersetzung, Anonymisierung und Review direkt in Microsoft Word. Dadurch eignet sich die Plattform sowohl für Kanzleien als auch für Rechtsabteilungen mit hohem Volumen standardisierbarer Dokumente. Nach den veröffentlichten Vertragsbedingungen nutzt LAWLIFT ausschließlich ISO-27001-zertifizierte Server in Deutschland.',
    best_for: ['Automatisierung wiederkehrender Verträge und gesellschaftsrechtlicher Dokumente', 'Teams, die deterministische Vorlagen mit KI-Drafting kombinieren wollen', 'DACH-Organisationen mit hohen Anforderungen an Hosting und Nachvollziehbarkeit'],
    not_for: ['Freie Rechtsrecherche ohne Dokumentenworkflow', 'Einzelanwender mit sehr geringem Dokumentenvolumen', 'Teams ohne Bereitschaft, Vorlagen und Guardrails aufzubauen'],
    verdict: 'LAWLIFT trifft einen wichtigen Mittelweg: Regeln für das, was exakt sein muss, KI für das, was flexibel sein darf. Die deutsche Infrastruktur und Word-Nähe sind klare Pluspunkte; der größte Nutzen entsteht erst nach sauberem Template-Setup.',
    score_praxisreife: 8, score_datenschutz: 9, score_dach: 9, score_ux: 8, score_preis: 6,
  },
  {
    slug: 'cocounsel-legal',
    name: 'CoCounsel Legal',
    url: 'https://legal.thomsonreuters.com/en/products/cocounsel-legal',
    tagline: 'Agentische Legal AI auf Basis von Westlaw und Practical Law',
    description: 'Thomson-Reuters-Plattform für Recherche, Analyse und Drafting mit belegten Westlaw-/Practical-Law-Quellen und Enterprise-Integrationen.',
    rechtsgebiet: ['M&A', 'Gesellschaftsrecht', 'Venture Capital'],
    category: ['Legal AI Workspace', 'Rechtsrecherche', 'Document Drafting', 'Dokumentenanalyse'],
    pricing: 'enterprise',
    pricing_url: 'https://legal.thomsonreuters.com/en/products/cocounsel-legal',
    is_new: true,
    featured: false,
    long_description: 'CoCounsel Legal ist die integrierte Legal-AI-Plattform von Thomson Reuters. Sie verbindet agentische Recherche-, Analyse- und Drafting-Funktionen mit Westlaw, Practical Law und dem internen Wissen einer Organisation. Quellen und Arbeitsschritte werden nachvollziehbar dargestellt; Microsoft-365-, HighQ- und DMS-Integrationen unterstützen den Enterprise-Einsatz. Der Anbieter erklärt, Nutzerdaten nicht zum Modelltraining zu verwenden und weist umfangreiche Sicherheitszertifizierungen aus.',
    best_for: ['Internationale Kanzleien mit Westlaw- und Practical-Law-Stack', 'US-/UK-Recherche, Litigation und transaktionsbezogene Drafting-Workflows', 'Große Rechtsabteilungen mit Thomson-Reuters-Infrastruktur'],
    not_for: ['Deutsche Kanzleien ohne regelmäßigen Common-Law-Bedarf', 'Teams, die deutsche Premium-Kommentare als primäre Quelle benötigen', 'Kleine Kanzleien mit begrenztem Lizenzbudget'],
    verdict: 'CoCounsel ist international ein führendes Legal-AI-Produkt mit sehr starker Quellenbasis. Im deutschen Markt bleibt der Nutzen ohne US-/UK-Bezug begrenzt, weshalb die globale Produktreife nicht vollständig in den DACH-Score durchschlägt.',
    score_praxisreife: 9, score_datenschutz: 7, score_dach: 3, score_ux: 8, score_preis: 3,
  },
  {
    slug: 'vincent-ai',
    name: 'Vincent AI',
    url: 'https://vlex.com/vincent-ai',
    tagline: 'Globale KI-Rechtsrecherche über mehr als 100 Jurisdiktionen',
    description: 'KI-Assistent von vLex für grenzüberschreitende Rechtsrecherche, Dokumentenanalyse und zitierte Antworten über internationale Rechtsquellen.',
    rechtsgebiet: ['M&A', 'Gesellschaftsrecht', 'Venture Capital'],
    category: ['Rechtsrecherche', 'Rechtsdatenbank', 'Internationales Recht', 'Dokumentenanalyse'],
    pricing: 'paid',
    pricing_url: 'https://vlex.com',
    is_new: true,
    featured: false,
    long_description: 'Vincent AI ist der KI-Rechercheassistent von vLex und erschließt einen großen internationalen Rechtsdatenbestand. Das Produkt unterstützt vergleichende Recherche, Dokumentenanalyse und die Suche nach relevanter Rechtsprechung über zahlreiche Jurisdiktionen hinweg. Seine Stärke liegt im grenzüberschreitenden Arbeiten und in Märkten, die von der vLex-Content-Abdeckung gut erfasst werden. Für rein deutsche Mandate ist die lokale Kommentarliteratur weniger tief als bei führenden DACH-Fachverlagen.',
    best_for: ['Grenzüberschreitende und rechtsvergleichende Recherche', 'Internationale Kanzleien mit vielen Jurisdiktionen', 'Erste Einordnung ausländischer Rechtsprechung und Rechtsquellen'],
    not_for: ['Ausschließlich deutsche Rechtsrecherche mit Kommentarbedarf', 'Vertragsautomatisierung ohne Recherchebezug', 'Kleine Teams ohne internationalen Mandatsanteil'],
    verdict: 'Vincent AI ist für internationale Recherche deutlich relevanter als der bisherige LexLab-Katalog erkennen ließ. Für deutsche Standardmandate bleibt es eine Ergänzung, bei grenzüberschreitenden Fragen kann die breite Jurisdiktionsabdeckung aber entscheidend sein.',
    score_praxisreife: 8, score_datenschutz: 7, score_dach: 5, score_ux: 8, score_preis: 5,
  },
  {
    slug: 'fides',
    name: 'Fides',
    url: 'https://fides.technology/de/ai',
    tagline: 'Corporate-Governance-Plattform mit vertraulicher Legal AI',
    description: 'Münchner Governance-Plattform für Gremien-, Beteiligungs- und Dokumentenarbeit mit KI-Suche, Drafting, Review und Self-Hosting-Option.',
    rechtsgebiet: ['M&A', 'Gesellschaftsrecht', 'Venture Capital'],
    category: ['Corporate Governance', 'Dokumentenmanagement', 'Vertragsanalyse', 'Document Drafting'],
    pricing: 'enterprise',
    pricing_url: 'https://fides.technology/de/ai',
    is_new: true,
    featured: false,
    long_description: 'Fides ist eine deutsche Corporate-Governance-Plattform für die Verwaltung von Gesellschaften, Gremien und juristischen Dokumenten. Das optionale KI-Modul durchsucht interne Unterlagen, identifiziert relevante Passagen, unterstützt Drafting und Review und erstellt zweisprachige Dokumente. Für besonders vertrauliche Umgebungen bietet Fides nach eigenen Angaben eine Self-Hosting-Lizenz, bei der keine Daten an OpenAI gesendet werden. Das Unternehmen ist ISO-27001-zertifiziert und auf europäische Datenschutzanforderungen ausgerichtet.',
    best_for: ['Inhouse-Rechtsteams mit komplexen Beteiligungs- und Governance-Strukturen', 'Gesellschaftsrechtliche Dokumentenbestände und Gremienarbeit', 'Organisationen mit Self-Hosting- oder hohen Vertraulichkeitsanforderungen'],
    not_for: ['Allgemeine öffentliche Rechtsrecherche', 'Kanzleien ohne Corporate-Governance-Anwendungsfall', 'Einzelanwender, die nur einen generischen KI-Assistenten suchen'],
    verdict: 'Fides ist kein universeller Legal-AI-Workspace, aber im Corporate-Governance-Kontext sehr relevant. Self-Hosting, deutsche Marktkenntnis und integrierte Gesellschaftsdaten rechtfertigen eine starke Bewertung in dieser Nische.',
    score_praxisreife: 8, score_datenschutz: 10, score_dach: 10, score_ux: 8, score_preis: 5,
  },
  {
    slug: 'juris-ki-suite',
    name: 'juris KI-Suite',
    url: 'https://www.juris.de',
    tagline: 'KI-gestützte Recherche in vernetzter deutscher Premium-Literatur',
    description: 'KI-Funktionen innerhalb der juris-Fachgebietsprodukte für Recherche in deutscher Rechtsprechung, Gesetzen und verlagsübergreifender Fachliteratur.',
    rechtsgebiet: ['Steuerrecht', 'M&A', 'Gesellschaftsrecht'],
    category: ['Rechtsrecherche', 'Rechtsdatenbank', 'Wissensmanagement', 'Steuerrecherche'],
    pricing: 'paid',
    pricing_url: 'https://www.juris.de',
    is_new: true,
    featured: false,
    long_description: 'Die juris KI-Suite erweitert die etablierten Fachgebiets- und Rechercheprodukte von juris um KI-gestützte Zugänge zu deutscher Rechtsprechung, Gesetzen und Premium-Literatur der jurisAllianz. Besonders stark ist die vernetzte Quellenbasis in spezialisierten Paketen, darunter Steuerrecht, Arbeitsrecht sowie Zivil- und Zivilprozessrecht. Die Lösung ist weniger als freier Universal-Chat konzipiert, sondern als intelligenter Zugang zu einem kuratierten deutschen Rechtsinformationssystem.',
    best_for: ['Quellenbasierte deutsche Rechts- und Steuerrecherche', 'Kanzleien mit bestehenden juris-Fachgebietslizenzen', 'Spezialisierte Recherche in vernetzter verlagsübergreifender Literatur'],
    not_for: ['Freies Drafting über umfangreiche eigene Dokumentensammlungen', 'Internationale Common-Law-Recherche', 'Teams, die einen universellen Workflow-Agenten suchen'],
    verdict: 'Die juris KI-Suite gehört wegen ihrer deutschen Quellenbasis zwingend in einen aktuellen DACH-Katalog. Sie ist weniger spektakulär als ein All-in-one-Agent, aber für belastbare Fachrecherche oft näher am eigentlichen juristischen Qualitätsproblem.',
    score_praxisreife: 8, score_datenschutz: 9, score_dach: 10, score_ux: 7, score_preis: 6,
  },
]

// ─── Supabase helpers ─────────────────────────────────────────────────────────

async function fetchExistingSlugs() {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/tools?select=slug&limit=500`,
    {
      headers: {
        'apikey': SERVICE_KEY,
        'Authorization': `Bearer ${SERVICE_KEY}`,
      },
    }
  )
  if (!res.ok) throw new Error(`Failed to fetch slugs: ${await res.text()}`)
  const rows = await res.json()
  return new Set(rows.map(r => r.slug))
}

function serializeTool(tool, { forCreate = false } = {}) {
  const score = lexlabScore(
    tool.score_praxisreife,
    tool.score_datenschutz,
    tool.score_dach,
    tool.score_ux,
    tool.score_preis
  )

  return {
    ...(tool.name ? {
      name:             tool.name,
      tagline:          tool.tagline,
      description:      tool.description,
      rechtsgebiet:     tool.rechtsgebiet,
      pricing:          tool.pricing ?? null,
      pricing_url:      tool.pricing_url ?? null,
      featured:         tool.featured ?? false,
      ...(forCreate ? {
        is_new:         tool.is_new ?? false,
        status:         'approved',
      } : {}),
    } : {}),
    url:               tool.url,
    category:          tool.category,
    long_description:  tool.long_description,
    best_for:          tool.best_for,
    not_for:           tool.not_for,
    verdict:           tool.verdict,
    ...((tool.last_reviewed_at || tool.name) ? {
      last_reviewed_at: tool.last_reviewed_at ?? REVIEW_DATE,
    } : {}),
    score_praxisreife: tool.score_praxisreife ?? null,
    score_datenschutz: tool.score_datenschutz ?? null,
    score_dach:        tool.score_dach        ?? null,
    score_ux:          tool.score_ux          ?? null,
    score_preis:       tool.score_preis       ?? null,
    lexlab_score:      score,
  }
}

async function updateTool(tool) {
  const body = JSON.stringify(serializeTool(tool))

  // return=representation lets us detect a slug-not-found (empty array = 0 rows matched)
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/tools?slug=eq.${encodeURIComponent(tool.slug)}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SERVICE_KEY,
        'Authorization': `Bearer ${SERVICE_KEY}`,
        'Prefer': 'return=representation',
      },
      body,
    }
  )

  if (!res.ok) {
    const err = await res.text()
    return { slug: tool.slug, ok: false, error: err }
  }

  const updated = await res.json()
  if (!Array.isArray(updated) || updated.length === 0) {
    return { slug: tool.slug, ok: false, error: 'Slug not found in DB' }
  }

  return { slug: tool.slug, ok: true, score: serializeTool(tool).lexlab_score, action: 'updated' }
}

async function createTool(tool) {
  if (!tool.name || !tool.tagline || !tool.description || !tool.rechtsgebiet?.length) {
    return { slug: tool.slug, ok: false, error: 'Missing required base fields for insert' }
  }

  const res = await fetch(`${SUPABASE_URL}/rest/v1/tools`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SERVICE_KEY,
      'Authorization': `Bearer ${SERVICE_KEY}`,
      'Prefer': 'return=representation',
    },
    body: JSON.stringify({ slug: tool.slug, ...serializeTool(tool, { forCreate: true }) }),
  })

  if (!res.ok) {
    return { slug: tool.slug, ok: false, error: await res.text() }
  }

  return { slug: tool.slug, ok: true, score: serializeTool(tool).lexlab_score, action: 'created' }
}

// ─── Run ──────────────────────────────────────────────────────────────────────

const DRY_RUN = process.argv.includes('--dry-run')

if (DRY_RUN) {
  console.log('DRY RUN — no writes to Supabase\n')
}

// Pre-flight: list which slugs exist in the DB
process.stdout.write('Fetching existing slugs from Supabase… ')
let existingSlugs
try {
  existingSlugs = await fetchExistingSlugs()
  console.log(`${existingSlugs.size} tools found.\n`)
} catch (e) {
  console.error(`\nFailed: ${e.message}`)
  process.exit(1)
}

const missing  = TOOLS.filter(t => !existingSlugs.has(t.slug))
const present  = TOOLS.filter(t =>  existingSlugs.has(t.slug))
const creatable = missing.filter(t => t.name && t.tagline && t.description && t.rechtsgebiet?.length)
const uncreatable = missing.filter(t => !creatable.includes(t))

if (creatable.length > 0) {
  console.log(`➕ ${creatable.length} new tool(s) will be created:`)
  creatable.forEach(t => console.log(`     – ${t.slug}`))
  console.log()
}

if (uncreatable.length > 0) {
  console.warn(`⚠️  ${uncreatable.length} legacy slug(s) not found and cannot be recreated without base fields:`)
  uncreatable.forEach(t => console.warn(`     – ${t.slug}`))
  console.log()
}

if (DRY_RUN) {
  console.log(`Would update ${present.length} tool(s):\n`)
  for (const tool of present) {
    const score = lexlabScore(
      tool.score_praxisreife, tool.score_datenschutz,
      tool.score_dach, tool.score_ux, tool.score_preis
    )
    console.log(`  • ${tool.slug.padEnd(28)} LexLab Score: ${score ?? '–'}`)
  }
  if (creatable.length > 0) {
    console.log(`\nWould create ${creatable.length} tool(s):\n`)
    for (const tool of creatable) {
      console.log(`  + ${tool.slug.padEnd(28)} LexLab Score: ${serializeTool(tool).lexlab_score ?? '–'}`)
    }
  }
  console.log(`\n${uncreatable.length} would be skipped (legacy slug missing in DB).`)
  process.exit(0)
}

console.log(`Updating ${present.length} and creating ${creatable.length} tool(s)…\n`)
let updated = 0, created = 0, fail = 0, skipped = uncreatable.length

for (const tool of TOOLS) {
  if (!existingSlugs.has(tool.slug) && !creatable.includes(tool)) {
    console.warn(`  ⏭  ${tool.slug} (skipped — not in DB)`)
    continue
  }

  const result = existingSlugs.has(tool.slug)
    ? await updateTool(tool)
    : await createTool(tool)
  if (result.ok) {
    const symbol = result.action === 'created' ? '➕' : '✅'
    console.log(`  ${symbol} ${result.slug.padEnd(28)} (${result.action}, LexLab Score: ${result.score ?? '–'})`)
    if (result.action === 'created') created++
    else updated++
  } else {
    console.error(`  ❌ ${result.slug}: ${result.error}`)
    fail++
  }
}

console.log(`\n─────────────────────────────────────────`)
console.log(`✅ Updated:  ${updated}`)
console.log(`➕ Created:  ${created}`)
if (fail    > 0) console.error(`❌ Failed:   ${fail}`)
if (skipped > 0) console.warn( `⏭  Skipped:  ${skipped}  (legacy slug not in DB)`)
console.log(`─────────────────────────────────────────`)
if (fail > 0) process.exit(1)
