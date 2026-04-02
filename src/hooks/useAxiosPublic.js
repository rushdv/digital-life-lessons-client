import axios from 'axios'

const axiosPublic = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://digital-life-lessons-server-one.vercel.app',
})

const useAxiosPublic = () => axiosPublic

export default useAxiosPublic
