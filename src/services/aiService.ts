import { AIInsight, Prediction, AnomalyDetection, Recommendation, SmartAlert, SentimentAnalysis } from '../types/ai';

class AIService {
  private baseUrl = '/api/v1/ai';
  private useMockData = true; // Enable mock data for testing

  // Mock data for testing
  private mockInsights: AIInsight[] = [
    {
      id: '1',
      type: 'trend',
      title: 'Donation Trend Alert',
      description: 'Donations have increased by 25% this month compared to last month',
      severity: 'medium',
      confidence: 0.85,
      data: {
        current: 45000,
        previous: 36000,
        trend: 'upward'
      },
      suggestions: ['Continue current fundraising strategy', 'Plan for holiday campaigns'],
      generatedAt: new Date(),
      status: 'new'
    },
    {
      id: '2',
      type: 'risk',
      title: 'Volunteer Engagement Drop',
      description: 'Volunteer participation has decreased by 15% in the last 2 weeks',
      severity: 'high',
      confidence: 0.78,
      data: {
        current: 85,
        previous: 100,
        trend: 'downward'
      },
      suggestions: ['Reach out to inactive volunteers', 'Organize engagement events'],
      generatedAt: new Date(),
      status: 'new'
    }
  ];

  private mockPredictions: Prediction[] = [
    {
      id: '1',
      modelId: 'donation-model',
      type: 'donation',
      value: 52000,
      confidence: 0.82,
      timeframe: '30d',
      factors: [
        { name: 'Seasonal Effect', impact: 0.3, description: 'Holiday season increases donations' },
        { name: 'Recent Campaigns', impact: 0.25, description: 'Active campaigns drive donations' }
      ],
      generatedAt: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
    },
    {
      id: '2',
      modelId: 'volunteer-model',
      type: 'volunteer',
      value: 0.75,
      confidence: 0.78,
      timeframe: '30d',
      factors: [
        { name: 'Skill Match', impact: 0.35, description: 'Relevant skills increase engagement' },
        { name: 'Location Proximity', impact: 0.25, description: 'Nearby opportunities are preferred' }
      ],
      generatedAt: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
    }
  ];

  private mockAnomalies: AnomalyDetection[] = [
    {
      id: '1',
      metric: 'donation_amount',
      value: 2500,
      expectedRange: {
        min: 800,
        max: 1500
      },
      severity: 'medium',
      probability: 0.88,
      description: 'Unusual spike in donations from new donors',
      detectedAt: new Date(),
      resolved: false
    }
  ];

  private mockRecommendations: Recommendation[] = [
    {
      id: '1',
      type: 'program_optimization',
      title: 'Optimize Volunteer Scheduling',
      description: 'Consider scheduling more weekend activities to increase volunteer participation',
      confidence: 0.85,
      expectedImpact: {
        metric: 'volunteer_participation',
        improvement: 25,
        unit: 'percentage'
      },
      requiredActions: ['Schedule weekend activities', 'Send notifications to volunteers'],
      timeline: '2-4 weeks',
      resources: ['Event planning team', 'Communication tools'],
      generatedAt: new Date(),
      status: 'pending'
    },
    {
      id: '2',
      type: 'donor_match',
      title: 'Target High-Value Donors',
      description: 'Focus on donors who have given >₹10,000 in the past for upcoming campaigns',
      confidence: 0.80,
      expectedImpact: {
        metric: 'fundraising_revenue',
        improvement: 150000,
        unit: 'INR'
      },
      requiredActions: ['Identify high-value donors', 'Create targeted campaigns'],
      timeline: '1-2 weeks',
      resources: ['Fundraising team', 'CRM system'],
      generatedAt: new Date(),
      status: 'pending'
    }
  ];

  async getInsights(options: { limit?: number; type?: string } = {}): Promise<AIInsight[]> {
    if (this.useMockData) {
      let insights = [...this.mockInsights];
      if (options.type) {
        insights = insights.filter(insight => insight.type === options.type);
      }
      if (options.limit) {
        insights = insights.slice(0, options.limit);
      }
      return insights;
    }

    const params = new URLSearchParams();
    if (options.limit) params.append('limit', options.limit.toString());
    if (options.type) params.append('type', options.type);

    const response = await fetch(`${this.baseUrl}/insights/recent?${params}`);
    if (!response.ok) {
      throw new Error('Failed to fetch insights');
    }
    const data = await response.json();
    return data.data || [];
  }

