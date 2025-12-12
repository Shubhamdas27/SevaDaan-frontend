import { NGO, Program, VolunteerOpportunity, Testimonial } from '../types';

// Transform backend data to frontend types
export const transformNGO = (backendNGO: any): NGO => {
  return {
    id: backendNGO._id || backendNGO.id,
    name: backendNGO.name,
    logo: backendNGO.logo,
    description: backendNGO.description,
    mission: backendNGO.mission || backendNGO.description,
    address: backendNGO.address || backendNGO.location?.address || '',
    city: backendNGO.city || backendNGO.location?.city || '',
    state: backendNGO.state || backendNGO.location?.state || '',
    contactEmail: backendNGO.contactEmail || backendNGO.email,
    contactPhone: backendNGO.contactPhone || backendNGO.phone,
    website: backendNGO.website,
    socialLinks: backendNGO.socialLinks,
    createdAt: backendNGO.createdAt,
    updatedAt: backendNGO.updatedAt,
  };
};

export const transformProgram = (backendProgram: any): Program => {
  return {
    id: backendProgram._id || backendProgram.id,
    ngoId: backendProgram.ngo?._id || backendProgram.ngoId,
    title: backendProgram.title,
    description: backendProgram.description,
    startDate: backendProgram.startDate,
    endDate: backendProgram.endDate,
    location: backendProgram.location?.city || backendProgram.location || '',
    status: backendProgram.status === 'active' ? 'ongoing' : backendProgram.status,
    eligibilityCriteria: backendProgram.eligibilityCriteria,
    capacity: backendProgram.beneficiariesCount,
    currentParticipants: backendProgram.volunteersRegistered,
    imageUrl: backendProgram.images?.[0] || backendProgram.imageUrl,
    createdAt: backendProgram.createdAt,
    updatedAt: backendProgram.updatedAt,
  };
};

export const transformVolunteerOpportunity = (backendOpportunity: any): VolunteerOpportunity => {
  return {
    id: backendOpportunity._id || backendOpportunity.id,
    ngoId: backendOpportunity.ngo?._id || backendOpportunity.ngoId,
    title: backendOpportunity.title,
    description: backendOpportunity.description,
    location: backendOpportunity.location?.city || backendOpportunity.location || '',
    startDate: backendOpportunity.startDate,
    endDate: backendOpportunity.endDate,
    skills: backendOpportunity.skills || [],
    requiredHours: backendOpportunity.requiredHours || backendOpportunity.duration || 8,
    status: backendOpportunity.status === 'active' ? 'open' : backendOpportunity.status,
    imageUrl: backendOpportunity.imageUrl || backendOpportunity.images?.[0],
    createdAt: backendOpportunity.createdAt,
    updatedAt: backendOpportunity.updatedAt,
  };
};

export const transformTestimonial = (backendTestimonial: any): Testimonial => {
  return {
    id: backendTestimonial._id || backendTestimonial.id,
    ngoId: backendTestimonial.ngo?._id || backendTestimonial.ngoId,
    authorName: backendTestimonial.authorName || backendTestimonial.name,
    authorRole: backendTestimonial.authorRole || backendTestimonial.role,
    content: backendTestimonial.content || backendTestimonial.message,
    rating: backendTestimonial.rating || 5,
    date: backendTestimonial.date || backendTestimonial.createdAt,
    avatar: backendTestimonial.avatar,
  };
};
