/**
 * API service utilities for connecting to InventoryPulse backend
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5500/api';

class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    // Add authorization header if token exists
    const token = localStorage.getItem('auth_token');
    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    const config: RequestInit = {
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      // Handle empty responses
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      } else {
        return {} as T;
      }
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Health check
  async healthCheck() {
    return this.request('/system/health');
  }

  // Authentication
  async login(credentials: { username: string; password: string }) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async getAuthStatus() {
    return this.request('/auth/status');
  }

  // Products
  async getProducts(params?: {
    page?: number;
    limit?: number;
    category?: string;
    status?: string;
    low_stock?: boolean;
  }) {
    const queryParams = params ? '?' + new URLSearchParams(
      Object.entries(params).reduce((acc, [key, value]) => {
        if (value !== undefined) {
          acc[key] = value.toString();
        }
        return acc;
      }, {} as Record<string, string>)
    ).toString() : '';
    
    return this.request(`/products/${queryParams}`);
  }

  async getProduct(productId: string) {
    return this.request(`/products/${productId}`);
  }

  async createProduct(productData: any) {
    return this.request('/products/', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  }

  // Suppliers
  async getSuppliers() {
    return this.request('/suppliers/');
  }

  // Orders
  async getPurchaseOrders() {
    return this.request('/orders/purchase');
  }

  async getOrders() {
    return this.request('/orders/');
  }

  // Alerts
  async getAlerts() {
    return this.request('/alerts/');
  }

  // Users
  async getUsers() {
    return this.request('/users/');
  }

  // AI Insights
  async getAIInsights(productId?: string, daysAhead: number = 30) {
    const params = new URLSearchParams();
    if (productId) params.append('product_id', productId);
    params.append('days_ahead', daysAhead.toString());
    return this.request(`/ai/insights?${params.toString()}`);
  }

  async getAIHealth(includeRecommendations: boolean = true) {
    const params = new URLSearchParams();
    params.append('include_recommendations', includeRecommendations.toString());
    return this.request(`/ai/health?${params.toString()}`);
  }
}

// Create and export a singleton instance
export const apiService = new ApiService();

// Export the class for testing
export { ApiService }; 