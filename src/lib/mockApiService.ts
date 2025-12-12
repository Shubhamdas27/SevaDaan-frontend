// Mock API responses for demo mode
export const mockApiResponses: Record<string, any> = {
  '/api/v1/dashboard/ngo-stats': {
    success: true,
    data: {
      totalDonations: 25000,
      totalPrograms: 12,
      totalBeneficiaries: 850,
      totalVolunteers: 45,
      recentDonations: [
        {
          id: 'demo-donation-1',
          amount: 5000,
          donorName: 'Anonymous Donor',
          date: new Date().toISOString(),
          status: 'completed'
        },
        {
          id: 'demo-donation-2',
          amount: 2500,
          donorName: 'John Smith',
          date: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          status: 'completed'
        }
      ],
      monthlyStats: [
        { month: 'Jan', donations: 15000, programs: 8 },
        { month: 'Feb', donations: 18000, programs: 10 },
        { month: 'Mar', donations: 22000, programs: 12 }
      ]
    }
  },
  '/api/v1/dashboard/admin-stats': {
    success: true,
    data: {
      totalNGOs: 156,
      totalUsers: 2450,
      totalDonations: 850000,
      totalPrograms: 89,
      pendingVerifications: 12,
      recentRegistrations: [
        {
          id: 'demo-ngo-1',
          name: 'Help India Foundation',
          registrationDate: new Date().toISOString(),
          status: 'pending'
        }
      ]
    }
  }
};

export const getMockResponse = (url: string) => {
  // Remove query parameters for matching
  const cleanUrl = url.split('?')[0];
  
  if (mockApiResponses[cleanUrl]) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: mockApiResponses[cleanUrl]
        });
      }, 500); // Simulate API delay
    });
  }
  
  // Default mock response for unknown endpoints
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: {
          success: true,
          data: null,
          message: 'Demo mode: This feature is not available in demo'
        }
      });
    }, 500);
  });
};
