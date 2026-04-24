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

auth.post('/register', async (c) => {
  const { username, password } = await c.req.json()
  const db = drizzle(c.env.DB)

  // Use a fallback JWT secret if not provided in env for local dev
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
