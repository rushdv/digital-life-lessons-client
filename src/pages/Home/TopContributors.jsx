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
    <section className="py-16 bg-indigo-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-800">🏆 Top Contributors This Week</h2>
          <p className="text-gray-500 mt-2">Celebrating the most active wisdom sharers</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {contributors.map((user, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-4 text-center shadow-sm hover:shadow-md transition"
            >
              <div className="relative mx-auto w-16 h-16 mb-3">
                <img
                  src={user.photo || "https://i.ibb.co/placeholder.png"}
                  alt={user.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-indigo-300"
                />
                {i === 0 && (
                  <span className="absolute -top-2 -right-1 text-lg">👑</span>
                )}
              </div>
              <p className="text-sm font-semibold text-gray-800 truncate">{user.name}</p>
              <p className="text-xs text-indigo-600 mt-1">{user.lessonCount} lessons</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopContributors;