// API Service using crudcrud.com with mock fallback
class ApiService {
  constructor() {
    this.baseURL = 'https://crudcrud.com/api/e53e57090d804a6b9c7c701c236cd708'
    this.useMock = false
    this.initializeLocalStorage()
  }

  // Initialize localStorage with default data for mock
  initializeLocalStorage() {
    if (!localStorage.getItem('outlets')) {
      localStorage.setItem('outlets', JSON.stringify([]))
    }
    if (!localStorage.getItem('discounts')) {
      localStorage.setItem('discounts', JSON.stringify([]))
    }
  }

  // Generate unique ID for mock
  generateId() {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9)
  }

  // HTTP request method with mock fallback
  async request(endpoint, options = {}) {
    // Try real API first
    if (!this.useMock) {
      try {
        const url = `${this.baseURL}${endpoint}`
        
        const config = {
          method: options.method || 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...options.headers
          },
          ...options
        }

        if (options.body && typeof options.body === 'object') {
          config.body = JSON.stringify(options.body)
        }
        
        const response = await fetch(url, config)
        
        if (!response.ok) {
          // If API key expired or invalid, switch to mock
          if (response.status === 401 || response.status === 403) {
            throw new Error('API key expired or invalid')
          }
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        // Handle empty responses (like DELETE)
        const text = await response.text()
        return text ? JSON.parse(text) : null
      } catch (error) {
        console.warn('Real API failed:', error.message)
        
        // Automatically switch to mock mode for network errors or expired API
        if (error.message.includes('Failed to fetch') || 
            error.message.includes('API key expired')) {
          this.useMock = true
          console.warn('Switching to mock mode')
        }
        
        // Fall through to mock implementation
      }
    }

    // Use mock API
    const [, resource, id] = endpoint.split('/')
    const method = options.method || 'GET'
    
    try {
      switch (method) {
        case 'GET':
          return this.mockGet(resource, id)
        case 'POST':
          return this.mockPost(resource, JSON.parse(options.body || '{}'))
        case 'PUT':
          return this.mockPut(resource, id, JSON.parse(options.body || '{}'))
        case 'DELETE':
          return this.mockDelete(resource, id)
        default:
          throw new Error(`Unsupported method: ${method}`)
      }
    } catch (error) {
      console.error('Mock API request failed:', error)
      throw error
    }
  }

  // Mock GET method
  mockGet(resource, id) {
    const data = JSON.parse(localStorage.getItem(resource) || '[]')
    
    if (id) {
      const item = data.find(item => item._id === id)
      if (!item) {
        throw new Error(`${resource} with id ${id} not found`)
      }
      return item
    }
    
    return data
  }

  // Mock POST method
  mockPost(resource, newItem) {
    const data = JSON.parse(localStorage.getItem(resource) || '[]')
    const itemWithId = {
      ...newItem,
      _id: this.generateId(),
      createdAt: new Date().toISOString()
    }
    
    data.push(itemWithId)
    localStorage.setItem(resource, JSON.stringify(data))
    
    return itemWithId
  }

  // Mock PUT method
  mockPut(resource, id, updatedItem) {
    const data = JSON.parse(localStorage.getItem(resource) || '[]')
    const index = data.findIndex(item => item._id === id)
    
    if (index === -1) {
      throw new Error(`${resource} with id ${id} not found`)
    }
    
    data[index] = {
      ...data[index],
      ...updatedItem,
      updatedAt: new Date().toISOString()
    }
    
    localStorage.setItem(resource, JSON.stringify(data))
    return data[index]
  }

  // Mock DELETE method
  mockDelete(resource, id) {
    const data = JSON.parse(localStorage.getItem(resource) || '[]')
    const index = data.findIndex(item => item._id === id)
    
    if (index === -1) {
      throw new Error(`${resource} with id ${id} not found`)
    }
    
    data.splice(index, 1)
    localStorage.setItem(resource, JSON.stringify(data))
    
    return null // DELETE typically returns no content
  }

  // GET request
  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' })
  }

  // POST request
  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  // PUT request
  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  }

  // DELETE request
  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' })
  }

  // Outlets API methods
  async getOutlets() {
    return this.get('/outlets')
  }

  async createOutlet(outlet) {
    return this.post('/outlets', outlet)
  }

  async updateOutlet(id, outlet) {
    return this.put(`/outlets/${id}`, outlet)
  }

  async deleteOutlet(id) {
    return this.delete(`/outlets/${id}`)
  }

  // Discounts API methods
  async getDiscounts() {
    return this.get('/discounts')
  }

  async createDiscount(discount) {
    return this.post('/discounts', discount)
  }

  async updateDiscount(id, discount) {
    return this.put(`/discounts/${id}`, discount)
  }

  async deleteDiscount(id) {
    return this.delete(`/discounts/${id}`)
  }

  // Initialize sample data
  async initializeSampleData() {
    try {
      // Check if outlets already exist
      const existingOutlets = await this.getOutlets()
      
      if (!existingOutlets || existingOutlets.length === 0) {
        // Create sample outlets
        const sampleOutlets = [
          { name: 'Dapoer Rasa', address: 'Jl. Asia Afrika No. 25' },
          { name: 'Espresso Bliss', address: 'Jl. Pemuda No. 78' },
          { name: 'Koffeetopia', address: 'Jl. Basuki Rahmat No. 12' },
          { name: 'Kopi Anak Bangsa', address: 'Jl. Gatot Subroto No. 33' },
          { name: 'Lauk & Co', address: 'Jl. Teuku Umar No. 88' },
          { name: 'Ruang Kopi', address: 'Jl. Sudirman No. 45' },
          { name: 'Selera Nusantara', address: 'Jl. Malioboro No. 10' },
          { name: 'The Tasty Table', address: 'Jl. Ahmad Yani No. 20' },
          { name: 'Warung Urban', address: 'Jl. Diponegoro No. 55' },
          { name: 'Warteg Berkah Jaya', address: 'Jl. Pahlawan No. 99' }
        ]

        for (const outlet of sampleOutlets) {
          await this.createOutlet(outlet)
        }
        
        console.log('Sample outlets created successfully')
      }
    } catch (error) {
      console.error('Failed to initialize sample data:', error)
    }
  }
}

// Export singleton instance
export default new ApiService()