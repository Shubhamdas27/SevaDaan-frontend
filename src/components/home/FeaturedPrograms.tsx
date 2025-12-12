import React from 'react';
import { Link } from 'react-router-dom';
import { Icons } from '../icons';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { ProgressBar } from '../ui/ProgressBar';
import { Spinner } from '../ui/Spinner';
import { Program } from '../../types';
import { formatDate } from '../../lib/utils';
import { getProgramStatusBadge } from '../../lib/status-utils';

interface FeaturedProgramsProps {
  programs: Program[];
  loading?: boolean;
  error?: string | null;
}

const FeaturedPrograms: React.FC<FeaturedProgramsProps> = ({ programs, loading, error }) => {
  return (
    <section className="py-20 bg-gradient-to-b from-white via-purple-50/30 to-white">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">Featured Programs</h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg">
            Explore programs and initiatives that are making a positive impact in communities across India.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center">
            <Spinner size="lg" />
          </div>
        ) : error ? (
          <div className="text-center text-red-600">
            <p>Error loading programs: {error}</p>
          </div>
        ) : programs.length === 0 ? (
          <div className="text-center text-slate-600">
            <p>No programs available at the moment.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {programs.map((program) => (
                <Card key={program.id} isHoverable className="overflow-hidden flex flex-col h-full group hover:shadow-2xl transition-all duration-300 border-0 bg-white">
                  <div className="h-48 overflow-hidden relative">
                    <img
                      src={program.imageUrl || 'https://images.pexels.com/photos/6646968/pexels-photo-6646968.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'}
                      alt={program.title}
                      className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <div className="absolute top-3 right-3">
                      {getProgramStatusBadge(program.status)}
                    </div>
                  </div>
                  <CardContent className="flex-grow flex flex-col p-6">
                    <div className="mt-4">
                      <Link to={`/programs/${program.id}`} className="group/link">
                        <h3 className="text-xl font-semibold group-hover/link:text-transparent group-hover/link:bg-gradient-to-r group-hover/link:from-purple-600 group-hover/link:to-blue-600 group-hover/link:bg-clip-text transition-all duration-300 mb-2">
                          {program.title}
                        </h3>
                      </Link>
                    </div>
                    <div className="flex items-center text-sm text-slate-500 mt-2">
                      <Icons.location className="w-4 h-4 mr-1.5 text-purple-500" />
                      <span className="font-medium">{program.location}</span>
                    </div>
                    <div className="flex items-center text-sm text-slate-500 mt-1">
                      <Icons.calendar className="w-4 h-4 mr-1.5 text-blue-500" />
                      <span>{formatDate(program.startDate)}{program.endDate ? ` - ${formatDate(program.endDate)}` : ''}</span>
                    </div>
                    <p className="text-slate-600 mt-4 mb-4 flex-grow leading-relaxed">
                      {program.description.length > 120
                        ? `${program.description.substring(0, 120)}...`
                        : program.description
                      }
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
                    
                    <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100">
                      <Link to={`/ngos/${program.ngoId}`}>
                        <Button variant="primary" size="sm" rightIcon={<Icons.arrowRight className="w-4 h-4" />} className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-md hover:shadow-lg transition-all duration-300">
                          Learn More
                        </Button>
                      </Link>
                      <Link to={`/ngos/${program.ngoId}`} className="text-sm text-purple-600 hover:text-blue-600 transition-colors duration-300 font-medium group/link">
                        View NGO
                        <Icons.arrowRight className="w-3 h-3 inline-block ml-1 group-hover/link:translate-x-0.5 transition-transform" />
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link to="/programs">
                <Button variant="outline" size="lg" className="border-2 border-purple-600 text-purple-600 hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 hover:text-white hover:border-transparent font-semibold shadow-md hover:shadow-xl transition-all duration-300 px-8 py-3">
                  View All Programs
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default FeaturedPrograms;