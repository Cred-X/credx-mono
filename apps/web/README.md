# credX Web

Minimal Next.js app for the credX frontend.

## Prerequisites

- Node.js 18+ or a compatible runtime
- A package manager: npm / pnpm / yarn or Bun (this repo contains a `bun.lock` so Bun is supported)

## Quick start

Install dependencies (choose one):

```bash
# npm
npm install

# or pnpm
pnpm install

# or yarn
yarn install

# or bun
bun install
```

Run the development server:

```bash
npm run dev
# or
pnpm dev
# or
yarn dev
# or
bun run dev
```

Open http://localhost:3000 in your browser.

## Build and start

Build for production:

```bash
npm run build
```

Start the production server (after build):

```bash
npm start
```

## Linting

Run the linter configured for the project:

```bash
npm run lint
```

## Type checking (optional)

If you want to run TypeScript checks:

```bash
npx tsc --noEmit
```

## Environment variables

This project doesn't require any specific environment variables by default. If you add secrets or API keys, create a `.env.local` file in the project root and add them there. Example:

```bash
# .env.local
NEXT_PUBLIC_API_URL=https://api.example.com
```

## Troubleshooting

- Port already in use: specify a port with `PORT=3001 npm run dev` or free the port.
- If install fails, try switching package manager (e.g., use npm if bun fails) or delete `node_modules`/lockfile and reinstall.
- If Next build errors reference missing types, ensure devDependencies are installed and run `npx tsc` for more details.

## Project scripts

Scripts available from `package.json`:

- `dev` — start dev server (Next.js with Turbopack)
- `build` — build for production
- `start` — start production server
- `lint` — run ESLint

## Notes

- This project uses Next.js and Tailwind. If you change Tailwind configuration, restart the dev server.
- If you prefer Bun (recommended when `bun.lock` is present), use `bun install` and `bun run <script>`.

---

If you want, I can add more sections (testing, deployment steps, CI examples). Which would you like next?
