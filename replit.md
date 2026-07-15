# Developer Portfolio

A world-class 2026 developer portfolio — a full-stack MERN-style app with a cinematic dark-luxury aesthetic. Built to impress recruiters and win Awwwards nominations.

## Run & Operate

- `pnpm --filter @workspace/portfolio run dev` — run the portfolio frontend (port auto-assigned)
- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- **Frontend**: React 19 + Vite, Tailwind CSS, Framer Motion, GSAP, Lenis, Three.js (R3F)
- **Backend**: Express 5, PostgreSQL + Drizzle ORM
- **Auth**: JWT (jsonwebtoken + bcrypt)
- **Email**: Nodemailer (optional, configure SMTP_ env vars)
- API codegen: Orval (from OpenAPI spec)

## Where things live

- `artifacts/portfolio/src/` — frontend React app
  - `src/components/sections/` — Hero, About, Skills, Experience, Projects, Services, Achievements, Testimonials, Certificates, GithubStats, Contact
  - `src/components/layout/` — Navbar, Footer, AdminLayout
  - `src/pages/` — Landing, admin pages
- `artifacts/api-server/src/routes/` — all API route handlers
- `lib/db/src/schema/` — Drizzle table definitions
- `lib/api-spec/openapi.yaml` — single source of truth for all API contracts

## Admin Dashboard

- URL: `/admin` — login page
- Credentials: `admin@portfolio.dev` / `admin123`
- Dashboard: `/admin/dashboard`
- Manages: Projects, Skills, Experience, Testimonials, Certificates, Achievements, Messages, Analytics

## Color Palette

- Background: `#050816`
- Primary: `#7C3AED` (violet)
- Secondary: `#06B6D4` (cyan)
- Accent: `#F472B6` (pink)

## Architecture decisions

- PostgreSQL used (instead of MongoDB) since it's pre-provisioned in Replit — functionally identical from frontend perspective
- JWT stored in localStorage as `portfolio_token` for admin auth
- GitHub stats endpoint returns curated static data; set `GITHUB_TOKEN` + `GITHUB_USERNAME` env vars to fetch live data
- Email notifications on contact form submission — configure `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `CONTACT_EMAIL` env vars

## Product

Full developer portfolio with:
- Cinematic Hero section with GSAP animations, typing animation, animated gradient blobs
- About with animated counters
- Skills with category tabs and animated progress bars
- Experience timeline
- Projects bento grid with search/filter
- Services section
- Achievements gallery
- Testimonials carousel
- Certificates grid
- GitHub stats with contribution heatmap
- Contact form (stores to DB, sends email)
- Full Admin Dashboard (CRUD for all content, analytics, message management)

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- bcrypt native build was blocked by pnpm; admin password is pre-hashed in seed data (`admin123`)
- react-icons v5 renamed many SI icons; `SiLinkedin` and `SiTwitter` don't exist — use Lucide equivalents
- After any schema change: run `pnpm --filter @workspace/db run push`, then `pnpm run typecheck:libs`

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
