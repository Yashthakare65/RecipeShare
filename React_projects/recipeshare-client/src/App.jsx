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
  return (
    <div className="nav">
      <div className="nav-inner container">
        <Link to="/" className="brand">RecipeShare</Link>
        <div className="row">
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


