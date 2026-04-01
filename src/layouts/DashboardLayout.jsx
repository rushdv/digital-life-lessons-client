import { NavLink, Outlet } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

const DashboardLayout = () => {
  const { role } = useAuth()

  const userLinks = [
    { to: '/dashboard', label: '🏠 Overview', end: true },
    { to: '/dashboard/add-lesson', label: '✏️ Add Lesson' },
    { to: '/dashboard/my-lessons', label: '📚 My Lessons' },
    { to: '/dashboard/my-favorites', label: '🔖 My Favorites' },
    { to: '/dashboard/profile', label: '👤 Profile' },
  ]

  const adminLinks = [
    { to: '/dashboard/admin', label: '📊 Overview', end: true },
    { to: '/dashboard/admin/manage-users', label: '👥 Manage Users' },
    { to: '/dashboard/admin/manage-lessons', label: '📋 Manage Lessons' },
    { to: '/dashboard/admin/reported-lessons', label: '🚩 Reported' },
    { to: '/dashboard/admin/profile', label: '👤 Admin Profile' },
  ]

  const links = role === 'admin' ? adminLinks : userLinks

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 shadow-sm flex-shrink-0 hidden md:flex flex-col">
        <div className="p-6 border-b border-gray-100">
          <NavLink to="/" className="flex items-center gap-2">
            <span className="text-xl">📖</span>
            <span className="font-bold text-indigo-700">LifeLessons</span>
          </NavLink>
          <p className="text-xs text-gray-400 mt-1 font-medium">
            {role === 'admin' ? 'Admin Panel' : 'My Dashboard'}
          </p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                    : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-600'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-100">
          <NavLink
            to="/"
            className="flex items-center gap-2 px-4 py-3 rounded-2xl text-sm font-semibold text-gray-500 hover:bg-gray-50 transition"
          >
            ← Back to Site
          </NavLink>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}

export default DashboardLayout
