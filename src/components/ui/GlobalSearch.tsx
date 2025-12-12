import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Building, Calendar, Users, Banknote } from 'lucide-react';
import { useSearch } from '../../hooks/useApiHooks';
import { cn } from '../../lib/utils';
import { Button } from './Button';
import { Spinner } from './Spinner';

interface SearchResultItem {
  _id: string;
  name?: string;
  title?: string;
  description?: string;
  location?: string;
}

interface GlobalSearchProps {
  className?: string;
  variant?: 'full' | 'icon';
  placeholder?: string;
}

const GlobalSearch: React.FC<GlobalSearchProps> = ({ 
  className, 
  variant = 'full',
  placeholder = "Search NGOs, programs, grants..."
}) => {
  const [query, setQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(variant === 'full');
  const [showResults, setShowResults] = useState(false);
  const { results, loading, searchAll } = useSearch();
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
        if (variant === 'icon' && !query) {
          setIsExpanded(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [variant, query]);  const handleSearch = useCallback(async () => {
    if (!query.trim()) return;
    
    try {
      await searchAll(query.trim());
      setShowResults(true);
    } catch (error) {
      console.error('Search failed:', error);
    }
  }, [query, searchAll]);

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (query.trim().length >= 2) {
        handleSearch();
      } else {
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [query, handleSearch]);

  const handleIconClick = () => {
    if (variant === 'icon') {
      setIsExpanded(true);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleNavigationShortcut = (searchQuery: string) => {
    const shortcuts = {
      'home': '/',
      'ngos': '/ngos',
      'programs': '/programs',
      'volunteer': '/volunteer',
      'grants': '/grants',
      'emergency': '/emergency-help',
      'about': '/who-we-are',
      'login': '/login',
      'register': '/register',
      'dashboard': '/dashboard'
    };

    const route = shortcuts[searchQuery.toLowerCase() as keyof typeof shortcuts];
    if (route) {
      navigate(route);
      setQuery('');
      setShowResults(false);
      if (variant === 'icon') {
        setIsExpanded(false);
      }
      return true;
    }
    return false;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Try navigation shortcut first
    if (handleNavigationShortcut(query)) {
      return;
    }

    // Otherwise, navigate to search results
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setShowResults(false);
      if (variant === 'icon') {
        setIsExpanded(false);
      }
    }
  };

  const handleResultClick = (type: string, id: string) => {
    setShowResults(false);
    if (variant === 'icon') {
      setIsExpanded(false);
    }
    setQuery('');
    
    switch (type) {
      case 'ngo':
        navigate(`/ngos/${id}`);
        break;
      case 'program':
        navigate(`/programs`);
        break;
      case 'volunteer':
        navigate(`/volunteer`);
        break;
      case 'grant':
        navigate(`/grants`);
        break;
      default:
        break;
    }
  };

  const clearSearch = () => {
    setQuery('');
    setShowResults(false);
    inputRef.current?.focus();
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'ngo':
        return <Building className="w-4 h-4" />;
      case 'program':
        return <Calendar className="w-4 h-4" />;
      case 'volunteer':
        return <Users className="w-4 h-4" />;
      case 'grant':
        return <Banknote className="w-4 h-4" />;
      default:
        return <Search className="w-4 h-4" />;
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
  return (
    <div ref={searchRef} className={cn('relative', className)}>      {/* Icon Mode - Just the search icon */}      {variant === 'icon' && !isExpanded && (
        <button
          onClick={handleIconClick}
          className="flex items-center justify-center p-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-slate-300"
          aria-label="Search"
        >
          <Search className="h-5 w-5" />
        </button>
      )}

      {/* Expanded Search Box */}
      {(variant === 'full' || isExpanded) && (
        <form onSubmit={handleSubmit} className="relative">
          <div className={cn(
            'relative transition-all duration-300',
            variant === 'icon' ? 'w-80' : 'w-full max-w-md'
          )}>            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className={cn(
                "h-5 w-5",
                variant === 'icon' ? "text-slate-300" : "text-slate-400"
              )} />
            </div><input
              ref={inputRef}
              type="text"
              placeholder={placeholder}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setShowResults(true)}
              className={cn(
                'w-full pl-10 pr-10 py-2 border rounded-lg',
                'focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                variant === 'icon' 
                  ? 'bg-slate-800 border-slate-600 text-white placeholder-slate-300 focus:bg-slate-700' 
                  : 'bg-white border-slate-300 text-slate-900 placeholder-slate-500',
                showResults && 'rounded-b-none border-b-0'
              )}
            />            {query && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                aria-label="Clear search"
              >
                <X className={cn(
                  "h-4 w-4",
                  variant === 'icon' 
                    ? "text-slate-300 hover:text-white" 
                    : "text-slate-400 hover:text-slate-600"
                )} />
              </button>
            )}
          </div>

          {/* Search Results Dropdown */}
          {showResults && (
            <div className="absolute top-full left-0 right-0 bg-white border border-slate-300 border-t-0 rounded-b-lg shadow-lg max-h-96 overflow-y-auto z-50">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Spinner size="sm" />
                  <span className="ml-2 text-sm text-slate-600">Searching...</span>
                </div>
              ) : results ? (
                <div className="py-2">
                  {/* Navigation Shortcuts */}
                  {query.length >= 1 && (
                    <div className="px-4 py-2 border-b border-slate-100">
                      <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
                        Quick Navigation
                      </div>
                      <div className="text-xs text-slate-400 mb-2">
                        Try: home, ngos, programs, volunteer, grants, dashboard
                      </div>
                    </div>
                  )}

                  {Object.entries(results).map(([type, items]) => 
                    Array.isArray(items) && items.length > 0 ? (
                      <div key={type}>
                        <div className="px-4 py-2 text-xs font-medium text-slate-500 uppercase tracking-wider border-b border-slate-100">
                          {getTypeLabel(type)}s ({items.length})
                        </div>
                        {items.slice(0, 3).map((item: SearchResultItem) => (
                          <button
                            type="button"
                            key={item._id}
                            onClick={() => handleResultClick(type, item._id)}
                            className="w-full px-4 py-3 text-left hover:bg-slate-50 border-b border-slate-50 last:border-b-0 focus:bg-slate-50 focus:outline-none"
                            aria-label={`View ${item.name || item.title}`}
                          >
                            <div className="flex items-start gap-3">
                              <div className="text-slate-400 mt-0.5">
                                {getIcon(type)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-slate-900 truncate">
                                  {item.name || item.title}
                                </div>
                                <div className="text-sm text-slate-500 truncate">
                                  {item.description?.substring(0, 80)}...
                                </div>
                                {item.location && (
                                  <div className="text-xs text-slate-400 mt-1">
                                    📍 {item.location}
                                  </div>
                                )}
                              </div>
                            </div>
                          </button>
                        ))}
                        {items.length > 3 && (
                          <div className="px-4 py-2 text-xs text-slate-500 border-b border-slate-100">
                            +{items.length - 3} more results
                          </div>
                        )}
                      </div>
                    ) : null
                  )}
                  
                  {(!results.ngos?.length && !results.programs?.length && !results.grants?.length) ? (
                    <div className="px-4 py-8 text-center text-slate-500">
                      <Search className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                      <p className="text-sm">No results found for "{query}"</p>
                      <p className="text-xs text-slate-400 mt-1">Try different keywords or use quick navigation</p>
                    </div>
                  ) : (
                    <div className="px-4 py-3 border-t border-slate-100">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full text-blue-600 hover:text-blue-700"
                        onClick={() => {
                          navigate(`/search?q=${encodeURIComponent(query)}`);
                          setShowResults(false);
                          if (variant === 'icon') {
                            setIsExpanded(false);
                          }
                        }}
                      >
                        View all results for "{query}"
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="px-4 py-8 text-center text-slate-500">
                  <Search className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                  <p className="text-sm">Start typing to search...</p>
                  <p className="text-xs text-slate-400 mt-1">Or type page names like "home", "ngos", "programs"</p>
                </div>
              )}
            </div>
          )}
        </form>
      )}
    </div>
  );
};

export default GlobalSearch;
