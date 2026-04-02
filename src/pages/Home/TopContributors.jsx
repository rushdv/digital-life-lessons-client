import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const TopContributors = () => {
  const { data: contributors = [] } = useQuery({
    queryKey: ["topContributors"],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/users/top-contributors`);
      return res.data;
    },
  });

  return (
    <section className="py-24 bg-indigo-50/50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-6">
        <header className="mb-16 text-center">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600 block mb-4">Community Leaders</span>
          <h2 className="text-4xl font-black text-gray-800 dark:text-gray-100 tracking-tight leading-tight">Top Contributors of the Week 🏆</h2>
          <p className="text-gray-500 dark:text-gray-400 font-medium mt-4 text-lg">Celebrating the wisdom-sharers who go the extra mile for our collective evolution.</p>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {contributors.slice(0, 6).map((user, i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 rounded-[2rem] p-6 text-center shadow-sm hover:shadow-xl hover:shadow-indigo-50 dark:hover:shadow-indigo-950 transition-all duration-500 transform hover:-translate-y-2 group"
            >
              <div className="relative mx-auto w-20 h-20 mb-4 ring-4 ring-indigo-50 dark:ring-indigo-950 rounded-full transition duration-500 group-hover:ring-indigo-100">
                <img
                  src={user.photo || "https://i.ibb.co/placeholder.png"}
                  alt={user.name}
                  className="w-full h-full rounded-full object-cover transition duration-500 group-hover:scale-110"
                />
                {i === 0 && (
                   <div className="absolute -top-3 -right-1 bg-yellow-400 text-white w-8 h-8 rounded-xl flex items-center justify-center shadow-lg transform rotate-12 transition group-hover:rotate-0">👑</div>
                )}
              </div>
              <p className="text-sm font-black text-gray-800 dark:text-gray-100 truncate mb-1">{user.name}</p>
              <p className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">{user.lessonCount} Lessons Shared</p>
            </div>
          ))}
          {contributors.length === 0 && (
            <div className="col-span-full py-10 text-center text-gray-400 font-bold italic">Gathering this week's data...</div>
          )}
        </div>
      </div>
    </section>
  );
};

export default TopContributors;