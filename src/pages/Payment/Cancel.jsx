import { Link } from "react-router-dom";

const Cancel = () => (
  <div className="min-h-screen flex items-center justify-center bg-red-50">
    <div className="bg-white rounded-2xl shadow-lg p-12 text-center max-w-md">
      <div className="text-6xl mb-4">😔</div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Cancelled</h2>
      <p className="text-gray-500 mb-6">
        Your payment was not completed. No charges were made.
      </p>
      <div className="flex gap-3">
        <Link
          to="/pricing"
          className="flex-1 bg-indigo-600 text-white py-3 rounded-xl text-sm font-medium hover:bg-indigo-700 transition"
        >
          Try Again
        </Link>
        <Link
          to="/"
          className="flex-1 border border-gray-300 py-3 rounded-xl text-sm font-medium hover:bg-gray-50 transition"
        >
          Go Home
        </Link>
      </div>
    </div>
  </div>
);

export default Cancel;