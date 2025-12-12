import React, { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/Badge';

// Mock volunteer schedule data
interface VolunteerEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  volunteerName: string;
  location: string;
  description?: string;
  color?: string;
}

const VolunteerScheduler: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events] = useState<VolunteerEvent[]>([
    {
      id: '1',
      title: 'Health Camp Assistance',
      start: new Date(2025, 5, 15, 9, 0),
      end: new Date(2025, 5, 15, 14, 0),
      volunteerName: 'Priya Singh',
      location: 'Community Center, Mumbai',
      color: '#0284c7'
    },
    {
      id: '2',
      title: 'Teaching Session',
      start: new Date(2025, 5, 10, 10, 0),
      end: new Date(2025, 5, 10, 12, 0),
      volunteerName: 'Rahul Sharma',
      location: 'Primary School, Delhi',
      color: '#10b981'
    },
    {
      id: '3',
      title: 'Food Distribution',
      start: new Date(2025, 5, 8, 8, 0),
      end: new Date(2025, 5, 8, 11, 0),
      volunteerName: 'Amit Patel',
      location: 'Slum Area, Kolkata',
      color: '#f59e0b'
    },
    {
      id: '4',
      title: 'Elderly Care Visit',
      start: new Date(2025, 5, 12, 14, 0),
      end: new Date(2025, 5, 12, 16, 0),
      volunteerName: 'Neha Gupta',
      location: 'Senior Home, Chennai',
      color: '#8b5cf6'
    },
    {
      id: '5',
      title: 'Tree Plantation Drive',
      start: new Date(2025, 5, 20, 9, 0),
      end: new Date(2025, 5, 20, 13, 0),
      volunteerName: 'Vikram Singh',
      location: 'City Park, Bangalore',
      color: '#22c55e'
    }
  ]);
  
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<VolunteerEvent | null>(null);

  useEffect(() => {
    // For simplicity, we're using hardcoded events
    // In a real app, this would fetch from your API based on the current month
  }, [currentDate]);

  // Calendar navigation
  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Calculate calendar days
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // First day of the month
    const firstDay = new Date(year, month, 1);
    const firstDayOfWeek = firstDay.getDay(); // 0 = Sunday, 1 = Monday, etc.

    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);
    const lastDate = lastDay.getDate();

    // Generate calendar grid
    const calendarDays = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      calendarDays.push(null);
    }

    // Add cells for each day of the month
    for (let day = 1; day <= lastDate; day++) {
      calendarDays.push(new Date(year, month, day));
    }

    return calendarDays;
  };

  const calendarDays = generateCalendarDays();

  // Filter events for a specific day
  const getEventsForDay = (date: Date) => {
    if (!date) return [];

    return events.filter(event => {
      const eventDate = new Date(event.start);
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      );
    });
  };

  // Format date for display
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', { 
      month: 'long', 
      year: 'numeric' 
    }).format(date);
  };

  const formatEventTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true
    }).format(date);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Volunteer Schedule</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={previousMonth}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="px-2 py-1 font-medium">{formatDate(currentDate)}</span>
            <Button variant="outline" size="sm" onClick={nextMonth}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
            <div key={index} className="text-center text-sm font-medium py-1">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, index) => {
            if (!day) {
              return <div key={`empty-${index}`} className="h-24 bg-slate-50 rounded"></div>;
            }

            const dayEvents = getEventsForDay(day);
            const isToday = new Date().toDateString() === day.toDateString();
            const isSelected = selectedDate?.toDateString() === day.toDateString();

            return (
              <div 
                key={index} 
                className={`h-24 p-1 rounded cursor-pointer border overflow-hidden ${
                  isToday ? 'bg-primary-50 border-primary-200' : 
                  isSelected ? 'bg-slate-100 border-slate-300' : 'border-slate-100 hover:bg-slate-50'
                }`}
                onClick={() => {
                  setSelectedDate(day);
                  setSelectedEvent(null);
                }}
              >
                <div className="text-right text-sm font-medium mb-1">
                  {day.getDate()}
                </div>
                <div className="space-y-1">
                  {dayEvents.slice(0, 2).map((event, eventIndex) => (
                    <div 
                      key={eventIndex} 
                      className="text-xs truncate px-1 py-1 rounded-sm"
                      style={{ backgroundColor: `${event.color}20`, color: event.color }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedEvent(event);
                        setSelectedDate(day);
                      }}
                    >
                      {formatEventTime(event.start).replace(/\s/g, '')} {event.title}
                    </div>
                  ))}
                  {dayEvents.length > 2 && (
                    <div className="text-xs text-center text-slate-500">
                      +{dayEvents.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {selectedDate && (
          <div className="mt-6 border-t pt-4">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-medium">
                {new Intl.DateTimeFormat('en-US', { 
                  weekday: 'long',
                  month: 'long', 
                  day: 'numeric',
                  year: 'numeric'
                }).format(selectedDate)}
              </h4>
              <Button variant="outline" size="sm">
                <Calendar className="w-4 h-4 mr-2" /> Add Event
              </Button>
            </div>

            {selectedEvent ? (
              <div className="bg-white p-4 rounded-lg border">
                <div className="flex justify-between">
                  <h3 className="font-medium">{selectedEvent.title}</h3>
                  <Badge style={{ backgroundColor: `${selectedEvent.color}20`, color: selectedEvent.color }}>
                    Scheduled
                  </Badge>
                </div>
                <div className="mt-2 space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span>
                      {formatEventTime(selectedEvent.start)} - {formatEventTime(selectedEvent.end)}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-600">Volunteer:</span> {selectedEvent.volunteerName}
                  </div>
                  <div>
                    <span className="text-slate-600">Location:</span> {selectedEvent.location}
                  </div>
                  {selectedEvent.description && (
                    <div className="pt-2 text-slate-600">{selectedEvent.description}</div>
                  )}
                </div>
                <div className="mt-4 flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => setSelectedEvent(null)}>
                    Close
                  </Button>
                  <Button variant="primary" size="sm">
                    Edit
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                {getEventsForDay(selectedDate).length > 0 ? (
                  <div className="space-y-2">
                    {getEventsForDay(selectedDate).map((event, index) => (
                      <div 
                        key={index}
                        className="p-2 rounded border cursor-pointer hover:bg-slate-50"
                        onClick={() => setSelectedEvent(event)}
                      >
                        <div className="flex justify-between">
                          <span className="font-medium">{event.title}</span>
                          <span className="text-xs text-slate-500">
                            {formatEventTime(event.start)} - {formatEventTime(event.end)}
                          </span>
                        </div>
                        <div className="text-xs text-slate-600 mt-1">
                          {event.volunteerName} • {event.location}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-slate-500">
                    No volunteer events scheduled for this day.
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VolunteerScheduler;
