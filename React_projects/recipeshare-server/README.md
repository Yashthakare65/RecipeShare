## RecipeShare Server

Express API with JWT auth, JSON storage, and Multer image upload.

### Endpoints
- POST `/api/auth/register`
- POST `/api/auth/login`
- POST `/api/recipes` (auth, multipart `photo`)
- GET `/api/recipes`
- GET `/api/recipes/:id`
- PUT `/api/recipes/:id` (auth, optional `photo`)
- DELETE `/api/recipes/:id` (auth)
- POST `/api/recipes/:id/comments`
- POST `/api/recipes/:id/ratings` (1-5)
- POST `/api/recipes/:id/favorite` (auth)
- DELETE `/api/recipes/:id/favorite` (auth)
- GET `/api/recipes/me/favorites` (auth)

### Run locally
```bash
cp .env.example .env  # or set env vars manually
npm i
npm run dev
```


