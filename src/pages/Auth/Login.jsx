import { useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'

const Login = () => {
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { email, password } = e.target
    await login(email.value, password.value)
    navigate('/')
  }

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" name="email" placeholder="Email" required />
        <input type="password" name="password" placeholder="Password" required />
        <button type="submit">Login</button>
      </form>
    </div>
  )
}

export default Login