  async getPredictions(options: { limit?: number; type?: string } = {}): Promise<Prediction[]> {
    if (this.useMockData) {
      let predictions = [...this.mockPredictions];
      if (options.type) {
        predictions = predictions.filter(prediction => prediction.type === options.type);
      }
      if (options.limit) {
        predictions = predictions.slice(0, options.limit);
      }
      return predictions;
    }

    const params = new URLSearchParams();
    if (options.limit) params.append('limit', options.limit.toString());
    if (options.type) params.append('type', options.type);

    const response = await fetch(`${this.baseUrl}/predictions/recent?${params}`);
    if (!response.ok) {
      throw new Error('Failed to fetch predictions');
    }
    const data = await response.json();
    return data.data || [];
  }

  async getAnomalies(options: { limit?: number; resolved?: boolean } = {}): Promise<AnomalyDetection[]> {
    if (this.useMockData) {
      let anomalies = [...this.mockAnomalies];
      if (options.resolved !== undefined) {
        anomalies = anomalies.filter(anomaly => anomaly.resolved === options.resolved);
      }
      if (options.limit) {
        anomalies = anomalies.slice(0, options.limit);
      }
      return anomalies;
    }

    const params = new URLSearchParams();
    if (options.limit) params.append('limit', options.limit.toString());
    if (options.resolved !== undefined) params.append('resolved', options.resolved.toString());

    const response = await fetch(`${this.baseUrl}/anomalies/active?${params}`);
    if (!response.ok) {
      throw new Error('Failed to fetch anomalies');
    }
    const data = await response.json();
    return data.data || [];
  }

  async getRecommendations(options: { limit?: number; type?: string } = {}): Promise<Recommendation[]> {
    if (this.useMockData) {
      let recommendations = [...this.mockRecommendations];
      if (options.type) {
        recommendations = recommendations.filter(recommendation => recommendation.type === options.type);
      }
      if (options.limit) {
        recommendations = recommendations.slice(0, options.limit);
      }
      return recommendations;
    }

    const params = new URLSearchParams();
    if (options.limit) params.append('limit', options.limit.toString());
    if (options.type) params.append('type', options.type);

    const response = await fetch(`${this.baseUrl}/recommendations/personalized?${params}`);
    if (!response.ok) {
      throw new Error('Failed to fetch recommendations');
    }
    const data = await response.json();
    return data.data || [];
  }

  async getAlerts(options: { limit?: number; delivered?: boolean } = {}): Promise<SmartAlert[]> {
    const params = new URLSearchParams();
    if (options.limit) params.append('limit', options.limit.toString());
    if (options.delivered !== undefined) params.append('delivered', options.delivered.toString());

    const response = await fetch(`${this.baseUrl}/alerts?${params}`);
    if (!response.ok) {
      throw new Error('Failed to fetch alerts');
    }
    return response.json();
  }

  async analyzeSentiment(text: string): Promise<SentimentAnalysis> {
    const response = await fetch(`${this.baseUrl}/nlp/sentiment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error('Failed to analyze sentiment');
    }
    return response.json();
  }

  async generateInsight(type: string, data: any): Promise<AIInsight> {
    const response = await fetch(`${this.baseUrl}/insights/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ type, data }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate insight');
    }
    return response.json();
  }

  async updateInsightStatus(id: string, status: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/insights/${id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      throw new Error('Failed to update insight status');
    }
  }

  async updateRecommendationStatus(id: string, status: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/recommendations/${id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      throw new Error('Failed to update recommendation status');
    }
  }

  async resolveAnomaly(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/anomalies/${id}/resolve`, {
      method: 'PUT',
    });

    if (!response.ok) {
      throw new Error('Failed to resolve anomaly');
    }
  }

  async getHealthCheck(): Promise<{ status: string; models: any[]; performance: any }> {
    const response = await fetch(`${this.baseUrl}/health`);
    if (!response.ok) {
      throw new Error('Failed to get health check');
    }
    return response.json();
  }
}

export const aiService = new AIService();
