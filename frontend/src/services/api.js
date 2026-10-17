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
  (error) => Promise.reject(error),
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const requestUrl = error.config?.url || ''
    const isLoginRequest = requestUrl.includes('/auth/login')
    const isRegisterRequest = requestUrl.includes('/auth/register')

    if (error.response?.status === 401 && !isLoginRequest && !isRegisterRequest) {
      localStorage.removeItem('captax_token')
      localStorage.removeItem('captax_user')
      window.dispatchEvent(new Event('captax:session-expired'))
    }

    return Promise.reject(error)
  },
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

export const requestPasswordReset = async (payload) => {
  const response = await api.post('/auth/forgot-password', payload)
  return response.data
}

export const submitPasswordReset = async (payload) => {
  const response = await api.post('/auth/reset-password', payload)
  return response.data
}
