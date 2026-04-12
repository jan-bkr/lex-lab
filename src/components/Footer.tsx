import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">

        {/* Top row: Logo + Description + Links */}
        <div className="flex flex-col md:flex-row justify-between gap-8 pb-10 border-b border-gray-100">
          <div className="max-w-xs">
            <div className="flex items-center gap-2.5 mb-3">
              <svg width="36" height="36" viewBox="0 0 28 28" fill="none">
                <rect width="28" height="28" rx="7" fill="#111827"/>
                <text x="5" y="13" fontFamily="Georgia, serif" fontSize="11" fontWeight="700" fill="white" letterSpacing="-0.5">lex</text>
                <text x="5" y="23" fontFamily="Georgia, serif" fontSize="11" fontWeight="700" fill="#2563EB" letterSpacing="-0.5">lab</text>
              </svg>
              <span className="font-display font-bold text-[18px] text-gray-900">
                lex-lab<span className="font-normal text-gray-400">.de</span>
              </span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              Die kuratierte Plattform für KI-Tools, Workflows und Prompts im deutschen Rechts- und Steuermarkt.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-3">Rechtliches</p>
            <div className="flex flex-col gap-2">
              <Link href="/impressum" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Impressum</Link>
              <Link href="/datenschutz" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Datenschutz</Link>
              <Link href="/kontakt" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Kontakt</Link>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="py-8 border-b border-gray-100">
          <details className="group">
            <summary className="flex items-center gap-2 cursor-pointer text-xs text-gray-400 hover:text-gray-600 transition-colors list-none">
              <span className="w-4 h-4 rounded-full border border-gray-300 flex items-center justify-center text-[10px] flex-shrink-0 group-open:bg-gray-100">i</span>
              <span className="font-medium">Haftungsausschluss &amp; rechtliche Hinweise</span>
              <span className="ml-auto text-gray-300 group-open:rotate-180 transition-transform">▾</span>
            </summary>
            <div className="mt-4 pl-6 grid sm:grid-cols-2 gap-4">
              <p className="text-xs text-gray-400 leading-relaxed">
                <strong className="text-gray-500 font-medium">Keine Rechtsberatung.</strong> Die auf dieser Website bereitgestellten Informationen stellen keine Rechtsberatung dar und sollen keine rechtlichen Fragen oder Probleme behandeln, die im individuellen Fall auftreten können. Die Informationen sind allgemeiner Natur und dienen ausschließlich zu Informationszwecken. Wenn Sie rechtlichen Rat für Ihre individuelle Situation benötigen, sollten Sie den Rat eines qualifizierten Anwalts einholen.
              </p>
              <p className="text-xs text-gray-400 leading-relaxed">
                <strong className="text-gray-500 font-medium">Externe Links.</strong> Diese Website enthält Links zu Websites Dritter. Diese Links werden ausschließlich zu Informationszwecken bereitgestellt. Ein Link stellt keine Zustimmung, Billigung oder Empfehlung dieser Website durch uns dar. Wir übernehmen keine Verantwortung für die Richtigkeit, Vollständigkeit oder Rechtmäßigkeit des Inhalts verlinkter Websites sowie für eventuelle Schäden aus deren Nutzung.
              </p>
            </div>
          </details>
        </div>

        {/* Bottom row */}
        <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <p className="text-xs text-gray-400">
              <span className="font-medium text-gray-500">Inhaltliche Verantwortung:</span> Jan Becker, Rechtsanwalt
            </p>
            <p className="text-xs text-gray-400">
              Kontakt: <a href="mailto:kontakt@lex-lab.de" className="hover:text-gray-600 transition-colors">kontakt@lex-lab.de</a>
            </p>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://www.linkedin.com/in/jan-niklas-becker"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-blue-600 transition-colors"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              <span>Folge uns auf LinkedIn</span>
            </a>
            <p className="text-xs text-gray-400">© 2026 lex-lab.de</p>
          </div>
        </div>

      </div>
    </footer>
  )
}
