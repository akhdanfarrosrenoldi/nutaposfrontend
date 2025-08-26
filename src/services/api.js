// API Service untuk CrudCrud
const API_BASE_URL = 'https://crudcrud.com/api/d7d7ddb4ae7f47358d2164b8916f6189'

class ApiService {
  // Generic method untuk HTTP requests
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      // Handle empty response (204 No Content)
      if (response.status === 204) {
        return null
      }
      
      return await response.json()
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
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