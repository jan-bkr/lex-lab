/**
 * Bulk-Import: Premium-Profile für alle 42 Tools
 * Ausführen: node scripts/bulk-import-tools.mjs
 * Danach: Datei löschen (enthält keine Secrets — nutzt .env.local)
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

// ─── Score-Berechnung (Gewichte: Praxisreife 30%, DS 25%, DACH 25%, UX 10%, Preis 10%) ─────
function lexlabScore(p, d, dach, ux, pr) {
  const scores = [
    { v: p,    w: 30 },
    { v: d,    w: 25 },
    { v: dach, w: 25 },
    { v: ux,   w: 10 },
    { v: pr,   w: 10 },
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
    url: 'https://www.harvey.ai',
    category: ['Rechtsrecherche', 'Document Drafting', 'Due Diligence', 'Vertragsanalyse'],
    long_description: 'Harvey AI ist eine spezialisierte KI-Plattform für Rechtsanwälte und Inhouse-Juristen, die auf großen Sprachmodellen aufbaut und speziell für juristische Aufgaben fine-getuned wurde. Harvey ermöglicht juristische Recherche, Vertragsanalyse, Due-Diligence-Automatisierung und das Erstellen rechtlicher Dokumente auf einem deutlich spezialisierten Niveau gegenüber allgemeinen KI-Tools. Die Plattform wird von mehreren Magic-Circle- und Global-100-Kanzleien genutzt und hat bedeutende Risikokapital-Investitionen erhalten.',
    best_for: ['Große und mittelgroße Kanzleien mit hohem Dokumenten- und Transaktionsvolumen', 'Due-Diligence-Automatisierung bei M&A-Transaktionen', 'Juristische Recherche und Fallanalyse auf Großkanzlei-Niveau', 'Vertragsanalyse und Risikobewertung in großen Dokumentenkorpora'],
    not_for: ['Kleine Kanzleien (Preisgestaltung auf Enterprise ausgerichtet)', 'Deutsches Recht als Schwerpunkt (primär Common-Law-orientiert, deutsches Recht im Aufbau)', 'Steuerberater und Wirtschaftsprüfer (juristisch-anwaltlicher Fokus)'],
    verdict: 'Harvey AI ist eines der ambitioniertesten Legal-KI-Projekte und hat echtes Potenzial für große DACH-Kanzleien, insbesondere im internationalen M&A-Bereich. Die Abdeckung deutschen Rechts war 2024/2025 noch im Aufbau. Für internationale Transaktionen unter deutschem und englischem Recht wird Harvey zunehmend attraktiver.',
    score_praxisreife: 7, score_datenschutz: 6, score_dach: 4, score_ux: 8, score_preis: 4,
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
    url: 'https://www.lexisnexis.com/en-us/products/lexis-plus.page',
    category: ['Rechtsdatenbank', 'Rechtsrecherche'],
    long_description: 'Lexis+ ist die KI-erweiterte Rechtsdatenbankplattform von LexisNexis, die umfangreiche Fallrechtsdatenbanken, Gesetzestexte, Zeitschriften und Kommentare mit KI-gestützter Suchfunktion verbindet. Die Plattform bietet Features wie Briefs Analysis, Contract Analytics und einen KI-Assistenten für juristische Recherche. In Deutschland existiert mit Lexis 360 eine lokalisierte Variante mit deutschem Rechtsmaterial. Die Integration von generativer KI wurde mit dem Feature Lexis+ AI deutlich ausgebaut.',
    best_for: ['Umfangreiche internationale Rechtsrecherche (US, UK, EU-Recht)', 'Vergleichende Analyse von Fallrechtsprechung über Jurisdiktionen hinweg', 'Großkanzleien mit internationalem Mandatsschwerpunkt'],
    not_for: ['Alleinige Abdeckung deutschen Rechts (dafür besser juris oder beck-online)', 'Kleine Kanzleien mit begrenztem Budget (hohe Lizenzkosten)', 'Steuerberater mit Fokus auf nationales deutsches Steuerrecht'],
    verdict: 'Lexis+ ist international führend, spielt im deutschen Rechtsmarkt aber eine Nebenrolle hinter juris und beck-online. Die KI-Funktionen sind beeindruckend, jedoch primär auf Common-Law-Systeme ausgerichtet. Für DACH-Kanzleien mit internationalem Transaktionsgeschäft sinnvoll als Ergänzung, nicht als primäre Rechercheplattform.',
    score_praxisreife: 6, score_datenschutz: 6, score_dach: 4, score_ux: 7, score_preis: 4,
  },
  {
    slug: 'luminance',
    url: 'https://www.luminance.com',
    category: ['Due Diligence', 'Vertragsanalyse', 'M&A', 'Vertragsmanagement'],
    long_description: 'Luminance ist eine etablierte KI-Plattform für automatisierte Vertragsanalyse und Due Diligence, die auf eigenem Machine-Learning-Modell (nicht rein GPT-basiert) aufbaut. Das System liest und kategorisiert Verträge aller Art, erkennt Anomalien und Abweichungen vom Marktstandard und ermöglicht strukturierte Reviews in Transaktionsprojekten. Luminance wird weltweit von mehreren Hundert Großkanzleien eingesetzt und bietet mit Luminance Autopilot zunehmend auch Vertragsverhandlungs-Features.',
    best_for: ['M&A Due Diligence mit großen Dokumentenvolumina (Datenraumanalyse)', 'Großkanzleien und Rechtsabteilungen mit regelmäßigen Transaktionsmandaten', 'Vertragsstandardisierung und Abweichungsanalyse in internationalen Projekten'],
    not_for: ['Kleinere Kanzleien ohne regelmäßige M&A-Mandate (zu kostenintensiv)', 'Einzelne Vertragsprüfungen ohne strukturierten Workflow-Bedarf', 'Deutsches Steuerrecht oder spezifische nationale Rechtsfragen'],
    verdict: 'Luminance gehört zur ersten Liga der Legal-Tech-Plattformen und ist auch in DACH bei mehreren Großkanzleien im Einsatz. Die DSGVO-Konformität ist dokumentiert, Serveroptionen in Europa verfügbar. Das Tool überzeugt durch technische Reife und breiten Einsatz, ist jedoch für mittelgroße Kanzleien preislich oft schwer darstellbar.',
    score_praxisreife: 8, score_datenschutz: 7, score_dach: 6, score_ux: 7, score_preis: 4,
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
    long_description: 'NWB Neo ist die KI-gestützte Erweiterung der NWB-Datenbank, einer der führenden Steuerrechtsdatenbanken im deutschsprachigen Raum. Das Tool integriert generative KI direkt in den bewährten NWB-Recherchekontext und ermöglicht natürlichsprachige Abfragen zu Steuerrecht, Kommentaren, BMF-Schreiben und Rechtsprechung. Alle Quellen sind offiziell lizenziert und mit Fundstellen belegt, was die Verlässlichkeit erheblich steigert. NWB Neo richtet sich explizit an Steuerberater, Wirtschaftsprüfer und steuerrechtlich tätige Anwälte in Deutschland.',
    best_for: ['Steuerberater und Wirtschaftsprüfer für tägliche steuerrechtliche Recherche', 'Belegbare KI-Antworten mit NWB-Quellenverweis (Kommentare, BMF-Schreiben)', 'Schnelle Orientierung in komplexen steuerrechtlichen Sachverhalten (UStG, EStG, KStG)'],
    not_for: ['Gesellschafts- oder Zivilrecht ohne steuerrechtlichen Bezug', 'Internationale Steuerrechtsfragen jenseits des DACH-Raums', 'Vollständige Substitution manueller Steuerrechtsprüfung'],
    verdict: 'NWB Neo ist eines der wenigen KI-Tools, das von Grund auf für den deutschen Steuerrechtsmarkt entwickelt wurde und dabei auf eine etablierte, rechtlich verlässliche Datenbasis zurückgreift. Als deutsches Unternehmen mit deutschen Servern ist NWB datenschutzseitig deutlich unkomplizierter als US-Anbieter — ein klarer Vorteil im Kanzleialltag.',
    score_praxisreife: 8, score_datenschutz: 8, score_dach: 10, score_ux: 7, score_preis: 7,
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
]

// ─── Supabase helpers ─────────────────────────────────────────────────────────

async function fetchExistingSlugs() {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/tools?select=slug&status=eq.approved&limit=500`,
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

async function updateTool(tool) {
  const score = lexlabScore(
    tool.score_praxisreife,
    tool.score_datenschutz,
    tool.score_dach,
    tool.score_ux,
    tool.score_preis
  )

  const body = JSON.stringify({
    url:               tool.url,
    category:          tool.category,
    long_description:  tool.long_description,
    best_for:          tool.best_for,
    not_for:           tool.not_for,
    verdict:           tool.verdict,
    last_reviewed_at:  new Date().toISOString().slice(0, 10),
    score_praxisreife: tool.score_praxisreife ?? null,
    score_datenschutz: tool.score_datenschutz ?? null,
    score_dach:        tool.score_dach        ?? null,
    score_ux:          tool.score_ux          ?? null,
    score_preis:       tool.score_preis       ?? null,
    lexlab_score:      score,
  })

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
    return { slug: tool.slug, ok: false, error: 'Slug not found in DB (status=approved)' }
  }

  return { slug: tool.slug, ok: true, score }
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
  console.log(`${existingSlugs.size} approved tools found.\n`)
} catch (e) {
  console.error(`\nFailed: ${e.message}`)
  process.exit(1)
}

const missing  = TOOLS.filter(t => !existingSlugs.has(t.slug))
const present  = TOOLS.filter(t =>  existingSlugs.has(t.slug))

if (missing.length > 0) {
  console.warn(`⚠️  ${missing.length} slug(s) not found in DB (will be skipped):`)
  missing.forEach(t => console.warn(`     – ${t.slug}`))
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
  console.log(`\n${missing.length} would be skipped (slug not in DB).`)
  process.exit(0)
}

console.log(`Updating ${present.length} tool(s)…\n`)
let ok = 0, fail = 0, skipped = missing.length

for (const tool of TOOLS) {
  if (!existingSlugs.has(tool.slug)) {
    console.warn(`  ⏭  ${tool.slug} (skipped — not in DB)`)
    continue
  }

  const result = await updateTool(tool)
  if (result.ok) {
    console.log(`  ✅ ${result.slug.padEnd(28)} (LexLab Score: ${result.score ?? '–'})`)
    ok++
  } else {
    console.error(`  ❌ ${result.slug}: ${result.error}`)
    fail++
  }
}

console.log(`\n─────────────────────────────────────────`)
console.log(`✅ Updated:  ${ok}`)
if (fail    > 0) console.error(`❌ Failed:   ${fail}`)
if (skipped > 0) console.warn( `⏭  Skipped:  ${skipped}  (slug not in DB)`)
console.log(`─────────────────────────────────────────`)
if (fail > 0) process.exit(1)
