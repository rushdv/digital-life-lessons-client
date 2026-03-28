import { Link, NavLink } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

const Navbar = () => {
  const { user, logout } = useAuth()

  return (
    <nav>
      <Link to="/">Digital Life Lessons</Link>
      <div>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/lessons">Lessons</NavLink>
        <NavLink to="/pricing">Pricing</NavLink>
        {user ? (
          <>
            <NavLink to="/dashboard">Dashboard</NavLink>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <NavLink to="/login">Login</NavLink>
        )}
      </div>
    </nav>
  )
}

export default Navbar
