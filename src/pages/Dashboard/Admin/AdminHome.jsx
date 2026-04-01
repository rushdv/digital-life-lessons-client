import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar
} from "recharts";
import Spinner from "../../../components/Spinner";

const AdminHome = () => {
  const axiosSecure = useAxiosSecure();

  const { data: stats = {}, isLoading: statsLoading } = useQuery({
    queryKey: ["adminStats"],
    queryFn: async () => (await axiosSecure.get("/admin/stats")).data,
  });

  const { data: lessons = [], isLoading: lessonsLoading } = useQuery({
    queryKey: ["allLessonsAdmin"],
    queryFn: async () => (await axiosSecure.get("/admin/lessons")).data,
  });

  if (statsLoading || lessonsLoading) return <Spinner />;

  // Chart data: lessons per month
  const chartData = (() => {
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const counts = Array(12).fill(0);
    lessons.forEach((l) => {
      const m = new Date(l.createdAt).getMonth();
      counts[m]++;
    });
    return months.map((m, i) => ({ month: m, count: counts[i] }));
  })();

  const cards = [
    { label: "Total Users", value: stats.totalUsers || 0, icon: "👥", color: "from-blue-500 to-blue-600" },
    { label: "Public Lessons", value: stats.totalPublicLessons || 0, icon: "🌍", color: "from-indigo-500 to-indigo-600" },
    { label: "Reported", value: stats.totalReported || 0, icon: "🚩", color: "from-red-500 to-red-600" },
    { label: "Today's New", value: stats.todayLessons || 0, icon: "🆕", color: "from-teal-500 to-teal-600" },
  ];

  return (
    <div className="animate-fade-in">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-gray-800 tracking-tight">System Overview 📊</h1>
        <p className="text-gray-500 mt-1">Real-time platform-wide insights and moderation analytics.</p>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {cards.map((c) => (
          <div key={c.label} className={`relative overflow-hidden rounded-3xl p-6 text-white bg-gradient-to-br ${c.color} shadow-lg shadow-gray-200`}>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-4xl font-bold mb-1">{c.value}</p>
                <p className="text-xs font-semibold opacity-80 uppercase tracking-widest">{c.label}</p>
              </div>
              <span className="text-4xl opacity-20">{c.icon}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <section className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-gray-800">📈 Lesson Growth Architecture</h3>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase">Annual Growth</span>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorAdminCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} dy={10} />
                <YAxis hide />
                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} />
                <Area type="monotone" dataKey="count" stroke="#4f46e5" strokeWidth={4} fillOpacity={1} fill="url(#colorAdminCount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Most Active Contributors */}
        <section className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-6">👑 Top Contributors</h3>
          <div className="space-y-5">
            {(stats.topContributors || []).slice(0, 5).map((user, i) => (
              <div key={user.email} className="flex items-center justify-between group">
                <div className="flex items-center">
                  <span className={`w-6 h-6 flex items-center justify-center rounded-lg text-xs font-black mr-3 ${
                    i === 0 ? "bg-yellow-100 text-yellow-600" : "bg-gray-100 text-gray-400"
                  }`}>{i + 1}</span>
                  <div>
                    <p className="text-sm font-bold text-gray-700 group-hover:text-indigo-600 transition truncate max-w-[120px]">{user.name}</p>
                    <p className="text-[10px] text-gray-400 font-semibold">{user.lessonsCount} lessons</p>
                  </div>
                </div>
                <div className="flex -space-x-1">
                   {/* Decorative dots for visual flair */}
                   {Array(3).fill(0).map((_, idx) => (
                     <span key={idx} className={`w-1 h-1 rounded-full ${i === 0 ? "bg-yellow-400" : "bg-gray-200"}`}></span>
                   ))}
                </div>
              </div>
            ))}
            {(!stats.topContributors || stats.topContributors.length === 0) && (
              <p className="text-xs text-center text-gray-400">Loading contributor data...</p>
            )}
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-50">
             <Link to="/dashboard/admin/manage-users" className="w-full inline-block text-center py-3 bg-gray-50 hover:bg-indigo-50 text-indigo-600 font-bold rounded-2xl text-xs transition">
                Manage All Users →
             </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminHome;