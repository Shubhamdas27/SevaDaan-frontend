import React, { useState, useEffect, useRef } from 'react';
import { Send, Paperclip, Phone, Video, Users, Search, MoreHorizontal } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  timestamp: string;
  attachments?: {
    name: string;
    url: string;
    type: 'image' | 'document' | 'other';
  }[];
  isRead: boolean;
}

interface ChatRoom {
  id: string;
  name: string;
  avatar?: string;
  isGroup: boolean;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
  participants: {
    id: string;
    name: string;
    avatar?: string;
    role: string;
  }[];
}

const InternalChat: React.FC = () => {
  const { user } = useAuth();
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch chat rooms
  useEffect(() => {
    // Simulating API call to fetch chat rooms
    setTimeout(() => {
      const mockRooms: ChatRoom[] = [
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
      
      setRooms(mockRooms);
      setSelectedRoom(mockRooms[0].id);
      setLoading(false);
    }, 1000);
  }, []);

  // Fetch messages when selected room changes
  useEffect(() => {
    if (selectedRoom) {
      setLoading(true);
      
      // Simulating API call to fetch messages
      setTimeout(() => {
        const mockMessages: Message[] = [
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
        
        setMessages(mockMessages);
        setLoading(false);
      }, 800);
    }
  }, [selectedRoom]);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !selectedRoom) return;
    
    // Generate a new message
    const newMsg: Message = {
      id: `m${Date.now()}`,
      senderId: user?.id || 'current-user',
      senderName: user?.name || 'Current User',
      senderAvatar: user?.avatar,
      content: newMessage,
      timestamp: new Date().toISOString(),
      isRead: false
    };
    
    // Update messages state
    setMessages(prev => [...prev, newMsg]);
    
    // Update rooms with the last message
    setRooms(prev => 
      prev.map(room => 
        room.id === selectedRoom
          ? {
              ...room,
              lastMessage: newMessage,
              lastMessageTime: new Date().toISOString()
            }
          : room
      )
    );
    
    // Clear input
    setNewMessage('');
  };

  const filteredRooms = rooms.filter(room => 
    room.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading && rooms.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md flex h-[600px] overflow-hidden">
      {/* Sidebar */}
      <div className="w-1/3 border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Messages</h2>
          <div className="relative">
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {filteredRooms.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No conversations found
            </div>
          ) : (
            filteredRooms.map(room => (
              <div
                key={room.id}
                className={`p-4 flex items-start cursor-pointer hover:bg-gray-50 ${selectedRoom === room.id ? 'bg-gray-100' : ''}`}
                onClick={() => setSelectedRoom(room.id)}
              >
                <div className="relative">
                  {room.avatar ? (
                    <img
                      src={room.avatar}
                      alt={room.name}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold text-lg">
                      {room.name.charAt(0)}
                    </div>
                  )}
                  {room.isGroup && (
                    <div className="absolute -bottom-1 -right-1 bg-primary-100 rounded-full p-1 border-2 border-white">
                      <Users className="h-3 w-3 text-primary-600" />
                    </div>
                  )}
                </div>
                <div className="ml-3 flex-1 overflow-hidden">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-gray-900 truncate">{room.name}</h3>
                    {room.lastMessageTime && (
                      <span className="text-xs text-gray-500">
                        {new Date(room.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                  </div>
                  {room.lastMessage && (
                    <p className="text-sm text-gray-500 truncate">{room.lastMessage}</p>
                  )}
                </div>
                {room.unreadCount > 0 && (
                  <span className="ml-2 bg-primary-500 text-white text-xs rounded-full h-5 min-w-[20px] flex items-center justify-center px-1">
                    {room.unreadCount}
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      </div>
      
      {/* Chat Area */}
      <div className="w-2/3 flex flex-col">
        {selectedRoom ? (
          <>
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center">
                {rooms.find(r => r.id === selectedRoom)?.avatar ? (
                  <img
                    src={rooms.find(r => r.id === selectedRoom)?.avatar}
                    alt={rooms.find(r => r.id === selectedRoom)?.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold text-lg">
                    {rooms.find(r => r.id === selectedRoom)?.name.charAt(0)}
                  </div>
                )}
                <div className="ml-3">
                  <h3 className="font-medium text-gray-900">
                    {rooms.find(r => r.id === selectedRoom)?.name}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {rooms.find(r => r.id === selectedRoom)?.isGroup
                      ? `${rooms.find(r => r.id === selectedRoom)?.participants.length} participants`
                      : 'Online'}
                  </p>
                </div>
              </div>
              <div className="flex space-x-3">
                <button className="p-2 rounded-full hover:bg-gray-100">
                  <Phone className="h-5 w-5 text-gray-500" />
                </button>
                <button className="p-2 rounded-full hover:bg-gray-100">
                  <Video className="h-5 w-5 text-gray-500" />
                </button>
                <button className="p-2 rounded-full hover:bg-gray-100">
                  <MoreHorizontal className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            </div>
            
            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto">
              {loading ? (
                <div className="flex justify-center items-center h-full">
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary-600"></div>
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    {messages.map(message => {
                      const isCurrentUser = message.senderId === user?.id || message.senderId === 'current-user';
                      
                      return (
                        <div
                          key={message.id}
                          className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`flex ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'} items-end max-w-[75%]`}>
                            {!isCurrentUser && (
                              <div className="flex-shrink-0">
                                {message.senderAvatar ? (
                                  <img
                                    src={message.senderAvatar}
                                    alt={message.senderName}
                                    className="h-8 w-8 rounded-full object-cover"
                                  />
                                ) : (
                                  <div className="h-8 w-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold text-sm">
                                    {message.senderName.charAt(0)}
                                  </div>
                                )}
                              </div>
                            )}
                            <div
                              className={`mx-2 px-4 py-3 rounded-lg ${
                                isCurrentUser
                                  ? 'bg-primary-600 text-white'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {!isCurrentUser && (
                                <p className="text-xs text-gray-500 mb-1">{message.senderName}</p>
                              )}
                              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                              <p 
                                className={`text-xs mt-1 text-right ${
                                  isCurrentUser ? 'text-primary-100' : 'text-gray-500'
                                }`}
                              >
                                {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                </>
              )}
            </div>
            
            {/* Input Area */}
            <div className="p-4 border-t border-gray-200">
              <form onSubmit={handleSendMessage} className="flex items-center">
                <button
                  type="button"
                  className="p-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  <Paperclip className="h-5 w-5" />
                </button>
                <input
                  type="text"
                  placeholder="Type your message..."
                  className="flex-1 mx-3 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <button
                  type="submit"
                  className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none disabled:opacity-50"
                  disabled={!newMessage.trim()}
                >
                  <Send className="h-5 w-5" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Send className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No conversation selected</h3>
            <p className="text-gray-500 mt-1">
              Choose a conversation from the list or start a new one
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InternalChat;
