// components/ui/breadcrumb.tsx

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IconHome } from '@/components/ui/icons';

// Function to convert path segments like "pohon-kinerja-pemda" to "Pohon Kinerja Pemda"
function formatSegmentLabel(segment: string): string {
  // Decode URI components in case there are encoded characters
  const decodedSegment = decodeURIComponent(segment);
  return decodedSegment
    .split('-')
    .map((word) => {
      // Keep acronyms uppercase if needed, otherwise capitalize first letter
      if (word.toLowerCase() === 'opd') return 'OPD';
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}

export function Breadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  const crumbs = segments.map((segment, index) => {
    const href = '/' + segments.slice(0, index + 1).join('/');
    const label = formatSegmentLabel(segment);
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
