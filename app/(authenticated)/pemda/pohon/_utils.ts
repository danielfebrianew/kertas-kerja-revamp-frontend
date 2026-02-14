export function getPohonStyle(levelPohon: number) {
  switch (levelPohon) {
    case 0:
    case 1:
    case 2:
    case 3:
      return {
        card: 'border-pohon-tematik-border',
        header: '',
        badge: 'bg-primary text-background',
      };
    case 4:
      return {
        card: 'border-pohon-strategic-border',
        header: '',
        badge: 'bg-red-100 text-red-800',
      };
    case 5:
      return {
        card: 'border-pohon-tactical-border',
        header: '',
        badge: 'bg-blue-100 text-blue-800',
      };
    case 6:
      return {
        card: 'border-pohon-operational-border',
        header: '',
        badge: 'bg-green-100 text-green-800',
      };
    default:
      return {
        card: 'border-border',
        header: '',
        badge: 'bg-muted text-muted-foreground',
      };
  }
}

export function getHeaderStyle(jenisPohon: string) {
  const jp = jenisPohon.toUpperCase().replace(/\s+/g, '_');
  switch (jp) {
    case 'STRATEGIC_PEMDA':
      return 'border-pohon-strategic-border text-white bg-gradient-to-r from-pohon-strategic-from from-40% to-pohon-strategic-to';
    case 'TACTICAL_PEMDA':
      return 'border-pohon-tactical-border text-white bg-gradient-to-r from-pohon-tactical-from from-40% to-pohon-tactical-to';
    case 'OPERATIONAL_PEMDA':
      return 'border-pohon-operational-border text-white bg-gradient-to-r from-pohon-operational-from from-40% to-pohon-operational-to';
    case 'TEMATIK':
    case 'SUB_TEMATIK':
    case 'SUB_SUB_TEMATIK':
    case 'SUPER_SUB_TEMATIK':
      return 'border-pohon-tematik-border bg-pohon-tematik-bg text-pohon-tematik-text';
    default:
      return 'border-border bg-card text-card-foreground';
  }
}

export interface ChildInfo {
  nextLevel: number;
  nextJenis: string;
  label: string;
}

export function getChildInfo(levelPohon: number): ChildInfo | null {
  switch (levelPohon) {
    case 0:
      return { nextLevel: 1, nextJenis: 'Sub Tematik', label: 'Sub Tematik' };
    case 1:
      return { nextLevel: 2, nextJenis: 'Sub Sub Tematik', label: 'Sub Sub Tematik' };
    case 2:
      return { nextLevel: 3, nextJenis: 'Super Sub Tematik', label: 'Super Sub Tematik' };
    case 3:
      return { nextLevel: 4, nextJenis: 'Strategic Pemda', label: 'Strategic Pemda' };
    case 4:
      return { nextLevel: 5, nextJenis: 'Tactical Pemda', label: 'Tactical Pemda' };
    case 5:
      return { nextLevel: 6, nextJenis: 'Operational Pemda', label: 'Operational Pemda' };
    default:
      return null;
  }
}
