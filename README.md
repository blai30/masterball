<div align="center">
  <img src="public/favicon.png" alt="Masterball Logo" width="96" />
  <h1>Masterball</h1>
  <p>A modern, fast, and beautiful Pokedex web app built with Next.js, React, and Tailwind CSS.</p>
</div>

---

## Features

- ⚡ **Instant Search**: Quickly find Pokémon, moves, abilities, items, and more.
- 🧬 **Detailed Data**: View stats, type effectiveness, evolutions, abilities, moves, and cosmetic forms.
- 🖼️ **Rich UI Components**: Responsive cards, charts, icons, and pills for a delightful user experience.
- 🌗 **Dark/Light Theme**: Toggle between themes for comfortable browsing.
- 📦 **Static Export**: Blazing fast static site generation (SSG) for production.
- 🛠️ **Developer Friendly**: Built with TypeScript, Bun, TanStack Table, pMap, clsx/lite, lucide-react, and more.

## Tech Stack

- **Framework**: Next.js 15 (SSG only, SSR for development)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS v4
- **Runtime**: Bun 1.2
- **UI**: React, lucide-react
- **Tables**: TanStack Table
- **Utils**: pMap, clsx/lite

## Project Structure

- `app/` — Next.js pages and layouts
- `components/` — UI and compound components (cards, pills, icons, tables, etc.)
- `lib/` — Providers, API helpers, stores, and utilities
- `public/` — Static assets (icons, images)

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) >= 1.2

### Install & Run

```sh
bun install
bun dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the app.

### Build Static Site

```sh
bun run build
bun run export
```

Static files will be generated in the `out/` directory.

## Contributing

Contributions are welcome! Please follow the code style and architecture guidelines:

- Use `type` over `interface` unless necessary.
- Import types with `import type { ... }`.
- Use Tailwind CSS for styling.
- Avoid `any`, `unknown`, or `object` types.
- Use `pMap` for parallel array processing.
- Use `clsx/lite` for conditional class names.
- Optimize with `useMemo` and `useCallback` when needed.
