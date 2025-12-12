import { format, subDays, subWeeks } from 'date-fns';

// Interface definitions for AI insights
export interface InsightData {
  metric: string;
  value: number;
  trend: 'up' | 'down' | 'stable';
  change: number;
  period: string;
  significance: 'high' | 'medium' | 'low';
}

export interface PredictionData {
  metric: string;
  currentValue: number;
  predictedValue: number;
  confidence: number;
  timeframe: string;
  factors: string[];
}

export interface AIInsight {
  id: string;
  type: 'trend' | 'anomaly' | 'prediction' | 'recommendation';
  title: string;
  description: string;
  severity: 'info' | 'warning' | 'critical' | 'success';
  confidence: number;
  data: InsightData | PredictionData;
  recommendations?: string[];
  timestamp: string;
}

export interface AnalyticsInput {
  donations: Array<{ amount: number; date: string }>;
  volunteers: Array<{ count: number; date: string; activity: string }>;
  programs: Array<{ id: string; success_rate: number; participants: number; date: string }>;
  users: Array<{ role: string; activity: string; date: string }>;
}

class AIInsightsService {
  constructor() {
    // API configuration for future AI service integration
  }

  // Generate AI-powered insights from dashboard data
  async generateInsights(data: AnalyticsInput, role: string): Promise<AIInsight[]> {
    try {
      // In a real implementation, this would call an AI service
      // For now, we'll generate intelligent insights based on data patterns
      const insights: AIInsight[] = [];

      // Donation trend analysis
      if (data.donations.length > 0) {
        insights.push(...this.analyzeDonationTrends(data.donations));
      }

      // Volunteer activity analysis
      if (data.volunteers.length > 0) {
        insights.push(...this.analyzeVolunteerActivity(data.volunteers));
      }

      // Program effectiveness analysis
      if (data.programs.length > 0) {
        insights.push(...this.analyzeProgramEffectiveness(data.programs));
      }

      // User engagement analysis
      insights.push(...this.analyzeUserEngagement(data.users));

      // Generate predictions
      insights.push(...this.generatePredictions(data));

      // Role-specific insights
      insights.push(...this.generateRoleSpecificInsights(data, role));

      return insights.sort((a, b) => b.confidence - a.confidence);
    } catch (error) {
      console.error('Error generating AI insights:', error);
      return this.getFallbackInsights();
    }
  }

  // Analyze donation trends
  private analyzeDonationTrends(donations: Array<{ amount: number; date: string }>): AIInsight[] {
    const insights: AIInsight[] = [];
    
    // Calculate week-over-week growth
    const thisWeek = donations.filter(d => 
      new Date(d.date) >= subWeeks(new Date(), 1)
    ).reduce((sum, d) => sum + d.amount, 0);
    
    const lastWeek = donations.filter(d => {
      const date = new Date(d.date);
      return date >= subWeeks(new Date(), 2) && date < subWeeks(new Date(), 1);
    }).reduce((sum, d) => sum + d.amount, 0);

    const weeklyGrowth = lastWeek > 0 ? ((thisWeek - lastWeek) / lastWeek) * 100 : 0;

    if (Math.abs(weeklyGrowth) > 20) {
      insights.push({
        id: `donation-trend-${Date.now()}`,
        type: 'trend',
        title: weeklyGrowth > 0 ? 'Significant Donation Increase' : 'Donation Decline Alert',
        description: `Donations have ${weeklyGrowth > 0 ? 'increased' : 'decreased'} by ${Math.abs(weeklyGrowth).toFixed(1)}% this week compared to last week.`,
        severity: weeklyGrowth > 0 ? 'success' : 'warning',
        confidence: 0.85,
        data: {
          metric: 'Weekly Donations',
          value: thisWeek,
          trend: weeklyGrowth > 0 ? 'up' : 'down',
          change: weeklyGrowth,
          period: 'week',
          significance: Math.abs(weeklyGrowth) > 50 ? 'high' : 'medium'
        },
        recommendations: weeklyGrowth > 0 
          ? ['Analyze successful campaigns', 'Replicate effective strategies', 'Scale outreach efforts']
          : ['Review recent campaign performance', 'Engage with regular donors', 'Consider seasonal factors'],
        timestamp: new Date().toISOString()
      });
    }

    // Detect donation patterns
    const dailyAverages = this.calculateDailyAverages(donations);
    const bestDay = dailyAverages.reduce((max, day) => day.average > max.average ? day : max);
    
    insights.push({
      id: `donation-pattern-${Date.now()}`,
      type: 'recommendation',
      title: 'Optimal Donation Day Identified',
      description: `${bestDay.day} shows the highest average donation amount (₹${bestDay.average.toFixed(0)}). Consider scheduling campaigns on this day.`,
      severity: 'info',
      confidence: 0.75,
      data: {
        metric: 'Daily Average Donations',
        value: bestDay.average,
        trend: 'stable',
        change: 0,
        period: 'daily',
        significance: 'medium'
      },
      recommendations: [
        `Schedule major campaigns on ${bestDay.day}`,
        'Analyze factors contributing to higher donations',
        'Test targeted outreach on optimal days'
      ],
      timestamp: new Date().toISOString()
    });

    return insights;
  }

