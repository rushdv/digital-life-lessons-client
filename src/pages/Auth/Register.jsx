import { useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'

const Register = () => {
  const { register, updateUserProfile } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { name, email, password } = e.target
    await register(email.value, password.value)
    await updateUserProfile(name.value, '')
    navigate('/')
  }

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Name" required />
        <input type="email" name="email" placeholder="Email" required />
        <input type="password" name="password" placeholder="Password" required />
        <button type="submit">Register</button>
      </form>
    </div>
  )
}

export default Register
