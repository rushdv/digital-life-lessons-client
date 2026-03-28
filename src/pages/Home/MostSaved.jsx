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
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-800">🔖 Most Saved Lessons</h2>
          <p className="text-gray-500 mt-2">The wisdom the community can't stop saving</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lessons.map((lesson) => (
            <div
              key={lesson._id}
              className="bg-gray-50 border border-gray-100 rounded-2xl p-5 hover:shadow-md transition flex flex-col h-full"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full">
                  {lesson.category}
                </span>
                <span className="text-xs text-gray-400">🔖 {lesson.favoritesCount} saves</span>
              </div>
              <h3 className="text-base font-bold text-gray-800 mb-2 line-clamp-2">{lesson.title}</h3>
              <p className="text-sm text-gray-500 line-clamp-3 flex-1">{lesson.description}</p>
              <Link
                to={`/lessons/${lesson._id}`}
                className="mt-4 text-sm text-indigo-600 font-medium hover:underline"
              >
                Read Lesson →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MostSaved;