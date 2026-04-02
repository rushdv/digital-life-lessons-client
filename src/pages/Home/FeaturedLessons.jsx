import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router-dom";
import Spinner from "../../components/Spinner";

const FeaturedLessons = () => {
  const { data: lessons = [], isLoading } = useQuery({
    queryKey: ["featuredLessons"],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/lessons/featured`);
      return res.data;
    },
  });

  if (isLoading) return <Spinner />;

  return (
    <section className="py-24 bg-white dark:bg-gray-950 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 dark:bg-indigo-950 rounded-full blur-3xl opacity-40 translate-x-1/2 -translate-y-1/2"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <header className="flex flex-col md:flex-row md:items-end md:justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600 block mb-4">Curated Wisdom</span>
            <h2 className="text-4xl font-black text-gray-800 dark:text-gray-100 tracking-tight leading-tight">Featured Reflections ✨</h2>
            <p className="text-gray-500 dark:text-gray-400 font-medium mt-4 text-lg">Hand-picked insights from our most resonant contributors. These lessons have shaped many journeys.</p>
          </div>
          <Link
            to="/public-lessons"
            className="inline-block bg-gray-50 dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-100 dark:hover:bg-indigo-950 transition shadow-sm"
          >
            Explore All Wisdom →
          </Link>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {lessons.slice(0, 3).map((lesson) => (
            <FeaturedLessonCard key={lesson._id} lesson={lesson} />
          ))}
        </div>
      </div>
    </section>
  );
};

const FeaturedLessonCard = ({ lesson }) => (
  <div className="group bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl hover:shadow-indigo-50 dark:hover:shadow-indigo-950 transition-all duration-500 p-8 flex flex-col h-full transform hover:-translate-y-2">
    <div className="flex items-center gap-3 mb-6">
       <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
       <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">{lesson.category}</span>
    </div>

    <h3 className="text-2xl font-black text-gray-800 dark:text-gray-100 mb-4 line-clamp-2 leading-tight group-hover:text-indigo-600 transition">
      {lesson.title}
    </h3>
    <p className="text-gray-500 dark:text-gray-400 font-medium line-clamp-3 mb-8 leading-relaxed flex-1">
      {lesson.description}
    </p>

    <div className="pt-6 border-t border-gray-50 dark:border-gray-800 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <img
          src={lesson.creatorPhoto || "https://i.ibb.co/placeholder.png"}
          className="w-10 h-10 rounded-2xl object-cover ring-4 ring-gray-50 dark:ring-gray-800"
          alt={lesson.creatorName}
        />
        <div>
          <p className="text-xs font-black text-gray-800 dark:text-gray-200">{lesson.creatorName}</p>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Sage Spirit</p>
        </div>
      </div>
      <Link
        to={`/lessons/${lesson._id}`}
        className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center font-black group-hover:bg-indigo-600 group-hover:text-white transition shadow-sm"
      >
        →
      </Link>
    </div>
  </div>
);

export default FeaturedLessons;