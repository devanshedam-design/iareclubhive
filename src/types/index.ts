// ClubHive Types

export type UserRole = 'student' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  department?: string;
  year?: number;
  createdAt: string;
}

export interface Club {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  adminId: string;
  createdAt: string;
}

export interface ClubMembership {
  id: string;
  clubId: string;
  userId: string;
  joinedAt: string;
}

export interface Event {
  id: string;
  clubId: string;
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  capacity: number;
  imageUrl?: string;
  createdAt: string;
}

export interface EventRegistration {
  id: string;
  eventId: string;
  userId: string;
  registeredAt: string;
  attended: boolean;
  qrCode: string;
}

export interface Announcement {
  id: string;
  clubId: string;
  title: string;
  content: string;
  createdAt: string;
}
