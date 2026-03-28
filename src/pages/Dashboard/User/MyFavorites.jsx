import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Spinner from "../../../components/Spinner";

const CATEGORIES = ["All", "Personal Growth", "Career", "Relationships", "Mindset", "Mistakes Learned"];

const MyFavorites = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState("All");

  const { data: lessons = [], isLoading } = useQuery({
    queryKey: ["favorites"],
    queryFn: async () => (await axiosSecure.get("/favorites")).data,
  });

  const removeMutation = useMutation({
    mutationFn: (id) => axiosSecure.delete(`/favorites/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["favorites"]);
      toast.success("Removed from favorites!");
    },
  });

  const filtered = filter === "All" ? lessons : lessons.filter((l) => l.category === filter);

  if (isLoading) return <Spinner />;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">🔖 My Favorites</h1>

      {/* Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
              filter === c
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-indigo-50"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">🔖</p>
          <p>No favorites yet. <Link to="/public-lessons" className="text-indigo-600">Browse lessons</Link></p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="text-left px-5 py-3 font-medium">Title</th>
                  <th className="text-left px-5 py-3 font-medium">Category</th>
                  <th className="text-left px-5 py-3 font-medium">Tone</th>
                  <th className="text-left px-5 py-3 font-medium">Creator</th>
                  <th className="text-left px-5 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((lesson) => (
                  <tr key={lesson._id} className="hover:bg-gray-50">
                    <td className="px-5 py-3 max-w-[200px]">
                      <p className="font-medium text-gray-800 truncate">{lesson.title}</p>
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
                        {lesson.category}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-500">{lesson.emotionalTone}</td>
                    <td className="px-5 py-3 text-gray-500">{lesson.creatorName}</td>
                    <td className="px-5 py-3">
                      <div className="flex gap-2">
                        <Link
                          to={`/lessons/${lesson._id}`}
                          className="text-xs text-indigo-600 border border-indigo-200 px-2 py-1 rounded-lg hover:bg-indigo-50"
                        >
                          View
                        </Link>
                        <button
                          onClick={() => removeMutation.mutate(lesson._id)}
                          className="text-xs text-red-500 border border-red-200 px-2 py-1 rounded-lg hover:bg-red-50"
                        >
                          Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyFavorites;