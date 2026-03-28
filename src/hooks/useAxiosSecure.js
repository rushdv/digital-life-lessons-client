import axios from 'axios'
import { useEffect } from 'react'
import useAuth from './useAuth'

const axiosSecure = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
})

const useAxiosSecure = () => {
  const { user, logout } = useAuth()

  useEffect(() => {
    const requestInterceptor = axiosSecure.interceptors.request.use((config) => {
      const token = localStorage.getItem('access-token')
      if (token) config.headers.authorization = `Bearer ${token}`
      return config
    })

    const responseInterceptor = axiosSecure.interceptors.response.use(
      (res) => res,
      async (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
          await logout()
        }
        return Promise.reject(error)
      }
    )

    return () => {
      axiosSecure.interceptors.request.eject(requestInterceptor)
      axiosSecure.interceptors.response.eject(responseInterceptor)
    }
  }, [logout])

  return axiosSecure
}

export default useAxiosSecure
