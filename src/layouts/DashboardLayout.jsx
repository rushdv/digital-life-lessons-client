import { NavLink, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useRole from "../hooks/useRole";
import Spinner from "../components/Spinner";
import {
  MdDashboard, MdAddCircle, MdBookmarks,
  MdFavorite, MdPerson, MdPeople,
  MdManageSearch, MdFlag
} from "react-icons/md";

const DashboardLayout = () => {
  const { user, logOut } = useAuth();
  const [role, isLoading] = useRole();

  if (isLoading) return <Spinner />;

  const userLinks = [
    { to: "/dashboard", label: "Dashboard", icon: <MdDashboard /> },
    { to: "/dashboard/add-lesson", label: "Add Lesson", icon: <MdAddCircle /> },
    { to: "/dashboard/my-lessons", label: "My Lessons", icon: <MdBookmarks /> },
    { to: "/dashboard/my-favorites", label: "Favorites", icon: <MdFavorite /> },
    { to: "/dashboard/profile", label: "Profile", icon: <MdPerson /> },
  ];

  const adminLinks = [
    { to: "/dashboard/admin", label: "Admin Home", icon: <MdDashboard /> },
    { to: "/dashboard/admin/manage-users", label: "Manage Users", icon: <MdPeople /> },
    { to: "/dashboard/admin/manage-lessons", label: "Manage Lessons", icon: <MdManageSearch /> },
    { to: "/dashboard/admin/reported-lessons", label: "Reported Lessons", icon: <MdFlag /> },
    { to: "/dashboard/admin/profile", label: "Profile", icon: <MdPerson /> },
  ];

  const links = role === "admin" ? adminLinks : userLinks;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-indigo-900 text-white flex flex-col">
        <div className="p-6 border-b border-indigo-700">
          <p className="text-xl font-bold">📖 LifeLessons</p>
          <p className="text-xs text-indigo-300 mt-1 capitalize">{role} panel</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/dashboard" || link.to === "/dashboard/admin"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? "bg-indigo-600 text-white"
                    : "text-indigo-200 hover:bg-indigo-700"
                }`
              }
            >
              <span className="text-lg">{link.icon}</span>
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-indigo-700">
          <div className="flex items-center gap-3 mb-3">
            <img
              src={user?.photoURL || "https://i.ibb.co/placeholder.png"}
              alt="avatar"
              className="w-9 h-9 rounded-full object-cover"
            />
            <div>
              <p className="text-sm font-medium truncate w-32">{user?.displayName}</p>
              <p className="text-xs text-indigo-300 truncate w-32">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={logOut}
            className="w-full bg-red-500 hover:bg-red-600 text-white text-sm py-2 rounded-lg transition"
          >
            Log Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;