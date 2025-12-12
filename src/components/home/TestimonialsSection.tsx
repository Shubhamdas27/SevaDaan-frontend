import React, { useState, useEffect } from 'react';
import { Quote, Star } from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { Spinner } from '../ui/Spinner';
import { Testimonial } from '../../types';
import { formatDate } from '../../lib/utils';

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
  loading?: boolean;
  error?: string | null;
}

const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ testimonials, loading, error }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (testimonials.length === 0) return;
    
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  const handleDotClick = (index: number) => {
    setActiveIndex(index);
  };

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-br from-mint-50 to-primary-50/50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-primary-800">Testimonials</h2>
            <p className="text-primary-600 max-w-2xl mx-auto">
              Hear from the people whose lives have been impacted by our NGO partners.
            </p>
          </div>
          <div className="flex justify-center">
            <Spinner size="lg" />
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-gradient-to-br from-mint-50 to-primary-50/50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-primary-800">Testimonials</h2>
            <p className="text-primary-600 max-w-2xl mx-auto">
              Hear from the people whose lives have been impacted by our NGO partners.
            </p>
          </div>
          <div className="text-center text-coral-600">
            <p>Error loading testimonials: {error}</p>
          </div>
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) {
    return (
      <section className="py-16 bg-gradient-to-br from-mint-50 to-primary-50/50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-primary-800">Testimonials</h2>
            <p className="text-primary-600 max-w-2xl mx-auto">
              Hear from the people whose lives have been impacted by our NGO partners.
            </p>
          </div>
          <div className="text-center text-primary-600">
            <p>No testimonials available at the moment.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 via-purple-50/30 to-pink-50/30 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-10 right-10 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute bottom-10 left-10 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      
      <div className="container relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">What People Say</h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg">
            Hear from the people whose lives have been impacted by our NGO partners.
          </p>
        </div>

        <div className="max-w-4xl mx-auto relative">
          <div className="absolute -top-8 -left-4 text-purple-200 z-0">
            <Quote className="w-32 h-32 rotate-180 opacity-50" />
          </div>
          
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className={`transition-opacity duration-500 px-6 ${
                activeIndex === index ? 'opacity-100' : 'opacity-0 absolute inset-0'
              }`}
            >
              <div className="bg-white rounded-xl p-8 shadow-sm relative z-10 border border-slate-200">
                <div className="mb-6 flex justify-center">
                  {[...Array(testimonial.rating || 5)].map((_, i) => (
                    <Star key={`star-${testimonial.id}-${i}`} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                
                <p className="text-lg text-primary-700 text-center mb-8 italic">
                  "{testimonial.content}"
                </p>
                
                <div className="flex flex-col items-center">
                  <Avatar
                    src={testimonial.avatar}
                    alt={testimonial.authorName}
                    name={testimonial.authorName}
                    size="lg"
                    className="mb-3"
                  />
                  <h4 className="text-lg font-semibold text-primary-800">{testimonial.authorName}</h4>
                  {testimonial.authorRole && (
                    <p className="text-sm text-primary-500">{testimonial.authorRole}</p>
                  )}
                  <p className="text-xs text-primary-400 mt-1">{formatDate(testimonial.date)}</p>
                </div>
              </div>
            </div>
          ))}
          
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  activeIndex === index ? 'bg-primary-600' : 'bg-mint-300 hover:bg-mint-400'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;