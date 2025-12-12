import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Building, Calendar, Users, Banknote, MapPin } from 'lucide-react';
import Layout from '../components/common/Layout';
import { useSearch } from '../hooks/useApiHooks';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Spinner } from '../components/ui/Spinner';
import { Input } from '../components/ui/Input';
import { formatDate } from '../lib/utils';

const SearchResults: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [searchQuery, setSearchQuery] = useState(query);
  const [activeFilter, setActiveFilter] = useState('all');
  const { results, loading, error, searchAll } = useSearch();

  useEffect(() => {
    if (query) {
      setSearchQuery(query);
      searchAll(query);
    }
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery.trim() });
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'ngo':
        return <Building className="w-5 h-5" />;
      case 'program':
        return <Calendar className="w-5 h-5" />;
      case 'volunteer':
        return <Users className="w-5 h-5" />;
      case 'grant':
        return <Banknote className="w-5 h-5" />;
      default:
        return <Search className="w-5 h-5" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'ngo':
        return 'NGO';
      case 'program':
        return 'Program';
      case 'volunteer':
        return 'Volunteer Opportunity';
      case 'grant':
        return 'Grant';
      default:
        return type;
    }
  };

  const getTotalResults = (): number => {
    if (!results) return 0;
    return Object.values(results).reduce((total: number, items: any) => total + (Array.isArray(items) ? items.length : 0), 0);
  };

  const getFilteredResults = () => {
    if (!results) return [];
    
    if (activeFilter === 'all') {
      return Object.entries(results).flatMap(([type, items]) =>
        Array.isArray(items) ? items.map(item => ({ ...item, type })) : []
      );
    }
    
    return results[activeFilter] || [];
  };

  const filteredResults = getFilteredResults();

  return (
    <Layout>
      <div className="bg-gradient-to-br from-primary-900 to-primary-700 py-16 text-white">
        <div className="container">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Search Results</h1>
          <p className="text-white/90 max-w-3xl">
            {query ? `Results for "${query}"` : 'Search across NGOs, programs, grants, and volunteer opportunities'}
          </p>
        </div>
      </div>

      <div className="container py-8">
        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Search NGOs, programs, grants..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search className="h-5 w-5" />}
              />
            </div>
            <Button type="submit" variant="primary">
              Search
            </Button>
          </div>
        </form>

        {loading ? (
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">Error: {error}</p>
            <Button variant="outline" onClick={() => searchAll(query)}>
              Try Again
            </Button>
          </div>
        ) : !query ? (
          <div className="text-center py-12">
            <Search className="w-16 h-16 mx-auto mb-4 text-slate-300" />
            <h2 className="text-xl font-semibold text-slate-800 mb-2">Search the SevaDaan Platform</h2>
            <p className="text-slate-600">
              Find NGOs, programs, grants, and volunteer opportunities that match your interests
            </p>
          </div>
        ) : results ? (
          <>
            {/* Results Summary */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">
                  {getTotalResults()} results found
                </h2>
                <p className="text-slate-600">for "{query}"</p>
              </div>

              {/* Filter Tabs */}
              <div className="flex gap-2">
                <Button
                  variant={activeFilter === 'all' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setActiveFilter('all')}
                >
                  All ({getTotalResults()})
                </Button>
                {Object.entries(results).map(([type, items]) =>
                  Array.isArray(items) && items.length > 0 && (
                    <Button
                      key={type}
                      variant={activeFilter === type ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() => setActiveFilter(type)}
                    >
                      {getTypeLabel(type)}s ({items.length})
                    </Button>
                  )
                )}
              </div>
            </div>

            {/* Results */}
            {filteredResults.length === 0 ? (
              <div className="text-center py-12">
                <Search className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                <h3 className="text-lg font-semibold text-slate-800 mb-2">No results found</h3>
                <p className="text-slate-600">Try adjusting your search terms or filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredResults.map((item: any) => (
                  <Card key={item._id}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="text-primary-600 mt-1">
                          {getIcon(item.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold text-slate-800">
                              {item.name || item.title}
                            </h3>
                            <Badge variant="primary">
                              {getTypeLabel(item.type)}
                            </Badge>
                          </div>
                          
                          <p className="text-slate-600 mb-3 line-clamp-2">
                            {item.description?.substring(0, 150)}...
                          </p>

                          {item.location && (
                            <div className="flex items-center text-sm text-slate-500 mb-3">
                              <MapPin className="w-4 h-4 mr-1" />
                              {item.location}
                            </div>
                          )}

                          {item.startDate && (
                            <div className="flex items-center text-sm text-slate-500 mb-3">
                              <Calendar className="w-4 h-4 mr-1" />
                              {formatDate(item.startDate)}
                              {item.endDate && ` - ${formatDate(item.endDate)}`}
                            </div>
                          )}

                          <div className="flex items-center justify-between">
                            <Link
                              to={
                                item.type === 'ngo' ? `/ngos/${item._id}` :
                                item.type === 'program' ? `/programs` :
                                item.type === 'volunteer' ? `/volunteer` :
                                `/grants`
                              }
                            >
                              <Button variant="primary" size="sm">
                                View Details
                              </Button>
                            </Link>
                            
                            {item.type === 'ngo' && item.isVerified && (
                              <Badge variant="success">Verified</Badge>
                            )}
                            {item.status && (
                              <Badge 
                                variant={
                                  item.status === 'active' || item.status === 'ongoing' ? 'success' :
                                  item.status === 'upcoming' ? 'primary' :
                                  'accent'
                                }
                              >
                                {item.status}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <Search className="w-16 h-16 mx-auto mb-4 text-slate-300" />
            <h2 className="text-xl font-semibold text-slate-800 mb-2">Start searching</h2>
            <p className="text-slate-600">Enter a search term to find NGOs, programs, and more</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SearchResults;
