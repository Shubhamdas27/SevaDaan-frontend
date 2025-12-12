import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, formatDistance } from 'date-fns';

/**
 * Combines multiple class values into a single className string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a date string into a human-readable format
 */
export function formatDate(date: string | Date, formatString: string = 'MMM d, yyyy') {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, formatString);
}

/**
 * Format date and time together
 */
export function formatDateTime(date: string | Date): string {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Returns the time difference between a date and now in a human-readable format
 */
export function timeAgo(date: string | Date) {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return formatDistance(dateObj, new Date(), { addSuffix: true });
}

/**
 * Truncates a string to a specified length and adds an ellipsis
 */
export function truncateText(text: string, maxLength: number = 100) {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

/**
 * Transforms a string into a URL-friendly slug
 */
export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
}

/**
 * Extracts the initials from a name
 */
export function getInitials(name: string) {
  if (!name) return '';
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Calculates the progress percentage
 */
export function calculateProgress(current: number, total: number) {
  if (total === 0) return 0;
  return Math.min(100, Math.round((current / total) * 100));
}

/**
 * Format a number as currency
 */
export function formatCurrency(amount: number, currencyCode: string = 'INR'): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format large numbers with K, L, Cr suffixes
 */
export function formatNumber(num: number): string {
  if (num >= 10000000) return `${(num / 10000000).toFixed(1)}Cr`;
  if (num >= 100000) return `${(num / 100000).toFixed(1)}L`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

/**
 * Get status badge variant based on status string
 */
export function getStatusVariant(status: string): 'primary' | 'success' | 'warning' | 'error' | 'accent' {
  const statusMap: Record<string, 'primary' | 'success' | 'warning' | 'error' | 'accent'> = {
    approved: 'success',
    completed: 'success',
    verified: 'success',
    active: 'success',
    published: 'success',
    pending: 'warning',
    review: 'warning',
    draft: 'warning',
    upcoming: 'primary',
    scheduled: 'primary',
    rejected: 'error',
    cancelled: 'error',
    failed: 'error',
    inactive: 'error',
    ongoing: 'accent',
    processing: 'accent'
  };
  
  return statusMap[status.toLowerCase()] || 'primary';
}

/**
 * Returns a random item from an array
 */
export function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}