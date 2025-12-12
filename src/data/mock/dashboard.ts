// Mock data for dashboard components
import { Donation, HoursEntry, LeaderboardEntry, VolunteerEvent } from '../../types';

// Sample notices data for demonstration
export const MOCK_NOTICES = [
  {
    id: '1',
    title: 'Upcoming Grant Deadline',
    description: 'Submit your application for the Community Development Grant by June 30, 2025.',
    type: 'grant',
    date: '2025-06-15',
    ngoId: 101,
    content: 'Submit your application for the Community Development Grant by June 30, 2025.',
    isHighlighted: true,
  },
  {
    id: '2',
    title: 'New Volunteer Training',
    description: 'Join our comprehensive volunteer training program starting July 1st.',
    type: 'volunteer',
    date: '2025-07-01',
    ngoId: 102,
    content: 'Join our comprehensive volunteer training program starting July 1st.',
    isHighlighted: false,
  },
];

// Mock donation history data
export const MOCK_DONATIONS: Donation[] = [
  {
    id: 'don-1',
    amount: 5000,
    date: '2023-07-15',
    ngoId: 'ngo-1',
    ngoName: 'Care Foundation',
    programName: 'Education for All',
    status: 'completed',
    paymentMethod: 'Credit Card',
    receiptUrl: '/receipts/don-1.pdf',
    certificateUrl: '/certificates/don-1.pdf'
  },
  {
    id: 'don-2',
    amount: 2500,
    date: '2023-06-22',
    ngoId: 'ngo-2',
    ngoName: 'Hope Initiative',
    programName: 'Healthcare Outreach',
    status: 'completed',
    paymentMethod: 'UPI',
    receiptUrl: '/receipts/don-2.pdf'
  },
  {
    id: 'don-3',
    amount: 1000,
    date: '2023-05-10',
    ngoId: 'ngo-3',
    ngoName: 'Green Earth Foundation',
    programName: 'Tree Plantation Drive',
    status: 'completed',
    paymentMethod: 'Net Banking',
    receiptUrl: '/receipts/don-3.pdf',
    certificateUrl: '/certificates/don-3.pdf'
  }
];

// Mock volunteer hours log
export const MOCK_VOLUNTEER_HOURS: HoursEntry[] = [
  {
    id: 'hr-1',
    eventId: 'evt-5',
    eventName: 'Beach Cleanup Drive',
    ngoId: 'ngo-1',
    ngoName: 'Green Earth Foundation',
    date: '2025-05-25',
    hours: 3,
    description: 'Participated in beach cleanup, collected plastic waste and organized recycling.',
    status: 'approved',
  },
  {
    id: 'hr-2',
    eventId: 'evt-6',
    eventName: 'Teaching Children',
    ngoId: 'ngo-2',
    ngoName: 'Education for All',
    date: '2025-05-20',
    hours: 4,
    description: 'Taught basic mathematics to children aged 8-12 in the community center.',
    status: 'pending',
  }
];

// Mock leaderboard data
export const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  {
    rank: 1,
    userId: 'user-1',
    name: 'Amit Sharma',
    avatar: '/images/avatars/avatar1.jpg',
    hours: 78,
    events: 12,
    badges: 8,
    isCurrentUser: false,
    trend: 'stable',
    category: 'Environment'
  },
  {
    rank: 2,
    userId: 'user-2',
    name: 'Priya Patel',
    avatar: '/images/avatars/avatar2.jpg',
    hours: 65,
    events: 10,
    badges: 6,
    isCurrentUser: false,
    trend: 'up',
    category: 'Healthcare'
  },
  {
    rank: 3,
    userId: 'user-3',
    name: 'Rahul Verma',
    avatar: '/images/avatars/avatar3.jpg',
    hours: 58,
    events: 9,
    badges: 5,
    isCurrentUser: true,
    trend: 'down',
    category: 'Education'
  }
];

// Mock volunteer events
export const MOCK_VOLUNTEER_EVENTS: VolunteerEvent[] = [
  {
    id: 'evt-1',
    title: 'Tree Plantation Drive',
    ngoId: 'ngo-1',
    ngoName: 'Green Earth Foundation',
    description: 'Join us for a tree plantation drive to increase the green cover in urban areas.',
    location: 'City Park, Mumbai',
    date: '2025-06-15',
    startTime: '09:00',
    endTime: '12:00',
    status: 'open',
    requiredVolunteers: 25,
    currentVolunteers: 12,
    skills: ['Physical Activity', 'Environmental Awareness'],
    imageUrl: '/images/events/tree-planting.jpg',
    category: 'Environment',
  },
  {
    id: 'evt-2',
    title: 'Teaching Workshop',
    ngoId: 'ngo-2',
    ngoName: 'Education for All',
    description: 'Help teach basic literacy and numeracy skills to underprivileged children.',
    location: 'Community Center, Delhi',
    date: '2025-06-18',
    startTime: '14:00',
    endTime: '17:00',
    status: 'open',
    requiredVolunteers: 15,
    currentVolunteers: 8,
    skills: ['Teaching', 'Patience', 'Communication'],
    imageUrl: '/images/events/teaching.jpg',
    category: 'Education',
  }
];
