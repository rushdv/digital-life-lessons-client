import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import toast from "react-hot-toast";

const AdminProfile = () => {
  const { user, updateUserProfile } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(user?.displayName || "");
  const [newPhoto, setNewPhoto] = useState(user?.photoURL || "");

  const mutation = useMutation({
    mutationFn: async ({ name, photo }) => {
      await updateUserProfile(name, photo);
      return axiosSecure.patch(`/users/${user.email}`, { name, photo });
    },
    onSuccess: () => {
      setIsEditing(false);
      toast.success("Profile updated!");
    },
    onError: () => toast.error("Update failed."),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newName.trim()) return toast.error("Name is required");
    mutation.mutate({ name: newName, photo: newPhoto });
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-8">Admin Profile</h1>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="h-28 bg-gradient-to-r from-indigo-600 to-purple-700 relative">
          <div className="absolute -bottom-10 left-8">
            <img
              src={user?.photoURL || "https://i.ibb.co/placeholder.png"}
              alt="Admin"
              className="w-20 h-20 rounded-2xl border-4 border-white object-cover shadow-md"
            />
          </div>
        </div>

        <div className="px-8 pt-14 pb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-gray-800">{user?.displayName}</h2>
                <span className="text-xs bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-full font-bold">
                  Admin 🛡️
                </span>
              </div>
              <p className="text-gray-500 text-sm mt-1">{user?.email}</p>
            </div>
            <button
              onClick={() => setIsEditing(true)}
              className="text-sm bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl font-semibold hover:bg-indigo-100 transition"
            >
              Edit Profile
            </button>
          </div>

          <div className="bg-indigo-50 rounded-2xl p-5 border border-indigo-100">
            <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">Role</p>
            <p className="text-gray-700 font-semibold">Platform Administrator</p>
            <p className="text-xs text-gray-400 mt-1">Full access to manage users, lessons, and reports.</p>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-bold mb-6">Update Profile</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
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
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={mutation.isLoading}
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
    </div>
  );
};

export default AdminProfile;
