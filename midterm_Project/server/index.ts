/// <reference types="@cloudflare/workers-types" />
import { Hono } from 'hono'
import { logger } from 'hono/logger'
import auth from './auth'
import gameInfo from './game'

// Type signature to get accurate environment types (D1 binding)
export interface Env {
  Bindings: {
    DB: D1Database
    JWT_SECRET: string
  }
}

const app = new Hono<Env>()

app.use('*', logger())

// Api group
const api = app.basePath('/api')

api.get('/health', (c) => {
  return c.json({ status: 'ok', server: 'Hono + Vite integration' })
})

api.route('/auth', auth)
api.route('/game', gameInfo)
// Fallback for vite integration dev server to handle index.html appropriately
// In production, we'll serve static assets differently by mapping Cloudflare Pages, 
// but for local unified dev, standard Hono routes handle /api and Vite handles the rest.

export default app
