## RecipeShare — Full Stack App

This repo contains both server and client for RecipeShare.

### Tech
- Frontend: React (Vite, React Router)
- Backend: Node.js + Express
- Storage: Local JSON file (Mongoose-ready design)

### Local setup
```bash
cd recipeshare-server && npm i
cd ../recipeshare-client && npm i
```

Start API:
```bash
cd recipeshare-server
npm run dev
```

Start Web:
```bash
cd recipeshare-client
npm run dev
```

By default the web app talks to `http://localhost:5000/api`. To change, set `VITE_API_URL` in `recipeshare-client/.env`.

### Deployment
- Frontend (Vercel): import `recipeshare-client`, set env `VITE_API_URL` to your server URL + `/api`.
- Backend (Render.com): import `recipeshare-server`, set env `PORT`, `JWT_SECRET`. Start command: `node src/index.js`.


---

## RecipeShare — Full Guide

### Features
- Browse and filter recipes by category
- Register/Login with JWT auth
- Create/Edit/Delete recipes with image upload
- Comment and rate recipes (1–5)
- Mark favorites

### Tech Stack
- Frontend: React 18, Vite, React Router
- Backend: Node.js, Express, Multer, JWT, bcrypt
- Storage: JSON on disk (`fs-extra`)

### Repo Layout
- `recipeshare-server/` — API (`/api/*`) and static uploads at `/uploads`
- `recipeshare-client/` — React SPA

### Quickstart
API (Terminal 1)
```bash
cd recipeshare-server
npm install
npm run start # or: npm run dev
```

Web (Terminal 2)
```bash
cd recipeshare-client
npm install
echo VITE_API_URL=http://127.0.0.1:5000/api > .env
npm run dev -- --host --port 5173
```

Open: `http://127.0.0.1:5173`

Health: `http://127.0.0.1:5000/api/health`

### Environment Variables
Server (`recipeshare-server/.env`)
- `PORT=5000`
- `JWT_SECRET=your_secret`
- `CORS_ORIGIN=*` or your site origin
- `PUBLIC_URL=http://127.0.0.1:5000`

Client (`recipeshare-client/.env`)
- `VITE_API_URL=http://127.0.0.1:5000/api`
- `VITE_GITHUB_URL=https://github.com/your-username/your-repo`

### Deployment
- Backend: Render/Fly/EC2/etc
  - Start: `node src/index.js`
  - Persist `data/` and `uploads/` via volumes
  - Set `PUBLIC_URL` to your backend origin
- Frontend: Vercel/Netlify/etc
  - Build from `recipeshare-client`
  - Set `VITE_API_URL` to your backend `/api` URL

### API Summary
- `POST /api/auth/register` — name, email, password
- `POST /api/auth/login` — email, password
- `GET /api/recipes` — list (optional `?category=`)
- `POST /api/recipes` — multipart with `photo` (auth)
- `GET /api/recipes/:id` — detail
- `PUT /api/recipes/:id` — update (auth)
- `DELETE /api/recipes/:id` — delete (auth)
- `POST /api/recipes/:id/comments` — comment
- `POST /api/recipes/:id/ratings` — rate 1–5
- `POST /api/recipes/:id/favorite` — add favorite (auth)
- `DELETE /api/recipes/:id/favorite` — remove favorite (auth)

### GitHub: Publish This Project
1) Create a new GitHub repo (public)
2) From project root:
```bash
git init
echo node_modules/>> .gitignore
echo dist/>> .gitignore
echo recipeshare-client/.env>> .gitignore
echo recipeshare-server/.env>> .gitignore
echo recipeshare-server/data/db.json>> .gitignore
echo recipeshare-server/uploads/>> .gitignore
git add .
git commit -m "feat: RecipeShare app (client+server)"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

Then set `VITE_GITHUB_URL` in `recipeshare-client/.env` to your repo URL. The navbar GitHub button will open it.

### License
MIT


