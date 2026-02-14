/**
 * ============================================================
 * BRAND COLOR CONFIGURATION — Single Source of Truth
 * ============================================================
 *
 * Aturan 60-30-10:
 *   60% PRIMARY   → Latar belakang dominan (background, card, surface)
 *   30% SECONDARY → Teks & elemen struktur (foreground, sidebar, button)
 *   10% ACCENT    → Sorotan & CTA (highlight, active state, focus ring)
 *
 * Untuk mengganti warna seluruh aplikasi:
 *   1. Ubah hex di bawah ini
 *   2. Jalankan `pnpm dev` — warna akan langsung berubah
 *
 * ============================================================
 */

// ── Brand Hex Values ─────────────────────────────────────────
export const brand = {
  /** 60% — Latar belakang dominan (cream hangat) */
  primary: '#f6f4f1',
  /** 30% — Teks & struktur UI (hitam) */
  secondary: '#000f22',
  /** 10% — Sorotan, CTA, aksen (emas) */
  accent: '#e5e5e5',
} as const;

// ── Injected CSS Custom Properties ───────────────────────────
// These are set on <html> via layout.tsx and referenced by
// globals.css using color-mix() to derive all theme colors.
export const brandCSSVars: Record<string, string> = {
  '--brand-60': brand.primary,
  '--brand-30': brand.secondary,
  '--brand-10': brand.accent,
};

// ── Tailwind Class Helpers ───────────────────────────────────

/** Kelas untuk background 60% (cream) */
export const bg60 = 'bg-background' as const;

/** Kelas untuk teks 30% — keterbacaan tinggi di atas bg 60% */
export const text30 = 'text-foreground' as const;

/** Kelas untuk elemen aksen 10% (gold) */
export const bgAccent10 = 'bg-accent' as const;
export const textAccent10 = 'text-accent' as const;

/** Kelas untuk tombol utama */
export const btnPrimary = 'bg-primary text-primary-foreground hover:bg-primary/90' as const;

/** Kelas untuk tombol destructive */
export const btnDestructive = 'bg-destructive text-white hover:bg-destructive/90' as const;

/** Kelas untuk card surface */
export const cardSurface = 'bg-card text-card-foreground' as const;

/** Kelas untuk label/deskripsi */
export const textMuted = 'text-muted-foreground' as const;

// ── Pohon Tree Semantic Colors ───────────────────────────────
export const pohonColors = {
  strategic: { from: '#CA3636', to: '#BD04A1' },
  tactical:  { from: '#3673CA', to: '#08D2FB' },
  operational: { from: '#139052', to: '#2DCB06' },
} as const;
