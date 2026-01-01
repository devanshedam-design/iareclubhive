// localStorage utilities for ClubHive

const STORAGE_KEYS = {
  USERS: 'clubhive_users',
  CLUBS: 'clubhive_clubs',
  MEMBERSHIPS: 'clubhive_memberships',
  EVENTS: 'clubhive_events',
  REGISTRATIONS: 'clubhive_registrations',
  ANNOUNCEMENTS: 'clubhive_announcements',
  CURRENT_USER: 'clubhive_current_user',
} as const;

export function getItem<T>(key: string): T | null {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch {
    return null;
  }
}

export function setItem<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

export function removeItem(key: string): void {
  localStorage.removeItem(key);
}

export { STORAGE_KEYS };
