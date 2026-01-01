import { useState, useEffect, useCallback } from 'react';
import { Club, ClubMembership, Event, EventRegistration, Announcement } from '@/types';
import { getItem, setItem, STORAGE_KEYS } from '@/lib/storage';
import { useAuth } from '@/contexts/AuthContext';

export function useClubs() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const { user } = useAuth();

  const loadClubs = useCallback(() => {
    const storedClubs = getItem<Club[]>(STORAGE_KEYS.CLUBS) || [];
    setClubs(storedClubs);
  }, []);

  useEffect(() => {
    loadClubs();
  }, [loadClubs]);

  const getMyClubs = useCallback(() => {
    if (!user) return [];
    const memberships = getItem<ClubMembership[]>(STORAGE_KEYS.MEMBERSHIPS) || [];
    const myClubIds = memberships.filter((m) => m.userId === user.id).map((m) => m.clubId);
    return clubs.filter((c) => myClubIds.includes(c.id));
  }, [clubs, user]);

  const getAdminClubs = useCallback(() => {
    if (!user || user.role !== 'admin') return [];
    return clubs.filter((c) => c.adminId === user.id);
  }, [clubs, user]);

  const joinClub = useCallback((clubId: string) => {
    if (!user) return;
    const memberships = getItem<ClubMembership[]>(STORAGE_KEYS.MEMBERSHIPS) || [];
    const exists = memberships.some((m) => m.clubId === clubId && m.userId === user.id);
    if (!exists) {
      const newMembership: ClubMembership = {
        id: `mem-${Date.now()}`,
        clubId,
        userId: user.id,
        joinedAt: new Date().toISOString(),
      };
      setItem(STORAGE_KEYS.MEMBERSHIPS, [...memberships, newMembership]);
      loadClubs();
    }
  }, [user, loadClubs]);

  return { clubs, getMyClubs, getAdminClubs, joinClub, refreshClubs: loadClubs };
}

export function useEvents(clubId?: string) {
  const [events, setEvents] = useState<Event[]>([]);
  const { user } = useAuth();

  const loadEvents = useCallback(() => {
    const storedEvents = getItem<Event[]>(STORAGE_KEYS.EVENTS) || [];
    if (clubId) {
      setEvents(storedEvents.filter((e) => e.clubId === clubId));
    } else {
      setEvents(storedEvents);
    }
  }, [clubId]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const createEvent = useCallback((eventData: Omit<Event, 'id' | 'createdAt'>) => {
    const storedEvents = getItem<Event[]>(STORAGE_KEYS.EVENTS) || [];
    const newEvent: Event = {
      ...eventData,
      id: `event-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setItem(STORAGE_KEYS.EVENTS, [...storedEvents, newEvent]);
    loadEvents();
    return newEvent;
  }, [loadEvents]);

  const getEventRegistrations = useCallback((eventId: string) => {
    const registrations = getItem<EventRegistration[]>(STORAGE_KEYS.REGISTRATIONS) || [];
    return registrations.filter((r) => r.eventId === eventId);
  }, []);

  const registerForEvent = useCallback((eventId: string) => {
    if (!user) return null;
    const registrations = getItem<EventRegistration[]>(STORAGE_KEYS.REGISTRATIONS) || [];
    const exists = registrations.some((r) => r.eventId === eventId && r.userId === user.id);
    if (!exists) {
      const qrCode = `CLUBHIVE-${eventId}-${user.id}-${Date.now()}`;
      const newRegistration: EventRegistration = {
        id: `reg-${Date.now()}`,
        eventId,
        userId: user.id,
        registeredAt: new Date().toISOString(),
        attended: false,
        qrCode,
      };
      setItem(STORAGE_KEYS.REGISTRATIONS, [...registrations, newRegistration]);
      return newRegistration;
    }
    return registrations.find((r) => r.eventId === eventId && r.userId === user.id) || null;
  }, [user]);

  const getMyRegistration = useCallback((eventId: string) => {
    if (!user) return null;
    const registrations = getItem<EventRegistration[]>(STORAGE_KEYS.REGISTRATIONS) || [];
    return registrations.find((r) => r.eventId === eventId && r.userId === user.id) || null;
  }, [user]);

  return { events, createEvent, registerForEvent, getMyRegistration, getEventRegistrations, refreshEvents: loadEvents };
}

export function useAnnouncements(clubId?: string) {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    const stored = getItem<Announcement[]>(STORAGE_KEYS.ANNOUNCEMENTS) || [];
    if (clubId) {
      setAnnouncements(stored.filter((a) => a.clubId === clubId));
    } else {
      setAnnouncements(stored);
    }
  }, [clubId]);

  return { announcements };
}
