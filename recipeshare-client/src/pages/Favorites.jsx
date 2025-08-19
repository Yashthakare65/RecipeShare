import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api.js'
import { useAuth } from '../lib/auth.jsx'

export default function Favorites(){
  const { user } = useAuth()
  const [recipes, setRecipes] = useState([])

  useEffect(()=>{ (async()=>{
    if(!user) return
    const { data } = await api.get('/recipes/me/favorites')
    setRecipes(data)
  })() }, [user])

  if(!user) return <div>Please log in to see your favorites.</div>

  return (
    <div>
      <h2>My Favorites</h2>
      <div className="grid">
        {recipes.map(r => (
          <Link className="card" key={r.id} to={`/recipe/${r.id}`}>
            <img src={r.photoUrl} alt={r.title} />
            <div className="card-body">
              <div className="row" style={{ justifyContent: 'space-between' }}>
                <strong>{r.title}</strong>
                <span className="rating">★ {r.averageRating?.toFixed?.(1) ?? r.averageRating}</span>
              </div>
              <p className="muted" style={{ margin: '6px 0 10px' }}>{r.description}</p>
              <div className="row">
                {(r.categories||[]).map(c => <span className="chip" key={c}>{c}</span>)}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}