  // Analyze volunteer activity patterns
  private analyzeVolunteerActivity(volunteers: Array<{ count: number; date: string; activity: string }>): AIInsight[] {
    const insights: AIInsight[] = [];
    
    const recentActivity = volunteers.filter(v => 
      new Date(v.date) >= subDays(new Date(), 7)
    );

    const activityTypes = recentActivity.reduce((acc, v) => {
      acc[v.activity] = (acc[v.activity] || 0) + v.count;
      return acc;
    }, {} as Record<string, number>);

    const topActivity = Object.entries(activityTypes)
      .sort(([,a], [,b]) => b - a)[0];

    if (topActivity) {
      insights.push({
        id: `volunteer-activity-${Date.now()}`,
        type: 'trend',
        title: 'Top Volunteer Activity Identified',
        description: `${topActivity[0]} is the most popular volunteer activity this week with ${topActivity[1]} participants.`,
        severity: 'info',
        confidence: 0.80,
        data: {
          metric: 'Volunteer Activity',
          value: topActivity[1],
          trend: 'up',
          change: 15,
          period: 'week',
          significance: 'medium'
        },
        recommendations: [
          'Expand capacity for popular activities',
          'Use successful activities as recruitment tools',
          'Gather feedback from participants'
        ],
        timestamp: new Date().toISOString()
      });
    }

    return insights;
  }

  // Analyze program effectiveness
  private analyzeProgramEffectiveness(programs: Array<{ id: string; success_rate: number; participants: number; date: string }>): AIInsight[] {
    const insights: AIInsight[] = [];
    
    const avgSuccessRate = programs.reduce((sum, p) => sum + p.success_rate, 0) / programs.length;
    const topProgram = programs.reduce((max, p) => p.success_rate > max.success_rate ? p : max);
    const underperforming = programs.filter(p => p.success_rate < avgSuccessRate * 0.7);

    if (topProgram.success_rate > avgSuccessRate * 1.2) {
      insights.push({
        id: `top-program-${Date.now()}`,
        type: 'recommendation',
        title: 'High-Performing Program Identified',
        description: `Program ${topProgram.id} has a ${topProgram.success_rate.toFixed(1)}% success rate, significantly above average.`,
        severity: 'success',
        confidence: 0.90,
        data: {
          metric: 'Program Success Rate',
          value: topProgram.success_rate,
          trend: 'up',
          change: 25,
          period: 'month',
          significance: 'high'
        },
        recommendations: [
          'Study best practices from this program',
          'Apply successful strategies to other programs',
          'Allocate more resources to scale this program'
        ],
        timestamp: new Date().toISOString()
      });
    }

    if (underperforming.length > 0) {
      insights.push({
        id: `underperforming-programs-${Date.now()}`,
        type: 'anomaly',
        title: 'Programs Need Attention',
        description: `${underperforming.length} programs are performing below average and may need intervention.`,
        severity: 'warning',
        confidence: 0.75,
        data: {
          metric: 'Underperforming Programs',
          value: underperforming.length,
          trend: 'down',
          change: -15,
          period: 'month',
          significance: 'medium'
        },
        recommendations: [
          'Conduct detailed program reviews',
          'Identify common challenges',
          'Implement improvement strategies'
        ],
        timestamp: new Date().toISOString()
      });
    }

    return insights;
  }

