## Deploying RecipeShare to Render

### 1) Backend (Web Service)
- Root directory: `recipeshare-server`
- Build command: `npm install`
- Start command: `npm start`
- Health check path: `/api/health`
- Environment variables:
  - `MONGO_URI` = your MongoDB Atlas SRV string
  - `JWT_SECRET` = a strong secret
  - `CORS_ORIGIN` = `https://<your-client>.onrender.com`
  - Optional: `PUBLIC_URL` (otherwise the server uses `RENDER_EXTERNAL_URL` automatically)
- Optional persistent disk for uploads:
  - Mount path: `/opt/render/project/src/recipeshare-server/uploads`

### 2) Frontend (Static Site)
- Root directory: `recipeshare-client`
- Build command: `npm install && npm run build`
- Publish directory: `dist`
- Environment variables:
  - `VITE_API_URL` = `https://<your-server>.onrender.com/api`
- Routing: add rewrite `/* -> /index.html`

### 3) MongoDB Atlas setup
- Create a database user with password.
- Network Access: allow your Render outbound IPs (temporarily `0.0.0.0/0` to verify, then restrict).
- Use the SRV connection string (`mongodb+srv://…`).

### 4) Local development
- Copy `recipeshare-server/env.example` to `.env` and fill values.
- Copy `recipeshare-client/env.example` to `.env` and set `VITE_API_URL`.
- Run server: `cd recipeshare-server && npm install && npm start`
- Run client: `cd recipeshare-client && npm install && npm run dev`

### 5) Post-deploy checks
- Backend: `GET https://<server>/api/health` returns `{ status: "ok" }`.
- Frontend network calls point to `https://<server>/api` and succeed.
- No CORS errors. Images load with absolute URLs built from the server public URL.
