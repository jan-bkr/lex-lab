import { Rechtsgebiet } from '@/types'

const tagStyles: Record<Rechtsgebiet, string> = {
  'Steuerrecht': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'M&A': 'bg-purple-50 text-purple-700 border-purple-200',
  'Gesellschaftsrecht': 'bg-blue-50 text-blue-700 border-blue-200',
  'Venture Capital': 'bg-orange-50 text-orange-700 border-orange-200',
}

export function RechtsgebietTag({ tag }: { tag: Rechtsgebiet }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${tagStyles[tag]}`}>
      {tag}
    </span>
  )
}
