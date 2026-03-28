import { useEffect } from "react";
import { Link } from "react-router-dom";
import Lottie from "lottie-react";
import useAuth from "../../hooks/useAuth";

const Success = () => {
  const { user, syncUserStatus } = useAuth();

  useEffect(() => {
    if (user) syncUserStatus(user);
  }, [user]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="bg-white rounded-2xl shadow-lg p-12 text-center max-w-md">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h2>
        <p className="text-gray-500 mb-6">
          Welcome to Premium! You now have full access to all exclusive lessons.
        </p>
        <span className="inline-block bg-yellow-400 text-yellow-900 px-4 py-2 rounded-full font-semibold mb-6">
          Premium Member ⭐
        </span>
        <div className="flex gap-3">
          <Link
            to="/public-lessons"
            className="flex-1 bg-indigo-600 text-white py-3 rounded-xl text-sm font-medium hover:bg-indigo-700 transition"
          >
            Explore Lessons
          </Link>
          <Link
            to="/dashboard"
            className="flex-1 border border-gray-300 py-3 rounded-xl text-sm font-medium hover:bg-gray-50 transition"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Success;