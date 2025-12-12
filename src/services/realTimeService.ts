// Real-time service for simulating live data updates
// Interface definitions for real-time events
export interface RealTimeUpdate {
  type: 'dashboard' | 'notification' | 'chart' | 'user_activity';
  data: any;
  timestamp: string;
  userId?: string;
  role?: string;
}

export interface NotificationUpdate {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  read: boolean;
  userId: string;
}

export interface ChartUpdate {
  chartId: string;
  data: any[];
  type: 'bar' | 'line' | 'pie' | 'area';
  timestamp: string;
}

export interface DashboardMetrics {
  kpis: Array<{
    title: string;
    value: number | string;
    change: number;
    trend: 'up' | 'down' | 'neutral';
  }>;
  timestamp: string;
}

// Enhanced Real-time service with WebSocket integration
export class RealTimeService {
  private static instance: RealTimeService;
  private intervalId: number | null = null;
  private callbacks: Map<string, Function[]> = new Map();
  
  // Simulated data state
  private data = {
    stats: {
      activeVolunteers: 45,
      totalDonations: 285000,
      activeProgrammes: 12,
      beneficiariesThisMonth: 156,
      newVolunteersToday: 3,
      donationsToday: 15000,
      hoursLoggedToday: 89,
      certificatesIssued: 234,
      totalNGOs: 1,
      approvedVolunteers: 42,
      pendingVolunteers: 8,
      totalPrograms: 15,
      ongoingPrograms: 12,
      completedPrograms: 3
    },
    volunteers: [
      { id: 1, name: 'Rajesh Kumar', status: 'active', hours: 45, joined: '2024-01-15' },
      { id: 2, name: 'Priya Sharma', status: 'active', hours: 38, joined: '2024-02-20' },
      { id: 3, name: 'Amit Singh', status: 'pending', hours: 0, joined: '2024-06-19' },
    ],
    activities: [
      { id: 1, type: 'volunteer', message: 'New volunteer Rajesh Kumar joined', time: '5 minutes ago', icon: 'Users' },
      { id: 2, type: 'donation', message: 'Received ₹5,000 donation from Priya Sharma', time: '12 minutes ago', icon: 'DollarSign' },
      { id: 3, type: 'program', message: 'Education Support program reached 50 beneficiaries', time: '1 hour ago', icon: 'Target' },
    ],
    programs: [
      { id: 1, name: 'Education Support', status: 'active', beneficiaries: 156, budget: 50000 },
      { id: 2, name: 'Healthcare Initiative', status: 'active', beneficiaries: 89, budget: 75000 },
      { id: 3, name: 'Women Empowerment', status: 'planning', beneficiaries: 0, budget: 60000 },
    ],
    chartData: {
      volunteerTrend: [
        { day: 'Mon', volunteers: 42, hours: 156 },
        { day: 'Tue', volunteers: 45, hours: 189 },
        { day: 'Wed', volunteers: 38, hours: 142 },
        { day: 'Thu', volunteers: 52, hours: 203 },
        { day: 'Fri', volunteers: 48, hours: 178 },
        { day: 'Sat', volunteers: 35, hours: 134 },
        { day: 'Sun', volunteers: 29, hours: 98 }
      ],
      donationTrend: [
        { month: 'Jan', amount: 45000 },
        { month: 'Feb', amount: 52000 },
        { month: 'Mar', amount: 48000 },
        { month: 'Apr', amount: 61000 },
        { month: 'May', amount: 55000 },
        { month: 'Jun', amount: 73000 }
      ],
      programBreakdown: [
        { name: 'Education', value: 40, color: '#3b82f6' },
        { name: 'Healthcare', value: 30, color: '#10b981' },
        { name: 'Environment', value: 20, color: '#f59e0b' },
        { name: 'Other', value: 10, color: '#ef4444' }
      ]
    }
  };

  static getInstance(): RealTimeService {
    if (!RealTimeService.instance) {
      RealTimeService.instance = new RealTimeService();
    }
    return RealTimeService.instance;
  }

  // Subscribe to real-time updates
  subscribe(dataType: string, callback: Function): () => void {
    if (!this.callbacks.has(dataType)) {
      this.callbacks.set(dataType, []);
    }
    this.callbacks.get(dataType)?.push(callback);

    // Return unsubscribe function
    return () => {
      const callbacks = this.callbacks.get(dataType);
      if (callbacks) {
        const index = callbacks.indexOf(callback);
        if (index > -1) {
          callbacks.splice(index, 1);
        }
      }
    };
  }

  // Start real-time simulation
  startRealTimeSimulation() {
    if (this.intervalId) return; // Already running

    this.intervalId = window.setInterval(() => {
      this.simulateDataChanges();
      this.notifySubscribers();
    }, 5000); // Update every 5 seconds
  }

