import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, formatDistanceToNow, isValid } from 'date-fns';
import { ro } from 'date-fns/locale';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Date formatting utilities
export function formatDate(date: Date | string | number, formatString = 'dd MMM yyyy'): string {
  const dateObj = new Date(date);
  if (!isValid(dateObj)) return 'Data invalidă';
  
  return format(dateObj, formatString, { locale: ro });
}

export function formatDateTime(date: Date | string | number): string {
  const dateObj = new Date(date);
  if (!isValid(dateObj)) return 'Data invalidă';
  
  return format(dateObj, 'dd MMM yyyy, HH:mm', { locale: ro });
}

export function formatTimeAgo(date: Date | string | number): string {
  const dateObj = new Date(date);
  if (!isValid(dateObj)) return 'Data invalidă';
  
  return formatDistanceToNow(dateObj, { addSuffix: true, locale: ro });
}

// Price formatting
export function formatPrice(price: number, currency = 'RON'): string {
  return new Intl.NumberFormat('ro-RO', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price);
}

// String utilities
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function capitalizeFirst(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

// Validation utilities
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^(\+4|4|0)?[0-9]{8,9}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

// File utilities
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function getFileExtension(filename: string): string {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
}

// Array utilities
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((result, item) => {
    const group = String(item[key]);
    (result[group] = result[group] || []).push(item);
    return result;
  }, {} as Record<string, T[]>);
}

export function unique<T>(array: T[]): T[] {
  return [...new Set(array)];
}

export function shuffle<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

// Color utilities
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

export function getContrastColor(hex: string): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return '#000000';
  
  const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
  return brightness > 128 ? '#000000' : '#ffffff';
}

// URL utilities
export function buildUrl(base: string, params: Record<string, string | number | boolean>): string {
  const url = new URL(base);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, String(value));
    }
  });
  return url.toString();
}

// Local storage utilities
export function getFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage key "${key}":`, error);
    return defaultValue;
  }
}

export function setToStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing to localStorage key "${key}":`, error);
  }
}

export function removeFromStorage(key: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing from localStorage key "${key}":`, error);
  }
}

// Debounce utility
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Throttle utility
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Random utilities
export function generateId(length = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function generateQRCode(data: string): string {
  // This would typically use the qrcode library
  // For now, return a placeholder
  return `data:image/png;base64,${Buffer.from(data).toString('base64')}`;
}

// Commission and VAT calculations
export function calculateCommission(price: number, rate = 0.04): number {
  return Math.round(price * rate * 100) / 100;
}

export function calculateVAT(amount: number, rate = 0.21): number {
  return Math.round(amount * rate * 100) / 100;
}

export function calculateTotalWithCommissionAndVAT(
  price: number,
  commissionRate = 0.04,
  vatRate = 0.21
): { commission: number; vat: number; total: number } {
  const commission = calculateCommission(price, commissionRate);
  const subtotal = price + commission;
  const vat = calculateVAT(subtotal, vatRate);
  const total = subtotal + vat;
  
  return {
    commission: Math.round(commission * 100) / 100,
    vat: Math.round(vat * 100) / 100,
    total: Math.round(total * 100) / 100,
  };
}

// Event category translations
export const categoryTranslations: Record<string, string> = {
  music: 'Muzică / Concerte',
  theater: 'Teatru & Arte Spectacol',
  film: 'Film & Proiecții',
  sports: 'Sport',
  conferences: 'Conferințe & Educație',
  exhibitions: 'Târguri & Expoziții',
  parties: 'Petreceri & Nightlife',
  family: 'Familie & Copii',
  outdoor: 'Outdoor & Experiențe',
  cultural: 'Culturale & Religioase',
};

export function translateCategory(category: string): string {
  return categoryTranslations[category] || category;
}