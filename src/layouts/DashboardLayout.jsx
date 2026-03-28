import { NavLink, Outlet } from 'react-router-dom'
import useRole from '../hooks/useRole'

const DashboardLayout = () => {
  const { role } = useRole()

  return (
    <div style={{ display: 'flex' }}>
      <aside style={{ width: '220px', padding: '1rem' }}>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <NavLink to="/dashboard">Home</NavLink>
          <NavLink to="/dashboard/profile">Profile</NavLink>
          <NavLink to="/dashboard/add-lesson">Add Lesson</NavLink>
          <NavLink to="/dashboard/my-lessons">My Lessons</NavLink>
          <NavLink to="/dashboard/my-favorites">My Favorites</NavLink>
          {role === 'admin' && (
            <>
              <hr />
              <NavLink to="/dashboard/admin">Admin Home</NavLink>
              <NavLink to="/dashboard/admin/manage-users">Manage Users</NavLink>
              <NavLink to="/dashboard/admin/manage-lessons">Manage Lessons</NavLink>
              <NavLink to="/dashboard/admin/reported-lessons">Reported Lessons</NavLink>
            </>
          )}
        </nav>
      </aside>
      <main style={{ flex: 1, padding: '1rem' }}>
        <Outlet />
      </main>
    </div>
  )
}

export default DashboardLayout
