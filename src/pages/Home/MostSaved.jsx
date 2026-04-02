import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router-dom";

const MostSaved = () => {
  const { data: lessons = [] } = useQuery({
    queryKey: ["mostSaved"],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/lessons/public?sort=most-saved&limit=6`
      );
      return res.data.lessons;
    },
  });

  return (
    <section className="py-24 bg-white dark:bg-gray-950 relative">
      <div className="max-w-7xl mx-auto px-6">
        <header className="mb-16 text-center lg:text-left flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div className="max-w-2xl">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600 block mb-4">Viral Wisdom</span>
            <h2 className="text-4xl font-black text-gray-800 dark:text-gray-100 tracking-tight leading-tight">Most Saved Lessons 🔖</h2>
            <p className="text-gray-500 dark:text-gray-400 font-medium mt-4 text-lg">Insights that the community finds so valuable, they can't stop bookmarking them for later reflection.</p>
          </div>
          <Link to="/public-lessons" className="text-sm font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest hover:underline">Explore Archive →</Link>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {lessons.map((lesson) => (
            <div
              key={lesson._id}
              className="group bg-gray-50 dark:bg-gray-900 rounded-[2.5rem] p-8 hover:bg-white dark:hover:bg-gray-800 hover:shadow-2xl hover:shadow-indigo-100 dark:hover:shadow-indigo-950 transition-all duration-500 flex flex-col h-full border border-transparent hover:border-indigo-100 dark:hover:border-indigo-900"
            >
              <div className="flex items-center justify-between mb-6">
                <span className="text-[10px] uppercase font-black text-indigo-600 dark:text-indigo-400 bg-white dark:bg-gray-700 px-3 py-1 rounded-full shadow-sm">
                  {lesson.category}
                </span>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  🔖 {lesson.favoritesCount || 0} Saves
                </span>
              </div>
              <h3 className="text-xl font-black text-gray-800 dark:text-gray-100 mb-4 line-clamp-2 leading-tight group-hover:text-indigo-600 transition">
                {lesson.title}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 font-medium line-clamp-3 mb-8 leading-relaxed flex-1">
                {lesson.description}
              </p>
              <Link
                to={`/lessons/${lesson._id}`}
                className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest hover:underline"
              >
                Read Lesson →
              </Link>
            </div>
          ))}
          {lessons.length === 0 && (
             <div className="col-span-full py-10 text-center text-gray-400 font-bold italic">Curating bookmarks...</div>
          )}
        </div>
      </div>
    </section>
  );
};

export default MostSaved;
