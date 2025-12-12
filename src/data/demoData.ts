// Demo data for all dashboard features
export interface DemoProgram {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'pending' | 'completed';
  beneficiaries: number;
  startDate: string;
  budget: number;
  ngoId: string;
}

export interface DemoVolunteer {
  id: string;
  name: string;
  email: string;
  phone: string;
  skills: string[];
  status: 'active' | 'pending' | 'inactive';
  hoursContributed: number;
  joinDate: string;
}

export interface DemoGrant {
  id: string;
  title: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  category: string;
  submissionDate: string;
  organization: string;
}

export interface DemoDonation {
  id: string;
  donorName: string;
  amount: number;
  date: string;
  purpose: string;
  status: 'completed' | 'pending' | 'failed';
  receiptNumber: string;
  ngoName: string;
  isAnonymous: boolean;
}

export interface DemoCertificate {
  id: string;
  title: string;
  recipientName: string;
  type: 'donation' | 'volunteer' | 'completion';
  issueDate: string;
  amount?: number;
  description: string;
  downloadUrl: string;
}

export interface DemoInvoice {
  id: string;
  invoiceNumber: string;
  amount: number;
  date: string;
  status: 'paid' | 'pending' | 'overdue';
  description: string;
  dueDate: string;
}

export interface DemoApplication {
  id: string;
  type: 'emergency' | 'service' | 'program';
  title: string;
  status: 'pending' | 'approved' | 'rejected' | 'in-progress';
  submissionDate: string;
  description: string;
  ngoAssigned?: string;
}

// Demo data generators
export const getDemoPrograms = (): DemoProgram[] => {
  const basePrograms: DemoProgram[] = [
    {
      id: '1',
      title: 'Education for Rural Children',
      description: 'Providing quality education and learning materials to children in rural areas',
      status: 'active',
      beneficiaries: 150,
      startDate: '2024-01-15',
      budget: 500000,
      ngoId: 'ngo1'
    },
    {
      id: '2', 
      title: 'Clean Water Initiative',
      description: 'Installing water purification systems in underserved communities',
      status: 'active',
      beneficiaries: 250,
      startDate: '2024-03-01',
      budget: 750000,
      ngoId: 'ngo1'
    },
    {
      id: '3',
      title: 'Women Empowerment Training',
      description: 'Skill development and entrepreneurship training for women',
      status: 'pending',
      beneficiaries: 80,
      startDate: '2024-07-01',
      budget: 300000,
      ngoId: 'ngo2'
    },
    {
      id: '4',
      title: 'Healthcare Outreach Program',
      description: 'Mobile healthcare services for remote villages',
      status: 'completed',
      beneficiaries: 300,
      startDate: '2023-06-01',
      budget: 400000,
      ngoId: 'ngo1'
    }
  ];

  return basePrograms;
};

export const getDemoVolunteers = (): DemoVolunteer[] => [
  {
    id: '1',
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@email.com',
    phone: '+91 9876543210',
    skills: ['Teaching', 'Community Outreach'],
    status: 'active',
    hoursContributed: 120,
    joinDate: '2024-01-15'
  },
  {
    id: '2',
    name: 'Priya Sharma',
    email: 'priya.sharma@email.com', 
    phone: '+91 9876543211',
    skills: ['Healthcare', 'First Aid'],
    status: 'active',
    hoursContributed: 95,
    joinDate: '2024-02-20'
  },
  {
    id: '3',
    name: 'Amit Patel',
    email: 'amit.patel@email.com',
    phone: '+91 9876543212',
    skills: ['Water Systems', 'Engineering'],
    status: 'pending',
    hoursContributed: 0,
    joinDate: '2024-06-15'
  }
];

export const getDemoGrants = (): DemoGrant[] => [
  {
    id: '1',
    title: 'Education Infrastructure Grant',
    amount: 1000000,
    status: 'approved',
    category: 'Education',
    submissionDate: '2024-03-15',
    organization: 'Ministry of Education'
  },
  {
    id: '2',
    title: 'Healthcare Equipment Grant',
    amount: 750000,
    status: 'pending',
    category: 'Healthcare',
    submissionDate: '2024-05-20',
    organization: 'Health Foundation'
  },
  {
    id: '3',
    title: 'Water Purification Grant',
    amount: 500000,
    status: 'rejected',
    category: 'Environment',
    submissionDate: '2024-04-10',
    organization: 'Environmental Fund'
  }
];

export const getDemoDonations = (): DemoDonation[] => [
  {
    id: '1',
    donorName: 'Sunita Agarwal',
    amount: 5000,
    date: '2024-06-15',
    purpose: 'Education Program',
    status: 'completed',
    receiptNumber: 'RCP001',
    ngoName: 'Green Earth Foundation',
    isAnonymous: false
  },
  {
    id: '2',
    donorName: 'Anonymous Donor',
    amount: 10000,
    date: '2024-06-10',
    purpose: 'Healthcare Initiative',
    status: 'completed',
    receiptNumber: 'RCP002',
    ngoName: 'Hope for Tomorrow',
    isAnonymous: true
  },
  {
    id: '3',
    donorName: 'Rohit Mehta',
    amount: 3000,
    date: '2024-06-18',
    purpose: 'Water Project',
    status: 'pending',
    receiptNumber: 'RCP003',
    ngoName: 'Education for All',
    isAnonymous: false
  }
];

export const getDemoCertificates = (role: string): DemoCertificate[] => {
  const baseCertificates: DemoCertificate[] = [
    {
      id: '1',
      title: 'Donation Tax Certificate',
      recipientName: 'Sunita Agarwal',
      type: 'donation',
      issueDate: '2024-06-15',
      amount: 5000,
      description: 'Tax deduction certificate for donation to Education Program under Section 80G',
      downloadUrl: '/api/certificates/1/download'
    },
    {
      id: '2',
      title: 'Volunteer Service Certificate',
      recipientName: 'Rajesh Kumar',
      type: 'volunteer',
      issueDate: '2024-06-01',
      description: 'Certificate of appreciation for 120 hours of volunteer service in community development',
      downloadUrl: '/api/certificates/2/download'
    },
    {
      id: '3',
      title: 'Healthcare Training Certificate',
      recipientName: 'Priya Sharma',
      type: 'completion',
      issueDate: '2024-05-30',
      description: 'Certificate for successful completion of Healthcare Training Program',
      downloadUrl: '/api/certificates/3/download'
    },
    {
      id: '4',
      title: 'Annual Donation Receipt',
      recipientName: 'Rohit Mehta',
      type: 'donation',
      issueDate: '2024-03-31',
      amount: 25000,
      description: 'Annual consolidated donation receipt for financial year 2023-24',
      downloadUrl: '/api/certificates/4/download'
    },
    {
      id: '5',
      title: 'Program Management Certificate',
      recipientName: 'Admin User',
      type: 'completion',
      issueDate: '2024-04-15',
      description: 'Certificate for successful completion of NGO Management and Leadership Program',
      downloadUrl: '/api/certificates/5/download'
    },
    {
      id: '6',
      title: 'Community Impact Certificate',
      recipientName: 'Volunteer Team',
      type: 'volunteer',
      issueDate: '2024-05-01',
      description: 'Certificate recognizing outstanding contribution to community welfare programs',
      downloadUrl: '/api/certificates/6/download'
    }
  ];

  // Filter certificates based on role
  switch (role) {
    case 'donor':
      return baseCertificates.filter(cert => cert.type === 'donation');
    case 'volunteer':
      return baseCertificates.filter(cert => cert.type === 'volunteer' || cert.type === 'completion');
    case 'citizen':
      return baseCertificates.filter(cert => cert.type === 'completion');
    case 'ngo':
    case 'ngo_admin':
    case 'ngo_manager':
      return baseCertificates;
    default:
      return baseCertificates.slice(0, 3);
  }
};

export const getDemoInvoices = (): DemoInvoice[] => [
  {
    id: '1',
    invoiceNumber: 'INV-2024-001',
    amount: 25000,
    date: '2024-06-01',
    status: 'paid',
    description: 'Program Implementation Services',
    dueDate: '2024-06-30'
  },
  {
    id: '2',
    invoiceNumber: 'INV-2024-002',
    amount: 15000,
    date: '2024-06-15',
    status: 'pending',
    description: 'Training and Consultation Services',
    dueDate: '2024-07-15'
  },
  {
    id: '3',
    invoiceNumber: 'INV-2024-003',
    amount: 8000,
    date: '2024-05-20',
    status: 'overdue',
    description: 'Equipment Maintenance Services',
    dueDate: '2024-06-20'
  }
];

export const getDemoApplications = (): DemoApplication[] => [
  {
    id: '1',
    type: 'emergency',
    title: 'Medical Emergency Assistance',
    status: 'approved',
    submissionDate: '2024-06-10',
    description: 'Urgent medical treatment required for family member',
    ngoAssigned: 'Hope for Tomorrow'
  },
  {
    id: '2',
    type: 'service',
    title: 'Educational Support Request',
    status: 'in-progress',
    submissionDate: '2024-06-05',
    description: 'Request for educational materials and tutoring support',
    ngoAssigned: 'Education for All'
  },
  {
    id: '3',
    type: 'program',
    title: 'Skill Development Program Application',
    status: 'pending',
    submissionDate: '2024-06-18',
    description: 'Application to join women empowerment training program'
  }
];

// Mock API functions for downloads
export const downloadCertificate = async (certificateId: string) => {
  // Simulate PDF download
  const link = document.createElement('a');
  link.href = `data:application/pdf;base64,JVBERi0xLjQKJdPr6eEKMSAwIG9iago8PAovVGl0bGUgKENlcnRpZmljYXRlKQovQ3JlYXRvciAoU2V2YSBEYWFuKQovUHJvZHVjZXIgKFNldmEgRGFhbikKPj4KZW5kb2JqCjIgMCBvYmoKPDwKL1R5cGUgL0NhdGFsb2cKL1BhZ2VzIDMgMCBSCj4+CmVuZG9iagozIDAgb2JqCjw8Ci9UeXBlIC9QYWdlcwovS2lkcyBbNSAwIFJdCi9Db3VudCAxCj4+CmVuZG9iago1IDAgb2JqCjw8Ci9UeXBlIC9QYWdlCi9QYXJlbnQgMyAwIFIKL1Jlc291cmNlcyA8PAovRm9udCA8PAovRjEgNiAwIFIKPj4KPj4KL01lZGlhQm94IFswIDAgNjEyIDc5Ml0KL0NvbnRlbnRzIDcgMCBSCj4+CmVuZG9iago2IDAgb2JqCjw8Ci9UeXBlIC9Gb250Ci9TdWJ0eXBlIC9UeXBlMQovQmFzZUZvbnQgL0hlbHZldGljYQo+PgplbmRvYmoKNyAwIG9iago8PAovTGVuZ3RoIDQ0Cj4+CnN0cmVhbQpCVAovRjEgMTIgVGYKNzIgNzIwIFRkCihDZXJ0aWZpY2F0ZSBvZiBBcHByZWNpYXRpb24pIFRqCkVUCmVuZHN0cmVhbQplbmRvYmoKeHJlZgowIDgKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDA5IDAwMDAwIG4gCjAwMDAwMDAwNzQgMDAwMDAgbiAKMDAwMDAwMDEyMCAwMDAwMCBuIAowMDAwMDAwMTc3IDAwMDAwIG4gCjAwMDAwMDAzMzkgMDAwMDAgbiAKMDAwMDAwMDM2OSAwMDAwMCBuIAowMDAwMDAwNDI5IDAwMDAwIG4gCnRyYWlsZXIKPDwKL1NpemUgOAovUm9vdCAyIDAgUgo+PgpzdGFydHhyZWYKNTE4CiUlRU9G`;
  link.download = `certificate-${certificateId}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  return { success: true, message: 'Certificate downloaded successfully' };
};

export const downloadInvoice = async (invoiceId: string) => {
  // Simulate PDF download
  const link = document.createElement('a');
  link.href = `data:application/pdf;base64,JVBERi0xLjQKJdPr6eEKMSAwIG9iago8PAovVGl0bGUgKEludm9pY2UpCi9DcmVhdG9yIChTZXZhIERhYW4pCi9Qcm9kdWNlciAoU2V2YSBEYWFuKQo+PgplbmRvYmoKMiAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwovUGFnZXMgMyAwIFIKPj4KZW5kb2JqCjMgMCBvYmoKPDwKL1R5cGUgL1BhZ2VzCi9LaWRzIFs1IDAgUl0KL0NvdW50IDEKPD4KZW5kb2JqCjUgMCBvYmoKPDwKL1R5cGUgL1BhZ2UKL1BhcmVudCAzIDAgUgovUmVzb3VyY2VzIDw8Ci9Gb250IDw8Ci9GMSA2IDAgUgo+Pgo+PgovTWVkaWFCb3ggWzAgMCA2MTIgNzkyXQovQ29udGVudHMgNyAwIFIKPj4KZW5kb2JqCjYgMCBvYmoKPDwKL1R5cGUgL0ZvbnQKL1N1YnR5cGUgL1R5cGUxCi9CYXNlRm9udCAvSGVsdmV0aWNhCj4+CmVuZG9iago3IDAgb2JqCjw8Ci9MZW5ndGggMzEKPj4Kc3RyZWFtCkJUCi9GMSAxMiBUZgo3MiA3MjAgVGQKKEludm9pY2UpIFRqCkVUCmVuZHN0cmVhbQplbmRvYmoKeHJlZgowIDgKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDA5IDAwMDAwIG4gCjAwMDAwMDAwNjYgMDAwMDAgbiAKMDAwMDAwMDExMiAwMDAwMCBuIAowMDAwMDAwMTY5IDAwMDAwIG4gCjAwMDAwMDAzMzEgMDAwMDAgbiAKMDAwMDAwMDM2MSAwMDAwMCBuIAowMDAwMDAwNDIxIDAwMDAwIG4gCnRyYWlsZXIKPDwKL1NpemUgOAovUm9vdCAyIDAgUgo+PgpzdGFydHhyZWYKNTAyCiUlRU9G`;
  link.download = `invoice-${invoiceId}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  return { success: true, message: 'Invoice downloaded successfully' };
};

export const downloadDonationReceipt = async (donationId: string) => {
  // Simulate PDF download
  const link = document.createElement('a');
  link.href = `data:application/pdf;base64,JVBERi0xLjQKJdPr6eEKMSAwIG9iago8PAovVGl0bGUgKERvbmF0aW9uIFJlY2VpcHQpCi9DcmVhdG9yIChTZXZhIERhYW4pCi9Qcm9kdWNlciAoU2V2YSBEYWFuKQo+PgplbmRvYmoKMiAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwovUGFnZXMgMyAwIFIKPj4KZW5kb2JqCjMgMCBvYmoKPDwKL1R5cGUgL1BhZ2VzCi9LaWRzIFs1IDAgUl0KL0NvdW50IDEKPD4KZW5kb2JqCjUgMCBvYmoKPDwKL1R5cGUgL1BhZ2UKL1BhcmVudCAzIDAgUgovUmVzb3VyY2VzIDw8Ci9Gb250IDw8Ci9GMSA2IDAgUgo+Pgo+PgovTWVkaWFCb3ggWzAgMCA2MTIgNzkyXQovQ29udGVudHMgNyAwIFIKPj4KZW5kb2JqCjYgMCBvYmoKPDwKL1R5cGUgL0ZvbnQKL1N1YnR5cGUgL1R5cGUxCi9CYXNlRm9udCAvSGVsdmV0aWNhCj4+CmVuZG9iago3IDAgb2JqCjw8Ci9MZW5ndGggNDMKPj4Kc3RyZWFtCkJUCi9GMSAxMiBUZgo3MiA3MjAgVGQKKERvbmF0aW9uIFJlY2VpcHQpIFRqCkVUCmVuZHN0cmVhbQplbmRvYmoKeHJlZgowIDgKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDA5IDAwMDAwIG4gCjAwMDAwMDAwNzggMDAwMDAgbiAKMDAwMDAwMDEyNCAwMDAwMCBuIAowMDAwMDAwMTgxIDAwMDAwIG4gCjAwMDAwMDAzNDMgMDAwMDAgbiAKMDAwMDAwMDM3MyAwMDAwMCBuIAowMDAwMDAwNDMzIDAwMDAwIG4gCnRyYWlsZXIKPDwKL1NpemUgOAovUm9vdCAyIDAgUgo+PgpzdGFydHhyZWYKNTI2CiUlRU9G`;
  link.download = `donation-receipt-${donationId}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  return { success: true, message: 'Donation receipt downloaded successfully' };
};
