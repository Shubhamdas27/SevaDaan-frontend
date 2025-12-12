import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Icons } from '../components/icons';
import Layout from '../components/common/Layout';
import { VolunteerOpportunity } from '../types';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Spinner } from '../components/ui/Spinner';
import { formatDate } from '../lib/utils';
import { useAuth } from '../context/AuthContext';
import { useVolunteerOpportunities } from '../hooks/useApiHooks';
import { getVolunteerStatusBadge } from '../lib/status-utils';
import { useToast } from '../components/ui/Toast';
import { VolunteerDetailsModal } from '../components/volunteer/VolunteerDetailsModal';

const Volunteer: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const { opportunities, loading, error, fetchOpportunities, getOpportunityById } = useVolunteerOpportunities();
  const [filteredOpportunities, setFilteredOpportunities] = useState<VolunteerOpportunity[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOpportunity, setSelectedOpportunity] = useState<VolunteerOpportunity | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [modalOpportunity, setModalOpportunity] = useState<VolunteerOpportunity | null>(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [applicationData, setApplicationData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    motivation: '',
    experience: '',
    availability: ''
  });
  
  // Location autocomplete state
  const [locationSuggestions, setLocationSuggestions] = useState<string[]>([]);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const locationInputRef = useRef<HTMLInputElement>(null);

  // Handler for opening volunteer details modal
  const handleViewDetails = (opportunity: VolunteerOpportunity) => {
    console.log('View Details clicked for:', opportunity.title);
    setModalOpportunity(opportunity);
    setShowDetailsModal(true);
  };

  // Handler for closing modal
  const handleCloseModal = () => {
    setShowDetailsModal(false);
    setModalOpportunity(null);
  };

  // Handler for volunteer application
  const handleVolunteerApply = async (applicationData: any) => {
    try {
      // Here you can add API call to submit volunteer application
      console.log('Volunteer application submitted:', applicationData);
      toast.success('Your volunteer application has been submitted successfully!', 'Application Sent');
    } catch (error: any) {
      console.error('Error submitting volunteer application:', error);
      toast.error('Failed to submit application. Please try again.', 'Error');
    }
  };

  useEffect(() => {
    if (id) {
      // If viewing a specific opportunity
      getOpportunityById(id)
        .then(setSelectedOpportunity)
        .catch(() => setSelectedOpportunity(null));
    } else {
      // Fetch all opportunities
      fetchOpportunities();
    }
  }, [id]);

  useEffect(() => {
    let result = opportunities;
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (opportunity: VolunteerOpportunity) => 
          opportunity.title.toLowerCase().includes(query) || 
          opportunity.description.toLowerCase().includes(query)
      );
    }
    
    if (locationFilter) {
      result = result.filter((opportunity: VolunteerOpportunity) => 
        opportunity.location.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }
    
    if (statusFilter !== 'all') {
      result = result.filter((opportunity: VolunteerOpportunity) => opportunity.status === statusFilter);
    }
    
    setFilteredOpportunities(result);
  }, [searchQuery, locationFilter, statusFilter, opportunities]);

  // Location autocomplete functionality
  const allLocations = [...new Set(opportunities.map((opportunity: VolunteerOpportunity) => opportunity.location))];
  
  // Comprehensive default cities list including smaller cities
  const defaultCities = [
    // Major Metro Cities
    'Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 
    'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur',
    'Indore', 'Thane', 'Bhopal', 'Visakhapatnam', 'Pimpri-Chinchwad',
    'Patna', 'Vadodara', 'Ghaziabad', 'Ludhiana', 'Agra', 'Nashik',
    'Faridabad', 'Meerut', 'Rajkot', 'Kalyan-Dombivali', 'Vasai-Virar',
    'Varanasi', 'Srinagar', 'Dhanbad', 'Jodhpur', 'Amritsar', 'Raipur',
    'Allahabad', 'Coimbatore', 'Jabalpur', 'Gwalior', 'Vijayawada',
    
    // Odisha Cities
    'Bhubaneswar', 'Cuttack', 'Brahmapur', 'Rourkela', 'Berhampur', 
    'Sambalpur', 'Puri', 'Balasore', 'Baripada', 'Bhadrak',
    'Jharsuguda', 'Jeypore', 'Barbil', 'Kendujhar', 'Sundargarh',
    'Rayagada', 'Koraput', 'Paradip', 'Angul', 'Dhenkanal',
    
    // Other Important Cities
    'Chandigarh', 'Thiruvananthapuram', 'Kochi', 'Madurai', 'Tiruchirappalli',
    'Salem', 'Tirunelveli', 'Tiruppur', 'Vellore', 'Thoothukudi',
    'Nagercoil', 'Thanjavur', 'Dindigul', 'Kumbakonam', 'Karur',
    'Puducherry', 'Mysore', 'Hubli-Dharwad', 'Mangalore', 'Belgaum',
    'Gulbarga', 'Davanagere', 'Bellary', 'Bijapur', 'Shimoga',
    'Tumkur', 'Raichur', 'Bidar', 'Hospet', 'Gadag-Betageri',
    'Udupi', 'Bhatkal', 'Ranchi', 'Jamshedpur', 'Dhanbad',
    'Bokaro', 'Deoghar', 'Phusro', 'Hazaribagh', 'Giridih',
    'Ramgarh', 'Medininagar', 'Chirkunda', 'Pakaur', 'Chaibasa',
    'Guwahati', 'Silchar', 'Dibrugarh', 'Jorhat', 'Nagaon',
    'Tinsukia', 'Tezpur', 'Bongaigaon', 'Karimganj', 'Sivasagar',
    'Goalpara', 'Barpeta', 'Mankachar', 'Margherita', 'Abhayapuri',
    'Dehradun', 'Haridwar', 'Roorkee', 'Haldwani-cum-Kathgodam', 'Rudrapur',
    'Kashipur', 'Rishikesh', 'Pithoragarh', 'Jaspur', 'Kichha',
    'Imphal', 'Thoubal', 'Lilong', 'Mayang Imphal', 'Kakching',
    'Kohima', 'Dimapur', 'Mokokchung', 'Tuensang', 'Wokha',
    'Zunheboto', 'Phek', 'Kiphire', 'Longleng', 'Peren',
    'Mon', 'Aizawl', 'Lunglei', 'Saiha', 'Champhai',
    'Kolasib', 'Lawngtlai', 'Mamit', 'Serchhip', 'Agartala',
    'Dharmanagar', 'Udaipur', 'Kailasahar', 'Belonia', 'Khowai',
    'Pratapgarh', 'Ramnagar', 'Sabroom', 'Sonamura', 'Panaji',
    'Margao', 'Vasco da Gama', 'Mapusa', 'Ponda', 'Bicholim',
    'Curchorem', 'Sanquelim', 'Pernem', 'Quepem', 'Canacona',
    'Gangtok', 'Namchi', 'Geyzing', 'Mangan', 'Jorethang',
    'Nayagarh', 'Khordha', 'Jajpur', 'Jagatsinghpur', 'Kendrapara',
    'Mayurbhanj', 'Keonjhar', 'Sundargarh', 'Nuapada', 'Kalahandi',
    'Nabarangpur', 'Malkangiri', 'Gajapati', 'Ganjam', 'Nayagarh'
  ];
  
  // Merge real data with default cities and remove duplicates
  const availableLocations = [...new Set([...allLocations, ...defaultCities])].sort();

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocationFilter(value);
    
    if (value.trim() === '') {
      setLocationSuggestions([]);
      setShowLocationDropdown(false);
    } else {
      const filtered = availableLocations.filter(location =>
        location.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 8); // Show max 8 suggestions
      setLocationSuggestions(filtered);
      setShowLocationDropdown(filtered.length > 0);
    }
  };

  const handleLocationSelect = (location: string) => {
    setLocationFilter(location);
    setShowLocationDropdown(false);
    setLocationSuggestions([]);
  };

  const handleLocationKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setShowLocationDropdown(false);
      setLocationSuggestions([]);
    }
  };

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (locationInputRef.current && !locationInputRef.current.contains(event.target as Node)) {
        setShowLocationDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const isOpportunityDetail = id && selectedOpportunity;
  const opportunity = isOpportunityDetail ? selectedOpportunity : null;

  return (
    <Layout>
      <div className="bg-gradient-to-br from-accent-600 to-accent-700 py-16 text-white">
        <div className="container">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {isOpportunityDetail ? opportunity?.title : 'Volunteer Opportunities'}
          </h1>
          <p className="text-white/90 max-w-3xl">
            {isOpportunityDetail 
              ? opportunity?.description
              : 'Make a difference by volunteering your time and skills. Browse opportunities to support NGOs and communities across India.'}
          </p>
        </div>
      </div>
      
      {isOpportunityDetail && opportunity ? (
        <div className="container py-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/2">
                  <img
                    src={opportunity.imageUrl || 'https://images.pexels.com/photos/6646907/pexels-photo-6646907.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'}
                    alt={opportunity.title}
                    className="w-full h-80 object-cover rounded-lg"
                  />
                  
                  <div className="mt-6 grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-slate-500 mb-1">Location</h3>
                      <div className="flex items-center">
                        <Icons.location className="w-4 h-4 text-accent-500 mr-1" />
                        <span className="text-slate-800">{opportunity.location}</span>
                      </div>
                    </div>
                    
                    <div className="bg-slate-50 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-slate-500 mb-1">Time Commitment</h3>
                      <div className="flex items-center">
                        <Icons.pending className="w-4 h-4 text-accent-500 mr-1" />
                        <span className="text-slate-800">{opportunity.requiredHours} hours</span>
                      </div>
                    </div>
                    
                    <div className="bg-slate-50 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-slate-500 mb-1">Start Date</h3>
                      <div className="flex items-center">
                        <Icons.calendar className="w-4 h-4 text-accent-500 mr-1" />
                        <span className="text-slate-800">{formatDate(opportunity.startDate)}</span>
                      </div>
                    </div>
                    
                    <div className="bg-slate-50 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-slate-500 mb-1">Status</h3>
                      <div>
                        {getVolunteerStatusBadge(opportunity.status)}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="md:w-1/2">
                  <h2 className="text-2xl font-semibold mb-4">Description</h2>
                  <p className="text-slate-600 mb-6">
                    {opportunity.description}
                  </p>
                  
                  <h3 className="text-lg font-semibold mb-3">Required Skills</h3>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {opportunity.skills.map((skill: string, index: number) => (
                      <span key={index} className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                  
                  <h3 className="text-lg font-semibold mb-3">Organization</h3>
                  <a href={`/ngos/${opportunity.ngoId}`} className="text-primary-600 hover:underline mb-8 block">
                    View NGO Profile
                  </a>
                  
                  <div className="mt-8">
                    {opportunity.status === 'open' ? (
                      user ? (
                        <Button 
                          variant="accent" 
                          size="lg" 
                          className="w-full md:w-auto"
                          onClick={() => setShowApplicationForm(!showApplicationForm)}
                        >
                          {showApplicationForm ? 'Hide Application Form' : 'Apply Now'}
                        </Button>
                      ) : (
                        <div className="space-y-3">
                          <a href={`/login?redirect=/volunteer/opportunities/${id}`}>
                            <Button variant="accent" size="lg" className="w-full md:w-auto">
                              Log in to Apply
                            </Button>
                          </a>
                          <p className="text-sm text-slate-500">
                            You need to be logged in to apply for volunteer opportunities.
                          </p>
                        </div>
                      )
                    ) : (
                      <Button variant="outline" size="lg" className="w-full md:w-auto" disabled>
                        {opportunity.status === 'filled' ? 'Position Filled' : 'Opportunity Ended'}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Application Form */}
          {showApplicationForm && user && opportunity.status === 'open' && (
            <Card className="mt-6">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-6">Submit Your Application</h2>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  handleVolunteerApply({ ...applicationData, opportunityId: opportunity.id });
                  setShowApplicationForm(false);
                }} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={applicationData.name}
                        onChange={(e) => setApplicationData({...applicationData, name: e.target.value})}
                        required
                        className="input w-full"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={applicationData.email}
                        onChange={(e) => setApplicationData({...applicationData, email: e.target.value})}
                        required
                        className="input w-full"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={applicationData.phone}
                      onChange={(e) => setApplicationData({...applicationData, phone: e.target.value})}
                      className="input w-full"
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Why do you want to volunteer? *
                    </label>
                    <textarea
                      value={applicationData.motivation}
                      onChange={(e) => setApplicationData({...applicationData, motivation: e.target.value})}
                      required
                      rows={4}
                      className="input w-full"
                      placeholder="Tell us what motivates you to volunteer for this opportunity..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Relevant Experience
                    </label>
                    <textarea
                      value={applicationData.experience}
                      onChange={(e) => setApplicationData({...applicationData, experience: e.target.value})}
                      rows={3}
                      className="input w-full"
                      placeholder="Share any relevant experience or skills..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Availability
                    </label>
                    <input
                      type="text"
                      value={applicationData.availability}
                      onChange={(e) => setApplicationData({...applicationData, availability: e.target.value})}
                      className="input w-full"
                      placeholder="e.g., Weekends, Weekday evenings, etc."
                    />
                  </div>
                  <div className="flex gap-4">
                    <Button type="submit" variant="accent" size="lg">
                      Submit Application
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="lg"
                      onClick={() => setShowApplicationForm(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
          
          <div className="mt-8">
            <a href="/volunteer" className="text-primary-600 hover:text-primary-700 flex items-center">
              <Icons.arrowRight className="w-4 h-4 mr-1 rotate-180" />
              Back to all volunteer opportunities
            </a>
          </div>
        </div>
      ) : (
        <div className="container py-8">
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-grow">
              <Icons.search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search volunteer opportunities..."
                className="input pl-10 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2 relative" ref={locationInputRef}>
              <Icons.location className="text-slate-500" />
              <div className="relative">
                <input
                  type="text"
                  placeholder="Type to search locations..."
                  className="input"
                  value={locationFilter}
                  onChange={handleLocationChange}
                  onKeyDown={handleLocationKeyDown}
                  onFocus={() => {
                    if (locationFilter.length > 0) {
                      handleLocationChange({ target: { value: locationFilter } } as React.ChangeEvent<HTMLInputElement>);
                    }
                  }}
                  aria-label="Filter by location"
                  autoComplete="off"
                />
                <Icons.chevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                
                {showLocationDropdown && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-slate-200 rounded-md shadow-lg z-10 max-h-48 overflow-y-auto">
                    {locationSuggestions.length > 0 ? (
                      locationSuggestions.map((location, index) => (
                        <button
                          key={index}
                          type="button"
                          className="w-full text-left px-3 py-2 hover:bg-slate-50 focus:bg-slate-50 focus:outline-none border-b border-slate-100 last:border-b-0"
                          onClick={() => handleLocationSelect(location)}
                        >
                          <div className="flex items-center">
                            <Icons.location className="w-4 h-4 text-slate-400 mr-2" />
                            <span className="text-slate-900">{location}</span>
                          </div>
                        </button>
                      ))
                    ) : locationFilter.length > 0 ? (
                      <div className="px-4 py-3 text-slate-500 text-sm text-center">
                        No cities found matching "{locationFilter}"
                      </div>
                    ) : (
                      <div className="px-4 py-3 text-slate-500 text-sm text-center">
                        Type to search cities...
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
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                aria-label="Filter by status"
              >
                <option value="all">All Statuses</option>
                <option value="open">Open</option>
                <option value="filled">Filled</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <Spinner size="lg" />
            </div>
          ) : error ? (
            <Card className="border-error-300 bg-error-50">
              <CardContent className="p-6 text-center">
                <p className="text-error-600 mb-4">{error}</p>
                <Button 
                  onClick={() => window.location.reload()} 
                  variant="outline"
                >
                  Try Again
                </Button>
              </CardContent>
            </Card>
          ) : filteredOpportunities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOpportunities.map((opportunity: VolunteerOpportunity) => (
                <Card key={opportunity.id} isHoverable>
                  <CardContent className="p-0">
                    <div className="h-48 overflow-hidden relative">
                      <img
                        src={opportunity.imageUrl || 'https://images.pexels.com/photos/6646907/pexels-photo-6646907.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'}
                        alt={opportunity.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 right-3">
                        {getVolunteerStatusBadge(opportunity.status)}
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2">{opportunity.title}</h3>
                      <div className="flex items-center text-sm text-slate-500 mb-2">
                        <Icons.calendar className="w-4 h-4 mr-1" />
                        <span>
                          {formatDate(opportunity.startDate)}
                          {opportunity.endDate ? ` - ${formatDate(opportunity.endDate)}` : ''}
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-slate-500 mb-3">
                        <Icons.location className="w-4 h-4 mr-1" />
                        <span>{opportunity.location}</span>
                      </div>
                      <p className="text-slate-600 mb-4">
                        {opportunity.description.length > 120
                          ? `${opportunity.description.substring(0, 120)}...`
                          : opportunity.description
                        }
                      </p>
                      
                      <div className="flex items-center text-sm text-slate-500 mb-4">
                        <Icons.pending className="w-4 h-4 mr-1" />
                        <span>{opportunity.requiredHours} hours required</span>
                      </div>
                      
                      <div className="flex justify-between items-center mt-4">
                        <a href={`/volunteer/opportunities/${opportunity.id}`}>
                          <Button 
                            variant="accent" 
                            disabled={opportunity.status !== 'open'}
                          >
                            View Details
                          </Button>
                        </a>
                        <a href={`/ngos/${opportunity.ngoId}`} className="text-sm text-primary-600 hover:text-primary-700">
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
              <p className="text-slate-600 mb-4">No volunteer opportunities found matching your criteria.</p>
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
          
          <div className="mt-12 bg-accent-50 rounded-lg p-6 border border-accent-100">
            <h2 className="text-xl font-semibold mb-3 text-accent-800">Benefits of Volunteering</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-3">
                  <div className="w-10 h-10 rounded-full bg-accent-100 flex items-center justify-center">
                    <Icons.favorite className="w-5 h-5 text-accent-600" />
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-accent-800 mb-1">Make a Difference</h3>
                  <p className="text-sm text-accent-600">
                    Help those in need and create positive change in communities.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-3">
                  <div className="w-10 h-10 rounded-full bg-accent-100 flex items-center justify-center">
                    <Icons.users className="w-5 h-5 text-accent-600" />
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-accent-800 mb-1">Build Connections</h3>
                  <p className="text-sm text-accent-600">
                    Meet like-minded individuals and expand your network.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-3">
                  <div className="w-10 h-10 rounded-full bg-accent-100 flex items-center justify-center">
                    <Icons.award className="w-5 h-5 text-accent-600" />
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-accent-800 mb-1">Gain Experience</h3>
                  <p className="text-sm text-accent-600">
                    Develop new skills and enhance your resume.
                  </p>
                </div>
              </div>
            </div>
            <Button variant="accent">Register as a Volunteer</Button>
          </div>
        </div>
      )}
      
      {/* Volunteer Details Modal */}
      {modalOpportunity && (
        <VolunteerDetailsModal
          opportunity={modalOpportunity}
          isOpen={showDetailsModal}
          onClose={handleCloseModal}
          onApply={handleVolunteerApply}
        />
      )}
    </Layout>
  );
};

export default Volunteer;