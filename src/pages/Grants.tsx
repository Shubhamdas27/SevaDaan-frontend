import React, { useState, useEffect } from 'react';
import { Search, Filter, ExternalLink, AlertCircle } from 'lucide-react';
import Layout from '../components/common/Layout';
import GrantCard from '../components/grants/GrantCard';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Spinner } from '../components/ui/Spinner';
import { Grant } from '../types';
import { useAuth } from '../context/AuthContext';
import { useGrants } from '../hooks/useApiHooks';

const Grants: React.FC = () => {
  const { user } = useAuth();
  const { grants, loading, error, fetchGrants } = useGrants();
  const [filteredGrants, setFilteredGrants] = useState<Grant[]>([]);
  const [displayedGrants, setDisplayedGrants] = useState<Grant[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [itemsToShow, setItemsToShow] = useState(12);
  const isNgo = user?.role === 'ngo';

  useEffect(() => {
    fetchGrants();
  }, [fetchGrants]);

  useEffect(() => {
    let result = grants;
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (grant: Grant) => 
          grant.title.toLowerCase().includes(query) || 
          grant.description.toLowerCase().includes(query) ||
          grant.provider.toLowerCase().includes(query)
      );
    }
    
    if (statusFilter !== 'all') {
      result = result.filter((grant: Grant) => grant.status === statusFilter);
    }
    
    setFilteredGrants(result);
    setDisplayedGrants(result.slice(0, itemsToShow));
  }, [searchQuery, statusFilter, grants, itemsToShow]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
  };

  return (
    <Layout>
      <div className="bg-gradient-to-br from-primary-900 to-primary-700 py-16 text-white">
        <div className="container">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Grants & Funding Opportunities</h1>
          <p className="text-white/90 max-w-3xl">
            Discover funding opportunities available for NGOs across India. Browse grants from government agencies, 
            private foundations, and corporate social responsibility programs.
          </p>
        </div>
      </div>
      
      <div className="container py-8">
        {!isNgo && (
          <Card className="mb-8 border-warning-300 bg-warning-50">
            <CardContent className="flex items-start gap-3 py-4">
              <AlertCircle className="w-5 h-5 text-warning-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-warning-700">NGO Access Only</h3>
                <p className="text-warning-600 text-sm">
                  Grant applications are only available to registered NGOs. 
                  <a href="/register" className="font-medium underline ml-1">Register</a> or 
                  <a href="/login" className="font-medium underline ml-1">log in</a> as an NGO to apply.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
        
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search grants by title, description, or provider..."
              className="input pl-10 w-full"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="text-slate-500" />
            <select 
              className="input"
              value={statusFilter}
              onChange={handleStatusChange}
              aria-label="Filter by grant status"
            >
              <option value="all">All Statuses</option>
              <option value="open">Open</option>
              <option value="closed">Closed</option>
              <option value="reviewing">Reviewing</option>
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
        ) : filteredGrants.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedGrants.map((grant: Grant) => (
                <GrantCard key={grant.id} grant={grant} isNgo={isNgo} />
              ))}
            </div>
            {displayedGrants.length < filteredGrants.length && (
              <div className="flex justify-center mt-8">
                <Button
                  variant="outline"
                  onClick={() => setItemsToShow(prev => prev + 12)}
                >
                  Load More ({filteredGrants.length - displayedGrants.length} remaining)
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-600 mb-4">No grants found matching your criteria.</p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
              }}
            >
              Reset Filters
            </Button>
          </div>
        )}

        {isNgo && (
          <div className="mt-12 bg-primary-50 rounded-lg p-6 border border-primary-100">
            <h2 className="text-xl font-semibold mb-3 text-primary-800">Resources for NGOs</h2>
            <p className="text-slate-600 mb-4">
              Need help with your grant application? Check out these resources:
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center gap-2 text-primary-700">
                <ExternalLink className="w-4 h-4" />
                <a href="#" className="underline hover:text-primary-800">
                  Grant Writing Best Practices
                </a>
              </li>
              <li className="flex items-center gap-2 text-primary-700">
                <ExternalLink className="w-4 h-4" />
                <a href="#" className="underline hover:text-primary-800">
                  Budget Template Download
                </a>
              </li>
              <li className="flex items-center gap-2 text-primary-700">
                <ExternalLink className="w-4 h-4" />
                <a href="#" className="underline hover:text-primary-800">
                  NGO Documentation Checklist
                </a>
              </li>
            </ul>
            <Button variant="primary">Schedule Grant Consultation</Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Grants;