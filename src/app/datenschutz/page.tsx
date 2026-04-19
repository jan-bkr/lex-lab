import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Datenschutzerklärung',
  description: 'Datenschutzerklärung von LexLab — Informationen zur Verarbeitung personenbezogener Daten gemäß DSGVO.',
  robots: { index: false, follow: true },
}

export default function DatenschutzPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 mb-8 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Zurück zur Startseite
      </Link>

      <h1 className="font-display text-3xl text-gray-900 mb-2">Datenschutzerklärung</h1>
      <p className="text-sm text-gray-400 mb-10">Stand: April 2026</p>

      <div className="space-y-8 text-sm leading-relaxed text-gray-600">

        {/* 1. Verantwortlicher */}
        <section>
          <h2 className="font-display font-semibold text-base text-gray-900 pb-2 mb-4 border-b border-gray-100">
            1. Verantwortlicher
          </h2>
          <p className="mb-3">
            Verantwortlich für die Verarbeitung personenbezogener Daten auf dieser Website ist:
          </p>
          <p className="text-gray-500 italic">
            Jan Becker<br />
            c/o BZG &amp; Partner<br />
            Lippstädter Str. 54<br />
            48155 Münster<br />
            E-Mail: <a href="mailto:kontakt@lex-lab.de" className="text-blue-600 hover:text-blue-700 not-italic">kontakt@lex-lab.de</a>
          </p>
        </section>

        {/* 2. Erhobene Daten */}
        <section>
          <h2 className="font-display font-semibold text-base text-gray-900 pb-2 mb-4 border-b border-gray-100">
            2. Welche Daten wir erheben
          </h2>

          <h3 className="font-semibold text-gray-800 mb-2">Server-Logs</h3>
          <p className="mb-4">
            Beim Besuch dieser Website werden automatisch technische Zugriffsdaten in Server-Logfiles
            gespeichert. Dazu gehören: IP-Adresse (anonymisiert), aufgerufene URL, Datum und Uhrzeit
            des Zugriffs, übertragene Datenmenge, Browser und Betriebssystem. Diese Daten sind nicht
            einer bestimmten Person zuordenbar und werden ausschließlich zur Sicherstellung des
            technischen Betriebs verwendet.
          </p>

          <h3 className="font-semibold text-gray-800 mb-2">Newsletter-Anmeldung</h3>
          <p className="mb-1">
            Wenn Sie unseren Newsletter abonnieren, speichern wir Ihre E-Mail-Adresse. Diese wird
            ausschließlich für den Versand des Newsletters verwendet und nicht an Dritte weitergegeben.
          </p>
          <p className="mb-1">
            <strong className="text-gray-700">Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. a DSGVO (Einwilligung)
          </p>
          <p className="mb-4">
            <strong className="text-gray-700">Widerruf:</strong> jederzeit möglich durch Klick auf den Abmeldelink im Newsletter
            oder per E-Mail an <a href="mailto:kontakt@lex-lab.de" className="text-blue-600 hover:text-blue-700">kontakt@lex-lab.de</a>
          </p>

          <h3 className="font-semibold text-gray-800 mb-2">Kontaktformular</h3>
          <p className="mb-1">
            Wenn Sie uns über das Kontaktformular eine Nachricht senden, speichern wir Ihre
            E-Mail-Adresse und die übermittelten Inhalte zur Bearbeitung Ihrer Anfrage.
          </p>
          <p className="mb-1">
            <strong className="text-gray-700">Zweck:</strong> Bearbeitung Ihrer Anfrage (nicht Direktmarketing)
          </p>
          <p className="mb-1">
            <strong className="text-gray-700">Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. b DSGVO (Vertragsanbahnung)
            und Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse)
          </p>
          <p className="mb-4">
            <strong className="text-gray-700">Speicherdauer:</strong> bis zur abschließenden Bearbeitung Ihrer Anfrage,
            danach nach gesetzlichen Aufbewahrungsfristen
          </p>

          <h3 className="font-semibold text-gray-800 mb-2">Tool-Einreichungen</h3>
          <p>
            Bei der Einreichung eines Tools über das Formular können Sie freiwillig eine E-Mail-Adresse
            für Rückfragen angeben. Die Angabe ist optional und wird ausschließlich zur Kontaktaufnahme
            im Rahmen der Prüfung Ihrer Einreichung verwendet.
          </p>
        </section>

        {/* 3. Rechtsgrundlage */}
        <section>
          <h2 className="font-display font-semibold text-base text-gray-900 pb-2 mb-4 border-b border-gray-100">
            3. Rechtsgrundlage der Verarbeitung
          </h2>
          <ul className="space-y-2">
            <li className="flex gap-2">
              <span className="text-blue-500 font-mono flex-shrink-0">Art. 6 Abs. 1 lit. f DSGVO</span>
              <span>— Berechtigtes Interesse: Betrieb und Sicherheit der Website, Server-Logs.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-500 font-mono flex-shrink-0">Art. 6 Abs. 1 lit. a DSGVO</span>
              <span>— Einwilligung: Newsletter-Versand (widerruflich).</span>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-500 font-mono flex-shrink-0">Art. 6 Abs. 1 lit. b DSGVO</span>
              <span>— Vertragserfüllung oder vorvertragliche Maßnahmen: Bearbeitung von Kontaktanfragen und Tool-Einreichungen.</span>
            </li>
          </ul>
        </section>

        {/* 4. Speicherdauer */}
        <section>
          <h2 className="font-display font-semibold text-base text-gray-900 pb-2 mb-4 border-b border-gray-100">
            4. Speicherdauer
          </h2>
          <p className="mb-3">
            Personenbezogene Daten werden nur so lange gespeichert, wie es für den jeweiligen Zweck
            erforderlich ist oder gesetzliche Aufbewahrungsfristen bestehen:
          </p>
          <ul className="space-y-1.5 list-disc list-inside text-gray-600">
            <li>Server-Logs: maximal 7 Tage, danach automatische Löschung</li>
            <li>Newsletter-E-Mail-Adressen: bis zum Widerruf der Einwilligung</li>
            <li>Kontaktanfragen: bis zur abschließenden Bearbeitung, danach nach gesetzlichen Aufbewahrungsfristen</li>
            <li>Tool-Einreichungen: bis zur Bearbeitung, danach Anonymisierung oder Löschung</li>
          </ul>
        </section>

        {/* 5. SSL/TLS */}
        <section>
          <h2 className="font-display font-semibold text-base text-gray-900 pb-2 mb-4 border-b border-gray-100">
            5. SSL/TLS-Verschlüsselung
          </h2>
          <p>
            Diese Website nutzt aus Sicherheitsgründen und zum Schutz der Übertragung vertraulicher
            Inhalte eine SSL- bzw. TLS-Verschlüsselung. Eine verschlüsselte Verbindung erkennen Sie
            daran, dass die Adresszeile des Browsers von &bdquo;http://&ldquo; auf &bdquo;https://&ldquo; wechselt und an dem
            Schloss-Symbol in Ihrer Browserzeile.
          </p>
        </section>

        {/* 6. Server-Log-Dateien */}
        <section>
          <h2 className="font-display font-semibold text-base text-gray-900 pb-2 mb-4 border-b border-gray-100">
            6. Server-Log-Dateien
          </h2>
          <p className="mb-3">
            Der Provider dieser Website erhebt und speichert automatisch Informationen in
            Server-Log-Dateien, die Ihr Browser automatisch übermittelt:
          </p>
          <ul className="space-y-1.5 list-disc list-inside text-gray-600 mb-3">
            <li>Browsertyp und Browserversion</li>
            <li>Verwendetes Betriebssystem</li>
            <li>Referrer URL</li>
            <li>Hostname des zugreifenden Rechners</li>
            <li>Datum und Uhrzeit der Serveranfrage</li>
            <li>IP-Adresse</li>
          </ul>
          <p>
            <strong className="text-gray-700">Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an
            sicherem Serverbetrieb). <strong className="text-gray-700">Speicherdauer:</strong> maximal 7 Tage.
          </p>
        </section>

        {/* 7. Drittanbieter */}
        <section>
          <h2 className="font-display font-semibold text-base text-gray-900 pb-2 mb-4 border-b border-gray-100">
            7. Drittanbieter und Auftragsverarbeiter
          </h2>

          <div className="space-y-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="font-semibold text-gray-800 mb-1.5">Vercel Inc. (Hosting)</h3>
              <p className="text-gray-500 text-xs mb-2">340 Pine Street Suite 701, San Francisco, CA 94104, USA</p>
              <p className="mb-1.5">
                Diese Website wird auf der Infrastruktur von Vercel gehostet. Beim Aufruf der Website
                werden Zugriffsdaten an Vercel übertragen. Vercel ist gemäß EU-US Data Privacy Framework
                zertifiziert und verarbeitet Daten auf Basis von Standardvertragsklauseln (SCCs) gemäß
                Art. 46 DSGVO.
              </p>
              <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 text-xs inline-block">
                Datenschutzerklärung Vercel →
              </a>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="font-semibold text-gray-800 mb-1.5">Supabase Inc. (Datenbank)</h3>
              <p className="text-gray-500 text-xs mb-2">Server in der EU (Ireland)</p>
              <p className="mb-1.5">
                Zur Speicherung von Tool-Einreichungen und weiteren Anwendungsdaten verwenden wir
                Supabase. Die Daten werden auf Servern innerhalb der Europäischen Union gespeichert.
                Supabase verarbeitet Daten im Auftrag und auf Weisung des Verantwortlichen.
              </p>
              <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 text-xs inline-block">
                Datenschutzerklärung Supabase →
              </a>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="font-semibold text-gray-800 mb-1.5">Resend Inc. (E-Mail-Versand)</h3>
              <p className="mb-1.5">
                Für den Versand von Newsletter- und Transaktions-E-Mails nutzen wir Resend.
                Resend verarbeitet Daten auf Basis von Standardvertragsklauseln gemäß Art. 46 DSGVO.
              </p>
              <a href="https://resend.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 text-xs inline-block">
                Datenschutzerklärung Resend →
              </a>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="font-semibold text-gray-800 mb-1.5">Anthropic PBC (KI-Verarbeitung)</h3>
              <p className="mb-1.5">
                Für den Prompt Builder und die automatisierte News-Pipeline wird die Claude-API von
                Anthropic genutzt. Dabei werden vom Nutzer eingegebene Texte (Prompt Builder) bzw.
                Nachrichteninhalte (News-Zusammenfassungen) an Anthropic übermittelt. Anthropic
                verarbeitet Daten auf Basis von Standardvertragsklauseln gemäß Art. 46 DSGVO.
              </p>
              <a href="https://www.anthropic.com/legal/privacy" target="_blank" rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 text-xs inline-block">
                Datenschutzerklärung Anthropic →
              </a>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="font-semibold text-gray-800 mb-1.5">Upstash Inc. (Rate Limiting)</h3>
              <p className="mb-1.5">
                Zum Schutz öffentlicher API-Endpunkte vor Missbrauch (z.&nbsp;B. übermäßige
                Tool-Einreichungen, Kommentare, Newsletter-Anmeldungen) setzen wir Upstash Redis
                ein. Dabei wird die anonymisierte IP-Adresse der anfragenden Person temporär
                gespeichert, um die Anfragerate zu begrenzen. Diese Daten werden ausschließlich
                für technische Schutzzwecke verwendet und nach Ablauf des jeweiligen Zeitfensters
                automatisch gelöscht (maximal 24&nbsp;Stunden). Es findet keine dauerhafte
                Speicherung oder Profilbildung statt.
              </p>
              <p className="mb-1.5">
                <strong className="text-gray-700">Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. f DSGVO
                (berechtigtes Interesse an der Sicherheit und dem Schutz der Website vor automatisierten
                Angriffen).
              </p>
              <a href="https://upstash.com/trust/privacy.pdf" target="_blank" rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 text-xs inline-block">
                Datenschutzerklärung Upstash →
              </a>
            </div>
          </div>
        </section>

        {/* 8. Weitergabe */}
        <section>
          <h2 className="font-display font-semibold text-base text-gray-900 pb-2 mb-4 border-b border-gray-100">
            8. Weitergabe an Dritte
          </h2>
          <p>
            Eine Weitergabe Ihrer personenbezogenen Daten an Dritte findet nicht statt, soweit dies
            nicht zur Vertragserfüllung erforderlich ist, Sie ausdrücklich eingewilligt haben oder
            eine gesetzliche Verpflichtung besteht. Die oben genannten Auftragsverarbeiter (Vercel,
            Supabase, Resend, Anthropic) erhalten nur die zur Erbringung ihres Dienstes notwendigen Daten.
          </p>
        </section>

        {/* 9. Cookies */}
        <section>
          <h2 className="font-display font-semibold text-base text-gray-900 pb-2 mb-4 border-b border-gray-100">
            9. Cookies, Analyse und Performance
          </h2>
          <p className="mb-3">
            Diese Website verwendet <strong className="text-gray-800">keine</strong> Werbe-Cookies,
            kein Cross-Site-Tracking und keine Dienste wie Google Analytics oder Meta Pixel.
          </p>
          <p className="mb-3">
            Wir setzen <strong className="text-gray-800">Vercel Analytics</strong> und{' '}
            <strong className="text-gray-800">Vercel Speed Insights</strong> ein. Diese Dienste
            erfassen anonyme Nutzungsstatistiken (aufgerufene Seiten, Herkunftsland, Gerätekategorie,
            Web-Vitals-Metriken) ohne Cookies und ohne geräteübergreifende Verfolgung einzelner
            Nutzer. Die Daten werden auf Servern von Vercel Inc. verarbeitet (siehe Abschnitt 7).
          </p>
          <p className="mb-3">
            <strong className="text-gray-700">Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. f DSGVO
            (berechtigtes Interesse an der Verbesserung der Website-Performance und Nutzererfahrung).
          </p>
          <p>
            Es werden ausschließlich technisch notwendige Sitzungs-Cookies gesetzt, die für den
            Betrieb der Website (z.&nbsp;B. Admin-Authentifizierung) erforderlich sind.
          </p>
        </section>

        {/* 10. AdSense */}
        <section>
          <h2 className="font-display font-semibold text-base text-gray-900 pb-2 mb-4 border-b border-gray-100">
            10. Geplante Werbung (Google AdSense)
          </h2>
          <p>
            Der Einsatz von Google AdSense ist für einen späteren Zeitpunkt geplant. Sobald dieser
            Dienst aktiviert wird, werden wir die Datenschutzerklärung entsprechend aktualisieren und
            Sie gesondert informieren. Bis dahin werden keine Anzeigen eingeblendet und keine
            werbebezogenen Daten erhoben.
          </p>
        </section>

        {/* 11. Betroffenenrechte */}
        <section>
          <h2 className="font-display font-semibold text-base text-gray-900 pb-2 mb-4 border-b border-gray-100">
            11. Ihre Rechte als betroffene Person (Art. 15–21 DSGVO)
          </h2>
          <p className="mb-3">Sie haben gegenüber uns folgende Rechte:</p>
          <ul className="space-y-2">
            {[
              ['Art. 15 DSGVO', 'Auskunft über die zu Ihrer Person gespeicherten Daten'],
              ['Art. 16 DSGVO', 'Berichtigung unrichtiger personenbezogener Daten'],
              ['Art. 17 DSGVO', 'Löschung Ihrer personenbezogenen Daten'],
              ['Art. 18 DSGVO', 'Einschränkung der Verarbeitung'],
              ['Art. 20 DSGVO', 'Datenübertragbarkeit'],
              ['Art. 21 DSGVO', 'Widerspruch gegen die Verarbeitung'],
            ].map(([norm, beschreibung]) => (
              <li key={norm} className="flex gap-2">
                <span className="text-blue-500 font-mono flex-shrink-0">{norm}</span>
                <span>{beschreibung}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4">
            Zur Geltendmachung Ihrer Rechte oder bei Fragen zum Datenschutz wenden Sie sich an:{' '}
            <a href="mailto:kontakt@lex-lab.de" className="text-blue-600 hover:text-blue-700">kontakt@lex-lab.de</a>
          </p>
        </section>

        {/* 12. Datenübertragbarkeit */}
        <section>
          <h2 className="font-display font-semibold text-base text-gray-900 pb-2 mb-4 border-b border-gray-100">
            12. Recht auf Datenübertragbarkeit
          </h2>
          <p>
            Sie haben das Recht, Daten die wir auf Grundlage Ihrer Einwilligung oder in Erfüllung eines
            Vertrags automatisiert verarbeiten, an sich oder an einen Dritten in einem gängigen
            maschinenlesbaren Format aushändigen zu lassen (Art. 20 DSGVO).
          </p>
        </section>

        {/* 13. Beschwerderecht */}
        <section>
          <h2 className="font-display font-semibold text-base text-gray-900 pb-2 mb-4 border-b border-gray-100">
            13. Beschwerderecht bei der Aufsichtsbehörde
          </h2>
          <p className="mb-3">
            Im Falle datenschutzrechtlicher Verstöße steht Ihnen ein Beschwerderecht bei der
            zuständigen Aufsichtsbehörde zu. Zuständige Aufsichtsbehörde in NRW ist der
            Landesbeauftragte für Datenschutz und Informationsfreiheit NRW:
          </p>
          <a
            href="https://www.ldi.nrw.de"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-700"
          >
            www.ldi.nrw.de →
          </a>
        </section>

        {/* Hinweis */}
        <section className="bg-amber-50 border border-amber-100 rounded-xl p-5">
          <h2 className="font-display font-semibold text-base text-amber-900 mb-3">
            Hinweis
          </h2>
          <p className="text-amber-800 leading-relaxed">
            Die Inhalte dieser Website dienen ausschließlich der allgemeinen Information. Sie stellen
            keine Rechts- oder Steuerberatung dar und begründen kein Mandatsverhältnis. Für eine
            rechtliche oder steuerliche Beratung wenden Sie sich bitte an einen zugelassenen
            Rechtsanwalt oder Steuerberater.
          </p>
        </section>

      </div>
    </div>
  )
}
