import axios from 'axios'

const baseURL = (import.meta.env.VITE_API_URL || 'https://digital-life-lessons-server-one.vercel.app').replace(/\/$/, '')

const axiosPublic = axios.create({
  baseURL,
})

const useAxiosPublic = () => axiosPublic

export default useAxiosPublic
