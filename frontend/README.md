# Bloglet Frontend

This is the React + Vite frontend for Bloglet.

Tech:
- React + Vite
- Tailwind CSS (dark-only)
- Axios (withCredentials)
- React Router DOM
- Context API for auth
- Framer Motion for transitions

Quick start:

```powershell
cd frontend; npm install
npm run dev
```

Notes:
- The axios base URL is `http://localhost:4000/api` in `src/services/axios.js`.
- Auth endpoints used: `/auth/login`, `/auth/register`, `/auth/logout`, `/auth/refresh`.
- Upload endpoint used: `/upload` (multipart-form expected).
- Protected routes are defined in `src/routes/AppRoutes.jsx`.
