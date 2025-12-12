import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../../ui/Button';
import { Send, Bot, User, Info, Lightbulb, HelpCircle, Mic, Paperclip, AlertCircle } from 'lucide-react';
import apiService from '../../../lib/apiService';
import { ChatMessage } from '../../../types';

const ChatbotInterface: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const messageEndRef = useRef<HTMLDivElement>(null);
  
  // Load chat history when component mounts
  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        setIsLoading(true);
        const { data } = await apiService.getChatHistory();
        
        if (data.length === 0) {
          // If no chat history, add a welcome message
          setMessages([
            {
              id: '1',
              sender: 'bot',
              text: 'Hello! I\'m your service assistant. How can I help you today?',
              timestamp: new Date(),
              suggestions: [
                'Find services for elderly',
                'How to apply for benefits',
                'Check application status',
                'Document requirements'
              ]
            }
          ]);
        } else {
          setMessages(data);
        }
        setError(null);
      } catch (err) {
        console.error('Error fetching chat history:', err);
        setError('Failed to load chat history. Please try again.');
        // Add a fallback welcome message
        setMessages([
          {
            id: 'fallback',
            sender: 'bot',
            text: 'Hello! I\'m your service assistant. How can I help you today?',
            timestamp: new Date(),
            suggestions: [
              'Find services for elderly',
              'How to apply for benefits',
              'Check application status',
              'Document requirements'
            ]
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchChatHistory();
  }, []);
  
  // Auto scroll to the bottom when new messages arrive
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = async () => {
    if (inputValue.trim() === '') return;
    
    // Add user message to chat
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputValue,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    
    // Show typing indicator
    setIsTyping(true);
    const typingIndicator: ChatMessage = {
      id: 'typing-' + Date.now().toString(),
      sender: 'bot',
      text: '',
      timestamp: new Date(),
      isTyping: true
    };
    setMessages(prev => [...prev, typingIndicator]);
    
    try {
      // Send message to API and get response
      const botResponse = await apiService.sendChatMessage(userMessage.text);
      
      // Remove typing indicator and add bot response
      setMessages(prev => prev.filter(msg => !msg.isTyping).concat(botResponse));
    } catch (err) {
      console.error('Error sending message:', err);
      
      // Remove typing indicator and add error message
      const errorResponse: ChatMessage = {
        id: Date.now().toString(),
        sender: 'bot',
        text: 'Sorry, I encountered an error. Please try again later.',
        timestamp: new Date(),
        suggestions: ['Try again', 'Contact support']
      };
      setMessages(prev => prev.filter(msg => !msg.isTyping).concat(errorResponse));
    } finally {
      setIsTyping(false);
    }
  };
  
  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    handleSendMessage();
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  if (isLoading && messages.length === 0) {
    return (
      <div className="flex justify-center items-center h-[600px] rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          <p className="mt-4 text-slate-600">Loading conversation history...</p>
        </div>
      </div>
    );
  }
  
  if (error && messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[600px] rounded-lg border border-slate-200 bg-white shadow-sm">
        <AlertCircle className="h-12 w-12 text-error-500 mb-4" />
        <h3 className="text-lg font-medium text-slate-800">Error loading chat</h3>
        <p className="text-slate-600 mb-4">{error}</p>
        <Button 
          variant="outline" 
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-[600px] rounded-lg border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between rounded-t-lg">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center mr-3">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-slate-800">Service Assistant</h3>
            <p className="text-xs text-slate-500">Get help with services and applications</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="text-slate-500">
          <HelpCircle className="w-4 h-4" />
        </Button>
      </div>
      
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(message => (
          <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] ${message.sender === 'user' ? 'bg-primary-100 text-primary-900' : 'bg-slate-100 text-slate-800'} rounded-lg px-4 py-2`}>
              {/* Message header with icon */}
              <div className="flex items-center mb-1">
                {message.sender === 'bot' ? (
                  <>
                    <Bot className="w-3 h-3 mr-1 text-primary-600" />
                    <span className="text-xs font-medium text-primary-600">Assistant</span>
                  </>
                ) : (
                  <>
                    <User className="w-3 h-3 mr-1 text-slate-600" />
                    <span className="text-xs font-medium text-slate-600">You</span>
                  </>
                )}
                <span className="text-xs text-slate-400 ml-auto">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
                {/* Message content */}
              {message.isTyping ? (
                <div className="flex space-x-1 items-center py-2">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-0"></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200"></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-400"></div>
                </div>
              ) : (
                <p className="text-sm whitespace-pre-wrap">{message.text}</p>
              )}
              
              {/* Attachments if any */}
              {message.attachments && message.attachments.length > 0 && (
                <div className="mt-2 space-y-1">
                  {message.attachments.map((attachment, index) => (
                    <div key={index} className="flex items-center text-xs bg-white rounded p-1 text-slate-600">
                      <Paperclip className="w-3 h-3 mr-1" />
                      <span className="truncate">{attachment}</span>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Suggestions */}
              {message.sender === 'bot' && message.suggestions && message.suggestions.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {message.suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="text-xs bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-2 py-1 rounded-full flex items-center"
                      type="button"
                    >
                      <Lightbulb className="w-3 h-3 mr-1 text-primary-500" />
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messageEndRef} />
      </div>
      
      {/* Input area */}
      <div className="p-4 border-t border-slate-200 bg-slate-50">
        <div className="flex items-center">
          <Button variant="ghost" size="sm" className="text-slate-500 mr-2" type="button">
            <Paperclip className="w-4 h-4" />
          </Button>          <textarea
            className="flex-1 border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm resize-none min-h-[40px] max-h-[120px]"
            placeholder="Type a message..."
            rows={1}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <div className="flex ml-2">
            <Button variant="ghost" size="sm" className="text-slate-500 mr-2" type="button">
              <Mic className="w-4 h-4" />
            </Button>
            <Button 
              variant="primary" 
              size="sm" 
              disabled={inputValue.trim() === '' || isTyping}
              onClick={handleSendMessage}
              type="button"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        {/* Privacy notice */}
        <div className="flex items-center justify-center mt-3 text-xs text-slate-500">
          <Info className="w-3 h-3 mr-1" />
          <span>Conversations are stored to improve our service quality</span>
        </div>
      </div>
    </div>
  );
};

export default ChatbotInterface;
