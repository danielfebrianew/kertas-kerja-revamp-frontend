'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IconHome } from '@/components/ui/icons';

const labelMap: Record<string, string> = {
  dashboard: 'Dashboard',
  pemda: 'Pemda',
  opd: 'OPD',
  'pemda/pohon': 'Pohon Kinerja Pemda',
  'opd/pohon': 'Pohon Kinerja OPD',
  tematik: 'Tematik',
  'data-master': 'Data Master',
  'master-lembaga': 'Master Lembaga',
  'master-opd': 'Master OPD',
  'master-role': 'Master Role',
};

export function Breadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  const crumbs = segments.map((segment, index) => {
    const href = '/' + segments.slice(0, index + 1).join('/');

    const prevSegment = segments[index - 1];
    const combinedPath = prevSegment ? `${prevSegment}/${segment}` : null;
    
    const label = (combinedPath && labelMap[combinedPath])
      ? labelMap[combinedPath]
      : (labelMap[segment] ?? segment);

    const isLast = index === segments.length - 1;
    return { href, label, isLast };
  });

  return (
    <nav className="mt-4 text-sm text-muted-foreground flex items-center gap-1">
      <Link href="/dashboard" className="hover:text-foreground transition-colors">
        <IconHome />
      </Link>
      {crumbs.map((crumb) => (
        <span key={crumb.href} className="flex items-center gap-1">
          <span>/</span>
          {crumb.isLast ? (
            <span className="text-foreground font-medium">{crumb.label}</span>
          ) : (
            <Link href={crumb.href} className="hover:text-foreground transition-colors">
              {crumb.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}
