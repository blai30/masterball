// Centralized path helpers keep internal routes and asset URLs working
// both at the site root in development and under the production subpath.

const { BASE_URL } = import.meta.env

export const toHref = (path: string) => path.replace(/^\/+/, '')

export const normalizePathname = (pathname: string) => {
  if (BASE_URL === '/') return pathname
  if (pathname === BASE_URL.slice(0, -1)) return '/'
  if (!pathname.startsWith(BASE_URL)) return pathname

  const normalizedPathname = pathname.slice(BASE_URL.length - 1)
  return normalizedPathname.startsWith('/') ? normalizedPathname : `/${normalizedPathname}`
}

export const resolvePath = (path: string) => {
  const relativePath = toHref(path)
  return typeof document === 'undefined'
    ? relativePath
    : new URL(relativePath, document.baseURI).pathname
}
