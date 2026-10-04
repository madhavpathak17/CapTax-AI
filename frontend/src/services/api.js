import axios from 'axios'

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000',
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('captax_token')

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export const registerUser = async (userData) => {
  const response = await api.post('/auth/register', userData)
  return response.data
}

export const loginUser = async (userData) => {
  const response = await api.post('/auth/login', userData)
  return response.data
}

export default api