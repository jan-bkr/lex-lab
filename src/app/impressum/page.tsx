import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Impressum',
  description: 'Impressum und rechtliche Angaben zu LexLab — Angaben gemäß § 5 DDG.',
  robots: { index: false, follow: true },
}

export default function ImpressumPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 mb-8 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Zurück zur Startseite
      </Link>

      <h1 className="font-display text-3xl text-gray-900 mb-10">Impressum</h1>

      <div className="space-y-8 text-sm leading-relaxed text-gray-600">

        {/* § 5 DDG */}
        <section>
          <h2 className="font-display font-semibold text-base text-gray-900 pb-2 mb-4 border-b border-gray-100">
            Angaben gemäß § 5 DDG
          </h2>
          <p>
            Jan Becker<br />
            Rechtsanwalt (zugelassen in der Bundesrepublik Deutschland)<br />
            c/o BZG &amp; Partner<br />
            Lippstädter Str. 54<br />
            48155 Münster<br />
            E-Mail: <a href="mailto:kontakt@lex-lab.de" className="text-blue-600 hover:text-blue-700">kontakt@lex-lab.de</a><br />
            Website: <a href="https://www.lex-lab.de" className="text-blue-600 hover:text-blue-700">www.lex-lab.de</a>
          </p>
        </section>

        {/* Zuständige Kammer */}
        <section>
          <h2 className="font-display font-semibold text-base text-gray-900 pb-2 mb-4 border-b border-gray-100">
            Zuständige Kammer
          </h2>
          <p>
            Rechtsanwaltskammer Hamm<br />
            Ostenallee 18<br />
            59063 Hamm<br />
            <a href="https://www.rak-hamm.de" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">www.rak-hamm.de</a>
          </p>
        </section>

        {/* Berufsrechtliche Regelungen */}
        <section>
          <h2 className="font-display font-semibold text-base text-gray-900 pb-2 mb-4 border-b border-gray-100">
            Berufsrechtliche Regelungen
          </h2>
          <ul className="list-disc list-inside space-y-1 mb-3">
            <li>Bundesrechtsanwaltsordnung (BRAO)</li>
            <li>Berufsordnung für Rechtsanwälte (BORA)</li>
            <li>Rechtsanwaltsvergütungsgesetz (RVG)</li>
            <li>Fachanwaltsordnung (FAO)</li>
          </ul>
          <p>
            Die berufsrechtlichen Regelungen sind einsehbar unter:{' '}
            <a href="https://www.brak.de" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">www.brak.de</a>
          </p>
        </section>

        {/* Verantwortlich nach MStV */}
        <section>
          <h2 className="font-display font-semibold text-base text-gray-900 pb-2 mb-4 border-b border-gray-100">
            Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV
          </h2>
          <p>
            Jan Becker<br />
            c/o BZG &amp; Partner<br />
            Lippstädter Str. 54<br />
            48155 Münster
          </p>
        </section>

        {/* Haftungsausschluss */}
        <section>
          <h2 className="font-display font-semibold text-base text-gray-900 pb-2 mb-4 border-b border-gray-100">
            Haftungsausschluss
          </h2>

          <h3 className="font-semibold text-gray-800 mb-2">Haftung für Inhalte</h3>
          <p className="mb-6">
            Als Diensteanbieter sind wir gemäß § 7 Abs. 1 DDG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 DDG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen. Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.
          </p>

          <h3 className="font-semibold text-gray-800 mb-2">Haftung für Links</h3>
          <p>
            Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar. Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.
          </p>
        </section>

        {/* Urheberrecht */}
        <section>
          <h2 className="font-display font-semibold text-base text-gray-900 pb-2 mb-4 border-b border-gray-100">
            Urheberrecht
          </h2>
          <p className="mb-4">
            Die durch den Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet. Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter als solche gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.
          </p>
          <p className="text-gray-500">
            Konzept und Inhalt: Jan Becker, Rechtsanwalt<br />
            Technische Umsetzung: lex-lab.de
          </p>
        </section>

        {/* KI-Hinweis */}
        <section>
          <h2 className="font-display font-semibold text-base text-gray-900 pb-2 mb-4 border-b border-gray-100">
            KI-Hinweis
          </h2>
          <p className="mb-4">
            Teile der auf dieser Website veröffentlichten Inhalte, insbesondere Nachrichtenzusammenfassungen im News-Bereich, werden mithilfe von Künstlicher Intelligenz (KI) automatisiert erstellt oder bearbeitet. Diese Inhalte sind entsprechend als &bdquo;KI-Zusammenfassung&ldquo; gekennzeichnet. Die inhaltliche Verantwortung für alle veröffentlichten Inhalte liegt bei Jan Becker.
          </p>
          <p>
            <span className="font-medium text-gray-700">Hinweis nach § 18 Abs. 3 MStV:</span> Automatisiert erstellte Inhalte auf dieser Website (insbesondere KI-generierte Nachrichtenzusammenfassungen) sind als solche gekennzeichnet.
          </p>
        </section>

        {/* Allgemeiner Hinweis */}
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
