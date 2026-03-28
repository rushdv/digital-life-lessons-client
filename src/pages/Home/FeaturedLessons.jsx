import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router-dom";
import Spinner from "../../components/Spinner";

const FeaturedLessons = () => {
  const { data: lessons = [], isLoading } = useQuery({
    queryKey: ["featuredLessons"],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/lessons/featured`);
      return res.data;
    },
  });

  if (isLoading) return <Spinner />;

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-800">✨ Featured Life Lessons</h2>
          <p className="text-gray-500 mt-2">Hand-picked wisdom from our community</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lessons.map((lesson) => (
            <LessonCard key={lesson._id} lesson={lesson} />
          ))}
        </div>
        <div className="text-center mt-8">
          <Link
            to="/public-lessons"
            className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-full font-medium hover:bg-indigo-700 transition"
          >
            View All Lessons →
          </Link>
        </div>
      </div>
    </section>
  );
};

const LessonCard = ({ lesson }) => (
  <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition p-5 flex flex-col h-full border border-gray-100">
    {lesson.image && (
      <img
        src={lesson.image}
        alt={lesson.title}
        className="w-full h-44 object-cover rounded-xl mb-4"
      />
    )}
    <div className="flex items-center gap-2 mb-3 flex-wrap">
      <span className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full">
        {lesson.category}
      </span>
      <span className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
        {lesson.emotionalTone}
      </span>
      {lesson.accessLevel === "premium" && (
        <span className="text-xs bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full">⭐ Premium</span>
      )}
    </div>
    <h3 className="text-base font-bold text-gray-800 mb-2 line-clamp-2">{lesson.title}</h3>
    <p className="text-sm text-gray-500 line-clamp-3 flex-1">{lesson.description}</p>
    <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
      <div className="flex items-center gap-2">
        <img
          src={lesson.creatorPhoto || "https://i.ibb.co/placeholder.png"}
          className="w-6 h-6 rounded-full object-cover"
          alt={lesson.creatorName}
        />
        <span className="text-xs text-gray-500">{lesson.creatorName}</span>
      </div>
      <Link
        to={`/lessons/${lesson._id}`}
        className="text-xs text-indigo-600 font-medium hover:underline"
      >
        Read More →
      </Link>
    </div>
  </div>
);

export default FeaturedLessons;