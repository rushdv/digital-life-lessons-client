import { useEffect, useState } from 'react'
import useAuth from './useAuth'
import useAxiosSecure from './useAxiosSecure'

const useIsPremium = () => {
  const { user, loading } = useAuth()
  const axiosSecure = useAxiosSecure()
  const [isPremium, setIsPremium] = useState(false)
  const [premiumLoading, setPremiumLoading] = useState(true)

  useEffect(() => {
    if (user?.email) {
      axiosSecure.get(`/users/premium-status/${user.email}`).then((res) => {
        setIsPremium(res.data.isPremium)
        setPremiumLoading(false)
      }).catch(() => setPremiumLoading(false))
    } else if (!loading) {
      setPremiumLoading(false)
    }
  }, [user, loading, axiosSecure])

  return { isPremium, premiumLoading }
}

export default useIsPremium
