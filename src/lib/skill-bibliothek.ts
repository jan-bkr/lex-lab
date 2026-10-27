// ─── Skill-Bibliothek — freigegebener Wortlaut ────────────────────────────────
//
// Einzige Quelle für den Teaser der Skill-Bibliothek (Startseite + /skill-bibliothek).
// INTRO und die `text`-Felder sind vom Bearbeiter wörtlich freigegeben — nicht
// umformulieren, kürzen oder ergänzen. Nur `label` ist redaktionelle Überschrift.
//
// Grenzen (bewusst): keine Anzahl der Skills, keine Rechtsgebiete, keine internen
// Inhalte, keine Mandate (§ 43a Abs. 2 BRAO). Ton: sachlich, Du-Form, keine
// Verkaufssprache.

export const SKILL_BIBLIOTHEK_INTRO =
  'In der Kanzlei baue ich eine Skill-Bibliothek auf und verantworte sie.'

export interface SkillPrinciple {
  label: string
  text: string
}

export const SKILL_BIBLIOTHEK_PRINCIPLES: SkillPrinciple[] = [
  {
    label: 'Arbeitsanleitungen',
    text: 'Eine Sammlung von Arbeitsanleitungen für KI-Assistenten. Sie halten fest, wie in der Kanzlei gearbeitet wird (Muster, Prüfschritte, Formvorgaben), und machen dieses Wissen für die KI verbindlich.',
  },
  {
    label: 'Bearbeiter',
    text: 'Jede Anleitung hat, wie ein Kommentar, einen Bearbeiter, der sie fachlich verantwortet.',
  },
  {
    label: 'Rechnen',
    text: 'Gerechnet wird nicht vom Sprachmodell. Wo eine Zahl haftungsrelevant ist, rechnet ein geprüftes Programm. Jede Berechnung trägt eine Kennung, mit der sie sich später nachvollziehen lässt.',
  },
  {
    label: 'Rechtsprechung',
    text: 'Neue Rechtsprechung wird regelmäßig abgerufen. Zitiert werden darf nur, was tatsächlich abgerufen wurde, nichts aus dem Gedächtnis des Modells.',
  },
  {
    label: 'Berufsträger',
    text: 'Die KI schreibt Entwürfe. Sie spricht keine Mandanten an, versendet nichts und entscheidet über keine Frist. Das bleibt beim Berufsträger.',
  },
]

export const PRIVATE_PROJECT_NOTICE =
  'LexLab ist ein privates Projekt von Jan Becker und kein Angebot der Kanzlei.'
