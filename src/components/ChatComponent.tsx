import React, { useState, useEffect, useRef } from 'react';
import { Send, MessageCircle, X, Minimize2 } from 'lucide-react';
import { useSocket, useSocketEvent, useSocketEmit } from '../context/SocketContext';
import { ChatMessageData, TypingIndicatorData, SOCKET_EVENTS } from '../types/socket';

interface ChatComponentProps {
  programId?: string;
  recipientId?: string;
  recipientName?: string;
  isOpen: boolean;
  onClose: () => void;
}

export const ChatComponent: React.FC<ChatComponentProps> = ({
  programId,
  recipientId,
  recipientName,
  isOpen,
  onClose
}) => {
  const [messages, setMessages] = useState<ChatMessageData[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const emit = useSocketEmit();
  const { socket } = useSocket();

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Join appropriate room on mount
  useEffect(() => {
    if (socket && programId) {
      emit(SOCKET_EVENTS.JOIN_PROGRAM, programId);
      
      return () => {
        emit(SOCKET_EVENTS.LEAVE_PROGRAM, programId);
      };
    }
  }, [socket, programId, emit]);

  // Listen for incoming messages
  useSocketEvent(SOCKET_EVENTS.CHAT_MESSAGE, (message: ChatMessageData) => {
    // Only add message if it's for this chat
    const isRelevant = (programId && message.programId === programId) ||
                      (recipientId && message.sender.id === recipientId);
    
    if (isRelevant) {
      setMessages(prev => [...prev, message]);
    }
  });

  // Listen for typing indicators
  useSocketEvent(SOCKET_EVENTS.CHAT_TYPING, (data: TypingIndicatorData) => {
    if (data.isTyping) {
      setTypingUsers(prev => [...prev.filter(id => id !== data.userId), data.userId]);
    } else {
      setTypingUsers(prev => prev.filter(id => id !== data.userId));
    }

    // Clear typing indicator after 3 seconds
    setTimeout(() => {
      setTypingUsers(prev => prev.filter(id => id !== data.userId));
    }, 3000);
  });

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const messageData = {
      message: newMessage.trim(),
      programId,
      recipientId
    };

    emit(SOCKET_EVENTS.CHAT_SEND, messageData);
    setNewMessage('');
    
    // Stop typing indicator
    if (isTyping) {
      setIsTyping(false);
      emit('chat:typing', {
        programId,
        recipientId,
        isTyping: false
      });
    }
  };

  const handleTyping = (value: string) => {
    setNewMessage(value);
    
    if (value.trim() && !isTyping) {
      setIsTyping(true);
      emit('chat:typing', {
        programId,
        recipientId,
        isTyping: true
      });
      
      // Clear typing after 2 seconds of no activity
      setTimeout(() => {
        setIsTyping(false);
        emit('chat:typing', {
          programId,
          recipientId,
          isTyping: false
        });
      }, 2000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed bottom-4 right-4 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50 ${
      isMinimized ? 'h-12' : 'h-96'
    } transition-all duration-300`}>
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b bg-blue-500 text-white rounded-t-lg">
        <div className="flex items-center space-x-2">
          <MessageCircle className="w-4 h-4" />
          <span className="font-medium text-sm">
            {recipientName || `Program Chat`}
          </span>
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 hover:bg-blue-600 rounded"
            title={isMinimized ? 'Expand' : 'Minimize'}
          >
            <Minimize2 className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-1 hover:bg-blue-600 rounded"
            title="Close chat"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 p-3 h-64 overflow-y-auto bg-gray-50">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 mt-8">
                <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No messages yet. Start the conversation!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender.id === socket?.id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg text-sm ${
                        message.sender.id === socket?.id
                          ? 'bg-blue-500 text-white'
                          : 'bg-white border border-gray-200'
                      }`}
                    >
                      {message.sender.id !== socket?.id && (
                        <div className="text-xs text-gray-500 mb-1">
                          {message.sender.name || message.sender.email}
                        </div>
                      )}
                      <div>{message.message}</div>
                      <div className={`text-xs mt-1 ${
                        message.sender.id === socket?.id ? 'text-blue-100' : 'text-gray-400'
                      }`}>
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
                {typingUsers.length > 0 && (
                  <div className="text-xs text-gray-500 italic">
                    {typingUsers.length === 1 ? 'Someone is typing...' : 'Multiple people are typing...'}
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-3 border-t">
            <div className="flex space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => handleTyping(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