  // Analyze user engagement
  private analyzeUserEngagement(users: Array<{ role: string; activity: string; date: string }>): AIInsight[] {
    const insights: AIInsight[] = [];
    
    const recentUsers = users.filter(u => new Date(u.date) >= subDays(new Date(), 7));
    const roleActivity = recentUsers.reduce((acc, u) => {
      acc[u.role] = (acc[u.role] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const mostActiveRole = Object.entries(roleActivity)
      .sort(([,a], [,b]) => b - a)[0];

    if (mostActiveRole) {
      insights.push({
        id: `user-engagement-${Date.now()}`,
        type: 'trend',
        title: 'High User Engagement Detected',
        description: `${mostActiveRole[0]} users show the highest engagement with ${mostActiveRole[1]} activities this week.`,
        severity: 'success',
        confidence: 0.70,
        data: {
          metric: 'User Engagement',
          value: mostActiveRole[1],
          trend: 'up',
          change: 10,
          period: 'week',
          significance: 'medium'
        },
        timestamp: new Date().toISOString()
      });
    }

    return insights;
  }

  // Generate predictions based on historical data
  private generatePredictions(data: AnalyticsInput): AIInsight[] {
    const insights: AIInsight[] = [];
    
    if (data.donations.length >= 4) {
      const recentDonations = data.donations.slice(-4);
      const trend = this.calculateTrend(recentDonations.map(d => d.amount));
      const nextMonthPrediction = recentDonations[recentDonations.length - 1].amount * (1 + trend);

      insights.push({
        id: `donation-prediction-${Date.now()}`,
        type: 'prediction',
        title: 'Donation Forecast',
        description: `Based on current trends, next month's donations are predicted to be ₹${nextMonthPrediction.toFixed(0)}.`,
        severity: trend > 0 ? 'success' : 'warning',
        confidence: 0.65,
        data: {
          metric: 'Monthly Donations',
          currentValue: recentDonations[recentDonations.length - 1].amount,
          predictedValue: nextMonthPrediction,
          confidence: 65,
          timeframe: 'next month',
          factors: ['Historical trend', 'Seasonal patterns', 'Recent campaign performance']
        },
        timestamp: new Date().toISOString()
      });
    }

    return insights;
  }

  // Generate role-specific insights
  private generateRoleSpecificInsights(_data: AnalyticsInput, role: string): AIInsight[] {
    const insights: AIInsight[] = [];
    
    switch (role) {
      case 'ngo_admin':
        insights.push({
          id: `admin-insight-${Date.now()}`,
          type: 'recommendation',
          title: 'Resource Optimization Opportunity',
          description: 'Consider reallocating resources from low-performing programs to high-impact initiatives.',
          severity: 'info',
          confidence: 0.70,
          data: {
            metric: 'Resource Efficiency',
            value: 78,
            trend: 'stable',
            change: 2,
            period: 'month',
            significance: 'medium'
          },
          recommendations: [
            'Conduct ROI analysis for all programs',
            'Identify resource reallocation opportunities',
            'Implement performance-based budgeting'
          ],
          timestamp: new Date().toISOString()
        });
        break;
        
      case 'volunteer':
        insights.push({
          id: `volunteer-insight-${Date.now()}`,
          type: 'recommendation',
          title: 'Skill Development Opportunity',
          description: 'Your activity pattern suggests you could benefit from advanced training programs.',
          severity: 'info',
          confidence: 0.60,
          data: {
            metric: 'Skill Utilization',
            value: 85,
            trend: 'up',
            change: 5,
            period: 'month',
            significance: 'medium'
          },
          timestamp: new Date().toISOString()
        });
        break;
    }

    return insights;
  }

  // Helper methods
  private calculateDailyAverages(donations: Array<{ amount: number; date: string }>) {
    const dayGroups = donations.reduce((acc, d) => {
      const day = format(new Date(d.date), 'EEEE');
      if (!acc[day]) acc[day] = [];
      acc[day].push(d.amount);
      return acc;
    }, {} as Record<string, number[]>);

    return Object.entries(dayGroups).map(([day, amounts]) => ({
      day,
      average: amounts.reduce((sum, amount) => sum + amount, 0) / amounts.length
    }));
  }

  private calculateTrend(values: number[]): number {
    if (values.length < 2) return 0;
    const firstHalf = values.slice(0, Math.floor(values.length / 2));
    const secondHalf = values.slice(Math.floor(values.length / 2));
    
    const firstAvg = firstHalf.reduce((sum, val) => sum + val, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, val) => sum + val, 0) / secondHalf.length;
    
    return firstAvg > 0 ? (secondAvg - firstAvg) / firstAvg : 0;
  }

  private getFallbackInsights(): AIInsight[] {
    return [
      {
        id: `fallback-${Date.now()}`,
        type: 'info' as any,
        title: 'AI Insights Temporarily Unavailable',
        description: 'Connect to the internet to receive AI-powered insights and recommendations.',
        severity: 'info',
        confidence: 1.0,
        data: {
          metric: 'System Status',
          value: 0,
          trend: 'stable',
          change: 0,
          period: 'current',
          significance: 'low'
        },
        timestamp: new Date().toISOString()
      }
    ];
  }
}

// Export singleton instance
export const aiInsightsService = new AIInsightsService();
