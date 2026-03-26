// app/(authenticated)/opd/pohon-cascading/_utils.ts

export function getCascadingHeaderStyle(jenis: string) {
  switch (jenis) {
    case 'Strategic Pemda':
      return 'border-red-500 text-white bg-gradient-to-r from-red-500 to-pink-500'

    case 'Tactical Pemda':
      return 'border-blue-500 text-white bg-gradient-to-r from-blue-500 to-indigo-500'

    case 'Operational Pemda':
      return 'border-green-500 text-white bg-gradient-to-r from-green-500 to-emerald-500'

    default:
      return 'border-border bg-card text-card-foreground'
  }
}

export function getCascadingBadge(level: number) {
  switch (level) {
    case 4:
      return 'bg-red-100 text-red-800'

    case 5:
      return 'bg-blue-100 text-blue-800'

    case 6:
      return 'bg-green-100 text-green-800'

    default:
      return 'bg-muted text-muted-foreground'
  }
}

export interface CascadingChildInfo {
  nextLevel: number
  nextJenis: string
  label: string
}

export function getCascadingChild(level: number): CascadingChildInfo | null {

  switch (level) {

    case 4:
      return {
        nextLevel: 5,
        nextJenis: 'Tactical Pemda',
        label: 'Tactical'
      }

    case 5:
      return {
        nextLevel: 6,
        nextJenis: 'Operational Pemda',
        label: 'Operational'
      }

    default:
      return null
  }
}