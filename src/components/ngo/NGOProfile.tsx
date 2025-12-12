import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import { Card, CardContent } from '../ui/Card';
import { StatusBadge } from '../ui/StatusBadge';
import { NoticeBoard } from '../ui/NoticeBoard';
import { ProgressBar } from '../ui/ProgressBar';
import { Icons } from '../icons';
import { NGO, Program, Testimonial, MediaItem, Notice } from '../../types';
import { formatDate, truncateText } from '../../utils/formatters';

interface NGOProfileProps {
  ngo: NGO;
  programs: Program[];
  testimonials: Testimonial[];
  mediaItems: MediaItem[];
  notices: Notice[];
}

const NGOProfile: React.FC<NGOProfileProps> = ({ 
  ngo, 
  programs, 
  testimonials, 
  mediaItems, 
  notices 
}) => {
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);

  const handlePrevMedia = () => {
    setActiveMediaIndex((prevIndex) => 
      prevIndex === 0 ? mediaItems.length - 1 : prevIndex - 1
    );
  };

  const handleNextMedia = () => {
    setActiveMediaIndex((prevIndex) => 
      (prevIndex + 1) % mediaItems.length
    );
  };

  const activeMedia = mediaItems[activeMediaIndex];

  return (
    <div className="min-h-screen bg-white">
      {/* Modern Compact Hero with Photo Background */}
      <section className="relative h-64 overflow-hidden">
        {/* Hero Background Image */}
        <div className="absolute inset-0">
          <img 
            src={ngo.logo || mediaItems[0]?.url || 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1200'}
            alt="NGO Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/90 via-pink-900/80 to-indigo-900/90"></div>
        </div>
        
        <div className="container relative z-10 h-64 flex items-center">
          <div className="flex items-center gap-6 w-full">
            {/* Compact Logo with Photo */}
            <div className="relative">
              <div className="w-24 h-24 rounded-2xl overflow-hidden bg-white shadow-2xl ring-4 ring-white/50">
                <img 
                  src={
                    ngo.logo ||
                    `https://images.pexels.com/photos/${
                      ['6646914', '6647068', '6995301', '8422150', '6646918', '5205856', '8422186', '6646907'][
                        (ngo.id?.charCodeAt(0) || 0) % 8
                      ]
                    }/pexels-photo-${
                      ['6646914', '6647068', '6995301', '8422150', '6646918', '5205856', '8422186', '6646907'][
                        (ngo.id?.charCodeAt(0) || 0) % 8
                      ]
                    }.jpeg?auto=compress&cs=tinysrgb&w=400`
                  }
                  alt={ngo.name} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.pexels.com/photos/6646914/pexels-photo-6646914.jpeg?auto=compress&cs=tinysrgb&w=400';
                  }}
                />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-green-500 text-white p-1.5 rounded-full shadow-lg">
                <Icons.success className="w-3 h-3" />
              </div>
            </div>
            
            {/* Compact NGO Info */}
            <div className="flex-1">
              <div className="inline-flex items-center bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-semibold mb-2">
                <Icons.success className="w-3 h-3 mr-1" />
                Verified NGO
              </div>
              
              <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">
                {ngo.name}
              </h1>
              
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="flex items-center text-white/90 text-sm">
                  <Icons.location className="w-4 h-4 mr-1" />
                  {ngo.city}, {ngo.state}
                </span>
                
                <span className="text-white/70">•</span>
                
                <span className="flex items-center text-white/90 text-sm">
                  <Icons.users className="w-4 h-4 mr-1" />
                  Since {new Date().getFullYear() - 5}
                </span>
                
                {ngo.website && (
                  <>
                    <span className="text-white/70">•</span>
                    <a 
                      href={ngo.website} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex items-center text-white/90 hover:text-white text-sm transition-colors"
                    >
                      <Icons.externalLink className="w-4 h-4 mr-1" />
                      Website
                    </a>
                  </>
                )}
              </div>
              
              <p className="text-white/90 text-sm max-w-2xl mb-3 line-clamp-2">
                {ngo.description}
              </p>
              
              {/* Compact Action Buttons */}
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-semibold px-4 py-2 rounded-lg transition-all"
                >
                  <Icons.favorite className="w-4 h-4 mr-1" />
                  Donate
                </Button>
                
                <Button 
                  size="sm"
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-semibold px-4 py-2 rounded-lg transition-all"
                >
                  <Icons.users className="w-4 h-4 mr-1" />
                  Volunteer
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Content Grid */}
      <div className="container mx-auto px-4 -mt-8 relative z-20">
        {/* Photo Gallery Preview */}
        {mediaItems.length > 0 && (
          <div className="mb-6">
            <div className="grid grid-cols-4 gap-2">
              {mediaItems.slice(0, 4).map((media, index) => (
                <div key={media.id} className="relative h-32 rounded-lg overflow-hidden group cursor-pointer shadow-lg">
                  <img 
                    src={media.url} 
                    alt={media.title || `Gallery ${index + 1}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4">
            {/* Compact Mission Card with Photo */}
            <Card className="bg-white shadow-md border-0 overflow-hidden rounded-xl hover:shadow-lg transition-all">
              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-48 h-48 md:h-auto flex-shrink-0">
                  <img 
                    src={
                      (mediaItems && mediaItems.length > 0 ? mediaItems[0].url : null) ||
                      ngo.logo ||
                      `https://images.pexels.com/photos/${
                        ['8422150', '6646918', '6995301', '5205856', '8422186', '6647068', '6646907', '6647112'][
                          (ngo.id?.charCodeAt(0) || 0) % 8
                        ]
                      }/pexels-photo-${
                        ['8422150', '6646918', '6995301', '5205856', '8422186', '6647068', '6646907', '6647112'][
                          (ngo.id?.charCodeAt(0) || 0) % 8
                        ]
                      }.jpeg?auto=compress&cs=tinysrgb&w=600`
                    }
                    alt="Mission"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.pexels.com/photos/6647068/pexels-photo-6647068.jpeg?auto=compress&cs=tinysrgb&w=600';
                    }}
                  />
                </div>
                <CardContent className="p-6 flex-1">
                  <div className="flex items-center mb-3">
                    <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-2 rounded-lg mr-3">
                      <Icons.target className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800">Our Mission</h2>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    {ngo.mission || ngo.description || 'Dedicated to making a positive impact in communities through innovative programs and sustainable initiatives. We believe in empowering individuals and creating lasting change through education, healthcare, and social welfare programs.'}
                  </p>
                </CardContent>
              </div>
            </Card>

            {/* Compact Programs Grid with Photos */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-2 rounded-lg mr-2">
                    <Icons.calendar className="w-4 h-4 text-white" />
                  </div>
                  <h2 className="text-lg font-bold text-gray-800">Programs</h2>
                </div>
                <span className="text-sm text-gray-500">{programs.length} active</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {programs.length === 0 ? (
                  <Card className="col-span-2 bg-gradient-to-br from-blue-50 to-cyan-50 border-0 rounded-xl">
                    <CardContent className="text-center py-8">
                      <Icons.calendar className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600 text-sm">No programs yet</p>
                    </CardContent>
                  </Card>
                ) : (
                  programs.slice(0, 4).map((program) => (
                    <Link key={program.id} to={`/programs/detail/${program.id}`}>
                      <Card className="bg-white shadow-sm border-0 overflow-hidden hover:shadow-md transition-all rounded-xl group cursor-pointer h-full">
                        <div className="relative h-36 overflow-hidden">
                          <img 
                            src={program.imageUrl || 'https://images.pexels.com/photos/6646968/pexels-photo-6646968.jpeg?w=400'} 
                            alt={program.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                          <div className="absolute top-2 right-2">
                            <StatusBadge status={program.status} variant="solid" size="sm" />
                          </div>
                          <div className="absolute bottom-2 left-2 right-2">
                            <h3 className="text-white font-bold text-sm line-clamp-2">{program.title}</h3>
                          </div>
                        </div>
                        
                        <CardContent className="p-3">
                          <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                            <span className="flex items-center">
                              <Icons.location className="w-3 h-3 mr-1" />
                              {program.location}
                            </span>
                            <span className="flex items-center">
                              <Icons.users className="w-3 h-3 mr-1" />
                              {program.currentParticipants || 0}
                            </span>
                          </div>
                          
                          {program.capacity && program.currentParticipants !== undefined && (
                            <ProgressBar 
                              value={program.currentParticipants} 
                              max={program.capacity}
                              size="sm"
                              className="bg-gray-100"
                            />
                          )}
                        </CardContent>
                      </Card>
                    </Link>
                  ))
                )}
              </div>
              {programs.length > 4 && (
                <div className="mt-3">
                  <Link to={`/ngos/${ngo.id}/programs`}>
                    <Button variant="outline" size="sm" className="w-full rounded-lg">
                      View all {programs.length} programs →
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Compact Testimonials with Photos */}
            {testimonials.length > 0 && (
              <div>
                <div className="flex items-center mb-3">
                  <div className="bg-gradient-to-br from-pink-500 to-rose-500 p-2 rounded-lg mr-2">
                    <Icons.heart className="w-4 h-4 text-white" />
                  </div>
                  <h2 className="text-lg font-bold text-gray-800">Testimonials</h2>
                </div>
                <div className="space-y-3">
                  {testimonials.slice(0, 2).map((testimonial) => (
                    <Card key={testimonial.id} className="bg-white shadow-sm border-0 rounded-xl hover:shadow-md transition-all">
                      <CardContent className="p-4">
                        <div className="flex gap-3">
                          <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-pink-100">
                            <img 
                              src={testimonial.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.authorName)}&background=ec4899&color=fff&size=48`} 
                              alt={testimonial.authorName}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-800 text-sm">{testimonial.authorName}</h4>
                            {testimonial.authorRole && (
                              <p className="text-pink-600 text-xs mb-2">{testimonial.authorRole}</p>
                            )}
                            <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                              "{truncateText(testimonial.content, 120)}"
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Compact Photo Gallery */}
            {mediaItems.length > 0 && (
              <div>
                <div className="flex items-center mb-3">
                  <div className="bg-gradient-to-br from-orange-500 to-pink-500 p-2 rounded-lg mr-2">
                    <Icons.image className="w-4 h-4 text-white" />
                  </div>
                  <h2 className="text-lg font-bold text-gray-800">Gallery</h2>
                </div>
                <Card className="bg-white shadow-sm border-0 rounded-xl overflow-hidden">
                  <CardContent className="p-3">
                    <div className="relative">
                      <div className="h-48 rounded-lg overflow-hidden">
                        {activeMedia.type === 'image' ? (
                          <img 
                            src={activeMedia.url} 
                            alt={activeMedia.title || 'Gallery item'} 
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-900 to-black rounded-2xl">
                            <a 
                              href={activeMedia.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex flex-col items-center justify-center text-white hover:text-blue-300 transition-colors duration-300 group"
                            >
                              <Icons.video className="w-16 h-16 mb-4 group-hover:scale-110 transition-transform duration-300" />
                              <span className="text-xl font-bold">Watch Video</span>
                            </a>
                          </div>
                        )}
                      </div>
                      
                      {mediaItems.length > 1 && (
                        <>
                          <button 
                            className="absolute top-1/2 left-2 transform -translate-y-1/2 w-8 h-8 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-all"
                            onClick={handlePrevMedia}
                            aria-label="Previous image"
                          >
                            <Icons.chevronLeft className="w-4 h-4" />
                          </button>
                          
                          <button 
                            className="absolute top-1/2 right-2 transform -translate-y-1/2 w-8 h-8 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-all"
                            onClick={handleNextMedia}
                            aria-label="Next image"
                          >
                            <Icons.chevronRight className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                    
                    <div className="mt-3 grid grid-cols-4 gap-2">
                      {mediaItems.slice(0, 4).map((item, index) => (
                        <button 
                          key={item.id}
                          className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                            index === activeMediaIndex 
                              ? 'border-purple-500' 
                              : 'border-transparent hover:border-gray-300'
                          }`}
                          onClick={() => setActiveMediaIndex(index)}
                        >
                          <img 
                            src={item.url} 
                            alt={`Thumb ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {/* Enhanced Beautiful Sidebar */}
          <div className="space-y-4">
            {/* Compact Contact Card */}
            <Card className="bg-white shadow-sm border-0 rounded-xl overflow-hidden">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3">
                <div className="flex items-center text-white">
                  <Icons.phone className="w-4 h-4 mr-2" />
                  <h3 className="text-sm font-bold">Contact</h3>
                </div>
              </div>
              
              <CardContent className="p-3">
                <div className="space-y-2">
                  <div className="flex items-start p-2 bg-blue-50 rounded-lg hover:bg-blue-100 transition-all">
                    <Icons.location className="w-4 h-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-gray-800 font-medium">{ngo.address || '123 Main Street, Block A'}</p>
                      <p className="text-xs text-gray-600">{ngo.city || 'Mumbai'}, {ngo.state || 'Maharashtra'}</p>
                    </div>
                  </div>
                  
                  <a href={`tel:${ngo.contactPhone || '+91-9876543210'}`} className="flex items-center p-2 bg-green-50 rounded-lg hover:bg-green-100 transition-all">
                    <Icons.phone className="w-4 h-4 text-green-600 mr-2" />
                    <span className="text-xs text-green-700 font-medium">{ngo.contactPhone || '+91-9876543210'}</span>
                  </a>
                  
                  <a href={`mailto:${ngo.contactEmail || 'contact@ngo.org'}`} className="flex items-center p-2 bg-purple-50 rounded-lg hover:bg-purple-100 transition-all">
                    <Icons.email className="w-4 h-4 text-purple-600 mr-2" />
                    <span className="text-xs text-purple-700 font-medium truncate">{ngo.contactEmail || 'contact@ngo.org'}</span>
                  </a>
                  
                  {ngo.website && (
                    <a 
                      href={ngo.website} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex items-center p-2 bg-cyan-50 rounded-lg hover:bg-cyan-100 transition-all"
                    >
                      <Icons.externalLink className="w-4 h-4 text-cyan-600 mr-2" />
                      <span className="text-xs text-cyan-700 font-medium truncate">{new URL(ngo.website).hostname}</span>
                    </a>
                  )}
                </div>
                
                {ngo.socialLinks && (
                  <div className="mt-3 p-2 bg-gray-50 rounded-lg">
                    <h4 className="text-xs font-bold mb-2 text-gray-700">Social</h4>
                    <div className="flex justify-center space-x-2">
                      {ngo.socialLinks.facebook && (
                        <a 
                          href={ngo.socialLinks.facebook} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          aria-label="Facebook"
                          className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white hover:bg-blue-700 transition-all"
                        >
                          <Icons.facebook className="w-4 h-4" />
                        </a>
                      )}
                      {ngo.socialLinks.twitter && (
                        <a 
                          href={ngo.socialLinks.twitter} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          aria-label="Twitter"
                          className="w-8 h-8 rounded-lg bg-sky-500 flex items-center justify-center text-white hover:bg-sky-600 transition-all"
                        >
                          <Icons.twitter className="w-4 h-4" />
                        </a>
                      )}
                      {ngo.socialLinks.instagram && (
                        <a 
                          href={ngo.socialLinks.instagram} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          aria-label="Instagram"
                          className="w-8 h-8 rounded-lg bg-pink-500 flex items-center justify-center text-white hover:bg-pink-600 transition-all"
                        >
                          <Icons.instagram className="w-4 h-4" />
                        </a>
                      )}
                      {ngo.socialLinks.linkedin && (
                        <a 
                          href={ngo.socialLinks.linkedin} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          aria-label="LinkedIn"
                          className="w-8 h-8 rounded-lg bg-blue-700 flex items-center justify-center text-white hover:bg-blue-800 transition-all"
                        >
                          <Icons.linkedin className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Compact Action Buttons */}
            <div className="space-y-2">
              <Link to={`/donate/${ngo.id}`}>
                <Button 
                  className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-medium py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all text-sm"
                >
                  <Icons.favorite className="w-4 h-4 mr-2" />
                  Donate Now
                </Button>
              </Link>
              
              <Link to={`/volunteer/ngo/${ngo.id}`}>
                <Button 
                  variant="outline" 
                  className="w-full border-2 border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white font-medium py-2.5 rounded-lg transition-all text-sm"
                >
                  <Icons.users className="w-4 h-4 mr-2" />
                  Volunteer
                </Button>
              </Link>
              
              <Button 
                variant="outline" 
                className="w-full border-2 border-gray-300 text-gray-600 hover:bg-gray-100 font-medium py-2.5 rounded-lg transition-all text-sm"
              >
                <Icons.share className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>

            {/* Compact Notice Board */}
            <Card className="bg-white shadow-sm border-0 rounded-xl overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-500 to-cyan-500 p-3">
                <div className="flex items-center text-white">
                  <Icons.info className="w-4 h-4 mr-2" />
                  <h3 className="text-sm font-bold">Notices</h3>
                </div>
              </div>
              <CardContent className="p-3">
                <NoticeBoard notices={notices} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NGOProfile;