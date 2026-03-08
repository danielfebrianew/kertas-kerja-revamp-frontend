import { Suspense } from 'react'
import { Loader2 } from 'lucide-react'
import PohonCascadingClient from './_components/PohonCascadingClient'

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin" />
        </div>
      }
    >
      <PohonCascadingClient />
    </Suspense>
  )
}