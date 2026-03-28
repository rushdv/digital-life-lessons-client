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
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">🌍 Public Life Lessons</h1>
        <p className="text-gray-500 mt-2">Explore wisdom shared by our community</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-8 flex flex-wrap gap-3 items-end">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-medium text-gray-600 mb-1">Search</label>
          <input
            type="text"
            placeholder="Search by title..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Category</label>
          <select
            value={category}
            onChange={(e) => { setCategory(e.target.value); setPage(1); }}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Emotional Tone</label>
          <select
            value={tone}
            onChange={(e) => { setTone(e.target.value); setPage(1); }}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none"
          >
            <option value="">All Tones</option>
            {TONES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Sort By</label>
          <select
            value={sort}
            onChange={(e) => { setSort(e.target.value); setPage(1); }}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none"
          >
            <option value="newest">Newest First</option>
            <option value="most-saved">Most Saved</option>
          </select>
        </div>
        <button
          onClick={resetFilters}
          className="text-sm text-indigo-600 border border-indigo-300 rounded-lg px-4 py-2 hover:bg-indigo-50 transition"
        >
          Reset
        </button>
      </div>

      {/* Lessons Grid */}
      {data?.lessons?.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-5xl mb-4">📭</p>
          <p className="text-lg">No lessons found. Try different filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.lessons?.map((lesson) => (
            <LessonCard key={lesson._id} lesson={lesson} isPremium={isPremium} user={user} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-10">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 border rounded-lg text-sm disabled:opacity-40 hover:bg-indigo-50"
          >
            ← Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-9 h-9 rounded-lg text-sm font-medium ${
                page === p ? "bg-indigo-600 text-white" : "border hover:bg-indigo-50"
              }`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 border rounded-lg text-sm disabled:opacity-40 hover:bg-indigo-50"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
};

const LessonCard = ({ lesson, isPremium, user }) => {
  const isLocked = lesson.accessLevel === "premium" && !isPremium;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition flex flex-col h-full">
      {/* Image */}
      <div className="relative h-44 bg-indigo-50">
        {lesson.image ? (
          <img
            src={lesson.image}
            alt={lesson.title}
            className={`w-full h-full object-cover ${isLocked ? "blur-sm" : ""}`}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl">📖</div>
        )}
        {isLocked && (
          <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center">
            <span className="text-3xl">🔒</span>
            <p className="text-white text-xs font-semibold mt-1">Premium Lesson</p>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
            {lesson.category}
          </span>
          <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
            {lesson.emotionalTone}
          </span>
          <span className={`text-xs px-2 py-0.5 rounded-full ${
            lesson.accessLevel === "premium"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-green-100 text-green-700"
          }`}>
            {lesson.accessLevel === "premium" ? "⭐ Premium" : "Free"}
          </span>
        </div>

        <h3 className={`text-base font-bold text-gray-800 mb-2 line-clamp-2 ${isLocked ? "blur-sm select-none" : ""}`}>
          {lesson.title}
        </h3>
        <p className={`text-sm text-gray-500 line-clamp-3 flex-1 ${isLocked ? "blur-sm select-none" : ""}`}>
          {lesson.description}
        </p>

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <img
              src={lesson.creatorPhoto || "https://i.ibb.co/placeholder.png"}
              className="w-6 h-6 rounded-full object-cover"
              alt={lesson.creatorName}
            />
            <span className="text-xs text-gray-500 truncate max-w-[100px]">{lesson.creatorName}</span>
          </div>
          {isLocked ? (
            <Link
              to="/pricing"
              className="text-xs bg-yellow-500 text-white px-3 py-1.5 rounded-full hover:bg-yellow-600 transition"
            >
              Upgrade to View
            </Link>
          ) : (
            <Link
              to={`/lessons/${lesson._id}`}
              className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-full hover:bg-indigo-700 transition"
            >
              See Details
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default PublicLessons;