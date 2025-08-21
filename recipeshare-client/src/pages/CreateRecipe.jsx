import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api, formDataFromRecipe } from '../lib/api.js'
import { useAuth } from '../lib/auth.jsx'

export default function CreateRecipe({ mode = 'create' }) {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [recipe, setRecipe] = useState({ title: '', description: '', ingredients: [], instructions: [], categories: [] })
  const [photo, setPhoto] = useState(null)
  const fileRef = useRef()

  useEffect(() => {
    if (!user) { alert('Login required'); navigate('/login'); }
  }, [user, navigate])

  useEffect(() => {
    (async () => {
      if (mode === 'edit' && id) {
        const { data } = await api.get(`/recipes/${id}`)
        setRecipe({
          title: data.title,
          description: data.description,
          ingredients: data.ingredients,
          instructions: data.instructions,
          categories: data.categories || []
        })
      }
    })()
  }, [mode, id])

  async function handleSubmit(e) {
    e.preventDefault()
    const payload = { ...recipe }
    if (photo) payload.photo = photo
    const formData = formDataFromRecipe(payload)
    if (mode === 'create') {
      const { data } = await api.post('/recipes', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      navigate(`/recipe/${data.id}`)
    } else {
      const { data } = await api.put(`/recipes/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      navigate(`/recipe/${data.id}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="row" style={{ flexDirection: 'column', gap: 12, maxWidth: 720, margin: '0 auto' }}>
      <h2>{mode === 'create' ? 'Create a Recipe' : 'Edit Recipe'}</h2>
      <input className="input" id="title" name="title" placeholder="Title" value={recipe.title} onChange={e => setRecipe(s => ({ ...s, title: e.target.value }))} />
      <textarea rows={3} className="input" id="description" name="description" placeholder="Short description" value={recipe.description} onChange={e => setRecipe(s => ({ ...s, description: e.target.value }))}></textarea>
      <div className="row" style={{ gap: 12 }}>
        <textarea rows={8} className="input" id="ingredients" name="ingredients" placeholder={'Ingredients (one per line)'} value={recipe.ingredients.join('\n')} onChange={e => setRecipe(s => ({ ...s, ingredients: e.target.value.split('\n').map(t => t.trim()).filter(Boolean) }))}></textarea>
        <textarea rows={8} className="input" id="instructions" name="instructions" placeholder={'Instructions (one step per line)'} value={recipe.instructions.join('\n')} onChange={e => setRecipe(s => ({ ...s, instructions: e.target.value.split('\n').map(t => t.trim()).filter(Boolean) }))}></textarea>
      </div>
      <input className="input" id="categories" name="categories" placeholder="Categories (comma separated)" value={recipe.categories.join(',')} onChange={e => setRecipe(s => ({ ...s, categories: e.target.value.split(',').map(t => t.trim()).filter(Boolean) }))} />
      <div className="row">
        <input ref={fileRef} id="photo" name="photo" type="file" accept="image/*" onChange={e => setPhoto(e.target.files?.[0] || null)} />
        {photo && <span className="muted">{photo.name}</span>}
      </div>
      <div className="row">
        <button className="btn" type="submit">{mode === 'create' ? 'Publish' : 'Save changes'}</button>
        <button className="btn secondary" type="button" onClick={() => { setRecipe({ title: '', description: '', ingredients: [], instructions: [], categories: [] }); setPhoto(null); if (fileRef.current) fileRef.current.value = '' }}>Reset</button>
      </div>
    </form>
  )
}


