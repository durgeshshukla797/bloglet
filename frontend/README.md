# BlogApp Frontend

A production-ready MERN blog website frontend built with React (Vite), Tailwind CSS, and React Router.

## Features

- 🏠 Home page with blog cards grid
- 📝 Blog details page with reactions and comments
- 👤 User profile page
- 🔐 Authentication (Login/Register)
- ❤️ Like/Dislike functionality
- 💬 Comments system with CRUD operations
- 🎨 Clean black-and-white dark theme

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Backend Configuration

Make sure your backend is running on `http://localhost:4001` and the CORS is configured to allow `http://localhost:5173`.

## Environment Variables

The API base URL is configured in `src/services/api.js`. Update it if your backend runs on a different port.
