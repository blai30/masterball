## Project specific

- Framework: Astro 7
- Language: TypeScript 6
- Core packages: Tailwind CSS 4.3, React 19, pnpm, TanStack Table, pMap, clsx, lucide-react
- This project is a Statically Generated Site (SSG) that fetches data at build time and generates static pages during build. It does not use Server-Side Rendering (SSR). We do not need to worry about hydration or client-side data fetching when building for production as that will all be done at build time.
- Import just the type from a package when possible, e.g., `import type { MyType } from 'my-package'`.
- Never use require, always use import.
- Do not suggest to cast variables to 'any' type.
- Avoid using `any`, `unknown`, or `object` types. Use specific types or generics instead.
- Avoid if-else chains, use Record or Map for faster lookups.
- Avoid adding redundant comments for self-documenting code, or comments that state the obvious.
- Use `pMap` for parallel processing of arrays.
