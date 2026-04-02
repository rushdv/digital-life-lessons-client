import { useState } from "react";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import toast from "react-hot-toast";

const features = [
  { label: "Lesson Creation", free: "5 Lessons", premium: "Unlimited" },
  { label: "Premium Lessons", free: "✗", premium: "✓" },
  { label: "Public Browsing", free: "Free Only", premium: "Free + Premium" },
  { label: "Experience", free: "Standard", premium: "Ad-Free" },
  { label: "Search & Filters", free: "Basic", premium: "Advanced" },
  { label: "Contribution List", free: "✗", premium: "Priority Listing" },
  { label: "Analytics", free: "Basic", premium: "Deep Insights" },
  { label: "Support", free: "Community", premium: "24/7 Priority" },
];

const Pricing = () => {
  const { user, isPremium } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    if (!user) return toast.error("Please login to upgrade");
    setLoading(true);
    try {
      const res = await axiosSecure.post("/create-checkout-session", { email: user.email });
      if (res.data.url) {
        window.location.href = res.data.url;
      }
    } catch (err) {
      toast.error("Stripe Checkout failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  if (isPremium) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <div className="bg-gradient-to-br from-yellow-400 to-amber-600 rounded-[2.5rem] p-12 text-white shadow-2xl shadow-amber-100">
          <div className="text-6xl mb-6 drop-shadow-lg">⭐</div>
          <h2 className="text-3xl font-black mb-4 tracking-tighter italic">ELITE MEMBER</h2>
          <p className="text-amber-100 font-medium mb-8 leading-relaxed">
            You are a Premium member. Enjoy lifetime access to all our exclusive wisdom and features.
          </p>
          <div className="inline-block bg-white text-amber-600 px-8 py-3 rounded-2xl font-black text-sm uppercase tracking-widest">
            Lifetime Access Verified
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-20 animate-fade-in">
      <header className="text-center mb-20 max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-black text-gray-800 dark:text-gray-100 tracking-tight mb-4">
          Elevate Your <span className="text-indigo-600">Wisdom</span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400 font-medium text-lg leading-relaxed">
          One simple payment. Lifetime personal growth. Unlock the full potential of Digital Life Lessons.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Comparison Table */}
        <div className="lg:col-span-12 xl:col-span-8 bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="p-8 pb-4">
             <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
               <span className="w-2 h-8 bg-indigo-600 rounded-full"></span>
               Feature Comparison
             </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800 border-y border-gray-100 dark:border-gray-700">
                  <th className="px-8 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Capabilities</th>
                  <th className="px-8 py-4 text-xs font-black text-gray-400 uppercase tracking-widest text-center">Free Explorer</th>
                  <th className="px-8 py-4 text-xs font-black text-indigo-600 uppercase tracking-widest text-center bg-indigo-50/50 dark:bg-indigo-950/50">Premium Sage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                {features.map((f, i) => (
                  <tr key={i} className="hover:bg-gray-50/30 dark:hover:bg-gray-800/50 transition group">
                    <td className="px-8 py-4 text-sm font-bold text-gray-600 dark:text-gray-300 group-hover:text-gray-800 dark:group-hover:text-gray-100">{f.label}</td>
                    <td className="px-8 py-4 text-sm text-center font-medium text-gray-400">{f.free}</td>
                    <td className="px-8 py-4 text-sm text-center font-black text-indigo-700 dark:text-indigo-400 bg-indigo-50/20 dark:bg-indigo-950/20">{f.premium}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pricing Card — unchanged (already dark gradient) */}
        <div className="lg:col-span-12 xl:col-span-4">
           <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-indigo-200 relative overflow-hidden group">
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition duration-700"></div>
              
              <div className="relative z-10">
                <span className="inline-block bg-white/20 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-6">
                  Recommended Plan
                </span>
                <h2 className="text-3xl font-black mb-2 italic tracking-tighter">PREMIUM LITE</h2>
                <div className="flex items-baseline gap-2 mb-2">
                   <span className="text-5xl font-black tracking-tighter">৳1,500</span>
                   <span className="text-indigo-200 font-bold text-sm">one-time</span>
                </div>
                <p className="text-indigo-100 text-sm font-medium mb-8">
                  Unlock everything forever. No subscriptions. No hidden fees.
                </p>

                <ul className="space-y-4 mb-10">
                   {["Lifetime Premium Access", "Unlimited Lesson Vault", "Global Sage Status", "Priority AI Listing"].map(item => (
                     <li key={item} className="flex items-center gap-3 text-sm font-bold">
                       <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px]">✓</span>
                       {item}
                     </li>
                   ))}
                </ul>

                <button
                  onClick={handleUpgrade}
                  disabled={loading}
                  className="w-full bg-white text-indigo-700 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-indigo-50 hover:scale-[1.02] transform transition disabled:opacity-60 shadow-xl shadow-indigo-900/20"
                >
                  {loading ? "Initializing Stripe..." : "Ascend to Premium →"}
                </button>
                <p className="text-center text-indigo-200 text-[10px] uppercase font-bold mt-4 tracking-widest">
                  Secure Checkout via Stripe
                </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;