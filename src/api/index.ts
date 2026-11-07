import type { ApiClient } from './client'
import { httpApi } from './httpApi'
import { mockApi } from './mockApi'

export const isMockMode = import.meta.env.VITE_USE_MOCK !== 'false'

/**
 * Mock is the default so the demo runs offline with zero setup.
 * Set VITE_USE_MOCK=false (and VITE_API_URL) to hit FastAPI.
 */
export const api: ApiClient = isMockMode ? mockApi : httpApi

export type { ApiClient }
