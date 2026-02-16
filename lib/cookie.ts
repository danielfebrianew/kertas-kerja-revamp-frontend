/**
 * Cookie Helper Utilities
 *
 * This module provides reusable, type-safe cookie management functions
 * built on top of cookies-next library.
 *
 * @module lib/cookie
 */

import { getCookie as getCookieNext, setCookie as setCookieNext, deleteCookie as deleteCookieNext } from 'cookies-next';
import { toast } from 'sonner';

/**
 * Get tahun (year) from cookie with fallback to current year
 *
 * @returns The year as a string (e.g., "2024")
 *
 * @example
 * ```typescript
 * const tahun = getTahunFromCookie(); // "2024"
 * ```
 */
export function getTahunFromCookie(): string {
  try {
    const raw = getCookieNext('tahun');
    if (!raw) return String(new Date().getFullYear());
    const rawStr = typeof raw === 'string' ? raw : String(raw);
    const parsed = JSON.parse(rawStr);
    return typeof parsed === 'object' ? parsed.value || '' : String(parsed);
  } catch {
    // Cookie bukan JSON, pakai langsung sebagai string
    const raw = getCookieNext('tahun');
    if (!raw) return String(new Date().getFullYear());
    const rawStr = typeof raw === 'string' ? raw : String(raw);
    if (rawStr && /^\d{4}$/.test(rawStr)) return rawStr;
    toast.error('Format cookie tahun tidak valid');
  }
  return String(new Date().getFullYear());
}

/**
 * Get cookie value from a JSON cookie (with .value property)
 */
export function getCookieValue(name: string): string {
  try {
    const raw = getCookieNext(name);
    if (!raw) return '';
    const rawStr = typeof raw === 'string' ? raw : String(raw);
    const parsed = JSON.parse(rawStr);
    return typeof parsed === 'object' ? parsed.value || '' : String(parsed);
  } catch {
    return '';
  }
}

/**
 * Get cookie label from a JSON cookie (with .label property)
 */
export function getCookieLabel(name: string): string {
  try {
    const raw = getCookieNext(name);
    if (!raw) return '';
    const rawStr = typeof raw === 'string' ? raw : String(raw);
    const parsed = JSON.parse(rawStr);
    return typeof parsed === 'object' ? parsed.label || '' : '';
  } catch {
    return '';
  }
}

/**
 * Type-safe getCookie wrapper
 */
export function getCookie(name: string): string | undefined {
  const raw = getCookieNext(name);
  if (!raw) return undefined;
  return typeof raw === 'string' ? raw : String(raw);
}

/**
 * Set cookie with JSON value and label
 */
export function setCookieWithLabel(name: string, value: string, label: string): void {
  setCookieNext(name, JSON.stringify({ value, label }));
}

/**
 * Set cookie
 */
export function setCookie(name: string, value: string): void {
  setCookieNext(name, value);
}

/**
 * Delete cookie
 */
export function deleteCookie(name: string): void {
  deleteCookieNext(name);
}
