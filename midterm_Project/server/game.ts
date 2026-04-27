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
    const payload = await verify(token, jwtSecret, 'HS256') as { id: number, username: string }
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

// Process Story Choice
gameInfo.post('/apply-choice', async (c) => {
  const payload = c.get('jwtPayload')
  const db = drizzle(c.env.DB)
  const { hpDiff, mpDiff, magicDiff, swordDiff } = await c.req.json()

  const player = await db.select().from(players).where(eq(players.id, payload.id)).get()
  if (!player) return c.json({ error: 'Player not found' }, 404)

  // Safely parse current stats, handling cases where Drizzle might return weird mapped values or missing columns
  const currentHp = typeof player.hp === 'number' ? player.hp : parseInt(player.hp as any) || 100;
  const currentMp = typeof player.mp === 'number' ? player.mp : parseInt(player.mp as any) || 50;
  const currentMagic = typeof player.magicSkill === 'number' ? player.magicSkill : parseInt((player as any).magic_skill) || 0;
  const currentSword = typeof player.swordSkill === 'number' ? player.swordSkill : parseInt((player as any).sword_skill) || 0;

  // Calculate new stats
  let newHp = currentHp + (Number(hpDiff) || 0);
  let newMp = currentMp + (Number(mpDiff) || 0);
  let newMagic = currentMagic + (Number(magicDiff) || 0);
  let newSword = currentSword + (Number(swordDiff) || 0);
  let isDead = false;

  // Apply Limits
  if (newHp > player.maxHp) newHp = player.maxHp;
  if (newMp > player.maxMp) newMp = player.maxMp;
  if (newMp < 0) newMp = 0;
  
  if (newHp <= 0) {
    isDead = true;
    newHp = player.maxHp; // Return from death full HP
    newMp = player.maxMp; // Return from death full MP
  }

  // Update Database
  await db.update(players).set({
    hp: newHp,
    mp: newMp,
    magicSkill: newMagic,
    swordSkill: newSword
  }).where(eq(players.id, payload.id));

  const updatedPlayer = await db.select().from(players).where(eq(players.id, payload.id)).get();

  return c.json({ 
    player: updatedPlayer,
    event: isDead ? 'died' : 'survived'
  })
})

export default gameInfo
