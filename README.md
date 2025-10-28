# CredX 🚀

**On-Chain Reputation Oracle for Solana**

A high-performance monorepo implementing a decentralized credit scoring system for Solana wallets. Built with modern tooling and designed for edge deployment.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

[![Cloudflare Workers](https://img.shields.io/badge/Deploy-Cloudflare%20Workers-F38020?style=flat&logo=cloudflare)](https://workers.cloudflare.com/)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Credit Scoring Algorithm](#credit-scoring-algorithm)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Environment Variables](#environment-variables)
- [Development](#development)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

**CredX** is a decentralized reputation oracle that computes credit scores for Solana wallet addresses based on on-chain activity. The system analyzes transaction history, wallet age, and asset holdings to generate a comprehensive creditworthiness score (0-100).

### Why CredX?

- 🔒 **Trustless & Transparent**: All scoring is based on verifiable on-chain data
- ⚡ **Lightning Fast**: Edge-deployed backend with Redis caching
- 🎨 **Beautiful UI**: Modern Next.js frontend with real-time score visualization
- 🔄 **Production Ready**: CI/CD pipelines, rate limiting, and error handling built-in

---

## ✨ Features

- **Real-time Credit Scoring**: Compute wallet reputation scores in seconds
- **Multi-Factor Analysis**: Evaluates transactions, age, and assets
- **Smart Caching**: Redis-based caching reduces RPC load
- **Rate Limiting**: Built-in protection against abuse
- **Edge Computing**: Deployed on Cloudflare Workers for global low-latency
- **Type-Safe**: Full TypeScript coverage across frontend and backend
- **Responsive Design**: Beautiful UI that works on all devices

---

## 🏗️ Architecture

```
┌─────────────┐         ┌──────────────────┐         ┌─────────────┐
│   Next.js   │────────▶│  Cloudflare      │────────▶│   Solana    │
│   Frontend  │         │  Workers API     │         │     RPC     │
│             │◀────────│  (Hono + Redis)  │         │             │
└─────────────┘         └──────────────────┘         └─────────────┘
                                 │
                                 ▼
                        ┌──────────────────┐
                        │  Upstash Redis   │
                        │  (Score Cache)   │
                        └──────────────────┘
```

### Tech Stack

**Frontend (`apps/web`)**
- Next.js
- TanStack Query for data fetching
- Tailwind CSS
- Zod for validation

**Backend (`apps/server`)**
- Cloudflare Workers (Edge runtime)
- Hono.js framework
- Upstash Redis for caching
- Zod for request validation

**Tooling**
- Turborepo for monorepo management
- Bun for fast package management
- TypeScript throughout
- Wrangler for Workers deployment

---

## 🧮 Credit Scoring Algorithm

The credit score is computed from three weighted components:

$$
\text{Final Score} = (\text{Transactions} \times 0.40) + (\text{Age} \times 0.40) + (\text{Assets} \times 0.20)
$$

### Component Breakdown

| Component | Weight | Factors Analyzed |
|-----------|--------|------------------|
| **Transactions** | 40% | Transaction count, volume, frequency, diversity |
| **Age** | 40% | Wallet age, consistency, longevity |
| **Assets** | 20% | Token holdings, NFTs, asset diversity |

Each component is normalized to a 0-100 scale before applying weights.

📖 **Detailed Specification**: See [`apps/server/docs/CREDIT_SCORING_STANDARD.md`](apps/server/docs/CREDIT_SCORING_STANDARD.md)

---

## 🚀 Getting Started

### Prerequisites

- **Bun** (recommended) or Node.js 18+
- **Git**
- Solana RPC endpoint (e.g., Helius, QuickNode)
- Upstash Redis account (free tier available)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Cred-X/credx-mono.git
   cd credx-mono
   ```

2. **Install dependencies**

   ```bash
   bun install
   ```

3. **Configure environment variables**

   **Backend** (`apps/server/.dev.vars`):
   ```bash
   cd apps/server
   cp .dev.vars.example .dev.vars
   # Edit .dev.vars with your credentials
   ```

   Required variables:
   - `SOLANA_RPC_URL` - Your Solana RPC endpoint
   - `SOLANA_API_KEY` - RPC API key
   - `REDIS_URL` - Upstash Redis URL
   - `REDIS_TOKEN` - Upstash Redis token
   - `FRONTEND_URL` - Frontend URL for CORS

   **Frontend** (`apps/web/.env.local`):
   ```bash
   cd apps/web
   cp .env.example .env.local
   # Edit .env.local
   ```

4. **Start development servers**

   ```bash
   # From repository root
   bun run dev
   ```

   This starts:
   - Frontend: http://localhost:3000
   - Backend: http://localhost:8787

---

## 📁 Project Structure

```
credx/
├── apps/
│   ├── server/              # Cloudflare Workers API
│   │   ├── src/
│   │   │   ├── controller/  # Request handlers
│   │   │   ├── services/    # Business logic
│   │   │   ├── routes/      # API route definitions
│   │   │   ├── middleware/  # Rate limiting, etc.
│   │   │   ├── lib/         # Utilities
│   │   │   │   ├── solana-rpc/    # Solana RPC wrapper
│   │   │   │   ├── redis/         # Redis client & caching
│   │   │   │   ├── utils/         # Score computation
│   │   │   │   └── validator/     # Request validation
│   │   │   └── types/       # TypeScript types
│   │   ├── docs/
│   │   │   └── CREDIT_SCORING_STANDARD.md
│   │   └── wrangler.jsonc   # Workers config
│   │
│   └── web/                 # Next.js frontend
│       ├── src/
│       │   ├── app/         # Next.js app directory
│       │   ├── components/  # React components
│       │   │   ├── ui/            # shadcn/ui primitives
│       │   │   ├── ScoreCompute.tsx
│       │   │   ├── ScoreCard.tsx
│       │   │   └── ScoreResults.tsx
│       │   ├── hooks/       # React hooks
│       │   ├── lib/
│       │   │   ├── api/           # API client
│       │   │   └── validator/     # Validation schemas
│       │   └── types/       # TypeScript types
│       └── next.config.ts
│
├── package.json             # Root workspace config
├── turbo.json              # Turborepo pipeline
└── bun.lock                # Lock file
```

---

## 📡 API Documentation

### Base URL

- **Development**: `http://localhost:8787`
- **Production**: Your deployed Workers URL

### Endpoints

#### Health Check

```http
GET /api/health
```

**Response**:
```json
{
  "success": true,
  "message": "Server is healthy",
  "data": {
    "status": "ok",
    "timestamp": "2025-10-29T12:00:00.000Z"
  }
}
```

#### Compute Credit Score

```http
POST /api/v1/compute
Content-Type: application/json
```

**Request Body**:
```json
{
  "wallet_address": "YourSolanaWalletAddressHere"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Score computed successfully",
  "data": {
    "wallet_address": "YourSolanaWalletAddressHere",
    "score": 85,
    "breakdown": {
      "transactions": 42.5,
      "age": 38.0,
      "assets": 4.5
    },
    "computed_at": "2025-10-29T12:00:00.000Z"
  }
}
```

**Error Response** (400 Bad Request):
```json
{
  "success": false,
  "message": "Invalid wallet address",
  "error": "Validation failed"
}
```

### Rate Limits

- **Default**: 10 requests per minute per IP
- Configurable via environment variables

---

## 🔐 Environment Variables

### Backend (`apps/server/.dev.vars`)

| Variable | Description | Required |
|----------|-------------|----------|
| `SOLANA_RPC_URL` | Solana RPC endpoint URL | ✅ |
| `SOLANA_API_KEY` | RPC API authentication key | ✅ |
| `REDIS_URL` | Upstash Redis connection URL | ✅ |
| `REDIS_TOKEN` | Upstash Redis authentication token | ✅ |
| `FRONTEND_URL` | Frontend URL for CORS (e.g., `http://localhost:3000`) | ✅ |
| `TURSO_DATABASE_URL` | Turso database URL (if using DB) | ❌ |
| `TURSO_AUTH_TOKEN` | Turso authentication token | ❌ |

### Frontend (`apps/web/.env.local`)

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | ✅ |

---

## 💻 Development

### Available Scripts

**Root level**:
```bash
bun run dev          # Start all apps in dev mode
bun run build        # Build all apps
bun run lint         # Lint all packages
```

**Frontend** (`apps/web`):
```bash
bun run dev          # Start Next.js dev server
bun run build        # Build for production
bun run start        # Start production server
bun run lint         # Run ESLint
```

**Backend** (`apps/server`):
```bash
bun run dev          # Start Wrangler dev server
bun run deploy       # Deploy to Cloudflare Workers
bun run build        # Type check (no build needed for Workers)
```

### Type Checking

```bash
# Check types across all packages
bun run typecheck

# Or in individual packages
cd apps/web && npx tsc --noEmit
cd apps/server && npx tsc --noEmit
```

### Testing Locally

1. Start both services:
   ```bash
   bun run dev
   ```

2. Open browser to `http://localhost:3000`

3. Enter a Solana wallet address and click "Compute Score"

4. API endpoint test:
   ```bash
   curl -X POST http://localhost:8787/api/v1/compute \
     -H "Content-Type: application/json" \
     -d '{"wallet_address": "YourWalletAddressHere"}'
   ```

---

## 🚢 Deployment

### Frontend (Cloudflare Pages)

The frontend is configured for Cloudflare Pages deployment:

1. **Install Wrangler CLI** (if not already installed):
   ```bash
   bun install -g wrangler
   ```

2. **Build the frontend**:
   ```bash
   cd apps/web
   bun run build
   ```

3. **Deploy to Cloudflare Pages**:
   ```bash
   wrangler pages deploy .next --project-name=credx-frontend
   ```

   Or use the Cloudflare Dashboard:
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
   - Navigate to **Pages** → **Create a project**
   - Connect your GitHub repository
   - Configure build settings:
     - **Build command**: `cd apps/web && bun run build`
     - **Build output directory**: `apps/web/.next`
     - **Root directory**: `/`

4. **Set environment variables** in Cloudflare Pages dashboard:
   - `NEXT_PUBLIC_API_URL` - Your deployed Workers API URL

### Backend (Cloudflare Workers)

1. **Install Wrangler CLI** (if not already installed):
   ```bash
   bun install -g wrangler
   ```

2. **Authenticate**:
   ```bash
   wrangler login
   ```

3. **Deploy**:
   ```bash
   cd apps/server
   bun run deploy
   ```

4. **Set production secrets**:
   ```bash
   wrangler secret put SOLANA_RPC_URL
   wrangler secret put SOLANA_API_KEY
   wrangler secret put REDIS_URL
   wrangler secret put REDIS_TOKEN
   wrangler secret put FRONTEND_URL
   ```

### CI/CD

The repository includes GitHub Actions workflows:

- **CI Build**: `.github/workflows/ci_build.yml` - Runs on every push
- **Frontend Deployment**: `.github/workflows/cd_web.yml` - Deploys to Cloudflare Pages
- **Backend Deployment**: `.github/workflows/cd_be.yml` - Deploys to Cloudflare Workers

---


## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🔗 Links

- **Repository**: [github.com/Cred-X/credx-mono](https://github.com/Cred-X/credx-mono)
- **Issues**: [GitHub Issues](https://github.com/Cred-X/credx-mono/issues)

---

## 🙏 Acknowledgments

- Built with [Turborepo](https://turbo.build/repo)
- Powered by [Cloudflare Workers](https://workers.cloudflare.com/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Caching by [Upstash Redis](https://upstash.com/)

---

## 📚 Useful Links

Learn more about the power of Turborepo:

- [Tasks](https://turborepo.com/docs/crafting-your-repository/running-tasks)
- [Caching](https://turborepo.com/docs/crafting-your-repository/caching)
- [Remote Caching](https://turborepo.com/docs/core-concepts/remote-caching)
- [Filtering](https://turborepo.com/docs/crafting-your-repository/running-tasks#using-filters)
- [Configuration Options](https://turborepo.com/docs/reference/configuration)
- [CLI Usage](https://turborepo.com/docs/reference/command-line-reference)