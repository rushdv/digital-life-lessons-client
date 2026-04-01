import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import Spinner from "../../../components/Spinner";

const Profile = () => {
  const { user, isPremium, updateUserProfile } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(user?.displayName || "");
  const [newPhoto, setNewPhoto] = useState(user?.photoURL || "");

  // User stats
  const { data: stats = {}, isLoading: statsLoading } = useQuery({
    queryKey: ["userStats", user?.email],
    queryFn: async () => (await axiosSecure.get(`/users/stats/${user?.email}`)).data,
    enabled: !!user?.email,
  });

  // User lessons (public only as required)
  const { data: myPublicLessons = [], isLoading: lessonsLoading } = useQuery({
    queryKey: ["myPublicLessons", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/lessons/public?email=${user?.email}&sort=newest`);
      return res.data.lessons;
    },
    enabled: !!user?.email,
  });

  const profileMutation = useMutation({
    mutationFn: async ({ name, photo }) => {
      await updateUserProfile(name, photo);
      return axiosSecure.patch(`/users/${user.email}`, { name, photo });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["userStats", user?.email]);
      setIsEditing(false);
      toast.success("Profile updated!");
    },
    onError: () => toast.error("Update failed. Try again."),
  });

  const handleUpdate = (e) => {
    e.preventDefault();
    if (!newName.trim()) return toast.error("Name is required");
    profileMutation.mutate({ name: newName, photo: newPhoto });
  };

  if (statsLoading) return <Spinner />;

  return (
    <div className="max-w-4xl">
      {/* Header Profile Card */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600 relative">
          <div className="absolute -bottom-12 left-8 flex items-end gap-5">
            <img
              src={user?.photoURL || "https://i.ibb.co/placeholder.png"}
              alt="Profile"
              className="w-28 h-28 rounded-full border-4 border-white object-cover shadow-md bg-white"
            />
            <div className="mb-2">
              <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                {user?.displayName}
                {isPremium && (
                  <span className="text-xs bg-yellow-400 text-yellow-900 px-2.5 py-1 rounded-full font-bold">
                    Premium ⭐
                  </span>
                )}
              </h1>
              <p className="text-gray-500 text-sm">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={() => setIsEditing(true)}
            className="absolute bottom-4 right-8 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl text-sm font-medium backdrop-blur-md transition"
          >
            Edit Profile
          </button>
        </div>

        {/* Stats Grid */}
        <div className="px-8 pt-16 pb-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-indigo-50 rounded-2xl p-5 border border-indigo-100">
            <p className="text-gray-500 text-sm mb-1 uppercase tracking-wider font-semibold">Lessons Created</p>
            <p className="text-4xl font-bold text-indigo-700">{stats.totalLessons || 0}</p>
          </div>
          <div className="bg-purple-50 rounded-2xl p-5 border border-purple-100">
            <p className="text-gray-500 text-sm mb-1 uppercase tracking-wider font-semibold">Lessons Favorited</p>
            <p className="text-4xl font-bold text-purple-700">{stats.totalFavorites || 0}</p>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold mb-6">Update Profile</h2>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Photo URL</label>
                <input
                  type="url"
                  value={newPhoto}
                  onChange={(e) => setNewPhoto(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-300"
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={profileMutation.isLoading}
                  className="flex-1 bg-indigo-600 text-white py-2.5 rounded-xl text-sm font-bold hover:bg-indigo-700 transition disabled:opacity-60"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 border border-gray-300 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* User's Lessons Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-8 border-l-4 border-indigo-600 pl-4">
          My Shared Wisdom
        </h2>
        {lessonsLoading ? (
          <Spinner />
        ) : myPublicLessons.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {myPublicLessons.map((lesson) => (
              <UserLessonCard key={lesson._id} lesson={lesson} />
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-3xl p-12 text-center border-2 border-dashed border-gray-200">
            <p className="text-4xl mb-4">✍️</p>
            <p className="text-gray-500 font-medium">You haven't shared any public lessons yet.</p>
            <Link
              to="/dashboard/add-lesson"
              className="inline-block mt-4 text-indigo-600 font-bold hover:underline"
            >
              Share your first lesson →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

const UserLessonCard = ({ lesson }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition p-5 flex gap-4 h-full">
    {lesson.image && (
      <img
        src={lesson.image}
        alt={lesson.title}
        className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl object-cover"
      />
    )}
    <div className="flex-1 flex flex-col justify-between">
      <div>
        <div className="flex flex-wrap gap-2 mb-2">
          <span className="text-[10px] uppercase font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
            {lesson.category}
          </span>
          <span className="text-[10px] uppercase font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded">
            {lesson.emotionalTone}
          </span>
        </div>
        <h3 className="text-sm font-bold text-gray-800 line-clamp-2 mb-1">{lesson.title}</h3>
        <p className="text-xs text-gray-400 font-medium">Published: {new Date(lesson.createdAt).toLocaleDateString()}</p>
      </div>
      <Link
        to={`/lessons/${lesson._id}`}
        className="text-xs text-indigo-600 font-bold hover:underline self-end"
      >
        View Details →
      </Link>
    </div>
  </div>
);

export default Profile;
