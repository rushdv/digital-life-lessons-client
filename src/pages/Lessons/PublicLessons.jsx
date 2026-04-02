import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import Spinner from "../../components/Spinner";

const CATEGORIES = ["Personal Growth", "Career", "Relationships", "Mindset", "Mistakes Learned"];
const TONES = ["Motivational", "Sad", "Realization", "Gratitude"];

const PublicLessons = () => {
  const { user, isPremium } = useAuth();
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState("");
  const [tone, setTone] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const limit = 9;

  const { data, isLoading } = useQuery({
    queryKey: ["publicLessons", page, category, tone, search, sort],
    queryFn: async () => {
      const params = new URLSearchParams({ page, limit, sort });
      if (category) params.append("category", category);
      if (tone) params.append("tone", tone);
      if (search) params.append("search", search);
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/lessons/public?${params}`
      );
      return res.data;
    },
    keepPreviousData: true,
  });

  const totalPages = data ? Math.ceil(data.total / limit) : 1;

  const resetFilters = () => {
    setCategory(""); setTone(""); setSearch(""); setSort("newest"); setPage(1);
  };

  if (isLoading) return <Spinner />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-20 animate-fade-in">
      <header className="text-center mb-16">
        <h1 className="text-4xl font-black text-gray-800 dark:text-gray-100 tracking-tight">Public Wisdom Archive 🌍</h1>
        <p className="text-gray-500 dark:text-gray-400 font-medium mt-2">Explore the collective consciousness of our community.</p>
      </header>

      {/* Advanced Filters */}
      <div className="bg-white dark:bg-gray-900 rounded-[2rem] shadow-xl shadow-indigo-50 dark:shadow-none border border-gray-100 dark:border-gray-800 p-8 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 items-end">
          <div className="lg:col-span-2">
            <label className="block text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-2">Search Insights</label>
            <input
              type="text"
              placeholder="Filter by title or keyword..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full bg-gray-50 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500 border-none rounded-2xl px-6 py-3.5 text-sm font-medium focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900 transition outline-none"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-2">Category</label>
            <select
              value={category}
              onChange={(e) => { setCategory(e.target.value); setPage(1); }}
              className="w-full bg-gray-50 dark:bg-gray-800 dark:text-gray-100 border-none rounded-2xl px-4 py-3.5 text-sm font-bold text-gray-600 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900 transition outline-none"
            >
              <option value="">All Topics</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-2">Emotional Tone</label>
            <select
              value={tone}
              onChange={(e) => { setTone(e.target.value); setPage(1); }}
              className="w-full bg-gray-50 dark:bg-gray-800 dark:text-gray-100 border-none rounded-2xl px-4 py-3.5 text-sm font-bold text-gray-600 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900 transition outline-none"
            >
              <option value="">All Tones</option>
              {TONES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
             <button
              onClick={resetFilters}
              className="w-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-indigo-100 dark:hover:bg-indigo-900 transition"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Grid Content */}
      {data?.lessons?.length === 0 ? (
        <div className="text-center py-32 bg-gray-50 dark:bg-gray-900 rounded-[3rem] border-2 border-dashed border-gray-200 dark:border-gray-700">
          <p className="text-6xl mb-6">📭</p>
          <p className="text-xl font-black text-gray-400">The archive is silent for these filters.</p>
          <button onClick={resetFilters} className="mt-4 text-indigo-600 font-bold underline">Clear all searches</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data?.lessons?.map((lesson) => (
            <LessonCard key={lesson._id} lesson={lesson} isPremium={isPremium} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-20">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="w-12 h-12 flex items-center justify-center bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-sm disabled:opacity-30 hover:scale-105 transition"
          >
            <span className="text-xl">←</span>
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-12 h-12 rounded-2xl text-sm font-black transition ${
                page === p ? "bg-indigo-600 text-white shadow-xl shadow-indigo-200" : "bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-gray-200"
              }`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="w-12 h-12 flex items-center justify-center bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-sm disabled:opacity-30 hover:scale-105 transition"
          >
            <span className="text-xl">→</span>
          </button>
        </div>
      )}
    </div>
  );
};

const LessonCard = ({ lesson, isPremium }) => {
  const isLocked = lesson.accessLevel === "premium" && !isPremium;

  return (
    <div className="group bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-2xl hover:shadow-indigo-100/50 dark:hover:shadow-indigo-950 transition-all duration-500 flex flex-col h-full transform hover:-translate-y-2">
      {/* Visual Header */}
      <div className="relative h-56 bg-indigo-50 dark:bg-indigo-950 overflow-hidden">
        {lesson.image ? (
          <img
            src={lesson.image}
            alt={lesson.title}
            className={`w-full h-full object-cover transition duration-700 group-hover:scale-110 ${isLocked ? "blur-md brightness-50" : ""}`}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl group-hover:rotate-12 transition duration-500">📖</div>
        )}
        
        <div className="absolute top-4 left-4 flex flex-col gap-2">
           <span className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md text-[10px] font-black text-gray-800 dark:text-gray-100 px-3 py-1.5 rounded-xl uppercase tracking-widest shadow-lg">
             {lesson.category}
           </span>
           {lesson.accessLevel === "premium" && (
             <span className="bg-yellow-400 text-yellow-900 text-[10px] font-black px-3 py-1.5 rounded-xl uppercase tracking-widest shadow-lg">
               ⭐ Premium
             </span>
           )}
        </div>

        {isLocked && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-2xl mb-3 shadow-2xl">🔒</div>
            <p className="text-xs font-black uppercase tracking-widest">Locked for Premium</p>
          </div>
        )}
      </div>

      {/* Content Body */}
      <div className="p-8 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-4">
           <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
           <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">{lesson.emotionalTone}</span>
        </div>

        <h3 className={`text-xl font-black text-gray-800 dark:text-gray-100 mb-3 line-clamp-2 leading-tight group-hover:text-indigo-600 transition ${isLocked ? "blur-sm select-none" : ""}`}>
          {lesson.title}
        </h3>
        <p className={`text-sm text-gray-400 font-medium line-clamp-3 mb-6 leading-relaxed flex-1 ${isLocked ? "blur-[2px] select-none" : ""}`}>
          {lesson.description}
        </p>

        <div className="pt-6 border-t border-gray-50 dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="relative">
                <img
                  src={lesson.creatorPhoto || "https://i.ibb.co/placeholder.png"}
                  className="w-10 h-10 rounded-2xl object-cover ring-4 ring-gray-50 dark:ring-gray-800"
                  alt={lesson.creatorName}
                />
                {!isLocked && <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full"></span>}
             </div>
             <div>
                <p className="text-xs font-black text-gray-800 dark:text-gray-200 truncate max-w-[100px]">{lesson.creatorName}</p>
                <p className="text-[10px] font-bold text-gray-400">{new Date(lesson.createdAt).toLocaleDateString()}</p>
             </div>
          </div>

          {isLocked ? (
            <Link
              to="/pricing"
              className="bg-gray-800 dark:bg-gray-700 text-white text-[10px] font-black px-4 py-2.5 rounded-xl uppercase tracking-widest hover:bg-black transition shadow-lg"
            >
              Upgrade
            </Link>
          ) : (
            <Link
              to={`/lessons/${lesson._id}`}
              className="bg-indigo-600 text-white text-[10px] font-black px-4 py-2.5 rounded-xl uppercase tracking-widest hover:bg-indigo-700 transition shadow-xl shadow-indigo-100"
            >
              Details
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default PublicLessons;
