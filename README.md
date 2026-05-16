<div align="center">
  <img src="public/favicon.png" alt="Masterball Logo" width="96" />
  <h1>Masterball</h1>
  <p>A modern, fast, and beautiful Pokedex web app built with Astro, React, and Tailwind CSS.</p>
</div>

---

## Features

- ⚡ **Instant Search**: Quickly find Pokémon, moves, abilities, items, and more.
- 🧬 **Detailed Data**: View stats, type effectiveness, evolutions, abilities, moves, and cosmetic forms.
- 🖼️ **Rich UI Components**: Responsive cards, charts, icons, and pills for a delightful user experience.
- 🌗 **Dark/Light Theme**: Toggle between themes for comfortable browsing.
- 📦 **Static Export**: Blazing fast static site generation (SSG) for production.
- 🛠️ **Developer Friendly**: Built with TypeScript, pnpm, TanStack Table, pMap, clsx/lite, lucide-react, and more.

## Tech Stack

- **Framework**: Astro 6.3 (SSG)
- **Language**: TypeScript 6
- **Styling**: Tailwind CSS v4
- **Package Manager**: pnpm
- **UI**: React, lucide-react, motion
- **Tables**: TanStack Table
- **Utils**: pMap, clsx/lite, oxlint, oxfmt

## Project Structure

- `src/pages/` — Astro pages and routes
- `src/components/` — UI and compound components (cards, pills, icons, tables, etc.)
- `src/lib/` — Providers, API helpers, stores, and utilities
- `public/` — Static assets (icons, images)

## Getting Started

### Prerequisites

- [pnpm](https://pnpm.io/) >= 10

### Install & Run

```sh
pnpm install
pnpm dev
```

Visit [http://localhost:4321](http://localhost:4321) to view the app.

### Build Static Site

```sh
pnpm build
```

Static files will be generated in the `dist/` directory.

## Contributing

Contributions are welcome! Please follow the code style and architecture guidelines:

- Use `type` over `interface` unless necessary.
- Import types with `import type { ... }`.
- Use Tailwind CSS for styling.
- Avoid `any`, `unknown`, or `object` types.
- Use `pMap` for parallel array processing.
- Use `clsx/lite` for conditional class names.
- Optimize with `useMemo` and `useCallback` when needed.
