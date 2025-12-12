import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Icons } from '../components/icons';
import Layout from '../components/common/Layout';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Spinner } from '../components/ui/Spinner';
import { Avatar } from '../components/ui/Avatar';
import { useNGOs } from '../hooks/useApiHooks';
import { NGO } from '../types';
import { truncateText } from '../lib/utils';

const NGOs: React.FC = () => {
  const { ngos, loading, error, fetchNGOs } = useNGOs();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [filteredNGOs, setFilteredNGOs] = useState<NGO[]>([]);
  const [displayedNGOs, setDisplayedNGOs] = useState<NGO[]>([]);
  const [itemsToShow, setItemsToShow] = useState(12);
  
  // City autocomplete states
  const [citySuggestions, setCitySuggestions] = useState<string[]>([]);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const cityInputRef = useRef<HTMLInputElement>(null);
  // Extract unique states and cities for filters
  const states = Array.from(new Set(ngos.map((ngo: NGO) => ngo.state))).sort();
  const allCities = Array.from(new Set(ngos.map((ngo: NGO) => ngo.city))).filter(Boolean).sort();
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
    'Tinsukuda', 'Tezpur', 'Bongaigaon', 'Karimganj', 'Sivasagar',
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
  const availableCities = [...new Set([...allCities, ...defaultCities])].sort();
  useEffect(() => {
    fetchNGOs();
  }, [fetchNGOs]);

  useEffect(() => {
    let filtered = ngos;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((ngo: NGO) =>
        ngo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ngo.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ngo.mission.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by state
    if (selectedState) {
      filtered = filtered.filter((ngo: NGO) => ngo.state === selectedState);
    }

    // Filter by city
    if (selectedCity) {
      filtered = filtered.filter((ngo: NGO) => ngo.city === selectedCity);
    }

    setFilteredNGOs(filtered);
    setDisplayedNGOs(filtered.slice(0, itemsToShow));
  }, [ngos, searchTerm, selectedState, selectedCity, itemsToShow]);
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled by useEffect
  };
  // City autocomplete handlers
  const handleCityChange = (value: string) => {
    setSelectedCity(value);
    
    if (value.length > 0) {
      const filtered = availableCities.filter(city =>
        city.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 8); // Show max 8 suggestions
      setCitySuggestions(filtered);
      setShowCityDropdown(true);
    } else {
      setCitySuggestions([]);
      setShowCityDropdown(false);
    }
  };

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
    setShowCityDropdown(false);
  };

  const handleCityKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setShowCityDropdown(false);
    } else if (e.key === 'Enter' && citySuggestions.length > 0) {
      e.preventDefault();
      handleCitySelect(citySuggestions[0]);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cityInputRef.current && !cityInputRef.current.contains(event.target as Node)) {
        setShowCityDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedState('');
    setSelectedCity('');
  };

  return (
    <Layout>
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-20 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_2px_2px,white_1px,transparent_0)] bg-[length:40px_40px]" />
        </div>
        <div className="container relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">NGO Directory</h1>
          <p className="text-gray-300 max-w-3xl text-lg">
            Discover organizations making a difference in communities across India. 
            Connect with NGOs working on causes you care about.
          </p>
          <div className="mt-6 flex gap-8">
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                <Icons.users className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <div className="text-2xl font-bold">{ngos.length}+</div>
                <div className="text-sm text-gray-400">NGOs Listed</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 bg-pink-500/20 rounded-full flex items-center justify-center">
                <Icons.location className="w-6 h-6 text-pink-400" />
              </div>
              <div>
                <div className="text-2xl font-bold">{states.length}+</div>
                <div className="text-sm text-gray-400">States Covered</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8">
        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Icons.search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <Input
                      type="text"
                      placeholder="Search NGOs by name, description, or mission..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  <select
                    value={selectedState}
                    onChange={(e) => {
                      setSelectedState(e.target.value);
                      setSelectedCity(''); // Reset city when state changes
                    }}
                    className="input min-w-[150px]"
                    aria-label="Filter by state"
                  >
                    <option value="">All States</option>
                    {states.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>                  <div className="relative" ref={cityInputRef}>
                    <input
                      type="text"
                      value={selectedCity}
                      onChange={(e) => handleCityChange(e.target.value)}
                      onKeyDown={handleCityKeyDown}
                      onFocus={() => {
                        if (selectedCity.length > 0) {
                          handleCityChange(selectedCity);
                        }
                      }}
                      placeholder="Search cities..."
                      className="input min-w-[150px] pr-10"
                      autoComplete="off"
                    />
                    <Icons.chevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    
                    {/* City Autocomplete Dropdown */}
                    {showCityDropdown && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-48 overflow-y-auto z-50">
                        {citySuggestions.length > 0 ? (
                          citySuggestions.map((city, index) => (
                            <button
                              key={index}
                              type="button"
                              onClick={() => handleCitySelect(city)}
                              className="w-full text-left px-4 py-2 text-slate-700 hover:bg-primary-50 hover:text-primary-700 first:rounded-t-lg last:rounded-b-lg border-b border-gray-100 last:border-b-0 transition-colors"
                            >
                              {city}
                            </button>
                          ))
                        ) : selectedCity.length > 0 ? (
                          <div className="px-4 py-3 text-slate-500 text-sm text-center">
                            No cities found matching "{selectedCity}"
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
              </div>
              
              {(searchTerm || selectedState || selectedCity) && (
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-600">
                    Showing {filteredNGOs.length} of {ngos.length} NGOs
                  </p>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={clearFilters}
                    leftIcon={<Icons.filter className="w-4 h-4" />}
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </form>
          </CardContent>
        </Card>

        {/* NGO Grid */}
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
        ) : filteredNGOs.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Icons.search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-slate-600 mb-4 text-lg font-medium">
                {ngos.length === 0 
                  ? "No NGOs found." 
                  : "No NGOs match your search criteria."
                }
              </p>
              {(searchTerm || selectedState || selectedCity) && (
                <Button onClick={clearFilters} variant="outline">
                  Clear Filters
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedNGOs.map((ngo) => (
              <Card key={ngo.id} isHoverable className="overflow-hidden flex flex-col h-full">
                <div className="h-48 overflow-hidden">
                  <img
                    src={ngo.logo}
                    alt={ngo.name}
                    className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                  />
                </div>
                <CardContent className="flex-grow flex flex-col p-6">
                  <div className="flex items-start justify-between mb-3">
                    <Link to={`/ngos/${ngo.id}`} className="group flex-1">
                      <h3 className="text-xl font-semibold group-hover:text-primary-600 transition-colors line-clamp-2">
                        {ngo.name}
                      </h3>
                    </Link>
                    <Avatar
                      src={ngo.logo}
                      alt={ngo.name}
                      size="sm"
                      className="-mt-10 border-4 border-white shadow-sm ml-4 flex-shrink-0"
                    />
                  </div>
                  
                  <div className="flex items-center text-sm text-slate-500 mb-3">
                    <Icons.location className="w-4 h-4 mr-1" />
                    <span>{ngo.city}, {ngo.state}</span>
                  </div>
                  
                  <p className="text-slate-600 mb-4 flex-grow">
                    {truncateText(ngo.description, 120)}
                  </p>
                  
                  <div className="border-t pt-4 mt-auto">
                    <div className="flex justify-between items-center">
                      <Link to={`/ngos/${ngo.id}`}>
                        <Button variant="primary" size="sm">
                          View Profile
                        </Button>
                      </Link>
                      {ngo.website && (
                        <a 
                          href={ngo.website} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-sm text-primary-600 hover:text-primary-700 flex items-center"
                        >
                          Website
                          <Icons.externalLink className="w-3 h-3 ml-1" />
                        </a>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            </div>
            {displayedNGOs.length < filteredNGOs.length && (
              <div className="flex justify-center mt-8">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setItemsToShow(prev => prev + 12)}
                  className="min-w-[200px]"
                >
                  Load More ({filteredNGOs.length - displayedNGOs.length} remaining)
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default NGOs;
