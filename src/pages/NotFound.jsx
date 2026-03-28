import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-indigo-50 px-4">
    <div className="text-center">
      <p className="text-8xl font-bold text-indigo-600 mb-4">404</p>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Page Not Found</h2>
      <p className="text-gray-500 mb-8">The wisdom you're looking for doesn't exist here.</p>
      <Link
        to="/"
        className="bg-indigo-600 text-white px-6 py-3 rounded-full font-medium hover:bg-indigo-700 transition"
      >
        ← Back to Home
      </Link>
    </div>
    <p className="text-6xl mt-10 animate-bounce">🤔</p>
  </div>
);

export default NotFound;