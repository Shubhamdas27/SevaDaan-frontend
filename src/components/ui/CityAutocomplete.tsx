import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Loader2 } from 'lucide-react';

// Implement debounce hook directly to avoid import issues
function useDebounceLocal<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Simple API function to avoid import issues
const searchCitiesAPI = async (query: string): Promise<any[]> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/cities/search?query=${encodeURIComponent(query)}`);
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error searching cities:', error);
    return [];
  }
};

interface City {
  _id: string;
  name: string;
  state: string;
  country: string;
  pincode?: string;
}

interface CityAutocompleteProps {
  onSelect: (city: City) => void;
  selectedCity?: City | null;
  placeholder?: string;
  className?: string;
}

const CityAutocomplete: React.FC<CityAutocompleteProps> = ({
  onSelect,
  /* selectedCity, */
  placeholder = 'Search for a city...',
  className = '',
}) => {
  const [query, setQuery] = useState<string>('');
  const [cities, setCities] = useState<City[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const debouncedQuery = useDebounceLocal(query, 300);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Add click outside handler to close dropdown
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchCities = async () => {
      if (debouncedQuery.length < 2) {
        setCities([]);
        setLoading(false);
        return;
      }      try {
        setLoading(true);
        setError(null);
        
        const cities = await searchCitiesAPI(debouncedQuery);
        setCities(cities);
        
        if (cities.length === 0) {
          setError('No cities found');
        }
      } catch (err) {
        console.error('Error fetching cities:', err);
        setCities([]);
        setError('Failed to fetch cities');
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, [debouncedQuery]);

  const handleSelect = (city: City) => {
    onSelect(city);
    setQuery(`${city.name}, ${city.state}`);
    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    
    if (value.length > 1) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  const handleInputFocus = () => {
    if (query.length > 1) {
      setIsOpen(true);
    }
  };

  // Format city display  // Helper function to format city display (not used directly)
  /* 
  const formatCityDisplay = (city: City) => {
    let display = city.name;
    if (city.state) display += `, ${city.state}`;
    if (city.pincode) display += ` - ${city.pincode}`;
    return display;
  };
  */

  return (
    <div className="relative w-full">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          placeholder={placeholder}
          className={`pl-10 pr-4 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MapPin className="h-5 w-5 text-gray-400" />
        </div>
      </div>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
        >
          {loading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-6 w-6 text-blue-500 animate-spin" />
              <span className="ml-2 text-gray-600">Loading cities...</span>
            </div>
          ) : cities.length > 0 ? (
            <ul>
              {cities.map((city) => (
                <li
                  key={city._id}
                  onClick={() => handleSelect(city)}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer transition-colors duration-150 ease-in-out"
                >
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                    <div>
                      <div className="font-medium">{city.name}</div>
                      <div className="text-sm text-gray-500">
                        {city.state}, {city.country}{city.pincode ? ` - ${city.pincode}` : ''}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : error ? (
            <div className="px-4 py-2 text-red-500">{error}</div>
          ) : debouncedQuery.length >= 2 ? (
            <div className="px-4 py-2 text-gray-500">No cities found</div>
          ) : (
            <div className="px-4 py-2 text-gray-500">Type at least 2 characters to search</div>
          )}
        </div>
      )}
    </div>
  );
};

export default CityAutocomplete;
