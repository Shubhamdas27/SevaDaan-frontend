import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/common/Layout';
import { Program } from '../types';
import { usePrograms } from '../hooks/useApiHooks';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Spinner } from '../components/ui/Spinner';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Icons } from '../components/icons';

const Programs: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const { programs, loading, error, fetchPrograms } = usePrograms();
  const [filteredPrograms, setFilteredPrograms] = useState<Program[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [programTypeFilter, setProgramTypeFilter] = useState<string>('all');
  
  // Location autocomplete states
  const [locationSuggestions, setLocationSuggestions] = useState<string[]>([]);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const locationInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Fetch programs when component mounts, with ngoId filter if available
    if (id) {
      fetchPrograms({ ngoId: id });
    } else {
      fetchPrograms();
    }
  }, [id, fetchPrograms]);

  // Get the programs data, filtering by NGO id if provided
  const allPrograms = React.useMemo(() => {
    if (!programs) return [];
    
    // If id parameter exists, filter by NGO id
    if (id) {
      return programs.filter((program: Program) => program.ngoId === id);
    }
    
    return programs;
  }, [programs, id]);

  useEffect(() => {
    let result = allPrograms;
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (program: Program) => 
          program.title.toLowerCase().includes(query) || 
          program.description.toLowerCase().includes(query)
      );
    }
    
    if (locationFilter) {
      result = result.filter((program: Program) => 
        program.location.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }
    
    if (statusFilter !== 'all') {
      result = result.filter((program: Program) => program.status === statusFilter);
    }
    
    if (programTypeFilter !== 'all') {
      result = result.filter((program: Program) => 
        (program as any).programType === programTypeFilter
      );
    }
    
    setFilteredPrograms(result);
  }, [searchQuery, locationFilter, statusFilter, programTypeFilter, allPrograms]);

  const uniqueLocations = [...new Set(allPrograms.map((program: Program) => program.location))];
  
  // Common Indian cities for location suggestions
  const commonCities = [
    'Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 
    'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur',
    'Indore', 'Bhopal', 'Patna', 'Vadodara', 'Ghaziabad', 'Ludhiana',
    'Agra', 'Nashik', 'Faridabad', 'Meerut', 'Rajkot', 'Varanasi',
    'Srinagar', 'Jodhpur', 'Amritsar', 'Raipur', 'Allahabad', 'Coimbatore',
    'Jabalpur', 'Gwalior', 'Vijayawada', 'Bhubaneswar', 'Cuttack',
    'Brahmapur', 'Rourkela', 'Sambalpur', 'Puri', 'Balasore'
  ];
  
  // Merge real data with common cities and remove duplicates
  const availableLocations = [...new Set([...uniqueLocations, ...commonCities])].sort();

  // Location autocomplete handlers
  const handleLocationChange = (value: string) => {
    setLocationFilter(value);
    
    if (value.length > 0) {
      const filtered = availableLocations.filter(location =>
        location.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 8); // Show max 8 suggestions
      setLocationSuggestions(filtered);
      setShowLocationDropdown(true);
    } else {
      setLocationSuggestions([]);
      setShowLocationDropdown(false);
    }
  };

  const handleLocationSelect = (location: string) => {
    setLocationFilter(location);
    setShowLocationDropdown(false);
  };

  const handleLocationKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setShowLocationDropdown(false);
    } else if (e.key === 'Enter' && locationSuggestions.length > 0) {
      e.preventDefault();
      handleLocationSelect(locationSuggestions[0]);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (locationInputRef.current && !locationInputRef.current.contains(event.target as Node)) {
        setShowLocationDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <Layout>
      <div className="bg-gradient-to-br from-primary-900 to-primary-700 py-16 text-white">
        <div className="container">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {id ? 'NGO Programs' : 'Explore Programs'}
          </h1>
          <p className="text-white/90 max-w-3xl">
            {id 
              ? 'Browse programs and initiatives offered by this NGO to support communities across India.'
              : 'Discover programs and initiatives that are making a positive impact in communities across India.'}
          </p>
        </div>
      </div>
      
      <div className="container py-8">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-grow">
            <Icons.search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search programs..."
              className="input pl-10 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Icons.location className="text-slate-500" />
            <div className="relative" ref={locationInputRef}>
              <input
                type="text"
                value={locationFilter}
                onChange={(e) => handleLocationChange(e.target.value)}
                onKeyDown={handleLocationKeyDown}
                onFocus={() => {
                  if (locationFilter.length > 0) {
                    handleLocationChange(locationFilter);
                  }
                }}
                placeholder="Search locations..."
                className="input min-w-[150px] pr-10"
                autoComplete="off"
              />
              <Icons.chevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              
              {/* Location Autocomplete Dropdown */}
              {showLocationDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-48 overflow-y-auto z-50">
                  {locationSuggestions.length > 0 ? (
                    locationSuggestions.map((location, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleLocationSelect(location)}
                        className="w-full text-left px-4 py-2 text-slate-700 hover:bg-primary-50 hover:text-primary-700 first:rounded-t-lg last:rounded-b-lg border-b border-gray-100 last:border-b-0 transition-colors"
                      >
                        {location}
                      </button>
                    ))
                  ) : locationFilter.length > 0 ? (
                    <div className="px-4 py-3 text-slate-500 text-sm text-center">
                      No locations found matching "{locationFilter}"
                    </div>
                  ) : (
                    <div className="px-4 py-3 text-slate-500 text-sm text-center">
                      Type to search locations...
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Icons.filter className="text-slate-500" />
            <select 
              className="input"
              value={programTypeFilter}
              onChange={(e) => setProgramTypeFilter(e.target.value)}
              aria-label="Filter by program type"
            >
              <option value="all">All Programs</option>
              <option value="regular">Regular Programs</option>
              <option value="event">Events</option>
              <option value="training">Training</option>
              <option value="workshop">Workshops</option>
              <option value="awareness">Awareness</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <Icons.filter className="text-slate-500" />
            <select 
              className="input"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="Filter by status"
            >
              <option value="all">All Statuses</option>
              <option value="upcoming">Upcoming</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">Error loading programs: {error}</p>
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </div>
        ) : filteredPrograms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredPrograms.map((program) => (
              <Card key={program.id} isHoverable>
                <CardContent className="p-0">
                  <div className="h-48 overflow-hidden relative">
                    <img
                      src={program.imageUrl || 'https://images.pexels.com/photos/6646968/pexels-photo-6646968.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'}
                      alt={program.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3">
                      <StatusBadge status={program.status} variant="solid" size="sm" />
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{program.title}</h3>
                    <div className="flex items-center text-sm text-slate-500 mb-2">
                      <Icons.calendar className="w-4 h-4 mr-1" />
                      <span>
                        {formatDate(program.startDate)}
                        {program.endDate ? ` - ${formatDate(program.endDate)}` : ''}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-slate-500 mb-3">
                      <Icons.location className="w-4 h-4 mr-1" />
                      <span>{program.location}</span>
                    </div>
                    <p className="text-slate-600 mb-4">
                      {truncateText(program.description, 150)}
                    </p>
                    
                    {program.capacity && program.currentParticipants !== undefined && (
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-slate-600">Participation</span>
                          <span className="text-slate-600">{program.currentParticipants}/{program.capacity}</span>
                        </div>
                        <ProgressBar 
                          value={program.currentParticipants} 
                          max={program.capacity} 
                          variant={program.status === 'completed' ? 'success' : 'primary'}
                        />
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center mt-4">
                      <Button 
                        variant="primary"
                        onClick={() => window.location.href = `/programs/detail/${program.id}`}
                      >
                        View Details
                      </Button>
                      <a href={`/ngos/${program.ngoId}`} className="text-sm text-primary-600 hover:text-primary-700">
                        View NGO
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-600 mb-4">No programs found matching your criteria.</p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery('');
                setLocationFilter('');
                setStatusFilter('all');
              }}
            >
              Reset Filters
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

/**
 * Format a date string (ISO or Date) to a human-readable format.
 */
function formatDate(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
}

/**
 * Truncate text to a specified length, adding ellipsis if needed.
 */
function truncateText(text: string, maxLength: number): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export default Programs;