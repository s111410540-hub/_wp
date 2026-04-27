import { Hono } from 'hono'
import { jwt, sign } from 'hono/jwt'
import { eq } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/d1'
import { players } from '../database/schema'
import { Env } from './index'

const auth = new Hono<Env>()

// Helper to hash password using Web Crypto API
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hash = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

// Helper to ensure tables exist
async function ensureTables(db: any) {
  await db.prepare(`CREATE TABLE IF NOT EXISTS players (id integer PRIMARY KEY AUTOINCREMENT NOT NULL, username text NOT NULL, password_hash text NOT NULL, hp integer DEFAULT 100 NOT NULL, max_hp integer DEFAULT 100 NOT NULL, mp integer DEFAULT 50 NOT NULL, max_mp integer DEFAULT 50 NOT NULL, location text DEFAULT 'roanoa' NOT NULL, gold integer DEFAULT 100 NOT NULL, level integer DEFAULT 1 NOT NULL, experience integer DEFAULT 0 NOT NULL)`).run();
  await db.prepare(`CREATE TABLE IF NOT EXISTS items (id integer PRIMARY KEY AUTOINCREMENT NOT NULL, name text NOT NULL, type text NOT NULL, description text NOT NULL, price integer NOT NULL, power integer DEFAULT 0 NOT NULL)`).run();
  await db.prepare(`CREATE TABLE IF NOT EXISTS inventory (id integer PRIMARY KEY AUTOINCREMENT NOT NULL, player_id integer NOT NULL, item_id integer NOT NULL, quantity integer DEFAULT 1 NOT NULL)`).run();
}

auth.post('/register', async (c) => {
  const { username, password } = await c.req.json()
  
  // Ensure tables exist before doing anything
  await ensureTables(c.env.DB);
  
  const db = drizzle(c.env.DB)
  const jwtSecret = c.env.JWT_SECRET || 'super-secret-mushoku-key'

  const existing = await db.select().from(players).where(eq(players.username, username)).get()
  
  if (existing) {
    return c.json({ error: 'Username already exists' }, 400)
  }

  const passwordHash = await hashPassword(password)
  
  const result = await db.insert(players).values({
    username,
    passwordHash,
    location: 'roanoa',
    hp: 100, maxHp: 100, mp: 50, maxMp: 50,
    gold: 100, level: 1, experience: 0
  }).returning().get()

  const token = await sign({ id: result.id, username, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 }, jwtSecret)

  return c.json({ token, player: { id: result.id, username: result.username } })
})

auth.post('/login', async (c) => {
  const { username, password } = await c.req.json()
  
  // Ensure tables exist
  await ensureTables(c.env.DB);
  
  const db = drizzle(c.env.DB)
  const jwtSecret = c.env.JWT_SECRET || 'super-secret-mushoku-key'

  const player = await db.select().from(players).where(eq(players.username, username)).get()
  
  if (!player) {
    return c.json({ error: 'Invalid credentials' }, 401)
  }

  const hash = await hashPassword(password)
  if (player.passwordHash !== hash) {
    return c.json({ error: 'Invalid credentials' }, 401)
  }

  const token = await sign({ id: player.id, username, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 }, jwtSecret)

  return c.json({ token, player: { id: player.id, username: player.username } })
})

export default auth
