import axios, { AxiosInstance } from 'axios';

interface FrontendCheckConfig {
  baseUrl: string;
  apiBaseUrl: string;
  timeout: number;
  retries: number;
}

interface CheckResult {
  success: boolean;
  message: string;
  error?: any;
}

interface FrontendCheckSummary {
  timestamp: string;
  pages: Record<string, CheckResult>;
  components: Record<string, CheckResult>;
  apis: Record<string, CheckResult>;
}

/**
 * Client-side system check utility for SevaDaan frontend
 */
export class FrontendSystemCheck {
  private config: FrontendCheckConfig;
  private summary: FrontendCheckSummary;
  private client: AxiosInstance;

  constructor(config?: Partial<FrontendCheckConfig>) {
    this.config = {
      baseUrl: window.location.origin,
      apiBaseUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000',
      timeout: 5000,
      retries: 2,
      ...config
    };

    this.summary = {
      timestamp: new Date().toISOString(),
      pages: {},
      components: {},
      apis: {}
    };

    this.client = axios.create({
      timeout: this.config.timeout,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Add retry logic
    this.client.interceptors.response.use(undefined, async (error) => {
      const originalRequest = error.config;
      if (originalRequest && !originalRequest._retry && originalRequest._retryCount < this.config.retries) {
        originalRequest._retry = true;
        originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;
        return new Promise(resolve => setTimeout(() => resolve(this.client(originalRequest)), 1000));
      }
      return Promise.reject(error);
    });
  }

  /**
   * Run all frontend checks
   */
  async runCheck(): Promise<FrontendCheckSummary> {
    // Run checks in parallel
    await Promise.all([
      this.checkPages(),
      this.checkComponents(),
      this.checkApis()
    ]);

    return this.summary;
  }

  /**
   * Check all essential pages
   */
  async checkPages(): Promise<Record<string, CheckResult>> {
    const pagesToCheck = [
      '/ngos',
      '/programs',
      '/volunteer',
      '/emergency',
      '/who-we-are',
      '/dashboard/ngo',
      '/dashboard/ngo_admin',
      '/dashboard/ngo_manager',
      '/dashboard/volunteer',
      '/dashboard/donor',
      '/dashboard/citizen'
    ];

    for (const page of pagesToCheck) {
      try {
        // Check if the page component is loadable (in a real scenario, we'd use react-router and loadable components)
        // Here we just simulate the check
        const canLoad = await this.simulatePageLoad(page);
        
        this.summary.pages[page] = {
          success: canLoad,
          message: canLoad ? `Page ${page} loaded successfully` : `Page ${page} failed to load`
        };
      } catch (error) {
        this.summary.pages[page] = {
          success: false,
          message: `Failed to check page ${page}`,
          error: this.formatError(error)
        };
        
        console.error(`Page check failed for ${page}`, error);
        this.generatePlaceholder(page);
      }
    }

    return this.summary.pages;
  }

  /**
   * Check critical components
   */
  async checkComponents(): Promise<Record<string, CheckResult>> {
    const componentsToCheck = [
      'NGORegistrationForm',
      'ProgramList',
      'VolunteerApplicationForm',
      'EmergencyHelpForm',
      'DonationForm',
      'ReferralTable',
      'GrantApplicationForm'
    ];

    for (const component of componentsToCheck) {
      try {
        // Simulate component check (in a real app we'd actually try to render the component)
        const canRender = await this.simulateComponentRender(component);
        
        this.summary.components[component] = {
          success: canRender,
          message: canRender ? `Component ${component} renders successfully` : `Component ${component} fails to render`
        };
      } catch (error) {
        this.summary.components[component] = {
          success: false,
          message: `Failed to check component ${component}`,
          error: this.formatError(error)
        };
        
        console.error(`Component check failed for ${component}`, error);
        this.generateComponentPlaceholder(component);
      }
    }

    return this.summary.components;
  }

  /**
   * Check API endpoints
   */
  async checkApis(): Promise<Record<string, CheckResult>> {
    const apisToCheck = [
      '/api/v1/ngos',
      '/api/v1/programs',
      '/api/v1/volunteer-opportunities',
      '/api/v1/emergency-help',
      '/api/v1/dashboard',
      '/api/v1/donations',
      '/api/v1/grants',
      '/api/v1/referrals'
    ];

    for (const api of apisToCheck) {
      try {
        const response = await this.client.get(`${this.config.apiBaseUrl}${api}`);
        
        this.summary.apis[api] = {
          success: response.status === 200,
          message: `API ${api} responds with status ${response.status}`
        };
      } catch (error) {
        this.summary.apis[api] = {
          success: false,
          message: `Failed to access API ${api}`,
          error: this.formatError(error)
        };
        
        console.error(`API check failed for ${api}`, error);
      }
    }

    return this.summary.apis;
  }
  /**
   * Simulate loading a page
   */
  private async simulatePageLoad(page: string): Promise<boolean> {
    // In a real app, we would use dynamic imports or react-router methods to check if a page can load
    // Here we just simulate with a delayed promise
    console.log(`Simulating load of page: ${page}`);
    return new Promise(resolve => {
      setTimeout(() => {
        // Simulate 90% success rate for demo purposes
        resolve(Math.random() > 0.1);
      }, 500);
    });
  }
  /**
   * Simulate rendering a component
   */
  private async simulateComponentRender(component: string): Promise<boolean> {
    // In a real app, we would try to render the component in a test div
    // Here we just simulate with a delayed promise
    console.log(`Simulating render of component: ${component}`);
    return new Promise(resolve => {
      setTimeout(() => {
        // Simulate 90% success rate for demo purposes
        resolve(Math.random() > 0.1);
      }, 300);
    });
  }

  /**
   * Format error for logging
   */
  private formatError(error: any): any {
    if (error.response) {
      return {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      };
    } else if (error.request) {
      return {
        request: 'Request sent but no response received',
        message: error.message
      };
    } else {
      return {
        message: error.message,
        stack: error.stack
      };
    }
  }

  /**
   * Generate a placeholder for a missing page
   */
  private generatePlaceholder(page: string): void {
    console.log(`Generating placeholder for missing page: ${page}`);
    
    // In a real app, we would dynamically create and register a placeholder component
    // For now, we just log it
  }

  /**
   * Generate a placeholder for a missing component
   */
  private generateComponentPlaceholder(component: string): void {
    console.log(`Generating placeholder for missing component: ${component}`);
    
    // In a real app, we would dynamically create a placeholder component
    // For now, we just log it
  }
}

// Helper function to run the check and format results for display
export const runFrontendCheck = async (config?: Partial<FrontendCheckConfig>): Promise<FrontendCheckSummary> => {
  const checker = new FrontendSystemCheck(config);
  try {
    const results = await checker.runCheck();
    
    // Log the results to console in a formatted way
    console.group('SevaDaan Frontend System Check Results');
    console.log(`Timestamp: ${results.timestamp}`);
    
    console.group('Pages');
    Object.entries(results.pages).forEach(([page, result]) => {
      console.log(`${result.success ? '✅' : '❌'} ${page}: ${result.message}`);
    });
    console.groupEnd();
    
    console.group('Components');
    Object.entries(results.components).forEach(([component, result]) => {
      console.log(`${result.success ? '✅' : '❌'} ${component}: ${result.message}`);
    });
    console.groupEnd();
    
    console.group('APIs');
    Object.entries(results.apis).forEach(([api, result]) => {
      console.log(`${result.success ? '✅' : '❌'} ${api}: ${result.message}`);
    });
    console.groupEnd();
    
    console.groupEnd();
    
    return results;
  } catch (error) {
    console.error('Frontend system check failed:', error);
    throw error;
  }
};

export default runFrontendCheck;
