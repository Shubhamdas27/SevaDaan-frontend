import React, { useState, useEffect } from 'react';
import { Search, Filter, MapPin, Calendar, Users, Tag, Clock, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '../../ui/Card';
import { Button } from '../../ui/Button';
import apiService from '../../../lib/apiService';
import { CitizenService } from '../../../types';

const ServiceDiscovery: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [locationFilter, setLocationFilter] = useState('');
  const [services, setServices] = useState<CitizenService[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const categories = ['all', 'Healthcare', 'Education', 'Financial', 'Environment', 'Food', 'Housing'];
  
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setIsLoading(true);
        const params: any = {};
        if (searchTerm) params.search = searchTerm;
        if (selectedCategory !== 'all') params.category = selectedCategory;
        if (locationFilter) params.location = locationFilter;
        
        const { data } = await apiService.getCitizenServices(params);
        setServices(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching services:', err);
        setError('Failed to load services. Please try again.');
        // Use a fallback empty array if the API fails
        setServices([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Use a debounce to avoid too many API calls when typing
    const timeoutId = setTimeout(() => {
      fetchServices();
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, [searchTerm, selectedCategory, locationFilter]);
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="w-full lg:w-1/2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for services..."
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          </div>
        </div>
        
        {/* Filters */}
        <div className="w-full lg:w-1/4">
          <div className="relative">
            <select
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 appearance-none bg-white"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              aria-label="Category filter"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          </div>
        </div>
        
        {/* Location */}
        <div className="w-full lg:w-1/4">
          <div className="relative">
            <input
              type="text"
              placeholder="Filter by location"
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
            />
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Loading, Error and Results */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <AlertCircle className="h-12 w-12 text-error-500 mb-4" />
          <h3 className="text-lg font-medium text-slate-800">Error loading services</h3>
          <p className="text-slate-600 mb-4">{error}</p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
              setLocationFilter('');
            }}
          >
            Reset filters and try again
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.length > 0 ? (
            services.map(service => (
              <Card key={service.id}>
                <CardContent className="p-5">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800">{service.title}</h3>
                    <p className="text-sm text-slate-600 mb-3">{service.provider}</p>
                    
                    <div className="flex items-center text-sm text-slate-500 mb-1">
                      <MapPin className="w-4 h-4 mr-1" /> {service.location}
                    </div>
                    <div className="flex items-center text-sm text-slate-500 mb-1">
                      <Calendar className="w-4 h-4 mr-1" /> Deadline: {new Date(service.deadline).toLocaleDateString()}
                    </div>
                    <div className="flex items-center text-sm text-slate-500 mb-3">
                      <Users className="w-4 h-4 mr-1" /> For: {service.beneficiaries}
                    </div>
                    
                    <p className="text-sm text-slate-700 mb-4">{service.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {service.tags.map(tag => (
                        <span key={tag} className="px-2 py-1 text-xs bg-slate-100 text-slate-700 rounded-full flex items-center">
                          <Tag className="w-3 h-3 mr-1" /> {tag}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex justify-between items-center mt-4">
                      <div className="text-xs text-slate-500 flex items-center">
                        <Clock className="w-3 h-3 mr-1" /> Application time: ~15 mins
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">Details</Button>
                        <Button 
                          variant="primary" 
                          size="sm" 
                          onClick={() => {
                            window.location.href = service.applicationUrl || `/services/${service.id}/apply`;
                          }}
                        >
                          Apply
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-2 p-8 text-center">
              <div className="text-slate-400 mb-2">
                <Search className="w-12 h-12 mx-auto mb-4" />
                <h3 className="text-lg font-medium">No services found</h3>
                <p>Try adjusting your filters or search terms</p>
              </div>
              <Button variant="outline" size="sm" className="mt-4" onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setLocationFilter('');
              }}>
                Clear all filters
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ServiceDiscovery;
