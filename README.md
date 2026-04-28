# ⚡ SwiftChain — Smart Delivery Orchestration System

A production-grade full-stack SaaS platform for optimizing city-level deliveries with real-time tracking, intelligent rider assignment, and route optimization.

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue?logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue?logo=postgresql)
![Redis](https://img.shields.io/badge/Redis-7-red?logo=redis)
![Socket.IO](https://img.shields.io/badge/Socket.IO-4.7-black?logo=socket.io)

## 🚀 Quick Start

### Prerequisites
- **Node.js** ≥ 18
- **Docker** & **Docker Compose** (for PostgreSQL + Redis)
- **npm** ≥ 9

### 1. Install Dependencies
```bash
cd SwiftChain
npm install
```

### 2. Start Database Services
```bash
docker-compose up -d
```
This starts:
- **PostgreSQL** (PostGIS-enabled) on port `5432`
- **Redis** on port `6379`

### 3. Setup Database
```bash
npx prisma generate         # Generate Prisma client
npx prisma migrate dev      # Run migrations
npx prisma db seed          # Seed demo data
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) — you'll be redirected to the dashboard.

## 🏗️ Architecture

```
SwiftChain/
├── server.js                  # Custom Node.js server (Next.js + Socket.IO)
├── prisma/                    # Database schema & seed data
├── src/
│   ├── algorithms/            # Route optimization (Dijkstra, TSP, 2-opt)
│   ├── app/                   # Next.js App Router (pages + API routes)
│   │   ├── (dashboard)/       # Dashboard pages (overview, orders, riders, map, analytics)
│   │   └── api/               # REST API endpoints
│   ├── components/            # React components (UI, layout, map, analytics)
│   ├── hooks/                 # Custom React hooks (socket, rider tracking)
│   ├── lib/                   # Core utilities (db, redis, constants)
│   ├── services/              # Business logic (assignment, routing, failures)
│   └── types/                 # TypeScript type definitions
└── docker-compose.yml         # PostgreSQL + Redis containers
```

## ✨ Key Features

| Feature | Description |
|---------|-------------|
| **Smart Assignment** | Scores riders on distance (35%), workload (30%), route efficiency (20%), rating (15%) |
| **Route Optimization** | Nearest Neighbor + 2-opt improvement (15-25% route reduction) |
| **Live Tracking** | WebSocket-powered real-time rider GPS on dark-themed Leaflet map |
| **Failure Handling** | Auto-detects inactive riders, escalates, and reassigns orders |
| **Order Batching** | Clusters nearby orders for efficient multi-stop deliveries |
| **ETA Calculator** | Traffic-aware, time-of-day adjusted delivery estimates |
| **WhatsApp Webhook** | Accept orders via messaging (format: `Order: [product], Address: [addr]`) |
| **Analytics** | Delivery trends, failure breakdowns, rider leaderboards with Recharts |

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/orders` | List orders (with filters) |
| `POST` | `/api/orders` | Create new order |
| `GET` | `/api/orders/:id` | Get order details + timeline |
| `PATCH` | `/api/orders/:id` | Update order status |
| `GET` | `/api/riders` | List riders |
| `POST` | `/api/assignments` | Trigger smart rider assignment |
| `POST` | `/api/routes/optimize` | Optimize multi-stop route |
| `GET` | `/api/analytics` | Dashboard statistics |
| `POST` | `/api/webhook/whatsapp` | WhatsApp order intake |

## 🧮 Algorithms

- **Haversine** — Great-circle distance for GPS coordinates
- **Nearest Neighbor TSP** — O(n²) greedy initial route construction
- **2-opt Improvement** — Iterative segment reversal for route refinement
- **Dijkstra** — Graph-based shortest path for internal routing decisions

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Vanilla CSS
- **Maps**: Leaflet.js + CartoDB Dark Matter tiles
- **Charts**: Recharts
- **Backend**: Custom Node.js server (Express-like)
- **Real-time**: Socket.IO (WebSocket)
- **Database**: PostgreSQL 16 + PostGIS 3.4
- **ORM**: Prisma
- **Cache**: Redis 7

## 📝 License

MIT