  // Stop real-time simulation
  stopRealTimeSimulation() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
  // Simulate realistic data changes
  private simulateDataChanges() {
    // Run realistic pattern simulation
    this.simulateRealisticPatterns();
    
    // Simulate volunteers joining/leaving
    if (Math.random() > 0.7) {
      this.data.stats.activeVolunteers += Math.random() > 0.6 ? 1 : -1;
      this.data.stats.newVolunteersToday += Math.random() > 0.8 ? 1 : 0;
    }

    // Simulate donations
    if (Math.random() > 0.6) {
      const donationAmount = Math.floor(Math.random() * 10000) + 1000;
      this.recordDonation(donationAmount);
    }

    // Simulate volunteer hours
    if (Math.random() > 0.5) {
      this.data.stats.hoursLoggedToday += Math.floor(Math.random() * 5) + 1;
    }

    // Simulate beneficiaries increase
    if (Math.random() > 0.8) {
      this.data.stats.beneficiariesThisMonth += Math.floor(Math.random() * 3) + 1;
    }

    // Add new activities randomly
    if (Math.random() > 0.7) {
      this.addRandomActivity();
    }

    // Update chart data with some randomness
    this.updateChartData();
  }

  private addRandomActivity() {
    const activities = [
      { type: 'volunteer', message: 'New volunteer registration received', icon: 'Users' },
      { type: 'donation', message: `Received ₹${Math.floor(Math.random() * 5000) + 1000} donation`, icon: 'DollarSign' },
      { type: 'program', message: 'Program milestone achieved', icon: 'Target' },
      { type: 'certificate', message: 'Volunteer certificate issued', icon: 'Award' },
    ];

    const randomActivity = activities[Math.floor(Math.random() * activities.length)];
    this.data.activities.unshift({
      id: Date.now(),
      ...randomActivity,
      time: 'Just now'
    });

    // Keep only last 10 activities
    if (this.data.activities.length > 10) {
      this.data.activities = this.data.activities.slice(0, 10);
    }
  }

  private updateChartData() {
    // Update volunteer trend data
    const today = new Date().getDay();
    const dayIndex = today === 0 ? 6 : today - 1; // Convert Sunday=0 to index 6
    
    if (Math.random() > 0.6) {
      this.data.chartData.volunteerTrend[dayIndex].volunteers += Math.random() > 0.5 ? 1 : -1;
      this.data.chartData.volunteerTrend[dayIndex].hours += Math.floor(Math.random() * 10) - 5;
    }

    // Update donation trend
    const currentMonth = new Date().getMonth();
    if (currentMonth < this.data.chartData.donationTrend.length && Math.random() > 0.8) {
      this.data.chartData.donationTrend[currentMonth].amount += Math.floor(Math.random() * 5000);
    }
  }

  private notifySubscribers() {
    this.callbacks.forEach((callbacks, dataType) => {
      callbacks.forEach(callback => {
        try {
          callback(this.getData(dataType));
        } catch (error) {
          console.error('Error in real-time callback:', error);
        }
      });
    });
  }

  // Get specific data type
  getData(type: string) {
    switch (type) {
      case 'stats':
        return { ...this.data.stats };
      case 'activities':
        return [...this.data.activities];
      case 'volunteers':
        return [...this.data.volunteers];
      case 'programs':
        return [...this.data.programs];
      case 'chartData':
        return JSON.parse(JSON.stringify(this.data.chartData));
      default:
        return this.data;
    }
  }

