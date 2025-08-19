import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import Home from './pages/Home.jsx'
import RecipeDetail from './pages/RecipeDetail.jsx'
import CreateRecipe from './pages/CreateRecipe.jsx'
import Favorites from './pages/Favorites.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import { AuthProvider, useAuth } from './lib/auth.jsx'

function Nav() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const GITHUB_URL = import.meta.env.VITE_GITHUB_PROFILE_URL || 'https://github.com/'
  return (
    <div className="nav">
      <div className="nav-inner container">
        <Link to="/" className="brand">RecipeShare</Link>
        <div className="row">
          <a className="btn secondary" href={GITHUB_URL} target="_blank" rel="noopener noreferrer" aria-label="GitHub repo">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: 6 }}>
              <path d="M12 .5a12 12 0 0 0-3.79 23.4c.6.11.82-.26.82-.58v-2.02c-3.34.73-4.04-1.61-4.04-1.61-.55-1.41-1.35-1.78-1.35-1.78-1.1-.75.08-.73.08-.73 1.22.09 1.86 1.26 1.86 1.26 1.08 1.85 2.83 1.32 3.52 1.01.11-.78.42-1.32.76-1.63-2.67-.3-5.48-1.34-5.48-5.97 0-1.32.47-2.39 1.24-3.24-.12-.3-.54-1.52.12-3.17 0 0 1.01-.32 3.3 1.24a11.5 11.5 0 0 1 6 0c2.29-1.56 3.3-1.24 3.3-1.24.66 1.65.24 2.87.12 3.17.77.85 1.24 1.92 1.24 3.24 0 4.64-2.82 5.66-5.5 5.96.43.37.81 1.1.81 2.23v3.31c0 .32.21.7.82.58A12 12 0 0 0 12 .5z"/>
            </svg>
            GitHub
          </a>
          <Link className="btn secondary" to="/create">Create</Link>
          <Link className="btn secondary" to="/favorites">Favorites</Link>
          {user ? (
            <>
              <span className="muted">{user.name}</span>
              <button className="btn" onClick={() => { logout(); navigate('/'); }}>Logout</button>
            </>
          ) : (
            <>
              <Link className="btn" to="/login">Login</Link>
              <Link className="btn secondary" to="/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <Nav />
      <div className="container" style={{ paddingTop: 16 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/recipe/:id" element={<RecipeDetail />} />
          <Route path="/create" element={<CreateRecipe mode="create" />} />
          <Route path="/edit/:id" element={<CreateRecipe mode="edit" />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </AuthProvider>
  )
}


