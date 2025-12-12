import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ExternalLink } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Avatar } from '../ui/Avatar';
import { Spinner } from '../ui/Spinner';
import { NGO } from '../../types';
import { truncateText } from '../../lib/utils';

interface FeaturedNGOsProps {
  ngos: NGO[];
  loading?: boolean;
  error?: string | null;
}

const FeaturedNGOs: React.FC<FeaturedNGOsProps> = ({ ngos, loading, error }) => {
  return (
    <section className="py-20 bg-gradient-to-b from-white via-blue-50/30 to-white">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">Featured NGOs</h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg">
            Discover organizations making a difference in communities across India through their impactful programs and initiatives.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center">
            <Spinner size="lg" />
          </div>
        ) : error ? (
          <div className="text-center text-red-600">
            <p>Error loading NGOs: {error}</p>
          </div>
        ) : ngos.length === 0 ? (
          <div className="text-center text-slate-600">
            <p>No NGOs available at the moment.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {ngos.map((ngo) => (
                <Card key={ngo.id} isHoverable className="overflow-hidden flex flex-col h-full group hover:shadow-2xl transition-all duration-300 border-0 bg-white">
                  <div className="h-48 overflow-hidden relative">
                    <img
                      src={ngo.logo}
                      alt={ngo.name}
                      className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <CardContent className="flex-grow flex flex-col p-6">
                    <div className="flex items-start justify-between mb-3">
                      <Link to={`/ngos/${ngo.id}`} className="group/link flex-1">
                        <h3 className="text-xl font-semibold group-hover/link:text-transparent group-hover/link:bg-gradient-to-r group-hover/link:from-blue-600 group-hover/link:to-purple-600 group-hover/link:bg-clip-text transition-all duration-300">
                          {ngo.name}
                        </h3>
                      </Link>
                      <Avatar
                        src={ngo.logo}
                        alt={ngo.name}
                        size="sm"
                        className="-mt-12 border-4 border-white shadow-lg ring-2 ring-white/50 group-hover:ring-blue-200 transition-all duration-300"
                      />
                    </div>
                    <div className="flex items-center text-sm text-slate-500 mb-2">
                      <MapPin className="w-4 h-4 mr-1.5 text-blue-500" />
                      <span className="font-medium">{ngo.city}, {ngo.state}</span>
                    </div>
                    <p className="text-slate-600 mt-3 mb-6 flex-grow leading-relaxed">
                      {truncateText(ngo.description, 120)}
                    </p>
                    <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100">
                      <Link to={`/ngos/${ngo.id}`}>
                        <Button variant="primary" size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-md hover:shadow-lg transition-all duration-300">
                          View Profile
                        </Button>
                      </Link>
                      {ngo.website && (
                        <a href={ngo.website} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:text-purple-600 flex items-center font-medium transition-colors duration-300 group/link">
                          Website
                          <ExternalLink className="w-3.5 h-3.5 ml-1 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link to="/ngos">
                <Button variant="outline" size="lg" className="border-2 border-blue-600 text-blue-600 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:text-white hover:border-transparent font-semibold shadow-md hover:shadow-xl transition-all duration-300 px-8 py-3">
                  View All NGOs
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default FeaturedNGOs;