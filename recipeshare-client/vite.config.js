import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: { port: 5173 },
  // Set base for GitHub Pages project site: https://<user>.github.io/RecipeShare/
  base: '/RecipeShare/'
})


