import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { api, toAbsoluteUrl } from '../lib/api.js'
import { useAuth } from '../lib/auth.jsx'

export default function RecipeDetail(){
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [data, setData] = useState(null)
  const [tab, setTab] = useState('ingredients')
  const [comment, setComment] = useState({ authorName: '', text: '' })
  const [rating, setRating] = useState(0)

  useEffect(() => { (async()=>{
    const { data } = await api.get(`/recipes/${id}`)
    setData(data)
  })() }, [id])

  if(!data) return <div>Loading...</div>

  async function handleDelete(){
    if(!confirm('Delete this recipe?')) return
    await api.delete(`/recipes/${id}`)
    navigate('/')
  }

  async function postComment(e){
    e.preventDefault()
    const { data: c } = await api.post(`/recipes/${id}/comments`, comment)
    setData(prev => ({ ...prev, comments: [...prev.comments, c] }))
    setComment({ authorName: '', text: '' })
  }

  async function postRating(){
    if(!rating) return
    const { data: r } = await api.post(`/recipes/${id}/ratings`, { value: rating })
    setData(prev => ({ ...prev, averageRating: r.averageRating }))
  }

  async function toggleFavorite(){
    if(!user){ alert('Login to save favorites'); return }
    await api.post(`/recipes/${id}/favorite`)
    alert('Added to favorites')
  }

  return (
    <div className="row" style={{ alignItems:'flex-start', gap:24 }}>
      <div style={{ flex:1 }}>
        <img src={toAbsoluteUrl(data.photoUrl)} alt={data.title} style={{ width:'100%', borderRadius:12 }} />
      </div>
      <div style={{ flex:1, minWidth:320 }}>
        <div className="row" style={{ justifyContent:'space-between' }}>
          <h2>{data.title}</h2>
          <span className="rating">★ {data.averageRating?.toFixed?.(1) ?? data.averageRating}</span>
        </div>
        <p className="muted">{data.description}</p>
        <div className="row" style={{ marginBottom:12 }}>
          {(data.categories||[]).map(c => <span className="chip" key={c}>{c}</span>)}
        </div>
        <div className="tabs">
          <button className={"tab "+(tab==='ingredients'?'active':'')} onClick={()=>setTab('ingredients')}>Ingredients</button>
          <button className={"tab "+(tab==='instructions'?'active':'')} onClick={()=>setTab('instructions')}>Instructions</button>
          <button className={"tab "+(tab==='comments'?'active':'')} onClick={()=>setTab('comments')}>Comments</button>
        </div>
        {tab==='ingredients' && (
          <ul>
            {data.ingredients.map((it, idx)=>(<li key={idx}>{it}</li>))}
          </ul>
        )}
        {tab==='instructions' && (
          <ol>
            {data.instructions.map((it, idx)=>(<li key={idx} style={{ marginBottom:8 }}>{it}</li>))}
          </ol>
        )}
        {tab==='comments' && (
          <div>
            <div style={{ marginBottom: 12 }}>
              {(data.comments||[]).map(c => (
                <div key={c.id} style={{ padding:'8px 0', borderBottom:'1px solid #1f2937' }}>
                  <strong>{c.authorName}</strong>
                  <p className="muted" style={{ margin:4 }}>{c.text}</p>
                </div>
              ))}
            </div>
            <form onSubmit={postComment} className="row" style={{ flexDirection:'column', gap:8 }}>
              <input className="input" placeholder="Your name" value={comment.authorName} onChange={e=>setComment(s=>({...s, authorName:e.target.value}))} />
              <textarea rows={3} className="input" placeholder="Write a comment" value={comment.text} onChange={e=>setComment(s=>({...s, text:e.target.value}))}></textarea>
              <button className="btn" type="submit">Post Comment</button>
            </form>
          </div>
        )}

        <div className="row" style={{ marginTop:16 }}>
          <select className="input" style={{ maxWidth:160 }} value={rating} onChange={e=>setRating(Number(e.target.value))}>
            <option value={0}>Rate…</option>
            {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} star{n>1?'s':''}</option>)}
          </select>
          <button className="btn" onClick={postRating}>Submit Rating</button>
          <button className="btn secondary" onClick={toggleFavorite}>Favorite</button>
          {user && user.id === data.authorId && (
            <>
              <Link className="btn secondary" to={`/edit/${id}`}>Edit</Link>
              <button className="btn" onClick={handleDelete}>Delete</button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}


