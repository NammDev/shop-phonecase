import { getConfiguration } from '@/lib/actions/configuration'
import { notFound } from 'next/navigation'
import DesignPreview from './design-preview'

interface PageProps {
  searchParams: {
    [key: string]: string | string[] | undefined
  }
}

export default async function PreviewPage({ searchParams }: PageProps) {
  const { id } = searchParams
  if (!id || typeof id !== 'string') return notFound()

  const configuration = await getConfiguration(id)
  if (!configuration) return notFound()

  return <DesignPreview configuration={configuration} />
}
