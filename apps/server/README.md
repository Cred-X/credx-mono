# CredX API

A Cloudflare Workers API built with Hono, Drizzle ORM, Turso (LibSQL), and Upstash Redis.

## Prerequisites

- [Bun](https://bun.sh/)
- [Cloudflare Account](https://dash.cloudflare.com/sign-up)
- [Turso Database](https://turso.tech/) account
- [Upstash Redis](https://upstash.com/) account

## Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd credX-api
```

### 2. Install Dependencies

```bash
npm install
# or
bun install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
TURSO_DATABASE_URL=your-turso-database-url
TURSO_AUTH_TOKEN=your-turso-auth-token
REDIS_URL=your-upstash-redis-url
REDIS_TOKEN=your-upstash-redis-token
FRONTEND_URL=your-frontend-url
```

**Getting the credentials:**

- **Turso Database**:
  - Sign up at [turso.tech](https://turso.tech/)
  - Create a new database
  - Get the URL and auth token from the Turso dashboard
- **Upstash Redis**:
  - Sign up at [upstash.com](https://upstash.com/)
  - Create a new Redis database
  - Copy the REST URL and token from the database details

### 4. Update `wrangler.jsonc`

Update the `vars` section in `wrangler.jsonc` with your values:

```jsonc
{
	"vars": {
		"TURSO_DATABASE_URL": "your-turso-database-url",
		"TURSO_AUTH_TOKEN": "your-turso-auth-token",
		"REDIS_URL": "your-upstash-redis-url",
		"REDIS_TOKEN": "your-upstash-redis-token",
		"FRONTEND_URL": "your-frontend-url"
	}
}
```

### 5. Generate Database Schema

Generate and push the database schema to Turso:

```bash
npm run drizzle:generate
npm run drizzle:push
```

### 6. Generate Cloudflare Types

Generate TypeScript types based on your Worker configuration:

```bash
npm run cf-typegen
```

## Development

Start the development server:

```bash
npm run dev
```

The API will be available at `http://localhost:8787`

## Deployment

Deploy to Cloudflare Workers:

```bash
npm run deploy
```

## Available Scripts

- `npm run dev` - Start development server with Wrangler
- `npm run build` - Build the Worker
- `npm run deploy` - Deploy to Cloudflare Workers (minified)
- `npm run cf-typegen` - Generate CloudflareBindings types
- `npm run drizzle:generate` - Generate Drizzle migration files
- `npm run drizzle:push` - Push schema changes to database

## Usage with Hono

Pass the `CloudflareBindings` as generics when instantiating `Hono`:

```ts
// src/index.ts
const app = new Hono<{ Bindings: CloudflareBindings }>();
```

## Technologies

- **[Hono](https://hono.dev/)** - Ultrafast web framework
- **[Drizzle ORM](https://orm.drizzle.team/)** - TypeScript ORM
- **[Turso](https://turso.tech/)** - SQLite-based edge database
- **[Upstash Redis](https://upstash.com/)** - Serverless Redis
- **[Cloudflare Workers](https://workers.cloudflare.com/)** - Serverless compute platform

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
