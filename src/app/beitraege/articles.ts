export interface EditorialSection {
  heading: string
  paragraphs: string[]
  bullets?: string[]
}

export interface EditorialArticle {
  slug: string
  category: string
  title: string
  preview: string
  readingTime: string
  publishedAt: string
  takeaway: string
  sections: EditorialSection[]
}

export const EDITORIAL_ARTICLES: EditorialArticle[] = [
  {
    slug: 'ki-tools-kanzlei-auswaehlen',
    category: 'Praxisleitfaden',
    title: 'KI-Tools für die Kanzlei auswählen: Das 5-Fragen-Framework',
    preview: 'Zwischen beeindruckender Demo und belastbarem Kanzleieinsatz liegt ein großer Unterschied. Fünf Fragen helfen, Anbieter strukturiert nach Nutzen, Datenschutz und Integrationsaufwand zu prüfen.',
    readingTime: '7 Min.',
    publishedAt: '2026-07-28',
    takeaway: 'Nicht das leistungsstärkste Modell gewinnt, sondern das Tool, das einen klaren Arbeitsablauf verlässlich, sicher und wirtschaftlich verbessert.',
    sections: [
      {
        heading: '1. Welches konkrete Problem soll verschwinden?',
        paragraphs: [
          '„Wir brauchen KI“ ist kein Anwendungsfall. Eine belastbare Auswahl beginnt mit einer wiederkehrenden Aufgabe: Vertragsklauseln vergleichen, umfangreiche Datenräume strukturieren, Rechtsprechung vorprüfen oder Mandantenkommunikation vorbereiten.',
          'Formuliere vor jeder Demo eine beobachtbare Verbesserung. Zum Beispiel: Die Erstprüfung von 40 Verträgen soll von vier Stunden auf zwei Stunden sinken, ohne dass Fundstellen oder Abweichungen verloren gehen.',
        ],
      },
      {
        heading: '2. Funktioniert das Tool mit echten DACH-Dokumenten?',
        paragraphs: [
          'Englischsprachige Demo-Dokumente sagen wenig über deutsche Vertragsstrukturen, Zitierweisen und Fachbegriffe aus. Ein Pilot sollte deshalb ausschließlich mit repräsentativen, zuvor anonymisierten Dokumenten aus dem eigenen Arbeitsalltag durchgeführt werden.',
        ],
        bullets: [
          'Erkennt das Tool relevante Klauseln und Abweichungen zuverlässig?',
          'Sind Quellen, Fundstellen und Verarbeitungsschritte nachvollziehbar?',
          'Bleibt die Qualität bei langen, uneinheitlich formatierten Dokumenten stabil?',
        ],
      },
      {
        heading: '3. Ist der Datenfluss vertretbar?',
        paragraphs: [
          'Datenschutz ist kein nachgelagerter Einkaufspunkt. Vor dem Pilot müssen Datenstandort, Unterauftragnehmer, Speicherfristen, Trainingsnutzung und Löschkonzept geklärt sein. Bei Mandatsdaten gehören zudem Berufsgeheimnis und vertragliche Vertraulichkeit in die Prüfung.',
          'Eine pauschale DSGVO-Zusage des Anbieters ersetzt keine eigene Bewertung. Entscheidend ist, welche Daten in welchem Modus tatsächlich verarbeitet werden.',
        ],
      },
      {
        heading: '4. Passt das Tool in den bestehenden Ablauf?',
        paragraphs: [
          'Ein isoliertes Portal kann in einer Demo überzeugen und im Alltag trotzdem scheitern. Prüfe, wie Dokumente hinein- und Ergebnisse wieder herauskommen, ob Berechtigungen abbildbar sind und wie viele manuelle Zwischenschritte entstehen.',
          'Je geringer die Prozessreibung, desto wahrscheinlicher wird das Tool dauerhaft genutzt. Adoption ist ein Teil der Produktqualität.',
        ],
      },
      {
        heading: '5. Lässt sich der Nutzen nach vier Wochen belegen?',
        paragraphs: [
          'Definiere vor dem Test wenige Kennzahlen: Bearbeitungszeit, Zahl relevanter Korrekturen, Nutzerquote und Kosten pro Vorgang. Eine kurze qualitative Rückmeldung der Bearbeiter ergänzt die Zahlen.',
          'Nach vier Wochen sollte die Entscheidung „einführen, anpassen oder stoppen“ möglich sein. Ein endloser Pilot ohne Entscheidungskriterien bindet Zeit und verschleiert fehlenden Nutzen.',
        ],
      },
    ],
  },
  {
    slug: 'lexlab-score-erklaert',
    category: 'Methodik',
    title: 'Der LexLab Score: Wie wir Legal-AI-Tools bewerten',
    preview: 'Ein einzelner Sternwert reicht für Legal AI nicht aus. Der LexLab Score gewichtet Praxisreife, Datenschutz, DACH-Relevanz, Bedienbarkeit und Preis-Leistung transparent.',
    readingTime: '6 Min.',
    publishedAt: '2026-07-21',
    takeaway: 'Der Score ist eine strukturierte Orientierung, kein Ersatz für den eigenen Pilot mit realen Dokumenten und Anforderungen.',
    sections: [
      {
        heading: 'Warum ein eigener Score?',
        paragraphs: [
          'Legal-AI-Produkte werden häufig anhand ihrer Modellleistung oder Feature-Liste verglichen. Für Kanzleien und Rechtsabteilungen entscheidet aber ein breiteres Bild: Liefert das Tool im konkreten Rechtskontext belastbare Ergebnisse, schützt es sensible Daten und lässt es sich wirtschaftlich einsetzen?',
          'Der LexLab Score verdichtet fünf getrennte Bewertungen auf 100 Punkte. Die Einzelwerte bleiben sichtbar, damit unterschiedliche Teams ihre eigenen Prioritäten setzen können.',
        ],
      },
      {
        heading: 'Die fünf Dimensionen',
        paragraphs: [
          'Praxisreife erhält das größte Gewicht. Bewertet werden Stabilität, Qualität in realen Arbeitsabläufen und die Frage, ob das Produkt über einen Demonstrationsfall hinaus einsetzbar ist.',
        ],
        bullets: [
          'Praxisreife — 35 %',
          'DACH-Relevanz — 25 %',
          'Datenschutz — 20 %',
          'Bedienbarkeit — 10 %',
          'Preis-Leistung — 10 %',
        ],
      },
      {
        heading: 'Was der Score bewusst nicht behauptet',
        paragraphs: [
          'Ein Wert von 85 bedeutet nicht, dass das Tool für jedes Team besser ist als ein Produkt mit 78 Punkten. Ein hoch spezialisiertes Tool kann für einen konkreten Workflow die beste Wahl sein, obwohl es in der Gesamtwertung weniger breit aufgestellt ist.',
          'Preise, Funktionen und Anbieterbedingungen verändern sich. Deshalb dokumentiert LexLab das letzte Prüfdatum und aktualisiert Bewertungen, wenn sich die Entscheidungsgrundlage wesentlich ändert.',
        ],
      },
      {
        heading: 'So nutzt du die Bewertung sinnvoll',
        paragraphs: [
          'Beginne mit dem Gesamtscore, prüfe danach die für deinen Einsatz kritischen Einzeldimensionen. Für besonders sensible Mandate kann der Datenschutzwert wichtiger sein als Komfort oder Preis. Für ein kleines Inhouse-Team kann Integrationsaufwand die zentrale Hürde sein.',
          'Die Shortlists und der Tool Finder übersetzen diese Unterschiede in konkrete Auswahlpfade. Die endgültige Entscheidung sollte immer auf einem eigenen, begrenzten Pilot beruhen.',
        ],
      },
    ],
  },
  {
    slug: 'prompting-fuer-juristen',
    category: 'Arbeitsmethode',
    title: 'Prompting für Juristen: Vom Sachverhalt zum prüfbaren Arbeitsentwurf',
    preview: 'Gute juristische Prompts sind keine Zauberformeln. Sie schaffen Kontext, definieren eine Aufgabe und verlangen eine prüfbare Struktur — ohne dem Modell blind Autorität zu geben.',
    readingTime: '8 Min.',
    publishedAt: '2026-07-14',
    takeaway: 'Ein guter Prompt macht Ziel, Material, Prüfungsmaßstab und gewünschte Ausgabe explizit. Die juristische Verantwortung bleibt beim Menschen.',
    sections: [
      {
        heading: 'Prompting ist Auftragsklärung',
        paragraphs: [
          'Die Qualität einer KI-Antwort hängt stark davon ab, wie präzise die Aufgabe beschrieben ist. Juristen kennen dieses Prinzip aus der Delegation: Wer Ziel, Sachverhalt und Erwartung sauber formuliert, erhält einen besseren Arbeitsentwurf.',
          'Ein Prompt sollte deshalb nicht möglichst kunstvoll, sondern vollständig und überprüfbar sein.',
        ],
      },
      {
        heading: 'Die fünf Bausteine',
        paragraphs: [
          'Ein praxistauglicher juristischer Prompt lässt sich meist aus fünf Bausteinen zusammensetzen. Sie können knapp sein; entscheidend ist, dass keine zentrale Erwartung unausgesprochen bleibt.',
        ],
        bullets: [
          'Rolle und Perspektive: Aus welcher fachlichen Sicht soll gearbeitet werden?',
          'Ziel: Welche Entscheidung oder welches Dokument wird vorbereitet?',
          'Sachverhalt und Material: Welche Fakten und Quellen dürfen verwendet werden?',
          'Prüfungsauftrag: Welche Fragen, Risiken oder Alternativen sind zu behandeln?',
          'Ausgabeformat: Welche Struktur, Tiefe und Kennzeichnung von Unsicherheiten wird erwartet?',
        ],
      },
      {
        heading: 'Fundstellen und Unsicherheit sichtbar machen',
        paragraphs: [
          'Bitte das Modell, Annahmen ausdrücklich zu kennzeichnen und fehlende Informationen als Rückfragen zu formulieren. Verlangte Fundstellen müssen anschließend in einer verlässlichen Rechtsquelle geprüft werden; erfundene oder veraltete Zitate bleiben ein reales Risiko.',
          'Hilfreich ist außerdem eine Trennung zwischen gesicherten Aussagen, Auslegungsfragen und praktischer Empfehlung. So wird der Entwurf leichter prüfbar.',
        ],
      },
      {
        heading: 'Vertraulichkeit vor Komfort',
        paragraphs: [
          'Personenbezogene Daten, Geschäftsgeheimnisse und Mandatsinformationen gehören nur in dafür freigegebene Systeme und Konfigurationen. Wo möglich, sollten Sachverhalte anonymisiert oder abstrahiert werden.',
          'Die Verantwortung endet nicht beim Prompt: Auch der Output kann sensible Informationen enthalten und muss entsprechend behandelt werden.',
        ],
      },
      {
        heading: 'Vom ersten Entwurf zur belastbaren Arbeit',
        paragraphs: [
          'Nutze die erste Antwort als Arbeitsmaterial. Lass Gegenargumente, fehlende Tatsachen und alternative Einordnungen ergänzen. Prüfe anschließend jeden entscheidenden Punkt am Originalmaterial und in autoritativen Quellen.',
          'Der Prompt Builder und die Bibliothek auf LexLab liefern dafür strukturierte Ausgangspunkte. Sie ersetzen nicht die fachliche Kontrolle, reduzieren aber die Zeit bis zu einem prüfbaren ersten Entwurf.',
        ],
      },
    ],
  },
]

export function getEditorialArticle(slug: string): EditorialArticle | undefined {
  return EDITORIAL_ARTICLES.find(article => article.slug === slug)
}
