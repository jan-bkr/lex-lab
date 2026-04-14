import { notFound } from 'next/navigation'
import { fetchToolById } from '@/app/admin/actions'
import { EditForm } from './EditForm'

export const dynamic = 'force-dynamic'

export default async function EditToolPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const tool = await fetchToolById(id)
  if (!tool) notFound()

  return (
    <div>
      <div className="mb-6">
        <a href="/admin/tools" className="text-xs text-blue-600 hover:underline">← Zurück zur Liste</a>
        <h1 className="font-display text-2xl font-bold text-gray-900 mt-1">
          Tool bearbeiten
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">{tool.name} · {tool.slug}</p>
      </div>
      <EditForm tool={tool} />
    </div>
  )
}
