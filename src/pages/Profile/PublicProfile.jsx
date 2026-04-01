import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import Spinner from '../../components/Spinner'

const PublicProfile = () => {
  const { email } = useParams()

  const { data: profile, isLoading } = useQuery({
    queryKey: ['public-profile', email],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/users/profile/${email}`)
      return res.data
    },
  })

  const { data: lessons = [], isLoading: lessonsLoading } = useQuery({
    queryKey: ['user-public-lessons', email],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/lessons/public?creatorEmail=${email}&sort=newest`)
      return res.data.lessons || []
    },
  })

  if (isLoading) return <Spinner />
  if (!profile) return <div className="text-center py-20 text-gray-500">User not found.</div>

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Profile Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col sm:flex-row items-center gap-6 mb-10">
        <img
          src={profile.photo || 'https://i.ibb.co/placeholder.png'}
          alt={profile.name}
          className="w-24 h-24 rounded-full object-cover border-4 border-indigo-100"
        />
        <div className="text-center sm:text-left">
          <div className="flex items-center gap-2 justify-center sm:justify-start">
            <h1 className="text-2xl font-bold text-gray-800">{profile.name}</h1>
            {profile.isPremium && (
              <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">⭐ Premium</span>
            )}
          </div>
          <p className="text-gray-500 text-sm mt-1">{profile.email}</p>
          <div className="flex gap-4 mt-3 justify-center sm:justify-start text-sm text-gray-600">
            <span>📖 {profile.totalLessons || 0} Lessons</span>
          </div>
        </div>
      </div>

      {/* Public Lessons */}
      <h2 className="text-xl font-bold text-gray-800 mb-5">
        Lessons by {profile.name}
      </h2>

      {lessonsLoading ? (
        <Spinner />
      ) : lessons.length === 0 ? (
        <p className="text-gray-500 text-sm">No public lessons yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {lessons.map((lesson) => (
            <div
              key={lesson._id}
              className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition flex flex-col"
            >
              {lesson.image && (
                <img
                  src={lesson.image}
                  alt={lesson.title}
                  className="w-full h-36 object-cover rounded-xl mb-3"
                />
              )}
              <span className="text-xs text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full w-fit mb-2">
                {lesson.category}
              </span>
              <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 flex-1">
                {lesson.title}
              </h3>
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">{lesson.description}</p>
              <Link
                to={`/lessons/${lesson._id}`}
                className="mt-3 text-center text-xs bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
              >
                See Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default PublicProfile
