import { useState, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { FacebookShareButton, LinkedinShareButton, TwitterShareButton } from "react-share";
import { FaFacebook, FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Spinner from "../../components/Spinner";
import axios from "axios";

const REPORT_REASONS = [
  "Inappropriate Content", "Hate Speech or Harassment",
  "Misleading or False Information", "Spam or Promotional Content",
  "Sensitive or Disturbing Content", "Other",
];

const LessonDetails = () => {
  const { id } = useParams();
  const { user, isPremium } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [comment, setComment] = useState("");
  const [reportReason, setReportReason] = useState("");
  const [showReportModal, setShowReportModal] = useState(false);
  const views = useMemo(() => Math.floor(Math.random() * 10000), []);

  const { data: lesson, isLoading } = useQuery({
    queryKey: ["lesson", id],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/lessons/${id}`);
      return res.data;
    },
  });

  const { data: similar = [] } = useQuery({
    queryKey: ["similar", lesson?.category],
    enabled: !!lesson?.category,
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/lessons/public?category=${lesson.category}&limit=6`
      );
      return res.data.lessons.filter((l) => l._id !== id);
    },
  });

  const { data: favorites = [] } = useQuery({
    queryKey: ["favorites"],
    enabled: !!user,
    queryFn: async () => {
      const res = await axiosSecure.get("/favorites");
      return res.data.map((l) => l._id);
    },
  });

  const isFavorited = favorites.includes(id);
  const isLiked = lesson?.likes?.includes(user?.email);

  const likeMutation = useMutation({
    mutationFn: () => axiosSecure.patch(`/lessons/${id}/like`),
    onSuccess: () => queryClient.invalidateQueries(["lesson", id]),
  });

  const favMutation = useMutation({
    mutationFn: () =>
      isFavorited
        ? axiosSecure.delete(`/favorites/${id}`)
        : axiosSecure.post("/favorites", { lessonId: id }),
    onSuccess: () => {
      queryClient.invalidateQueries(["favorites"]);
      toast.success(isFavorited ? "Removed from favorites" : "Saved to favorites!");
    },
  });

  const commentMutation = useMutation({
    mutationFn: () =>
      axiosSecure.post(`/lessons/${id}/comments`, {
        text: comment,
        userName: user.displayName,
        userPhoto: user.photoURL,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(["lesson", id]);
      setComment("");
      toast.success("Comment posted!");
    },
  });

  const reportMutation = useMutation({
    mutationFn: () =>
      axiosSecure.post("/reports", { lessonId: id, reason: reportReason }),
    onSuccess: () => {
      setShowReportModal(false);
      toast.success("Lesson reported. Thank you!");
    },
  });

  const handleLike = () => {
    if (!user) return toast.error("Please log in to like");
    likeMutation.mutate();
  };

  const handleReport = async () => {
    const result = await Swal.fire({
      title: "Report this lesson?",
      text: "Are you sure you want to report this lesson?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Report",
      confirmButtonColor: "#ef4444",
    });
    if (result.isConfirmed) setShowReportModal(true);
  };

  if (isLoading) return <Spinner />;
  if (!lesson) return <div className="text-center py-20">Lesson not found.</div>;

  // Premium check
  if (lesson.accessLevel === "premium" && !isPremium) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-10">
          <p className="text-5xl mb-4">🔒</p>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Premium Lesson</h2>
          <p className="text-gray-500 mb-6">
            Upgrade to Premium to access this lesson and thousands of others.
          </p>
          <Link
            to="/pricing"
            className="inline-block bg-yellow-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-yellow-600 transition"
          >
            Upgrade to Premium ⭐
          </Link>
        </div>
        <div className="mt-8 blur-sm select-none pointer-events-none">
          <h1 className="text-3xl font-bold text-gray-800">{lesson.title}</h1>
          <p className="mt-4 text-gray-500">{lesson.description?.substring(0, 200)}...</p>
        </div>
      </div>
    );
  }

  const shareUrl = window.location.href;
  const readingTime = Math.ceil(lesson.description?.split(" ").length / 200) || 1;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full">{lesson.category}</span>
          <span className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full">{lesson.emotionalTone}</span>
          {lesson.accessLevel === "premium" && (
            <span className="text-xs bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full">⭐ Premium</span>
          )}
        </div>
        <h1 className="text-3xl font-bold text-gray-800 leading-tight">{lesson.title}</h1>
      </div>

      {/* Image */}
      {lesson.image && (
        <img src={lesson.image} alt={lesson.title} className="w-full rounded-2xl mb-8 max-h-96 object-cover" />
      )}

      {/* Metadata */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gray-50 rounded-2xl p-4 mb-8 text-center text-sm">
        <div><p className="text-gray-400 text-xs">Created</p><p className="font-medium">{new Date(lesson.createdAt).toLocaleDateString()}</p></div>
        <div><p className="text-gray-400 text-xs">Updated</p><p className="font-medium">{new Date(lesson.updatedAt).toLocaleDateString()}</p></div>
        <div><p className="text-gray-400 text-xs">Visibility</p><p className="font-medium capitalize">{lesson.visibility}</p></div>
        <div><p className="text-gray-400 text-xs">Read Time</p><p className="font-medium">{readingTime} min</p></div>
      </div>

      {/* Description */}
      <div className="prose max-w-none text-gray-700 leading-relaxed mb-8 whitespace-pre-wrap">
        {lesson.description}
      </div>

      {/* Author Card */}
      <div className="bg-indigo-50 rounded-2xl p-5 flex items-center gap-4 mb-8">
        <img
          src={lesson.creatorPhoto || "https://i.ibb.co/placeholder.png"}
          className="w-14 h-14 rounded-full object-cover"
          alt={lesson.creatorName}
        />
        <div className="flex-1">
          <p className="font-semibold text-gray-800">{lesson.creatorName}</p>
          <p className="text-sm text-gray-500">{lesson.creatorEmail}</p>
        </div>
        <Link
          to={`/dashboard/profile`}
          className="text-sm text-indigo-600 border border-indigo-300 px-4 py-2 rounded-lg hover:bg-indigo-100 transition"
        >
          View Profile
        </Link>
      </div>

      {/* Stats */}
      <div className="flex gap-6 mb-8 flex-wrap">
        <span className="text-gray-600 text-sm">❤️ {lesson.likesCount || 0} Likes</span>
        <span className="text-gray-600 text-sm">🔖 {lesson.favoritesCount || 0} Favorites</span>
        <span className="text-gray-600 text-sm">👀 {views} Views</span>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 mb-10">
        <button
          onClick={() => favMutation.mutate()}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
            isFavorited ? "bg-indigo-600 text-white" : "border border-indigo-300 text-indigo-600 hover:bg-indigo-50"
          }`}
        >
          🔖 {isFavorited ? "Saved" : "Save to Favorites"}
        </button>
        <button
          onClick={handleLike}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
            isLiked ? "bg-red-500 text-white" : "border border-gray-300 text-gray-600 hover:bg-red-50"
          }`}
        >
          ❤️ {isLiked ? "Liked" : "Like"}
        </button>
        <button
          onClick={handleReport}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 text-gray-600 hover:bg-red-50 transition"
        >
          🚩 Report
        </button>
        {/* Social Share */}
        <FacebookShareButton url={shareUrl}>
          <span className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm border border-gray-300 hover:bg-blue-50 text-blue-600 transition">
            <FaFacebook /> Share
          </span>
        </FacebookShareButton>
        <TwitterShareButton url={shareUrl} title={lesson.title}>
          <span className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm border border-gray-300 hover:bg-gray-100 transition">
            <FaXTwitter /> Share
          </span>
        </TwitterShareButton>
        <LinkedinShareButton url={shareUrl}>
          <span className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm border border-gray-300 hover:bg-blue-50 text-blue-700 transition">
            <FaLinkedin /> Share
          </span>
        </LinkedinShareButton>
      </div>

      {/* Comments */}
      <div className="mb-10">
        <h3 className="text-xl font-bold text-gray-800 mb-4">💬 Comments</h3>
        {user ? (
          <div className="flex gap-3 mb-6">
            <img src={user.photoURL} className="w-9 h-9 rounded-full object-cover" alt="you" />
            <div className="flex-1">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                placeholder="Share your thoughts..."
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none"
              />
              <button
                onClick={() => comment.trim() && commentMutation.mutate()}
                disabled={!comment.trim()}
                className="mt-2 bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-40 transition"
              >
                Post Comment
              </button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-500 mb-4">
            <Link to="/login" className="text-indigo-600 font-medium">Log in</Link> to post a comment.
          </p>
        )}
        <div className="space-y-4">
          {lesson.comments?.map((c, i) => (
            <div key={i} className="flex gap-3 bg-gray-50 rounded-xl p-4">
              <img src={c.userPhoto || "https://i.ibb.co/placeholder.png"} className="w-8 h-8 rounded-full" alt={c.userName} />
              <div>
                <p className="text-sm font-medium text-gray-800">{c.userName}</p>
                <p className="text-sm text-gray-600 mt-0.5">{c.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Similar Lessons */}
      {similar.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-4">📚 Similar Lessons</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {similar.slice(0, 6).map((l) => (
              <Link
                key={l._id}
                to={`/lessons/${l._id}`}
                className="bg-gray-50 rounded-xl p-4 border border-gray-100 hover:shadow-sm transition"
              >
                <p className="text-xs text-indigo-600 mb-1">{l.category}</p>
                <p className="text-sm font-semibold text-gray-800 line-clamp-2">{l.title}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">🚩 Select Report Reason</h3>
            <select
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 mb-4 text-sm"
            >
              <option value="">Choose a reason</option>
              {REPORT_REASONS.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
            <div className="flex gap-3">
              <button
                onClick={() => reportReason && reportMutation.mutate()}
                disabled={!reportReason}
                className="flex-1 bg-red-500 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-red-600 disabled:opacity-40 transition"
              >
                Submit Report
              </button>
              <button
                onClick={() => setShowReportModal(false)}
                className="flex-1 border border-gray-300 py-2.5 rounded-lg text-sm hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LessonDetails;