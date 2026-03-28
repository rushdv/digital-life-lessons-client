import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import toast from "react-hot-toast";

const features = [
  { label: "Create lessons", free: "Up to 5", premium: "Unlimited" },
  { label: "Create Premium lessons", free: "✗", premium: "✓" },
  { label: "View Premium lessons", free: "✗", premium: "✓" },
  { label: "Ad-free experience", free: "✗", premium: "✓" },
  { label: "Priority listing", free: "✗", premium: "✓" },
  { label: "Analytics dashboard", free: "Basic", premium: "Advanced" },
  { label: "Export lessons as PDF", free: "✗", premium: "✓" },
  { label: "Support", free: "Community", premium: "Priority" },
];

const Pricing = () => {
  const { user, isPremium } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      const res = await axiosSecure.post("/create-checkout-session", {
        email: user.email,
      });
      window.location.href = res.data.url;
    } catch {
      toast.error("Payment initiation failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  if (isPremium) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-10">
          <p className="text-5xl mb-4">⭐</p>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">You're Premium!</h2>
          <p className="text-gray-500">You have lifetime access to all premium features.</p>
          <span className="inline-block mt-4 bg-yellow-400 text-yellow-900 px-4 py-2 rounded-full font-semibold">
            Premium Member ⭐
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-800">Choose Your Plan</h1>
        <p className="text-gray-500 mt-2">Unlock the full power of LifeLessons</p>
      </div>

      {/* Plan Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {/* Free */}
        <div className="bg-white border-2 border-gray-200 rounded-2xl p-8">
          <div className="text-center mb-6">
            <p className="text-4xl mb-2">🆓</p>
            <h2 className="text-xl font-bold text-gray-800">Free Plan</h2>
            <p className="text-3xl font-bold text-gray-800 mt-3">৳0 <span className="text-base font-normal text-gray-400">forever</span></p>
          </div>
          <ul className="space-y-3 text-sm">
            {features.map((f) => (
              <li key={f.label} className="flex items-center justify-between">
                <span className="text-gray-600">{f.label}</span>
                <span className={`font-medium ${f.free === "✗" ? "text-red-400" : "text-gray-800"}`}>{f.free}</span>
              </li>
            ))}
          </ul>
          <button disabled className="w-full mt-8 py-3 border-2 border-gray-200 rounded-xl text-gray-400 cursor-not-allowed text-sm font-medium">
            Current Plan
          </button>
        </div>

        {/* Premium */}
        <div className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-2xl p-8 relative overflow-hidden">
          <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full">
            BEST VALUE
          </div>
          <div className="text-center mb-6">
            <p className="text-4xl mb-2">⭐</p>
            <h2 className="text-xl font-bold">Premium Plan</h2>
            <p className="text-3xl font-bold mt-3">৳1,500 <span className="text-base font-normal text-indigo-200">one-time</span></p>
            <p className="text-xs text-indigo-200 mt-1">Lifetime access</p>
          </div>
          <ul className="space-y-3 text-sm">
            {features.map((f) => (
              <li key={f.label} className="flex items-center justify-between">
                <span className="text-indigo-100">{f.label}</span>
                <span className={`font-medium ${f.premium === "✗" ? "text-red-300" : "text-yellow-300"}`}>{f.premium}</span>
              </li>
            ))}
          </ul>
          <button
            onClick={handleUpgrade}
            disabled={loading}
            className="w-full mt-8 py-3 bg-white text-indigo-700 rounded-xl font-bold text-sm hover:bg-indigo-50 transition disabled:opacity-60"
          >
            {loading ? "Redirecting to Stripe..." : "Upgrade to Premium →"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pricing;