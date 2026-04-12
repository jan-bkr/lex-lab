import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

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

      <h1 className="font-display text-3xl font-bold text-gray-900 mb-10">Impressum</h1>

      <div className="space-y-8 text-sm leading-relaxed text-gray-600">

        {/* § 5 TMG */}
        <section>
          <h2 className="font-display font-semibold text-base text-gray-900 pb-2 mb-4 border-b border-gray-100">
            Angaben gemäß § 5 TMG
          </h2>
          <p className="text-gray-500 italic">
            Jan Becker<br />
            Lippstädter Str. 54<br />
            48155 Münster
          </p>
        </section>

        {/* Kontakt */}
        <section>
          <h2 className="font-display font-semibold text-base text-gray-900 pb-2 mb-4 border-b border-gray-100">
            Kontakt
          </h2>
          <p>
            E-Mail: <a href="mailto:kontakt@lex-lab.de" className="text-blue-600 hover:text-blue-700">kontakt@lex-lab.de</a>
          </p>
        </section>

        {/* Berufsbezeichnung */}
        <section>
          <h2 className="font-display font-semibold text-base text-gray-900 pb-2 mb-4 border-b border-gray-100">
            Berufsbezeichnung und berufsrechtliche Regelungen
          </h2>
          <p>Berufsbezeichnung: Rechtsanwalt (zugelassen in Deutschland)</p>
        </section>

        {/* Kammer */}
        <section>
          <h2 className="font-display font-semibold text-base text-gray-900 pb-2 mb-4 border-b border-gray-100">
            Zuständige Kammer
          </h2>
          <p className="text-gray-500 italic">Rechtsanwaltskammer Hamm</p>
        </section>

        {/* Haftungsausschluss */}
        <section>
          <h2 className="font-display font-semibold text-base text-gray-900 pb-2 mb-4 border-b border-gray-100">
            Haftungsausschluss
          </h2>

          <h3 className="font-semibold text-gray-800 mb-2">Haftung für Inhalte</h3>
          <p className="mb-4">
            Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene Inhalte auf diesen Seiten
            nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als
            Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde
            Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige
            Tätigkeit hinweisen.
          </p>
          <p className="mb-6">
            Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den
            allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch
            erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei
            Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend
            entfernen.
          </p>

          <h3 className="font-semibold text-gray-800 mb-2">Haftung für Links</h3>
          <p>
            Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen
            Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr
            übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder
            Betreiber der Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der
            Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum
            Zeitpunkt der Verlinkung nicht erkennbar. Eine permanente inhaltliche Kontrolle der
            verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht
            zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend
            entfernen.
          </p>
        </section>

        {/* Urheberrecht */}
        <section>
          <h2 className="font-display font-semibold text-base text-gray-900 pb-2 mb-4 border-b border-gray-100">
            Urheberrecht
          </h2>
          <p className="mb-4">
            Die durch den Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen
            dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art
            der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen
            Zustimmung des jeweiligen Autors bzw. Erstellers.
          </p>
          <p>
            Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch
            gestattet. Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden
            die Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter als solche
            gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden,
            bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen
            werden wir derartige Inhalte umgehend entfernen.
          </p>
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
