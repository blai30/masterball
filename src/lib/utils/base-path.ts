function normalizeBasePath(value?: string) {
  if (!value || value === '/') return ''
  return value.endsWith('/') ? value.slice(0, -1) : value
}

export function getBasePath() {
  return normalizeBasePath(import.meta.env.PUBLIC_BASEPATH ?? import.meta.env.BASE_URL)
}

export function withBasePath(path: string) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${getBasePath()}${normalizedPath}`
}
