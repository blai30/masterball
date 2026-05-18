import { useEffect, useRef } from 'react'
import { useDebouncedCallback } from 'use-debounce'

// Configuration for a single URL parameter.
export type ParamConfig = {
  // The query parameter key in the URL
  key: string
  // The default value: when state matches this, the param is omitted from URL
  defaultValue?: unknown
  // Separator for joining arrays (e.g. ',' for type filters)
  join?: string
}

/**
 * Syncs component state to URL query parameters with debouncing.
 *
 * Each component manages its own state (initialized from URL on mount).
 * This hook handles writing state back to the URL.
 *
 * @param getState Function that returns the current state object
 * @param params Mapping of state keys to URL param configuration
 * @param deps Dependency array that triggers the sync effect
 * @param debounceMs Debounce delay in milliseconds (default: 500)
 */
export function useUrlSync(
  getState: () => Record<string, unknown>,
  params: Record<string, ParamConfig>,
  deps: unknown[],
  debounceMs = 500
) {
  const getStateRef = useRef(getState)
  getStateRef.current = getState

  const paramsRef = useRef(params)
  paramsRef.current = params

  const sync = useDebouncedCallback(() => {
    const state = getStateRef.current()
    const urlParams = new URLSearchParams()

    const params = Object.entries(paramsRef.current)
    for (const param of params) {
      const [stateKey, { key: paramKey, defaultValue, join: joinSep }] = param
      const val = state[stateKey]

      if (val === defaultValue) continue

      // Handle arrays
      if (Array.isArray(val)) {
        if (val.length > 0) urlParams.set(paramKey, val.join(joinSep || ','))
        continue
      }

      if (!val) continue

      // Serialize to string
      urlParams.set(paramKey, String(val))
    }

    window.history.replaceState(
      null,
      '',
      urlParams.toString() ? `?${urlParams}` : window.location.pathname
    )
  }, debounceMs)

  useEffect(() => {
    sync()
  }, [sync, ...deps])
}
