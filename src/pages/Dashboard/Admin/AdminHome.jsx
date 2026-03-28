import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, BarChart, Bar
} from "recharts";

const AdminHome = () => {
  const axiosSecure = useAxiosSecure();

  const { data: stats = {} } = useQuery({
    queryKey: ["adminStats"],
    queryFn: async () => (await axiosSecure.get("/admin/stats")).data,
  });

  const { data: lessons = [] } = useQuery({
    queryKey: ["allLessonsAdmin"],
    queryFn: async () => (await axiosSecure.get("/admin/lessons")).data,
  });

  // Growth chart: lessons per month
  const chartData = (() => {
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const counts = Array(12).fill(0);
    lessons.forEach((l) => {
      const m = new Date(l.createdAt).getMonth();
      counts[m]++;
    });
    return months.map((m, i) => ({ month: m, lessons: counts[i] }));
  })();

  const cards = [
    { label: "Total Users", value: stats.totalUsers || 0, icon: "👥", color: "bg-blue-100 text-blue-700" },
    { label: "Public Lessons", value: stats.totalPublicLessons || 0, icon: "📖", color: "bg-indigo-100 text-indigo-700" },
    { label: "Reported Lessons", value: stats.totalReported || 0, icon: "🚩", color: "bg-red-100 text-red-700" },
    { label: "Total Lessons", value: lessons.length || 0, icon: "📚", color: "bg-purple-100 text-purple-700" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">📊 Admin Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((c) => (
          <div key={c.label} className={`${c.color} rounded-2xl p-5`}>
            <p className="text-2xl mb-1">{c.icon}</p>
            <p className="text-2xl font-bold">{c.value}</p>
            <p className="text-sm opacity-70">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h3 className="font-semibold text-gray-800 mb-4">📈 Lesson Growth (This Year)</h3>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
            <Tooltip />
            <Bar dataKey="lessons" fill="#6366f1" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AdminHome;