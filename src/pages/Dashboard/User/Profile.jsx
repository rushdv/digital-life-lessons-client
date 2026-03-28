import useAuth from '../../../hooks/useAuth'

const Profile = () => {
  const { user } = useAuth()

  return (
    <div>
      <h2>Profile</h2>
      <p>Name: {user?.displayName}</p>
      <p>Email: {user?.email}</p>
    </div>
  )
}

export default Profile
