import { Navigate } from 'react-router-dom'
import useRole from '../hooks/useRole'
import Spinner from '../components/Spinner'

const AdminRoute = ({ children }) => {
  const { role, roleLoading } = useRole()

  if (roleLoading) return <Spinner />
  if (role !== 'admin') return <Navigate to="/dashboard" replace />

  return children
}

export default AdminRoute
