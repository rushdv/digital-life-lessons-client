import { useState, useMemo, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { FacebookShareButton, LinkedinShareButton, TwitterShareButton } from "react-share";
import { FaFacebook, FaLinkedin, FaShareAlt, FaHeart, FaRegHeart, FaBookmark, FaRegBookmark, FaFlag, FaFilePdf } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Spinner from "../../components/Spinner";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

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
  const [exportingPdf, setExportingPdf] = useState(false);
  const pdfRef = useRef(null);
  const views = useMemo(() => Math.floor(Math.random() * 10000), []);

  const { data: lesson, isLoading } = useQuery({
    queryKey: ["lesson", id],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/lessons/${id}`);
      return res.data;
    },
  });

  const { data: authorStats = {} } = useQuery({
    queryKey: ["authorStats", lesson?.creatorEmail],
    enabled: !!lesson?.creatorEmail,
    queryFn: async () => (await axios.get(`${import.meta.env.VITE_API_URL}/users/stats/${lesson.creatorEmail}`)).data,
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
      toast.success("Reflection shared!");
    },
  });

  const reportMutation = useMutation({
    mutationFn: () =>
      axiosSecure.post("/reports", { lessonId: id, reason: reportReason }),
    onSuccess: () => {
      setShowReportModal(false);
      setReportReason("");
      toast.success("Report submitted for review.");
    },
  });

  const handleLike = () => {
    if (!user) return navigate("/login");
    likeMutation.mutate();
  };

  const handleReport = async () => {
    if (!user) return navigate("/login");
    const result = await Swal.fire({
      title: "Wait! Are you sure?",
      text: "Reporting a lesson triggers a community review. Only report content that violates our guidelines.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Proceed",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      customClass: { popup: 'rounded-3xl p-8' }
    });
    if (result.isConfirmed) setShowReportModal(true);
  };

  const handleExportPdf = async () => {
    if (!pdfRef.current) return;
    setExportingPdf(true);
    try {
      const canvas = await html2canvas(pdfRef.current, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      let y = 0;
      const pageHeight = pdf.internal.pageSize.getHeight();
      while (y < pdfHeight) {
        pdf.addImage(imgData, "PNG", 0, -y, pdfWidth, pdfHeight);
        y += pageHeight;
        if (y < pdfHeight) pdf.addPage();
      }
      pdf.save(`${lesson.title || "lesson"}.pdf`);
      toast.success("PDF exported successfully!");
    } catch {
      toast.error("Failed to export PDF.");
    } finally {
      setExportingPdf(false);
    }
  };

  if (isLoading) return <Spinner />;
  if (!lesson) return <div className="text-center py-32 text-gray-400 font-bold">Lesson not found.</div>;

  // Premium gate
  if (lesson.accessLevel === "premium" && !isPremium) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="bg-gradient-to-br from-gray-900 to-indigo-900 rounded-[3rem] p-16 text-white shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
           <div className="relative z-10">
              <div className="w-20 h-20 bg-yellow-400 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-8 shadow-xl shadow-yellow-500/20">🔒</div>
              <h2 className="text-4xl font-black mb-6 tracking-tight">Premium Insight Reserved</h2>
              <p className="text-indigo-200 font-medium mb-10 max-w-lg mx-auto text-lg leading-relaxed">
                This wisdom is exclusive to our Premium community. Upgrade now to unlock this lesson and 1,000+ others.
              </p>
              <Link
                to="/pricing"
                className="inline-block bg-yellow-400 text-yellow-900 px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-yellow-500 transition shadow-lg"
              >
                Ascend to Premium ⭐
              </Link>
           </div>
        </div>
        <div className="mt-12 blur-md select-none pointer-events-none opacity-40 grayscale">
          <h1 className="text-4xl font-black text-gray-800 mb-6">{lesson.title}</h1>
          <div className="space-y-4 max-w-2xl mx-auto">
             <div className="h-4 bg-gray-200 rounded-full w-full"></div>
             <div className="h-4 bg-gray-200 rounded-full w-5/6"></div>
             <div className="h-4 bg-gray-200 rounded-full w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  const shareUrl = window.location.href;
  const readingTime = Math.ceil(lesson.description?.split(" ").length / 200) || 1;

  return (
    <div className="max-w-4xl mx-auto px-4 py-20 animate-fade-in">
      {/* PDF Export Content Wrapper */}
      <div ref={pdfRef}>
      {/* Category & Title */}
      <div className="mb-12">
        <div className="flex flex-wrap gap-3 mb-6">
          <span className="text-[10px] font-black uppercase tracking-widest bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-full border border-indigo-100">{lesson.category}</span>
          <span className="text-[10px] font-black uppercase tracking-widest bg-purple-50 text-purple-600 px-4 py-1.5 rounded-full border border-purple-100">{lesson.emotionalTone}</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-gray-800 leading-tight tracking-tight">{lesson.title}</h1>
      </div>

      {/* Feature Image */}
      {lesson.image && (
        <div className="mb-12 group">
          <img src={lesson.image} alt={lesson.title} className="w-full rounded-[2.5rem] shadow-2xl group-hover:scale-[1.01] transition duration-700 max-h-[500px] object-cover" />
        </div>
      )}

      {/* Meta Info Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 bg-gray-50 rounded-[2rem] p-6 text-center border border-gray-100">
        <div><p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Created At</p><p className="font-bold text-gray-700">{new Date(lesson.createdAt).toLocaleDateString()}</p></div>
        <div><p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Refined At</p><p className="font-bold text-gray-700">{new Date(lesson.updatedAt).toLocaleDateString()}</p></div>
        <div><p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Access Tier</p><p className="font-black text-indigo-600 capitalize">{lesson.accessLevel}</p></div>
        <div><p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Reading Depth</p><p className="font-bold text-gray-700">{readingTime} min read</p></div>
      </div>

      {/* Content */}
      <div className="prose prose-indigo max-w-none text-gray-700 text-lg leading-[1.8] mb-16 whitespace-pre-wrap font-medium font-serif first-letter:text-5xl first-letter:font-black first-letter:text-indigo-600 first-letter:mr-3 first-letter:float-left">
        {lesson.description}
      </div>

      {/* Author Card & Engagement */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-16">
        {/* Author */}
        <div className="md:col-span-8 bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm flex items-center gap-6">
          <div className="relative">
            <img
              src={lesson.creatorPhoto || "https://i.ibb.co/placeholder.png"}
              className="w-20 h-20 rounded-3xl object-cover shadow-lg"
              alt={lesson.creatorName}
            />
            {lesson.creatorRole === "admin" && <span className="absolute -top-2 -right-2 bg-yellow-400 text-white p-1.5 rounded-xl"><FaBookmark className="text-[10px]"/></span>}
          </div>
          <div className="flex-1">
            <h4 className="text-xl font-black text-gray-800 mb-1">{lesson.creatorName}</h4>
            <p className="text-xs font-bold text-gray-400 mb-4">{authorStats.totalLessons || 0} Lessons Published</p>
            <Link
              to={`/profile/${lesson.creatorEmail}`}
              className="text-xs font-black text-indigo-600 uppercase tracking-widest hover:underline"
            >
              Explore Profile →
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="md:col-span-4 bg-indigo-600 rounded-[2rem] p-8 text-white shadow-xl shadow-indigo-100 flex flex-col justify-center gap-4">
           <div className="flex justify-between items-center"><span className="text-xs font-bold opacity-80 uppercase tracking-widest">Appreciation</span><span className="font-black">{lesson.likesCount}</span></div>
           <div className="flex justify-between items-center"><span className="text-xs font-bold opacity-80 uppercase tracking-widest">Bookmarks</span><span className="font-black">{lesson.favoritesCount}</span></div>
           <div className="flex justify-between items-center"><span className="text-xs font-bold opacity-80 uppercase tracking-widest">Global Views</span><span className="font-black">{views}</span></div>
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="flex flex-wrap items-center gap-3 mb-20 border-y border-gray-100 py-8">
        <button
          onClick={() => user ? favMutation.mutate() : navigate("/login")}
          className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition ${
            isFavorited ? "bg-indigo-600 text-white" : "bg-gray-50 text-gray-600 hover:bg-indigo-50"
          }`}
        >
          {isFavorited ? <FaBookmark /> : <FaRegBookmark />} {isFavorited ? "In Collection" : "Save Lesson"}
        </button>
        <button
          onClick={handleLike}
          className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition ${
            isLiked ? "bg-red-500 text-white" : "bg-gray-50 text-gray-600 hover:bg-red-50"
          }`}
        >
          {isLiked ? <FaHeart /> : <FaRegHeart />} {isLiked ? "Liked" : "Like"}
        </button>
        <button
          onClick={handleReport}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500 transition"
        >
          <FaFlag /> Report
        </button>
        <button
          onClick={handleExportPdf}
          disabled={exportingPdf}
          className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest bg-gray-50 text-gray-500 hover:bg-green-50 hover:text-green-600 transition disabled:opacity-50"
        >
          <FaFilePdf /> {exportingPdf ? "Exporting..." : "Export PDF"}
        </button>
        <div className="flex items-center gap-2 ml-auto">
          <FacebookShareButton url={shareUrl}><span className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center hover:scale-110 transition"><FaFacebook /></span></FacebookShareButton>
          <TwitterShareButton url={shareUrl}><span className="w-10 h-10 rounded-xl bg-gray-800 text-white flex items-center justify-center hover:scale-110 transition"><FaXTwitter /></span></TwitterShareButton>
          <LinkedinShareButton url={shareUrl}><span className="w-10 h-10 rounded-xl bg-blue-800 text-white flex items-center justify-center hover:scale-110 transition"><FaLinkedin /></span></LinkedinShareButton>
        </div>
      </div>

      {/* Comments */}
      <div className="mb-20">
        <h3 className="text-2xl font-black text-gray-800 mb-10 flex items-center gap-3">
           <span className="w-2 h-8 bg-purple-600 rounded-full"></span>
           Reflective Comments
        </h3>
        {user ? (
          <div className="flex gap-4 mb-12">
            <img src={user.photoURL} className="w-12 h-12 rounded-2xl object-cover shadow-sm" alt="you" />
            <div className="flex-1">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                placeholder="Share your resonance with this wisdom..."
                className="w-full bg-gray-50 border-none rounded-[1.5rem] px-6 py-4 text-sm font-medium focus:ring-4 focus:ring-indigo-100 transition resize-none outline-none"
              />
              <button
                onClick={() => comment.trim() && commentMutation.mutate()}
                disabled={!comment.trim() || commentMutation.isLoading}
                className="mt-4 bg-indigo-600 text-white px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-700 disabled:opacity-40 transition shadow-lg shadow-indigo-100"
              >
                Share Reflection
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-indigo-50 rounded-2xl p-6 text-center mb-12">
            <p className="text-sm font-bold text-indigo-700">
              <Link to="/login" className="underline">Sign in</Link> to join the discussion.
            </p>
          </div>
        )}
        <div className="space-y-6">
          {lesson.comments?.slice().reverse().map((c, i) => (
            <div key={i} className="flex gap-4 group">
              <img src={c.userPhoto || "https://i.ibb.co/placeholder.png"} className="w-10 h-10 rounded-xl object-cover ring-2 ring-gray-50" alt={c.userName} />
              <div className="flex-1 bg-white border border-gray-100 rounded-[1.5rem] p-6 shadow-sm group-hover:border-indigo-100 transition">
                <div className="flex justify-between items-center mb-1">
                  <p className="text-sm font-black text-gray-800">{c.userName}</p>
                  <span className="text-[10px] font-bold text-gray-400">Sage Contributor</span>
                </div>
                <p className="text-sm text-gray-500 font-medium leading-relaxed">{c.text}</p>
              </div>
            </div>
          ))}
          {(!lesson.comments || lesson.comments.length === 0) && (
            <p className="text-center text-gray-400 font-bold py-10 italic">Be the first to reflect on this wisdom.</p>
          )}
        </div>
      </div>

      {/* Similar Wisdom */}
      {similar.length > 0 && (
        <div className="pt-20 border-t border-gray-100">
          <h3 className="text-2xl font-black text-gray-800 mb-10">Resonating Wisdom 📚</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {similar.slice(0, 6).map((l) => (
              <Link
                key={l._id}
                to={`/lessons/${l._id}`}
                className="bg-white rounded-3xl p-6 border border-gray-100 hover:shadow-xl hover:shadow-indigo-50 hover:-translate-y-1 transition duration-500"
              >
                <div className="flex items-center gap-2 mb-3">
                   <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
                   <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{l.category}</span>
                </div>
                <h4 className="text-md font-black text-gray-800 line-clamp-2 leading-snug mb-3">{l.title}</h4>
                <p className="text-xs font-black text-indigo-600 uppercase tracking-widest">Read Essence →</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Report Modal */}
      </div>{/* end pdfRef */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center px-4 animate-fade-in">
          <div className="bg-white rounded-[2.5rem] p-10 w-full max-w-md shadow-2xl">
            <div className="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center text-xl mb-6">🚩</div>
            <h3 className="text-2xl font-black text-gray-800 mb-2">Report Content</h3>
            <p className="text-sm text-gray-400 mb-8 font-medium">Help us keep the community safe. Select the primary reason for this report.</p>
            
            <div className="space-y-3 mb-8">
               {REPORT_REASONS.map(r => (
                 <button
                   key={r}
                   onClick={() => setReportReason(r)}
                   className={`w-full text-left px-5 py-3 rounded-xl text-sm font-bold transition border ${
                     reportReason === r ? "bg-red-50 border-red-200 text-red-600 shadow-sm" : "bg-gray-50 border-transparent text-gray-600 hover:bg-gray-100"
                   }`}
                 >
                   {r}
                 </button>
               ))}
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => reportReason && reportMutation.mutate()}
                disabled={!reportReason || reportMutation.isLoading}
                className="flex-[2] bg-red-500 text-white py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-red-600 transition shadow-lg shadow-red-100 disabled:opacity-40"
              >
                {reportMutation.isLoading ? "Submitting..." : "Submit Report"}
              </button>
              <button
                onClick={() => { setShowReportModal(false); setReportReason(""); }}
                className="flex-1 border-2 border-gray-100 text-gray-400 py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-gray-50 transition"
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