import { Link } from "react-router-dom";

const Success = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 px-4">
      <div className="bg-white rounded-3xl shadow-lg p-12 text-center max-w-md w-full">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">🎉</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h2>
        <p className="text-gray-500 mb-6 leading-relaxed">
          Welcome to Premium! You now have full access to all exclusive lessons and features.
        </p>
        <span className="inline-block bg-yellow-100 text-yellow-800 px-5 py-2 rounded-full font-bold text-sm mb-8">
          Premium Member ⭐
        </span>
        <div className="flex gap-3">
          <Link
            to="/public-lessons"
            className="flex-1 bg-indigo-600 text-white py-3 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition"
          >
            Explore Lessons
          </Link>
          <Link
            to="/dashboard"
            className="flex-1 border border-gray-200 py-3 rounded-xl text-sm font-semibold hover:bg-gray-50 transition"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Success;
