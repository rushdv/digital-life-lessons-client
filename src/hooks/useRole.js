import { useEffect, useState } from 'react'
import useAuth from './useAuth'
import useAxiosSecure from './useAxiosSecure'

const useRole = () => {
  const { user, loading } = useAuth()
  const axiosSecure = useAxiosSecure()
  const [role, setRole] = useState(null)
  const [roleLoading, setRoleLoading] = useState(true)

  useEffect(() => {
    if (user?.email) {
      axiosSecure.get(`/users/role/${user.email}`).then((res) => {
        setRole(res.data.role)
        setRoleLoading(false)
      })
    }
  }, [user, axiosSecure])

  return { role, roleLoading }
}

export default useRole
