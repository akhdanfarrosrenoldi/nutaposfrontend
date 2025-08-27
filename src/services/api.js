// API Service for crudcrud.com
class ApiService {
  constructor() {
    this.baseURL = null;
  }

  // API URL Management
  setApiUrl(url) {
    this.baseURL = url.endsWith('/') ? url.slice(0, -1) : url;
    localStorage.setItem('apiUrl', this.baseURL);
  }

  getApiUrl() {
    if (!this.baseURL) {
      this.baseURL = localStorage.getItem('apiUrl');
    }
    return this.baseURL;
  }

  isConfigured() {
    return !!this.getApiUrl();
  }

  // HTTP request methods
  async request(endpoint, options = {}) {
    if (!this.isConfigured()) {
      throw new Error('API URL not configured');
    }

    const url = `${this.getApiUrl()}${endpoint}`;
    
    const config = {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    if (options.body && typeof options.body === 'object') {
      config.body = JSON.stringify(options.body);
    }
    
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    // Handle empty responses (like DELETE)
    const text = await response.text();
    return text ? JSON.parse(text) : null;
  }

  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: data
    });
  }

  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: data
    });
  }

  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  // Outlets API
  async getOutlets() {
    return this.get('/outlets');
  }

  async createOutlet(outlet) {
    return this.post('/outlets', outlet);
  }

  async updateOutlet(id, outlet) {
    return this.put(`/outlets/${id}`, outlet);
  }

  async deleteOutlet(id) {
    return this.delete(`/outlets/${id}`);
  }

  // Selected Outlet Management
  getSelectedOutlet() {
    const outlet = localStorage.getItem('selectedOutlet');
    return outlet ? JSON.parse(outlet) : null;
  }

  setSelectedOutlet(outlet) {
    localStorage.setItem('selectedOutlet', JSON.stringify(outlet));
  }

  clearSelectedOutlet() {
    localStorage.removeItem('selectedOutlet');
  }

  // Discounts API
  async getDiscounts() {
    return this.get('/discounts');
  }

  async createDiscount(discount) {
    return this.post('/discounts', discount);
  }

  async updateDiscount(id, discount) {
    return this.put(`/discounts/${id}`, discount);
  }

  async deleteDiscount(id) {
    return this.delete(`/discounts/${id}`);
  }
}

// Create instance and set default API URL
const apiService = new ApiService();
apiService.setApiUrl('https://crudcrud.com/api/b499b88afe624d309121d434825d08ab');

export default apiService;