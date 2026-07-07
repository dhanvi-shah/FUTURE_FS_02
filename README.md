# Mini CRM — Client Lead Management System

A production-quality Mini CRM built with the MERN stack, featuring a premium dark dashboard UI, JWT authentication, lead pipeline management, analytics, and smooth Framer Motion animations.

## Screenshots

> Add screenshots of the Login, Dashboard, Leads table, and Lead Details pages here.

## Features

- **Authentication** — JWT-based admin login with protected routes
- **Dashboard** — KPI cards, pie/bar/area charts, recent leads, follow-up reminders
- **Lead Management** — Full CRUD with search, filters, sorting, and pagination
- **Lead Details** — Profile view, status updates, notes, activity timeline
- **Analytics** — Conversion rate, monthly growth, status/source breakdowns
- **Premium UI** — Dark theme inspired by Linear, Vercel, and Stripe
- **Animations** — Page transitions, staggered cards, animated counters, chart animations
- **Responsive** — Desktop, tablet, and mobile (sidebar drawer, card layout)
- **Bonus** — Dark/light mode, CSV export, keyboard shortcuts, confirmation dialogs

## Tech Stack

| Layer    | Technologies |
|----------|-------------|
| Frontend | React 19, Vite, TypeScript, Tailwind CSS, Framer Motion, Recharts, React Hook Form, Zod, Sonner |
| Backend  | Node.js, Express, MongoDB, Mongoose, JWT, bcrypt |
| Database | MongoDB |

## Installation

### Prerequisites

- Node.js 18+
- MongoDB running locally (or MongoDB Atlas connection string)

### 1. Clone and install

```bash
cd minicrm

# Install root + server + client dependencies
npm install
npm run install:all

# Or install separately
cd server && npm install
cd ../client && npm install
```

### 2. Seed the database

```bash
npm run seed
# or: cd server && npm run seed
```

### 3. Start the servers

**Windows (PowerShell) — recommended:**

```bash
npm run dev
```

**macOS / Linux / Git Bash (with GNU Make):**

```bash
make dev
```

Runs backend on **http://localhost:5001** and frontend on **http://localhost:3001**.

## Demo Credentials

| Field    | Value           |
|----------|-----------------|
| Email    | admin@crm.com   |
| Password | password123     |

## Environment Variables

### Server (`server/.env`)

| Variable         | Default                              | Description          |
|------------------|--------------------------------------|----------------------|
| PORT             | 5001                                 | API server port      |
| MONGODB_URI      | mongodb://127.0.0.1:27017/minicrm    | MongoDB connection   |
| JWT_SECRET       | —                                    | JWT signing secret   |
| JWT_EXPIRES_IN   | 7d                                   | Token expiry         |
| CLIENT_URL       | http://localhost:3001                | CORS origin          |

### Client (`client/.env`)

| Variable      | Default                      | Description   |
|---------------|------------------------------|---------------|
| VITE_API_URL  | http://localhost:5001/api    | Backend API   |

## Folder Structure

```
minicrm/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/           # Reusable UI primitives
│   │   │   ├── layout/       # Sidebar, Navbar, Layout
│   │   │   ├── leads/        # Lead-specific components
│   │   │   ├── dashboard/    # Charts, stat cards
│   │   │   └── common/       # ProtectedRoute, etc.
│   │   ├── pages/            # Route pages
│   │   ├── hooks/            # Custom hooks
│   │   ├── services/         # API layer
│   │   ├── context/          # Auth & theme
│   │   ├── schemas/          # Zod validation
│   │   ├── types/            # TypeScript types
│   │   ├── constants/        # Status colors, nav items
│   │   └── utils/            # Helpers
│   └── package.json
├── server/
│   ├── config/               # DB & env
│   ├── models/               # Mongoose schemas
│   ├── routers/              # Express routes
│   ├── services/             # Business logic
│   ├── middleware/           # Auth & errors
│   ├── seed/                 # Database seeder
│   └── server.js
└── README.md
```

## API Endpoints

### Authentication

| Method | Endpoint          | Description |
|--------|-------------------|-------------|
| POST   | /api/auth/login   | Admin login |

### Leads (Protected)

| Method | Endpoint                    | Description        |
|--------|-----------------------------|--------------------|
| GET    | /api/leads                  | List leads (query) |
| POST   | /api/leads                  | Create lead        |
| GET    | /api/leads/:id              | Get lead           |
| PUT    | /api/leads/:id              | Update lead        |
| DELETE | /api/leads/:id              | Delete lead        |
| POST   | /api/leads/:id/note         | Add note           |
| PUT    | /api/leads/:id/status       | Update status      |
| PUT    | /api/leads/:id/follow-up    | Set follow-up date |
| GET    | /api/leads/analytics        | Dashboard data     |
| GET    | /api/leads/activity         | Recent activity    |
| GET    | /api/leads/export           | CSV export         |

## Keyboard Shortcuts

| Key | Action        |
|-----|---------------|
| N   | New lead      |
| Esc | Close sidebar |

## Future Improvements

- Multi-user roles and permissions
- Email integration for outreach
- Kanban pipeline view
- Real-time updates with WebSockets
- Advanced reporting and forecasting
- File attachments on leads
- Integration with calendar apps

## License

MIT
