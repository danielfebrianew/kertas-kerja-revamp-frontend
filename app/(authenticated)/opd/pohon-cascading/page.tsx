import { Suspense } from 'react'
import { Loader2 } from 'lucide-react'
import PohonCascadingClient from './_components/PohonCascadingClient'

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center px-6 py-20">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <PohonCascadingClient />
    </Suspense>
  )
}