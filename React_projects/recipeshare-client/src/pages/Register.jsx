import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../lib/auth.jsx'

export default function Register(){
  const { register } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(e){
    e.preventDefault()
    setError('')
    try{
      await register(name, email, password)
      navigate('/')
    }catch(err){
      setError(err?.response?.data?.message || 'Registration failed')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="row" style={{ flexDirection:'column', gap:12, maxWidth:420, margin:'40px auto' }}>
      <h2>Register</h2>
      {error && <div className="muted" style={{ color:'#f87171' }}>{error}</div>}
      <input className="input" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
      <input className="input" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input className="input" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
      <button className="btn" type="submit">Create account</button>
      <div className="muted">Have an account? <Link to="/login">Login</Link></div>
    </form>
  )
}


