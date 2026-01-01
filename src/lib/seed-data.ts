import { User, Club, ClubMembership, Event, Announcement } from '@/types';

export const seedUsers: User[] = [
  {
    id: 'user-1',
    email: 'student@demo.com',
    name: 'Alex Johnson',
    role: 'student',
    department: 'Computer Science',
    year: 3,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'admin-1',
    email: 'admin@demo.com',
    name: 'Dr. Sarah Chen',
    role: 'admin',
    department: 'Student Affairs',
    createdAt: new Date().toISOString(),
  },
];

export const seedClubs: Club[] = [
  {
    id: 'club-1',
    name: 'Tech Innovators',
    description: 'A club for technology enthusiasts to explore cutting-edge innovations, build projects, and network with industry professionals.',
    adminId: 'admin-1',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'club-2',
    name: 'Creative Arts Society',
    description: 'Express yourself through various art forms including painting, photography, digital art, and more.',
    adminId: 'admin-1',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'club-3',
    name: 'Entrepreneurship Cell',
    description: 'Building the next generation of entrepreneurs through workshops, mentorship, and startup competitions.',
    adminId: 'admin-1',
    createdAt: new Date().toISOString(),
  },
];

export const seedMemberships: ClubMembership[] = [
  {
    id: 'mem-1',
    clubId: 'club-1',
    userId: 'user-1',
    joinedAt: new Date().toISOString(),
  },
  {
    id: 'mem-2',
    clubId: 'club-3',
    userId: 'user-1',
    joinedAt: new Date().toISOString(),
  },
];

export const seedEvents: Event[] = [
  {
    id: 'event-1',
    clubId: 'club-1',
    title: 'AI Workshop: Introduction to Machine Learning',
    description: 'Learn the fundamentals of machine learning with hands-on exercises using Python and TensorFlow.',
    date: '2026-01-15',
    time: '14:00',
    venue: 'Tech Lab 101',
    capacity: 50,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'event-2',
    clubId: 'club-1',
    title: 'Hackathon 2026',
    description: '24-hour coding competition with amazing prizes and networking opportunities.',
    date: '2026-01-25',
    time: '09:00',
    venue: 'Main Auditorium',
    capacity: 200,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'event-3',
    clubId: 'club-3',
    title: 'Startup Pitch Night',
    description: 'Present your startup ideas to a panel of investors and mentors.',
    date: '2026-01-20',
    time: '18:00',
    venue: 'Business School Hall',
    capacity: 100,
    createdAt: new Date().toISOString(),
  },
];

export const seedAnnouncements: Announcement[] = [
  {
    id: 'ann-1',
    clubId: 'club-1',
    title: 'Welcome to Spring Semester!',
    content: 'Exciting events planned for this semester. Stay tuned for updates!',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'ann-2',
    clubId: 'club-3',
    title: 'New Partnership with Local Incubator',
    content: 'We are thrilled to announce our partnership with TechStart Incubator for mentorship programs.',
    createdAt: new Date().toISOString(),
  },
];
