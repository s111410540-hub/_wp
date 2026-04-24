import { Hono } from 'hono'
import { verify } from 'hono/jwt'
import { eq } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/d1'
import { players, items, inventory } from '../database/schema'
import { Env } from './index'

const gameInfo = new Hono<Env>()

// Middleware to protect routes that require authentication
gameInfo.use('*', async (c, next) => {
  const authHeader = c.req.header('Authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401)
  }
  const token = authHeader.split(' ')[1]
  const jwtSecret = c.env.JWT_SECRET || 'super-secret-mushoku-key'
  try {
    const payload = await verify(token, jwtSecret)
    c.set('jwtPayload', payload)
    await next()
  } catch (e) {
    return c.json({ error: 'Unauthorized' }, 401)
  }
})

// GET Player Stats
gameInfo.get('/player', async (c) => {
  const payload = c.get('jwtPayload')
  const db = drizzle(c.env.DB)
  const player = await db.select().from(players).where(eq(players.id, payload.id)).get()
  
  if (!player) return c.json({ error: 'Player not found' }, 404)
    
  return c.json({ player })
})

gameInfo.get('/inventory', async (c) => {
  const payload = c.get('jwtPayload')
  const db = drizzle(c.env.DB)
  
  const userItems = await db.select({
    id: inventory.id,
    itemId: inventory.itemId,
    quantity: inventory.quantity,
    name: items.name,
    type: items.type,
    description: items.description,
    power: items.power
  })
    .from(inventory)
    .innerJoin(items, eq(inventory.itemId, items.id))
    .where(eq(inventory.playerId, payload.id))
    .all()
    
  return c.json({ items: userItems })
})

export default gameInfo
