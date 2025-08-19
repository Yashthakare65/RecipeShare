import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export const api = axios.create({ baseURL })

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export function formDataFromRecipe(data) {
  const fd = new FormData()
  Object.entries(data).forEach(([k, v]) => {
    if (v === undefined || v === null) return
    if (Array.isArray(v)) {
      if (k === 'ingredients' || k === 'instructions') fd.append(k, v.join('\n'))
      else if (k === 'categories') fd.append(k, v.join(','))
    } else fd.append(k, v)
  })
  return fd
}


