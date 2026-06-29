/**
 * Generate a random avatar background color from a set of iOS-like palette options
 */
export const AVATAR_COLORS = [
  '#FF6B6B', '#FF8E53', '#FFC107', '#4CAF50',
  '#00BCD4', '#2196F3', '#9C27B0', '#E91E63',
  '#FF5722', '#607D8B', '#795548', '#009688',
];

/**
 * Get initials from a contact name (up to 2 chars)
 */
export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0 || parts[0] === '') return '?';
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

/**
 * Format current time as HH:MM AM/PM
 */
export function getCurrentTime(): string {
  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${hours}:${minutes} ${ampm}`;
}

/**
 * Clamp a number between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Check if a color is dark (to determine text color)
 */
export function isDarkColor(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance < 0.5;
}

/**
 * Generate a unique short ID
 */
export function generateId(): string {
  return `msg-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
}

/**
 * Reorder an array by moving item from one index to another
 */
export function reorderArray<T>(arr: T[], from: number, to: number): T[] {
  const result = [...arr];
  const [removed] = result.splice(from, 1);
  result.splice(to, 0, removed);
  return result;
}

/**
 * Returns the current time as a Twitter-style timestamp string:
 * "h:mm AM/PM" format matching what iOS/Twitter show.
 */
export function getCurrentTimeForPost(): string {
  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${hours}:${minutes} ${ampm}`;
}

/**
 * Returns Instagram-style "time ago" string from now.
 */
export function getTimeAgoFromNow(): string {
  return 'Just now';
}

/**
 * Format a Date as "h:mm AM · Mon DD, YYYY" (Twitter full timestamp style).
 */
export function formatTwitterTimestamp(date: Date): string {
  const hours = date.getHours() % 12 || 12;
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const ampm = date.getHours() >= 12 ? 'PM' : 'AM';
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${hours}:${minutes} ${ampm} · ${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}
