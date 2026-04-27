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
    ASSETS: Fetcher
  },
  Variables: {
    jwtPayload: {
      id: number
      username: string
    }
  }
}

const app = new Hono<Env>()

app.use('*', logger())

// Global Error Handler to see the real error in frontend
app.onError((err, c) => {
  console.error(`${err}`)
  return c.json({ 
    error: err.message, 
    stack: err.stack,
    cause: 'Internal Server Error' 
  }, 500)
})

// Api group
const api = app.basePath('/api')

api.get('/health', (c) => {
  return c.json({ status: 'ok', server: 'Hono + Vite integration' })
})

// Helper to ensure v2 tables exist
async function ensureTables(db: any) {
  await db.prepare(`CREATE TABLE IF NOT EXISTS players_v2 (id integer PRIMARY KEY AUTOINCREMENT NOT NULL, username text NOT NULL UNIQUE, password_hash text NOT NULL, hp integer DEFAULT 100 NOT NULL, max_hp integer DEFAULT 100 NOT NULL, mp integer DEFAULT 50 NOT NULL, max_mp integer DEFAULT 50 NOT NULL, magic_skill integer DEFAULT 0 NOT NULL, sword_skill integer DEFAULT 0 NOT NULL, location text DEFAULT 'roanoa' NOT NULL, gold integer DEFAULT 100 NOT NULL, level integer DEFAULT 1 NOT NULL, experience integer DEFAULT 0 NOT NULL)`).run();
  await db.prepare(`CREATE TABLE IF NOT EXISTS items_v2 (id integer PRIMARY KEY AUTOINCREMENT NOT NULL, name text NOT NULL, type text NOT NULL, description text NOT NULL, price integer NOT NULL, power integer DEFAULT 0 NOT NULL)`).run();
  await db.prepare(`CREATE TABLE IF NOT EXISTS inventory_v2 (id integer PRIMARY KEY AUTOINCREMENT NOT NULL, player_id integer NOT NULL, item_id integer NOT NULL, quantity integer DEFAULT 1 NOT NULL)`).run();
}

// Database Diagnostics
api.get('/debug-db', async (c) => {
  try {
    await ensureTables(c.env.DB);
    return c.json({ 
      success: true, 
      message: "Database v2 verified successfully!"
    });
  } catch (err: any) {
    return c.json({ success: false, error: err.message });
  }
})

api.route('/auth', auth)
api.route('/game', gameInfo)

// Handle static assets in Cloudflare Pages
app.get('*', async (c) => {
  if (c.env.ASSETS) {
    return await c.env.ASSETS.fetch(c.req.raw)
  }
  return c.notFound()
})

export default app
