import React, { useEffect, useState } from 'react';
import Layout from '../components/common/Layout';
import Hero from '../components/home/Hero';
import FeaturedNGOs from '../components/home/FeaturedNGOs';
import FeaturedPrograms from '../components/home/FeaturedPrograms';
import TestimonialsSection from '../components/home/TestimonialsSection';
import VolunteerCta from '../components/home/VolunteerCta';
import { useNGOs, usePrograms, useTestimonials, useVolunteerOpportunities } from '../hooks/useApiHooks';
import { NGO, Program, Testimonial, VolunteerOpportunity } from '../types';

// Mock data for demonstration
const mockNGOs: NGO[] = [
  {
    id: '1',
    name: 'Smile Foundation',
    logo: 'https://images.pexels.com/photos/8422150/pexels-photo-8422150.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Working towards providing education and healthcare to underprivileged children across India.',
    mission: 'Empowering underprivileged children through education and healthcare',
    address: '123 Main Street',
    city: 'Delhi',
    state: 'Delhi',
    contactEmail: 'contact@smilefoundation.org',
    contactPhone: '+91-9876543210',
    website: 'https://smilefoundation.org',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Akshaya Patra Foundation',
    logo: 'https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Providing nutritious meals to school children to combat hunger and promote education.',
    mission: 'Eliminating classroom hunger and attracting children to education',
    address: '456 Food Street',
    city: 'Bangalore',
    state: 'Karnataka',
    contactEmail: 'info@akshayapatra.org',
    contactPhone: '+91-9876543211',
    website: 'https://akshayapatra.org',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    name: 'Goonj - Voice of the Voiceless',
    logo: 'https://images.pexels.com/photos/6995301/pexels-photo-6995301.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Converting urban surplus into rural development through clothing and material donation.',
    mission: 'Making social impact through innovative solutions',
    address: '789 Social Street',
    city: 'Mumbai',
    state: 'Maharashtra',
    contactEmail: 'contact@goonj.org',
    contactPhone: '+91-9876543212',
    website: 'https://goonj.org',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '4',
    name: 'CRY - Child Rights and You',
    logo: 'https://images.pexels.com/photos/5205856/pexels-photo-5205856.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Ensuring happier childhoods for underprivileged children through education, healthcare, and protection.',
    mission: 'Restoring childhood to every child in India',
    address: '12 Children Street',
    city: 'Mumbai',
    state: 'Maharashtra',
    contactEmail: 'info@cry.org',
    contactPhone: '+91-9876543213',
    website: 'https://cry.org',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '5',
    name: 'Helpage India',
    logo: 'https://images.pexels.com/photos/8422186/pexels-photo-8422186.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Working for the cause and care of disadvantaged elderly through programs on healthcare, income generation, and disaster relief.',
    mission: 'Creating a caring society for the elderly',
    address: '45 Elder Care Road',
    city: 'Delhi',
    state: 'Delhi',
    contactEmail: 'info@helpageindia.org',
    contactPhone: '+91-9876543214',
    website: 'https://helpageindia.org',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

const mockPrograms: Program[] = [
  {
    id: '1',
    ngoId: '1',
    title: 'Education for All',
    description: 'Providing quality education to children in rural areas through innovative teaching methods.',
    startDate: '2024-01-15T00:00:00Z',
    endDate: '2024-12-15T00:00:00Z',
    location: 'Rural Delhi',
    status: 'ongoing',
    eligibilityCriteria: 'Children aged 6-14 years',
    capacity: 100,
    currentParticipants: 75,
    imageUrl: 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    createdAt: '2023-12-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    ngoId: '2',
    title: 'Mid-Day Meal Program',
    description: 'Nutritious meals for school children to improve attendance and health outcomes.',
    startDate: '2024-01-01T00:00:00Z',
    location: 'Karnataka Schools',
    status: 'ongoing',
    eligibilityCriteria: 'Government school students',
    capacity: 10000,
    currentParticipants: 8500,
    imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    createdAt: '2023-12-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    ngoId: '3',
    title: 'Cloth for Work',
    description: 'Dignified development through converting urban surplus into rural development.',
    startDate: '2024-02-01T00:00:00Z',
    location: 'Maharashtra Villages',
    status: 'upcoming',
    eligibilityCriteria: 'Rural communities',
    capacity: 500,
    currentParticipants: 0,
    imageUrl: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

const mockTestimonials: Testimonial[] = [
  {
    id: '1',
    ngoId: '1',
    authorName: 'Priya Sharma',
    authorRole: 'Volunteer',
    content: 'Working with this NGO has been incredibly rewarding. Seeing the smile on children\'s faces when they learn something new is priceless.',
    rating: 5,
    date: '2024-01-15T00:00:00Z',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b1e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
  },
  {
    id: '2',
    ngoId: '2',
    authorName: 'Raj Kumar',
    authorRole: 'Parent',
    content: 'The mid-day meal program has significantly improved my child\'s attendance and health. Thank you for this wonderful initiative.',
    rating: 5,
    date: '2024-01-10T00:00:00Z',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
  },
  {
    id: '3',
    ngoId: '3',
    authorName: 'Sunita Devi',
    authorRole: 'Beneficiary',
    content: 'The clothing and materials provided helped our village during difficult times. It\'s amazing how small contributions can make such a big difference.',
    rating: 5,
    date: '2024-01-05T00:00:00Z',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
  }
];

const mockOpportunities: VolunteerOpportunity[] = [
  {
    id: '1',
    ngoId: '1',
    title: 'Teaching Assistant',
    description: 'Help children with their studies and assist teachers in conducting classes.',
    location: 'Delhi',
    startDate: '2024-02-01T00:00:00Z',
    endDate: '2024-06-30T00:00:00Z',
    skills: ['Teaching', 'Communication', 'Patience'],
    requiredHours: 10,
    status: 'open',
    imageUrl: 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    ngoId: '2',
    title: 'Meal Distribution Volunteer',
    description: 'Assist in preparing and distributing meals to school children.',
    location: 'Bangalore',
    startDate: '2024-01-20T00:00:00Z',
    skills: ['Organization', 'Time Management'],
    requiredHours: 5,
    status: 'open',
    imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

const Home: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [ngos, setNgos] = useState<NGO[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [opportunities, setOpportunities] = useState<VolunteerOpportunity[]>([]);
  
  // Use API hooks for backend calls
  const { 
    ngos: apiNgos, 
    loading: ngosLoading, 
    fetchNGOs 
  } = useNGOs();
  
  const { 
    programs: apiPrograms, 
    loading: programsLoading, 
    fetchPrograms 
  } = usePrograms();
  
  const { 
    testimonials: apiTestimonials, 
    loading: testimonialsLoading, 
    fetchTestimonials 
  } = useTestimonials();
  
  const { 
    opportunities: apiOpportunities, 
    loading: opportunitiesLoading, 
    fetchVolunteerOpportunities 
  } = useVolunteerOpportunities();

  useEffect(() => {
    // Try to fetch data from backend, fallback to mock data if error
    const loadData = async () => {
      try {
        // Attempt to fetch from backend
        await Promise.all([
          fetchNGOs({ limit: 6 }),
          fetchPrograms({ limit: 6 }),
          fetchTestimonials({ limit: 3 }),
          fetchVolunteerOpportunities({ limit: 3 })
        ]);
        
        // If successful, use API data
        if (apiNgos.length > 0) setNgos(apiNgos);
        else setNgos(mockNGOs);
        
        if (apiPrograms.length > 0) setPrograms(apiPrograms);
        else setPrograms(mockPrograms);
        
        if (apiTestimonials.length > 0) setTestimonials(apiTestimonials);
        else setTestimonials(mockTestimonials);
        
        if (apiOpportunities.length > 0) setOpportunities(apiOpportunities);
        else setOpportunities(mockOpportunities);
        
      } catch {
        // If backend fails, use mock data
        console.log('Backend unavailable, using mock data');
        setNgos(mockNGOs);
        setPrograms(mockPrograms);
        setTestimonials(mockTestimonials);
        setOpportunities(mockOpportunities);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [fetchNGOs, fetchPrograms, fetchTestimonials, fetchVolunteerOpportunities]);

  // Update state when API data changes
  useEffect(() => {
    if (apiNgos.length > 0) setNgos(apiNgos);
  }, [apiNgos]);

  useEffect(() => {
    if (apiPrograms.length > 0) setPrograms(apiPrograms);
  }, [apiPrograms]);

  useEffect(() => {
    if (apiTestimonials.length > 0) setTestimonials(apiTestimonials);
  }, [apiTestimonials]);

  useEffect(() => {
    if (apiOpportunities.length > 0) setOpportunities(apiOpportunities);
  }, [apiOpportunities]);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading SevaDaan...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-0">
        <Hero />
        <FeaturedNGOs 
          ngos={ngos} 
          loading={ngosLoading} 
          error={null} 
        />
        <FeaturedPrograms 
          programs={programs} 
          loading={programsLoading} 
          error={null} 
        />
        <TestimonialsSection 
          testimonials={testimonials} 
          loading={testimonialsLoading} 
          error={null} 
        />
        <VolunteerCta 
          opportunities={opportunities} 
          loading={opportunitiesLoading} 
          error={null} 
        />
      </div>
    </Layout>
  );
};

export default Home;