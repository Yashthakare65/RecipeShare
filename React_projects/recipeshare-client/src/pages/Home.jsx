import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api.js'

export default function Home() {
  const [recipes, setRecipes] = useState([])
  const [category, setCategory] = useState('')

  useEffect(() => { fetchRecipes() }, [])

  async function fetchRecipes(cat) {
    const params = cat ? { params: { category: cat } } : undefined
    const { data } = await api.get('/recipes', params)
    setRecipes(data)
  }

  return (
    <div>
      <div className="row" style={{ justifyContent: 'space-between', marginBottom: 12 }}>
        <h2>Discover Recipes</h2>
        <select className="input" style={{ maxWidth: 220 }} value={category} onChange={(e)=>{ setCategory(e.target.value); fetchRecipes(e.target.value) }}>
          <option value="">All categories</option>
          <option>Dessert</option>
          <option>Dinner</option>
          <option>Vegan</option>
          <option>Breakfast</option>
        </select>
      </div>
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


