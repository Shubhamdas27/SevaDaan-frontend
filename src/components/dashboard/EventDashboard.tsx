import React, { useState, useEffect } from 'react';
import { EventService, EventData, EventRegistrationData } from '../../services/eventService';

interface EventDashboardProps {
  ngoId: string;
}

const EventDashboard: React.FC<EventDashboardProps> = ({ ngoId }) => {
  const [events, setEvents] = useState<EventData[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);
  const [registrations, setRegistrations] = useState<EventRegistrationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'events' | 'registrations' | 'analytics'>('events');
  const [showEventForm, setShowEventForm] = useState(false);

  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    type: 'workshop' as const,
    category: 'education' as const,
    startDate: '',
    endDate: '',
    location: {
      type: 'physical' as 'physical' | 'online' | 'hybrid',
      address: '',
      city: '',
      state: '',
      country: '',
      onlineLink: '',
      platform: ''
    },
    maxParticipants: 0,
    registrationDeadline: '',
    registrationFee: 0,
    requirements: [] as string[],
    tags: [] as string[],
    isPublic: true
  });

  useEffect(() => {
    loadEvents();
  }, [ngoId]);

  useEffect(() => {
    if (selectedEvent) {
      loadEventRegistrations(selectedEvent.id!);
    }
  }, [selectedEvent]);

  const loadEvents = async () => {
    try {
      const response = await EventService.getEvents(ngoId, { limit: 20 });
      setEvents(response.events);
    } catch (error) {
      console.error('Error loading events:', error);
      alert('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const loadEventRegistrations = async (eventId: string) => {
    try {
      const response = await EventService.getEventRegistrations(ngoId, eventId, { limit: 50 });
      setRegistrations(response.registrations);
    } catch (error) {
      console.error('Error loading registrations:', error);
      alert('Failed to load registrations');
    }
  };

  const handleEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newEvent = await EventService.createEvent(ngoId, eventForm);
      setEvents(prev => [newEvent, ...prev]);
      setShowEventForm(false);
      resetEventForm();
      alert('Event created successfully');
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Failed to create event');
    }
  };

  const resetEventForm = () => {
    setEventForm({
      title: '',
      description: '',
      type: 'workshop',
      category: 'education',
      startDate: '',
      endDate: '',
      location: {
        type: 'physical',
        address: '',
        city: '',
        state: '',
        country: '',
        onlineLink: '',
        platform: ''
      },
      maxParticipants: 0,
      registrationDeadline: '',
      registrationFee: 0,
      requirements: [],
      tags: [],
      isPublic: true
    });
  };

  const publishEvent = async (eventId: string) => {
    try {
      const updatedEvent = await EventService.publishEvent(ngoId, eventId);
      setEvents(prev => prev.map(e => e.id === eventId ? updatedEvent : e));
      alert('Event published successfully');
    } catch (error) {
      console.error('Error publishing event:', error);
      alert('Failed to publish event');
    }
  };

  const cancelEvent = async (eventId: string) => {
    if (!confirm('Are you sure you want to cancel this event?')) return;

    try {
      const updatedEvent = await EventService.cancelEvent(ngoId, eventId, 'Cancelled by admin');
      setEvents(prev => prev.map(e => e.id === eventId ? updatedEvent : e));
      alert('Event cancelled successfully');
    } catch (error) {
      console.error('Error cancelling event:', error);
      alert('Failed to cancel event');
    }
  };

  const markAttendance = async (registrationId: string, attended: boolean) => {
    try {
      await EventService.markAttendance(ngoId, selectedEvent!.id!, registrationId, attended);
      setRegistrations(prev => prev.map(r => 
        r.id === registrationId 
          ? { ...r, status: attended ? 'attended' : 'no-show' as const }
          : r
      ));
      alert(`Attendance ${attended ? 'marked' : 'unmarked'} successfully`);
    } catch (error) {
      console.error('Error marking attendance:', error);
      alert('Failed to mark attendance');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Event Management</h1>
        <p className="text-gray-600">Manage your organization's events, registrations, and attendance</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'events', label: 'Events' },
            { id: 'registrations', label: 'Registrations' },
            { id: 'analytics', label: 'Analytics' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Events Tab */}
      {activeTab === 'events' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Events</h2>
            <button
              onClick={() => setShowEventForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Event
            </button>
          </div>

          {/* Event Form Modal */}
          {showEventForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-screen overflow-y-auto">
                <h3 className="text-lg font-semibold mb-4">Create New Event</h3>
                <form onSubmit={handleEventSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                      <input
                        type="text"
                        value={eventForm.title}
                        onChange={(e) => setEventForm(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        placeholder="Enter event title"
                        aria-label="Event title"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea
                        value={eventForm.description}
                        onChange={(e) => setEventForm(prev => ({ ...prev, description: e.target.value }))}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        placeholder="Enter event description"
                        aria-label="Event description"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                      <select
                        value={eventForm.type}
                        onChange={(e) => setEventForm(prev => ({ ...prev, type: e.target.value as any }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        aria-label="Event type"
                        title="Select event type"
                      >
                        <option value="workshop">Workshop</option>
                        <option value="fundraiser">Fundraiser</option>
                        <option value="community">Community</option>
                        <option value="volunteer">Volunteer</option>
                        <option value="awareness">Awareness</option>
                        <option value="training">Training</option>
                        <option value="meeting">Meeting</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                      <select
                        value={eventForm.category}
                        onChange={(e) => setEventForm(prev => ({ ...prev, category: e.target.value as any }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        aria-label="Event category"
                        title="Select event category"
                      >
                        <option value="education">Education</option>
                        <option value="health">Health</option>
                        <option value="environment">Environment</option>
                        <option value="social">Social</option>
                        <option value="technology">Technology</option>
                        <option value="arts">Arts</option>
                        <option value="sports">Sports</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                      <input
                        type="datetime-local"
                        value={eventForm.startDate}
                        onChange={(e) => setEventForm(prev => ({ ...prev, startDate: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        aria-label="Event start date"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                      <input
                        type="datetime-local"
                        value={eventForm.endDate}
                        onChange={(e) => setEventForm(prev => ({ ...prev, endDate: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        aria-label="Event end date"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Location Type</label>
                      <select
                        value={eventForm.location.type}
                        onChange={(e) => setEventForm(prev => ({ 
                          ...prev, 
                          location: { ...prev.location, type: e.target.value as any }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        aria-label="Location type"
                        title="Select location type"
                      >
                        <option value="physical">Physical</option>
                        <option value="online">Online</option>
                        <option value="hybrid">Hybrid</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Max Participants</label>
                      <input
                        type="number"
                        value={eventForm.maxParticipants}
                        onChange={(e) => setEventForm(prev => ({ ...prev, maxParticipants: parseInt(e.target.value) || 0 }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min="0"
                        placeholder="0 for unlimited"
                        aria-label="Maximum participants"
                      />
                    </div>
                    {eventForm.location.type !== 'online' && (
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                        <input
                          type="text"
                          value={eventForm.location.address}
                          onChange={(e) => setEventForm(prev => ({ 
                            ...prev, 
                            location: { ...prev.location, address: e.target.value }
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter event address"
                          aria-label="Event address"
                        />
                      </div>
                    )}
                    {eventForm.location.type !== 'physical' && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Online Link</label>
                          <input
                            type="url"
                            value={eventForm.location.onlineLink}
                            onChange={(e) => setEventForm(prev => ({ 
                              ...prev, 
                              location: { ...prev.location, onlineLink: e.target.value }
                            }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="https://..."
                            aria-label="Online meeting link"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Platform</label>
                          <input
                            type="text"
                            value={eventForm.location.platform}
                            onChange={(e) => setEventForm(prev => ({ 
                              ...prev, 
                              location: { ...prev.location, platform: e.target.value }
                            }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., Zoom, Teams, Meet"
                            aria-label="Online platform"
                          />
                        </div>
                      </>
                    )}
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={eventForm.isPublic}
                      onChange={(e) => setEventForm(prev => ({ ...prev, isPublic: e.target.checked }))}
                      className="mr-2"
                      aria-label="Make event public"
                      title="Make event public"
                    />
                    <label className="text-sm font-medium text-gray-700">Make this event public</label>
                  </div>

                  <div className="flex justify-end space-x-4 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowEventForm(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Create Event
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Events List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div key={event.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold line-clamp-2">{event.title}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    event.status === 'published' ? 'bg-green-100 text-green-800' :
                    event.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                    event.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {event.status}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-2 line-clamp-3">{event.description}</p>
                <div className="text-sm text-gray-500 space-y-1">
                  <p>📅 {new Date(event.startDate).toLocaleDateString()}</p>
                  <p>📍 {event.location.type === 'online' ? 'Online' : event.location.address}</p>
                  <p>👥 {event.registeredCount || 0} registered</p>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <button
                    onClick={() => setSelectedEvent(event)}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    View Details
                  </button>
                  <div className="space-x-2">
                    {event.status === 'draft' && (
                      <button
                        onClick={() => publishEvent(event.id!)}
                        className="text-green-600 hover:text-green-800 text-sm"
                      >
                        Publish
                      </button>
                    )}
                    {event.status !== 'cancelled' && (
                      <button
                        onClick={() => cancelEvent(event.id!)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Registrations Tab */}
      {activeTab === 'registrations' && (
        <div>
          {selectedEvent ? (
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Registrations for: {selectedEvent.title}</h2>
                <p className="text-gray-600">Manage event registrations and attendance</p>
              </div>

              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Participant
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Registered
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {registrations.map((registration) => (
                      <tr key={registration.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {registration.participantName}
                            </div>
                            {registration.participantPhone && (
                              <div className="text-sm text-gray-500">
                                {registration.participantPhone}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {registration.participantEmail}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            registration.status === 'attended' ? 'bg-green-100 text-green-800' :
                            registration.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                            registration.status === 'registered' ? 'bg-yellow-100 text-yellow-800' :
                            registration.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {registration.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(registration.registeredAt!).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          {registration.status !== 'attended' && (
                            <button
                              onClick={() => markAttendance(registration.id!, true)}
                              className="text-green-600 hover:text-green-900"
                            >
                              Mark Present
                            </button>
                          )}
                          {registration.status === 'attended' && (
                            <button
                              onClick={() => markAttendance(registration.id!, false)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Mark Absent
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">Select an event to view its registrations</p>
            </div>
          )}
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Event Analytics</h2>
          <p className="text-gray-600">Event analytics features coming soon...</p>
        </div>
      )}
    </div>
  );
};

export default EventDashboard;