  // Update data manually (for user actions)
  updateData(type: string, newData: any) {
    switch (type) {
      case 'stats':
        this.data.stats = { ...this.data.stats, ...newData };
        break;
      case 'volunteers':
        this.data.volunteers = newData;
        break;
      case 'programs':
        this.data.programs = newData;
        break;
      case 'activities':
        this.data.activities = newData;
        break;
    }
    
    // Immediately notify subscribers of manual updates
    const callbacks = this.callbacks.get(type);
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(this.getData(type));
        } catch (error) {
          console.error('Error in manual update callback:', error);
        }
      });
    }
  }

  // Add new manager (simulated)
  addManager(managerData: any) {
    // Simulate adding manager by updating relevant stats
    this.data.stats.activeVolunteers += 1;
    
    // Add activity
    this.data.activities.unshift({
      id: Date.now(),
      type: 'team',
      message: `New team member ${managerData.name} added`,
      time: 'Just now',
      icon: 'Users'
    });

    // Notify subscribers
    this.notifySubscribers();
  }
  // Add notification system
  addNotification(_type: string, message: string) {
    // Add to activities as well
    this.data.activities.unshift({
      id: Date.now(),
      type: 'notification',
      message,
      time: 'Just now',
      icon: 'Bell'
    });

    this.notifySubscribers();
  }

  // Enhanced program management
  addProgram(programData: any) {
    const newProgram = {
      id: Date.now(),
      name: programData.name,
      status: 'active',
      beneficiaries: 0,
      budget: programData.budget || 50000
    };
    
    this.data.programs.push(newProgram);
    this.data.stats.activeProgrammes += 1;
    this.data.stats.totalPrograms += 1;
    
    this.data.activities.unshift({
      id: Date.now(),
      type: 'program',
      message: `New program "${programData.name}" created`,
      time: 'Just now',
      icon: 'Target'
    });

    this.notifySubscribers();
  }

  // Volunteer approval system
  approveVolunteer(volunteerId: number) {
    const volunteer = this.data.volunteers.find(v => v.id === volunteerId);
    if (volunteer && volunteer.status === 'pending') {
      volunteer.status = 'active';
      this.data.stats.approvedVolunteers += 1;
      this.data.stats.pendingVolunteers -= 1;
      this.data.stats.activeVolunteers += 1;
      
      this.data.activities.unshift({
        id: Date.now(),
        type: 'volunteer',
        message: `Volunteer ${volunteer.name} approved and activated`,
        time: 'Just now',
        icon: 'Users'
      });

      this.notifySubscribers();
    }
  }

  // Donation tracking
  recordDonation(amount: number, donorName?: string) {
    this.data.stats.totalDonations += amount;
    this.data.stats.donationsToday += amount;
    
    // Update monthly donation chart
    const currentMonth = new Date().getMonth();
    if (currentMonth < this.data.chartData.donationTrend.length) {
      this.data.chartData.donationTrend[currentMonth].amount += amount;
    }
    
    const message = donorName 
      ? `Received ₹${amount.toLocaleString('en-IN')} donation from ${donorName}`
      : `Received ₹${amount.toLocaleString('en-IN')} donation`;
    
    this.data.activities.unshift({
      id: Date.now(),
      type: 'donation',
      message,
      time: 'Just now',
      icon: 'DollarSign'
    });

    this.notifySubscribers();
  }

  // Certificate issuance
  issueCertificate(recipientName: string, programName?: string) {
    this.data.stats.certificatesIssued += 1;
    
    const message = programName 
      ? `Certificate issued to ${recipientName} for ${programName}`
      : `Certificate issued to ${recipientName}`;
    
    this.data.activities.unshift({
      id: Date.now(),
      type: 'certificate',
      message,
      time: 'Just now',
      icon: 'Award'
    });

    this.notifySubscribers();
  }

  // Enhanced simulation with more realistic patterns
  private simulateRealisticPatterns() {
    const currentHour = new Date().getHours();
    const isBusinessHours = currentHour >= 9 && currentHour <= 17;
    const isWeekend = [0, 6].includes(new Date().getDay());
    
    // More activity during business hours
    const activityMultiplier = isBusinessHours && !isWeekend ? 1.5 : 0.5;
    
    // Simulate volunteer activities based on time
    if (Math.random() < 0.3 * activityMultiplier) {
      const volunteerNames = ['Rajesh', 'Priya', 'Amit', 'Sunita', 'Ravi', 'Kavya'];
      const randomName = volunteerNames[Math.floor(Math.random() * volunteerNames.length)];
      const hours = Math.floor(Math.random() * 6) + 1;
      
      this.data.stats.hoursLoggedToday += hours;
      this.data.activities.unshift({
        id: Date.now(),
        type: 'volunteer',
        message: `${randomName} logged ${hours} volunteer hours`,
        time: 'Just now',
        icon: 'Clock'
      });
    }
    
    // Simulate program updates
    if (Math.random() < 0.2 * activityMultiplier) {
      const programs = this.data.programs.filter(p => p.status === 'active');
      if (programs.length > 0) {
        const randomProgram = programs[Math.floor(Math.random() * programs.length)];
        const newBeneficiaries = Math.floor(Math.random() * 5) + 1;
        randomProgram.beneficiaries += newBeneficiaries;
        this.data.stats.beneficiariesThisMonth += newBeneficiaries;
        
        this.data.activities.unshift({
          id: Date.now(),
          type: 'program',
          message: `${randomProgram.name} reached ${newBeneficiaries} more beneficiaries`,
          time: 'Just now',
          icon: 'Target'
        });
      }
    }
  }

  // Demo functions for testing real-time features
  triggerDemoActivity() {
    const actions = [
      () => this.recordDonation(5000, 'Anonymous Donor'),
      () => this.approveVolunteer(3),
      () => this.issueCertificate('Rajesh Kumar', 'Education Support'),
      () => this.addNotification('info', 'Monthly report generated successfully'),
      () => this.addProgram({ name: 'Clean Water Initiative', budget: 75000 })
    ];

    const randomAction = actions[Math.floor(Math.random() * actions.length)];
    randomAction();
  }

  // Start intensive demo mode
  startDemoMode() {
    const demoInterval = setInterval(() => {
      this.triggerDemoActivity();
    }, 3000); // Trigger demo activity every 3 seconds

    // Return function to stop demo mode
    return () => clearInterval(demoInterval);
  }
}

// Export singleton instance
export const realTimeService = RealTimeService.getInstance();
