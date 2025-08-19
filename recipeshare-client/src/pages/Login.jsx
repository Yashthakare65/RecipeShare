import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../lib/auth.jsx'

export default function Login(){
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(e){
    e.preventDefault()
    setError('')
    try{
      await login(email, password)
      navigate('/')
    }catch(err){
      setError(err?.response?.data?.message || 'Login failed')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="row" style={{ flexDirection:'column', gap:12, maxWidth:420, margin:'40px auto' }}>
      <h2>Login</h2>
      {error && <div className="muted" style={{ color:'#f87171' }}>{error}</div>}
      <input className="input" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input className="input" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
      <button className="btn" type="submit">Login</button>
      <div className="muted">No account? <Link to="/register">Register</Link></div>
    </form>
  )
}


