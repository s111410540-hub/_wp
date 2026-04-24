import { Hono } from 'hono'
import { logger } from 'hono/logger'

// Type signature to get accurate environment types (D1 binding)
export interface Env {
  Bindings: {
    DB: D1Database
    JWT_SECRET: string
  }
}

const app = new Hono<Env>()

app.use('*', logger())

import auth from './auth'

// Api group
const api = app.basePath('/api')

api.get('/health', (c) => {
  return c.json({ status: 'ok', server: 'Hono + Vite integration' })
})

api.route('/auth', auth)

// Fallback for vite integration dev server to handle index.html appropriately
// In production, we'll serve static assets differently by mapping Cloudflare Pages, 
// but for local unified dev, standard Hono routes handle /api and Vite handles the rest.

export default app
