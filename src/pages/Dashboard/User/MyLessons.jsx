import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import Spinner from "../../../components/Spinner";

const MyLessons = () => {
  const axiosSecure = useAxiosSecure();
  const { isPremium } = useAuth();
  const queryClient = useQueryClient();
  const [editLesson, setEditLesson] = useState(null);

  const { data: lessons = [], isLoading } = useQuery({
    queryKey: ["myLessons"],
    queryFn: async () => (await axiosSecure.get("/lessons/my-lessons")).data,
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => axiosSecure.delete(`/lessons/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["myLessons"]);
      toast.success("Lesson deleted!");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => axiosSecure.put(`/lessons/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["myLessons"]);
      setEditLesson(null);
      toast.success("Lesson updated!");
    },
  });

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete this lesson?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
      confirmButtonColor: "#ef4444",
    });
    if (result.isConfirmed) deleteMutation.mutate(id);
  };

  if (isLoading) return <Spinner />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">📚 My Lessons</h1>
        <Link
          to="/dashboard/add-lesson"
          className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-indigo-700 transition"
        >
          + Add Lesson
        </Link>
      </div>

      {lessons.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">📭</p>
          <p>No lessons yet. <Link to="/dashboard/add-lesson" className="text-indigo-600">Create one!</Link></p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="text-left px-5 py-3 font-medium">Title</th>
                  <th className="text-left px-5 py-3 font-medium">Category</th>
                  <th className="text-left px-5 py-3 font-medium">Visibility</th>
                  <th className="text-left px-5 py-3 font-medium">Access</th>
                  <th className="text-left px-5 py-3 font-medium">❤️</th>
                  <th className="text-left px-5 py-3 font-medium">🔖</th>
                  <th className="text-left px-5 py-3 font-medium">Date</th>
                  <th className="text-left px-5 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {lessons.map((lesson) => (
                  <tr key={lesson._id} className="hover:bg-gray-50">
                    <td className="px-5 py-3 max-w-[200px]">
                      <p className="font-medium text-gray-800 truncate">{lesson.title}</p>
                    </td>
                    <td className="px-5 py-3 text-gray-500">{lesson.category}</td>
                    <td className="px-5 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        lesson.visibility === "public"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}>{lesson.visibility}</span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        lesson.accessLevel === "premium"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-blue-100 text-blue-600"
                      }`}>{lesson.accessLevel}</span>
                    </td>
                    <td className="px-5 py-3 text-gray-500">{lesson.likesCount || 0}</td>
                    <td className="px-5 py-3 text-gray-500">{lesson.favoritesCount || 0}</td>
                    <td className="px-5 py-3 text-gray-400 text-xs">
                      {new Date(lesson.createdAt).toLocaleDateString()}
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
                          onClick={() => setEditLesson(lesson)}
                          className="text-xs text-gray-600 border border-gray-200 px-2 py-1 rounded-lg hover:bg-gray-50"
                        >
                          Edit
                        </button>
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
      )}

      {/* Edit Modal */}
      {editLesson && (
        <EditModal
          lesson={editLesson}
          isPremium={isPremium}
          onClose={() => setEditLesson(null)}
          onSave={(data) => updateMutation.mutate({ id: editLesson._id, data })}
        />
      )}
    </div>
  );
};

const EditModal = ({ lesson, isPremium, onClose, onSave }) => {
  const { register, handleSubmit } = useForm({ defaultValues: lesson });
  const CATEGORIES = ["Personal Growth", "Career", "Relationships", "Mindset", "Mistakes Learned"];
  const TONES = ["Motivational", "Sad", "Realization", "Gratitude"];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-bold mb-4">✏️ Update Lesson</h3>
        <form onSubmit={handleSubmit(onSave)} className="space-y-4">
          <input
            type="text"
            placeholder="Title"
            className="w-full border rounded-lg px-4 py-2.5 text-sm"
            {...register("title", { required: true })}
          />
          <textarea
            rows={5}
            placeholder="Description"
            className="w-full border rounded-lg px-4 py-2.5 text-sm resize-none"
            {...register("description", { required: true })}
          />
          <div className="grid grid-cols-2 gap-3">
            <select className="border rounded-lg px-3 py-2.5 text-sm" {...register("category")}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <select className="border rounded-lg px-3 py-2.5 text-sm" {...register("emotionalTone")}>
              {TONES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <select className="border rounded-lg px-3 py-2.5 text-sm" {...register("visibility")}>
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
            <select
              disabled={!isPremium}
              className="border rounded-lg px-3 py-2.5 text-sm disabled:bg-gray-100"
              {...register("accessLevel")}
            >
              <option value="free">Free</option>
              {isPremium && <option value="premium">Premium</option>}
            </select>
          </div>
          <input
            type="url"
            placeholder="Image URL (optional)"
            className="w-full border rounded-lg px-4 py-2.5 text-sm"
            {...register("image")}
          />
          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 bg-indigo-600 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-700 transition"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 py-2.5 rounded-xl text-sm hover:bg-gray-50 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

import { useForm } from "react-hook-form";
export default MyLessons;