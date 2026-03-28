import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { Link } from "react-router-dom";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

const DashboardHome = () => {
  const { user, isPremium } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: myLessons = [] } = useQuery({
    queryKey: ["myLessons"],
    queryFn: async () => (await axiosSecure.get("/lessons/my-lessons")).data,
  });

  const { data: myFavorites = [] } = useQuery({
    queryKey: ["favorites"],
    queryFn: async () => (await axiosSecure.get("/favorites")).data,
  });

  // Chart data — lessons per month
  const chartData = (() => {
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const counts = Array(12).fill(0);
    myLessons.forEach((l) => {
      const m = new Date(l.createdAt).getMonth();
      counts[m]++;
    });
    return months.map((m, i) => ({ month: m, lessons: counts[i] }));
  })();

  const stats = [
    { label: "Total Lessons", value: myLessons.length, icon: "📖", color: "bg-indigo-100 text-indigo-700" },
    { label: "Saved Favorites", value: myFavorites.length, icon: "🔖", color: "bg-purple-100 text-purple-700" },
    { label: "Public Lessons", value: myLessons.filter((l) => l.visibility === "public").length, icon: "🌍", color: "bg-teal-100 text-teal-700" },
    { label: "Plan", value: isPremium ? "Premium ⭐" : "Free", icon: "💎", color: "bg-yellow-100 text-yellow-700" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Welcome back, {user?.displayName?.split(" ")[0]}! 👋
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className={`${s.color} rounded-2xl p-5`}>
            <p className="text-2xl mb-1">{s.icon}</p>
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-sm opacity-70">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3 mb-8">
        <Link to="/dashboard/add-lesson"
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-700 transition">
          + Add New Lesson
        </Link>
        <Link to="/dashboard/my-lessons"
          className="border border-gray-300 px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition">
          My Lessons
        </Link>
        <Link to="/dashboard/my-favorites"
          className="border border-gray-300 px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition">
          My Favorites
        </Link>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-8">
        <h3 className="font-semibold text-gray-800 mb-4">📊 Lessons Created Monthly</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
            <Tooltip />
            <Bar dataKey="lessons" fill="#6366f1" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Lessons */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h3 className="font-semibold text-gray-800 mb-4">🕒 Recently Added Lessons</h3>
        <div className="space-y-3">
          {myLessons.slice(0, 5).map((l) => (
            <div key={l._id} className="flex items-center justify-between py-2 border-b border-gray-50">
              <div>
                <p className="text-sm font-medium text-gray-700 line-clamp-1">{l.title}</p>
                <p className="text-xs text-gray-400">{l.category} • {new Date(l.createdAt).toLocaleDateString()}</p>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                l.visibility === "public" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
              }`}>
                {l.visibility}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;