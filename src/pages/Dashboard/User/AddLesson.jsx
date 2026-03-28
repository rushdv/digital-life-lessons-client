import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Lottie from "lottie-react";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const CATEGORIES = ["Personal Growth", "Career", "Relationships", "Mindset", "Mistakes Learned"];
const TONES = ["Motivational", "Sad", "Realization", "Gratitude"];

const AddLesson = () => {
  const { user, isPremium } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [success, setSuccess] = useState(false);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    try {
      await axiosSecure.post("/lessons", {
        ...data,
        creatorName: user.displayName,
        creatorEmail: user.email,
        creatorPhoto: user.photoURL,
      });
      toast.success("Lesson created successfully!");
      setSuccess(true);
      reset();
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      toast.error("Failed to create lesson. Try again.");
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">📝 Add New Lesson</h1>

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 text-center text-green-700 font-medium">
          ✅ Lesson published successfully!
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Lesson Title *</label>
          <input
            type="text"
            placeholder="What did you learn?"
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
            {...register("title", { required: "Title is required" })}
          />
          {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Description *</label>
          <textarea
            rows={6}
            placeholder="Share your story, insight, or lesson in detail..."
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none"
            {...register("description", { required: "Description is required" })}
          />
          {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
        </div>

        {/* Category & Tone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
            <select
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none"
              {...register("category", { required: "Category is required" })}
            >
              <option value="">Select category</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Emotional Tone *</label>
            <select
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none"
              {...register("emotionalTone", { required: "Tone is required" })}
            >
              <option value="">Select tone</option>
              {TONES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            {errors.emotionalTone && <p className="text-red-500 text-xs mt-1">{errors.emotionalTone.message}</p>}
          </div>
        </div>

        {/* Visibility & Access Level */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Visibility *</label>
            <select
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none"
              {...register("visibility", { required: true })}
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Access Level *
              {!isPremium && (
                <span className="ml-2 text-xs text-yellow-600 font-normal">
                  (Upgrade for Premium)
                </span>
              )}
            </label>
            <select
              disabled={!isPremium}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              title={!isPremium ? "Upgrade to Premium to create paid lessons" : ""}
              {...register("accessLevel")}
              defaultValue="free"
            >
              <option value="free">Free</option>
              {isPremium && <option value="premium">Premium</option>}
            </select>
          </div>
        </div>

        {/* Image URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Image URL <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <input
            type="url"
            placeholder="https://..."
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
            {...register("image")}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition disabled:opacity-60"
        >
          {isSubmitting ? "Publishing..." : "Publish Lesson"}
        </button>
      </form>
    </div>
  );
};

export default AddLesson;