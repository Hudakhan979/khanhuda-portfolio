# 🚀 Developer Portfolio — Full Stack

A world-class 2026 developer portfolio with a cinematic dark-luxury aesthetic, full admin dashboard, and MongoDB backend.

## ✨ Features

- **Cinematic hero** — GSAP character animations, animated gradient blobs, typing animation, animated stats counters
- **11 portfolio sections** — Hero, About, Skills (tabbed by category), Experience (timeline), Projects (filterable bento grid), Services, Achievements, Testimonials (carousel), Certificates, GitHub Stats, Contact
- **Contact form** — saves to MongoDB + optional email notifications via Nodemailer
- **Admin Dashboard** — full CRUD for all content, message inbox, analytics
- **JWT auth** — bcrypt password hashing, protected admin routes
- **Dark luxury aesthetic** — violet/cyan/pink aurora palette, glassmorphism, glow effects
- **Responsive** — mobile-first design

## 🛠 Tech Stack

| Layer    | Tech                                                    |
|----------|---------------------------------------------------------|
| Frontend | React 18, Vite 5, Tailwind CSS 3, Framer Motion, GSAP  |
| Backend  | Node.js, Express 4, MongoDB, Mongoose 8                 |
| Auth     | JWT (jsonwebtoken), bcryptjs                            |
| Email    | Nodemailer                                              |
| State    | TanStack Query (React Query)                            |
| Forms    | React Hook Form                                         |

## 📁 Project Structure

```
portfolio/
├── client/                   # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/       # Navbar, Footer, AdminLayout
│   │   │   └── sections/     # Hero, About, Skills, Experience, …
│   │   ├── hooks/            # useAuth
│   │   ├── lib/              # api.js (Axios client)
│   │   └── pages/
│   │       ├── admin/        # Login, Dashboard, Projects, Skills, Experience, Messages
│   │       ├── Landing.jsx
│   │       └── NotFound.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
└── server/                   # Express + MongoDB backend
    ├── config/db.js          # MongoDB connection
    ├── middleware/auth.js     # JWT middleware
    ├── models/               # Mongoose schemas
    │   ├── Admin.js
    │   ├── Profile.js
    │   ├── Project.js
    │   ├── Skill.js
    │   ├── Experience.js
    │   ├── Testimonial.js
    │   ├── Certificate.js
    │   ├── Achievement.js
    │   └── Message.js
    ├── routes/               # Express routers
    │   ├── auth.js
    │   ├── profile.js
    │   ├── projects.js
    │   ├── skills.js
    │   ├── experience.js
    │   ├── testimonials.js
    │   ├── certificates.js
    │   ├── achievements.js
    │   ├── contact.js
    │   ├── analytics.js
    │   └── github.js
    ├── seed.js               # Database seeder
    ├── app.js                # Express entry point
    └── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/atlas))

### 1. Clone & install

```bash
# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
```

### 2. Environment variables

```bash
cp .env.example .env
# Edit .env — set MONGODB_URI and JWT_SECRET at minimum
```

### 3. Seed the database

```bash
cd server
npm run seed
```

This creates:
- Admin user: `admin@portfolio.dev` / `admin123`
- 6 sample projects, 24 skills, 3 experience entries, 4 testimonials, 4 certificates, 5 achievements

### 4. Run in development

**Terminal 1 — Backend:**
```bash
cd server && npm run dev
# → http://localhost:5000
```

**Terminal 2 — Frontend:**
```bash
cd client && npm run dev
# → http://localhost:5173
```

> The Vite dev server proxies `/api` requests to `localhost:5000` automatically.

### 5. Build for production

```bash
cd client && npm run build   # outputs to client/dist/
cd server && npm start       # serve API + optionally serve client/dist
```

## 🔐 Admin Panel

Navigate to `/admin` and sign in with:
- **Email:** `admin@portfolio.dev`
- **Password:** `admin123`

> Change the password after first login by updating the admin document in MongoDB.

The admin panel lets you manage:
- **Projects** — add, edit, delete, set featured/status
- **Skills** — organized by category with proficiency bars
- **Experience** — work history timeline
- **Messages** — read/reply/delete contact form submissions
- **Dashboard** — analytics overview

## 📧 Contact Form Email Setup

Configure these env vars to receive email notifications:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@gmail.com
SMTP_PASS=your_16char_app_password   # Gmail App Password
CONTACT_EMAIL=receive@here.com
```

For Gmail, enable 2FA and generate an [App Password](https://myaccount.google.com/apppasswords).

## 🌍 Deployment

### Backend (Railway / Render / Fly.io)
1. Set `MONGODB_URI`, `JWT_SECRET`, `NODE_ENV=production`, `CLIENT_URL` in your hosting platform's env vars
2. Deploy the `server/` directory
3. Run `npm run seed` once in the deployed environment

### Frontend (Vercel / Netlify)
1. Set `VITE_API_URL=https://your-api-server.com/api`
2. Deploy the `client/` directory
3. Set the build command to `npm run build` and output dir to `dist`

## 🎨 Customization

1. **Colors** — edit CSS variables in `client/src/index.css` and `client/tailwind.config.js`
2. **Content** — use the Admin Dashboard or run `cd server && npm run seed` to reset demo data
3. **Profile photo** — update `avatarUrl` in the Profile admin section
4. **Sections** — remove any section from `client/src/pages/Landing.jsx`

## 📄 License

MIT — free to use for personal and commercial projects.
