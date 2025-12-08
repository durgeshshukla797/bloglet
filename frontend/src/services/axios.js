import axios from 'axios'

const api = axios.create({
  // Backend is running on port 4000 in your environment
  baseURL: 'http://localhost:4000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
})

export default api
