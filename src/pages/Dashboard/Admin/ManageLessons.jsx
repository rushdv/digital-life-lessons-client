import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Spinner from "../../../components/Spinner";

const ManageLessons = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState("");

  const { data: lessons = [], isLoading } = useQuery({
    queryKey: ["adminLessons"],
    queryFn: async () => (await axiosSecure.get("/admin/lessons")).data,
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => axiosSecure.delete(`/lessons/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["adminLessons"]);
      toast.success("Lesson deleted!");
    },
  });

  const featuredMutation = useMutation({
    mutationFn: ({ id, isFeatured }) =>
      axiosSecure.patch(`/lessons/${id}/featured`, { isFeatured }),
    onSuccess: () => queryClient.invalidateQueries(["adminLessons"]),
  });

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete this lesson?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#ef4444",
    });
    if (result.isConfirmed) deleteMutation.mutate(id);
  };

  const filtered = filter
    ? lessons.filter((l) => l.visibility === filter)
    : lessons;

  if (isLoading) return <Spinner />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-gray-800">📋 Manage Lessons</h1>
        <div className="flex gap-2">
          {["", "public", "private"].map((v) => (
            <button
              key={v}
              onClick={() => setFilter(v)}
              className={`px-4 py-1.5 rounded-full text-sm transition ${
                filter === v ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-indigo-50"
              }`}
            >
              {v === "" ? "All" : v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="text-left px-5 py-3 font-medium">Title</th>
                <th className="text-left px-5 py-3 font-medium">Creator</th>
                <th className="text-left px-5 py-3 font-medium">Category</th>
                <th className="text-left px-5 py-3 font-medium">Visibility</th>
                <th className="text-left px-5 py-3 font-medium">Featured</th>
                <th className="text-left px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((lesson) => (
                <tr key={lesson._id} className="hover:bg-gray-50">
                  <td className="px-5 py-3 max-w-[180px]">
                    <p className="font-medium text-gray-800 truncate">{lesson.title}</p>
                  </td>
                  <td className="px-5 py-3 text-gray-500">{lesson.creatorName}</td>
                  <td className="px-5 py-3 text-gray-500">{lesson.category}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      lesson.visibility === "public"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}>{lesson.visibility}</span>
                  </td>
                  <td className="px-5 py-3">
                    <button
                      onClick={() =>
                        featuredMutation.mutate({
                          id: lesson._id,
                          isFeatured: !lesson.isFeatured,
                        })
                      }
                      className={`text-xs px-2 py-1 rounded-lg transition ${
                        lesson.isFeatured
                          ? "bg-yellow-400 text-yellow-900"
                          : "bg-gray-100 text-gray-500 hover:bg-yellow-100"
                      }`}
                    >
                      {lesson.isFeatured ? "✨ Featured" : "Set Featured"}
                    </button>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex gap-2">
                      <Link
                        to={`/lessons/${lesson._id}`}
                        className="text-xs text-indigo-600 border border-indigo-200 px-2 py-1 rounded-lg hover:bg-indigo-50"
                      >
                        View
                      </Link>
                      <button
                        onClick={() => handleDelete(lesson._id)}
                        className="text-xs text-red-500 border border-red-200 px-2 py-1 rounded-lg hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageLessons;