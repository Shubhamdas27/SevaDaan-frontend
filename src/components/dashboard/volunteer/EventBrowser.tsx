import React, { useState, useEffect } from 'react';
import { Search, Filter, MapPin, Calendar, Clock, ChevronDown, ChevronUp, ArrowRight, Users, Tag } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

interface VolunteerEvent {
  id: string;
  title: string;
  ngoId: string;
  ngoName: string;
  description: string;
  location: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'open' | 'filled' | 'registered' | 'completed' | 'cancelled';
  requiredVolunteers: number;
  currentVolunteers: number;
  skills: string[];
  imageUrl?: string;
  category: string;
  hours: number;
}

const EventBrowser: React.FC = () => {
  const [events, setEvents] = useState<VolunteerEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<VolunteerEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);

  // Mock data - in a real app, fetch from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Simulate API call delay
        setTimeout(() => {
          const mockEvents: VolunteerEvent[] = [
            {
              id: 'evt-1',
              title: 'Tree Plantation Drive',
              ngoId: 'ngo-1',
              ngoName: 'Green Earth Foundation',
              description: 'Join us for a tree plantation drive to increase the green cover in urban areas. We will be planting native species to support local biodiversity. No prior experience required, training will be provided on-site.',
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
              hours: 3
            },
            {
              id: 'evt-2',
              title: 'Teach For Change',
              ngoId: 'ngo-2',
              ngoName: 'Education For All',
              description: 'Volunteer as a teacher for underprivileged children. Help them with basic subjects like mathematics, science, and English. Teaching materials will be provided.',
              location: 'Community Center, Dadar',
              date: '2025-06-20',
              startTime: '16:00',
              endTime: '18:00',
              status: 'open',
              requiredVolunteers: 10,
              currentVolunteers: 3,
              skills: ['Teaching', 'Communication', 'Patience'],
              imageUrl: '/images/events/teaching.jpg',
              category: 'Education',
              hours: 2
            },
            {
              id: 'evt-3',
              title: 'Food Distribution Camp',
              ngoId: 'ngo-3',
              ngoName: 'Helping Hands',
              description: 'Distribute food packages to homeless people and families in need. We need volunteers to help with packaging, distribution, and coordination.',
              location: 'Central Railway Station, Mumbai',
              date: '2025-06-10',
              startTime: '18:00',
              endTime: '20:00',
              status: 'registered',
              requiredVolunteers: 15,
              currentVolunteers: 15,
              skills: ['Organization', 'Communication'],
              imageUrl: '/images/events/food-distribution.jpg',
              category: 'Hunger Relief',
              hours: 2
            },
            {
              id: 'evt-4',
              title: 'Senior Citizen Support',
              ngoId: 'ngo-4',
              ngoName: 'Care For Elderly',
              description: 'Spend time with elderly residents at a senior living facility. Activities include reading books, playing board games, and general companionship.',
              location: 'Sunshine Senior Home, Andheri',
              date: '2025-06-12',
              startTime: '10:00',
              endTime: '13:00',
              status: 'registered',
              requiredVolunteers: 8,
              currentVolunteers: 5,
              skills: ['Empathy', 'Communication', 'Patience'],
              imageUrl: '/images/events/elderly-care.jpg',
              category: 'Healthcare',
              hours: 3
            },
            {
              id: 'evt-5',
              title: 'Beach Cleanup Drive',
              ngoId: 'ngo-1',
              ngoName: 'Green Earth Foundation',
              description: 'Help clean up one of Mumbai\'s beaches to protect marine life and improve the environment. Cleaning equipment will be provided.',
              location: 'Juhu Beach, Mumbai',
              date: '2025-05-25',
              startTime: '07:00',
              endTime: '10:00',
              status: 'completed',
              requiredVolunteers: 30,
              currentVolunteers: 28,
              skills: ['Physical Activity', 'Environmental Awareness'],
              imageUrl: '/images/events/beach-cleanup.jpg',
              category: 'Environment',
              hours: 3
            },
            {
              id: 'evt-6',
              title: 'Art Workshop for Children',
              ngoId: 'ngo-5',
              ngoName: 'Creative Minds',
              description: 'Conduct an art workshop for children from underserved communities. Help nurture their creativity and provide guidance on various art forms.',
              location: 'Children\'s Community Center, Bandra',
              date: '2025-06-18',
              startTime: '15:00',
              endTime: '17:00',
              status: 'open',
              requiredVolunteers: 5,
              currentVolunteers: 2,
              skills: ['Creativity', 'Teaching', 'Patience'],
              imageUrl: '/images/events/art-workshop.jpg',
              category: 'Education',
              hours: 2
            }
          ];

          setEvents(mockEvents);
          setFilteredEvents(mockEvents);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching events', error);
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Filter events based on search query and filters
  useEffect(() => {
    let result = [...events];
    
    // Apply status filter if not 'all'
    if (filterStatus !== 'all') {
      result = result.filter(event => event.status === filterStatus);
    }
    
    // Apply category filter if not 'all'
    if (filterCategory !== 'all') {
      result = result.filter(event => event.category === filterCategory);
    }
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(event => 
        event.title.toLowerCase().includes(query) ||
        event.ngoName.toLowerCase().includes(query) ||
        event.description.toLowerCase().includes(query) ||
        event.location.toLowerCase().includes(query)
      );
    }
    
    setFilteredEvents(result);
  }, [searchQuery, filterStatus, filterCategory, events]);

  // Get unique categories
  const categories = ['all', ...new Set(events.map(event => event.category))];
  
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const getEventStatusLabel = (status: string): string => {
    switch (status) {
      case 'open':
        return 'Open for Registration';
      case 'filled':
        return 'Fully Booked';
      case 'registered':
        return 'Registered';
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };
  
  const getEventStatusColor = (status: string): string => {
    switch (status) {
      case 'open':
        return 'bg-green-100 text-green-800';
      case 'filled':
        return 'bg-amber-100 text-amber-800';
      case 'registered':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const toggleExpanded = (id: string) => {
    setExpandedEventId(expandedEventId === id ? null : id);
  };

  const handleRegister = (eventId: string) => {
    // In a real app, call API to register
    setEvents(prev => 
      prev.map(event => 
        event.id === eventId 
          ? { 
              ...event, 
              status: 'registered', 
              currentVolunteers: event.currentVolunteers + 1 
            } 
          : event
      )
    );
  };

  const handleCancel = (eventId: string) => {
    // In a real app, call API to cancel registration
    setEvents(prev => 
      prev.map(event => 
        event.id === eventId 
          ? { 
              ...event, 
              status: 'open', 
              currentVolunteers: event.currentVolunteers - 1 
            } 
          : event
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
        <div className="relative w-full sm:w-auto sm:min-w-[300px]">
          <input
            type="text"
            placeholder="Search events..."
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        </div>
        
        <div className="flex space-x-2 w-full sm:w-auto">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <Filter className="h-4 w-4 mr-1" />
            Filters
            {isFilterOpen ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />}
          </Button>
          <select
            className="rounded-md border border-gray-300 text-sm py-2 px-3 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 pr-8"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            aria-label="Filter by status"
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="registered">Registered</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>
      
      {/* Extended Filters */}
      {isFilterOpen && (
        <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                className="w-full rounded-md border border-gray-300 text-sm py-2 px-3 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                aria-label="Filter by category"
              >
                <option value="all">All Categories</option>
                {categories.filter(cat => cat !== 'all').map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <>
          {filteredEvents.length === 0 ? (
            <div className="text-center py-10">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <Calendar className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
              <p className="text-gray-500 mb-6">
                {searchQuery || filterStatus !== 'all' || filterCategory !== 'all'
                  ? 'Try changing your search or filter criteria'
                  : 'There are no volunteer events available at this time'}
              </p>
              <Button variant="primary">Explore All Categories</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredEvents.map(event => (
                <div 
                  key={event.id} 
                  className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="relative h-40 bg-gray-200">
                    {event.imageUrl ? (
                      <img 
                        src={event.imageUrl} 
                        alt={event.title} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full bg-gray-200">
                        <Calendar className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                    <span 
                      className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${getEventStatusColor(event.status)}`}
                    >
                      {getEventStatusLabel(event.status)}
                    </span>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                      <h3 className="text-lg font-semibold text-white">{event.title}</h3>
                      <p className="text-sm text-white/90">{event.ngoName}</p>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex flex-col space-y-2 mb-4">
                      <div className="flex items-start">
                        <Calendar className="h-4 w-4 text-gray-500 mt-0.5 mr-2" />
                        <span className="text-sm text-gray-700">{formatDate(event.date)} • {event.startTime} - {event.endTime}</span>
                      </div>
                      <div className="flex items-start">
                        <MapPin className="h-4 w-4 text-gray-500 mt-0.5 mr-2" />
                        <span className="text-sm text-gray-700">{event.location}</span>
                      </div>
                      <div className="flex items-start">
                        <Users className="h-4 w-4 text-gray-500 mt-0.5 mr-2" />
                        <span className="text-sm text-gray-700">{event.currentVolunteers} of {event.requiredVolunteers} volunteers</span>
                      </div>
                      <div className="flex items-start">
                        <Clock className="h-4 w-4 text-gray-500 mt-0.5 mr-2" />
                        <span className="text-sm text-gray-700">{event.hours} hours</span>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {event.description}
                      </p>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {event.skills.map((skill, index) => (
                        <span 
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                        >
                          <Tag className="h-3 w-3 mr-1" />
                          {skill}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <button
                        className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center"
                        onClick={() => toggleExpanded(event.id)}
                      >
                        {expandedEventId === event.id ? 'Show less' : 'Show more'}
                        {expandedEventId === event.id ? (
                          <ChevronUp className="h-4 w-4 ml-1" />
                        ) : (
                          <ChevronDown className="h-4 w-4 ml-1" />
                        )}
                      </button>
                      
                      {event.status === 'open' && (
                        <Button 
                          variant="primary"
                          size="sm"
                          onClick={() => handleRegister(event.id)}
                        >
                          Register
                        </Button>
                      )}
                      
                      {event.status === 'registered' && (
                        <Button 
                          variant="outline"
                          size="sm"
                          onClick={() => handleCancel(event.id)}
                        >
                          Cancel Registration
                        </Button>
                      )}
                      
                      {event.status === 'completed' && (
                        <Button 
                          variant="outline"
                          size="sm"
                          disabled
                        >
                          Completed
                        </Button>
                      )}
                    </div>
                    
                    {/* Expanded Details */}
                    {expandedEventId === event.id && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">Event Details</h4>
                        <p className="text-sm text-gray-700 mb-4">
                          {event.description}
                        </p>
                        
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">Skills Required</h4>
                        <ul className="list-disc list-inside text-sm text-gray-700 mb-4">
                          {event.skills.map((skill, index) => (
                            <li key={index}>{skill}</li>
                          ))}
                        </ul>
                        
                        <div className="flex justify-end">
                          <Button variant="ghost" size="sm">
                            View NGO Profile <ArrowRight className="h-4 w-4 ml-1" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default EventBrowser;
