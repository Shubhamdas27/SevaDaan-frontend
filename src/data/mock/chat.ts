// Mock data for internal chat component
export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  timestamp: string;
  isRead: boolean;
}

export interface ChatRoom {
  id: string;
  name: string;
  avatar?: string;
  isGroup: boolean;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
  participants: Array<{
    id: string;
    name: string;
    avatar?: string;
    role: string;
  }>;
}

export const MOCK_CHAT_ROOMS: ChatRoom[] = [
  {
    id: 'r1',
    name: 'Program Coordination',
    avatar: '/images/avatars/group1.png',
    isGroup: true,
    lastMessage: 'Can we move the health camp to next week?',
    lastMessageTime: '2023-07-28T10:30:00Z',
    unreadCount: 3,
    participants: [
      { id: 'u1', name: 'Aditya Sharma', avatar: '/images/avatars/avatar1.jpg', role: 'Program Manager' },
      { id: 'u2', name: 'Priya Patel', avatar: '/images/avatars/avatar2.jpg', role: 'Volunteer Coordinator' }
    ]
  },
  {
    id: 'r2',
    name: 'Volunteer Team',
    avatar: '/images/avatars/group2.png',
    isGroup: true,
    lastMessage: 'All volunteers have been briefed about the new protocols',
    lastMessageTime: '2023-07-27T14:45:00Z',
    unreadCount: 0,
    participants: [
      { id: 'u3', name: 'Rahul Verma', avatar: '/images/avatars/avatar3.jpg', role: 'Volunteer' },
      { id: 'u4', name: 'Anjali Das', avatar: '/images/avatars/avatar4.jpg', role: 'Volunteer' }
    ]
  },
  {
    id: 'r3',
    name: 'Priya Patel',
    avatar: '/images/avatars/avatar2.jpg',
    isGroup: false,
    lastMessage: 'Could you review the draft proposal?',
    lastMessageTime: '2023-07-26T09:15:00Z',
    unreadCount: 1,
    participants: [
      { id: 'u2', name: 'Priya Patel', avatar: '/images/avatars/avatar2.jpg', role: 'Volunteer Coordinator' }
    ]
  }
];

export const MOCK_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'm1',
    senderId: 'u1',
    senderName: 'Aditya Sharma',
    senderAvatar: '/images/avatars/avatar1.jpg',
    content: 'Good morning everyone! I hope you all are doing well.',
    timestamp: '2023-07-28T09:00:00Z',
    isRead: true
  },
  {
    id: 'm2',
    senderId: 'u2',
    senderName: 'Priya Patel',
    senderAvatar: '/images/avatars/avatar2.jpg',
    content: 'Morning Aditya! Yes, all good here.',
    timestamp: '2023-07-28T09:05:00Z',
    isRead: true
  },
  {
    id: 'm3',
    senderId: 'u1',
    senderName: 'Aditya Sharma',
    senderAvatar: '/images/avatars/avatar1.jpg',
    content: 'I wanted to discuss the upcoming health camp scheduled for this weekend.',
    timestamp: '2023-07-28T09:10:00Z',
    isRead: true
  },
  {
    id: 'm4',
    senderId: 'u1',
    senderName: 'Aditya Sharma',
    senderAvatar: '/images/avatars/avatar1.jpg',
    content: 'The weather forecast shows heavy rain, which might affect our outdoor setup.',
    timestamp: '2023-07-28T09:12:00Z',
    isRead: true
  },
  {
    id: 'm5',
    senderId: 'u2',
    senderName: 'Priya Patel',
    senderAvatar: '/images/avatars/avatar2.jpg',
    content: 'That\'s concerning. Do we have a backup venue?',
    timestamp: '2023-07-28T09:15:00Z',
    isRead: true
  },
  {
    id: 'm6',
    senderId: 'u1',
    senderName: 'Aditya Sharma',
    senderAvatar: '/images/avatars/avatar1.jpg',
    content: 'Not yet. I\'m thinking we should either postpone to next week or find an indoor location.',
    timestamp: '2023-07-28T09:20:00Z',
    isRead: true
  },
  {
    id: 'm7',
    senderId: 'u2',
    senderName: 'Priya Patel',
    senderAvatar: '/images/avatars/avatar2.jpg',
    content: 'Can we move the health camp to next week? That would give us more time to prepare as well.',
    timestamp: '2023-07-28T10:30:00Z',
    isRead: false
  }
];
