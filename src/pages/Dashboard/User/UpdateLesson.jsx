import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import toast from "react-hot-toast";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import Spinner from "../../../components/Spinner";

const CATEGORIES = ["Personal Growth", "Career", "Relationships", "Mindset", "Mistakes Learned"];
const TONES = ["Motivational", "Sad", "Realization", "Gratitude"];

const UpdateLesson = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const { isPremium } = useAuth();

  const { data: lesson, isLoading } = useQuery({
    queryKey: ["lesson-edit", id],
    queryFn: async () => (await axiosSecure.get(`/lessons/${id}`)).data,
  });

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

  useEffect(() => {
    if (lesson) reset(lesson);
  }, [lesson, reset]);

  const mutation = useMutation({
    mutationFn: (data) => axiosSecure.put(`/lessons/${id}`, data),
    onSuccess: () => {
      toast.success("Lesson updated successfully!");
      navigate("/dashboard/my-lessons");
    },
    onError: () => toast.error("Update failed. Try again."),
  });

  if (isLoading) return <Spinner />;

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">✏️ Update Lesson</h1>

      <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Lesson Title *</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
            {...register("title", { required: "Title is required" })}
          />
          {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Description *</label>
          <textarea
            rows={6}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none"
            {...register("description", { required: "Description is required" })}
          />
          {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
            <select className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm" {...register("category")}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Emotional Tone *</label>
            <select className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm" {...register("emotionalTone")}>
              {TONES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Visibility</label>
            <select className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm" {...register("visibility")}>
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Access Level
              {!isPremium && <span className="ml-1 text-xs text-yellow-600">(Upgrade for Premium)</span>}
            </label>
            <select
              disabled={!isPremium}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm disabled:bg-gray-100"
              {...register("accessLevel")}
            >
              <option value="free">Free</option>
              {isPremium && <option value="premium">Premium</option>}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Image URL <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <input
            type="url"
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
            {...register("image")}
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={isSubmitting || mutation.isLoading}
            className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition disabled:opacity-60"
          >
            {isSubmitting || mutation.isLoading ? "Saving..." : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/dashboard/my-lessons")}
            className="flex-1 border border-gray-300 py-3 rounded-xl font-semibold hover:bg-gray-50 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateLesson;
