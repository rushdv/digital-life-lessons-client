import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { Link } from "react-router-dom";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import Spinner from "../../../components/Spinner";

const DashboardHome = () => {
  const { user, isPremium } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: myLessons = [], isLoading: lessonsLoading } = useQuery({
    queryKey: ["myLessons", user?.email],
    queryFn: async () => (await axiosSecure.get("/lessons/my-lessons")).data,
    enabled: !!user?.email,
  });

  const { data: myFavorites = [], isLoading: favLoading } = useQuery({
    queryKey: ["favorites", user?.email],
    queryFn: async () => (await axiosSecure.get("/favorites")).data,
    enabled: !!user?.email,
  });

  // Chart data — lessons per month
  const chartData = (() => {
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const counts = Array(12).fill(0);
    myLessons.forEach((l) => {
      const m = new Date(l.createdAt).getMonth();
      counts[m]++;
    });
    return months.map((m, i) => ({ month: m, count: counts[i] }));
  })();

  const stats = [
    { label: "Total Lessons", value: myLessons.length, icon: "📖", color: "from-indigo-500 to-indigo-600" },
    { label: "Favorites Saved", value: myFavorites.length, icon: "🔖", color: "from-purple-500 to-purple-600" },
    { label: "Public Shared", value: myLessons.filter((l) => l.visibility === "public").length, icon: "🌍", color: "from-teal-500 to-teal-600" },
    { label: "Current Plan", value: isPremium ? "Premium ⭐" : "Free", icon: "💎", color: "from-yellow-400 to-yellow-600" },
  ];

  if (lessonsLoading || favLoading) return <Spinner />;

  return (
    <div className="animate-fade-in">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 tracking-tight">
          Welcome back, {user?.displayName?.split(" ")[0]}! 👋
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Here's what's happening on your growth journey.</p>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((s) => (
          <div key={s.label} className={`relative overflow-hidden rounded-3xl p-6 text-white bg-gradient-to-br ${s.color} shadow-lg shadow-indigo-100`}>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-4xl font-bold mb-1">{s.value}</p>
                <p className="text-xs font-semibold opacity-80 uppercase tracking-widest">{s.label}</p>
              </div>
              <span className="text-4xl opacity-20">{s.icon}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Chart & Recent */}
        <div className="lg:col-span-2 space-y-8">
          {/* Chart */}
          <section className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">📊 Contribution Analytics</h3>
              <span className="text-xs font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-950 px-3 py-1 rounded-full uppercase">2024 Performance</span>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} dy={10} />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', backgroundColor: '#1f2937', color: '#f1f5f9' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="#6366f1"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorCount)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* Recent Lessons */}
          <section className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">🕒 Recent Reflections</h3>
              <Link to="/dashboard/my-lessons" className="text-sm font-bold text-indigo-600 hover:underline">View All</Link>
            </div>
            <div className="space-y-4">
              {myLessons.length > 0 ? (
                myLessons.slice(0, 5).map((l, i) => (
                  <div key={l._id} className="flex items-center group">
                    <div className="w-10 h-10 rounded-2xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-lg mr-4 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-950 transition">
                      {i % 2 === 0 ? "🧘" : "🧠"}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-gray-700 dark:text-gray-200 line-clamp-1 group-hover:text-indigo-600 transition">{l.title}</p>
                      <p className="text-xs text-gray-400 font-medium">{l.category} • {new Date(l.createdAt).toLocaleDateString()}</p>
                    </div>
                    <span className={`text-[10px] uppercase font-black px-2 py-1 rounded-lg ${
                      l.visibility === "public" ? "bg-green-100 dark:bg-green-900/30 text-green-600" : "bg-gray-100 dark:bg-gray-800 text-gray-500"
                    }`}>
                      {l.visibility}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-400 text-center py-4">No lessons added yet.</p>
              )}
            </div>
          </section>
        </div>

        {/* Right Column: Shortcuts & Quick Tips */}
        <div className="space-y-8">
          <section className="bg-indigo-600 rounded-3xl p-8 text-white shadow-xl shadow-indigo-100">
            <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link to="/dashboard/add-lesson" className="flex items-center justify-between bg-white/10 hover:bg-white/20 p-4 rounded-2xl transition">
                <span className="font-bold text-sm">Add New Lesson</span>
                <span className="text-xl">+</span>
              </Link>
              <Link to="/dashboard/my-favorites" className="flex items-center justify-between bg-white/10 hover:bg-white/20 p-4 rounded-2xl transition">
                <span className="font-bold text-sm">View Favorites</span>
                <span className="text-xl">🔖</span>
              </Link>
              <Link to="/dashboard/profile" className="flex items-center justify-between bg-white/10 hover:bg-white/20 p-4 rounded-2xl transition">
                <span className="font-bold text-sm">Manage Profile</span>
                <span className="text-xl">⚙️</span>
              </Link>
            </div>
          </section>

          <section className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-8 shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">Wisdom Tip 💡</h3>
            <div className="bg-indigo-50 dark:bg-indigo-950 rounded-2xl p-4 italic text-indigo-700 dark:text-indigo-300 text-sm leading-relaxed border-l-4 border-indigo-600">
              "Experience is not what happens to you; it's what you do with what happens to you." — Aldous Huxley
            </div>
            <p className="text-xs text-gray-400 mt-4 leading-relaxed font-medium">Keep documenting your journey. Each lesson shared is another step toward collective growth.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;