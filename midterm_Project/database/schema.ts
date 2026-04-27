import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const players = sqliteTable('players_v2', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  username: text('username').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  hp: integer('hp').notNull().default(100),
  maxHp: integer('max_hp').notNull().default(100),
  mp: integer('mp').notNull().default(50),
  maxMp: integer('max_mp').notNull().default(50),
  magicSkill: integer('magic_skill').notNull().default(0),
  swordSkill: integer('sword_skill').notNull().default(0),
  location: text('location').notNull().default('roanoa'), // Default starting city
  gold: integer('gold').notNull().default(100),
  level: integer('level').notNull().default(1),
  experience: integer('experience').notNull().default(0),
});

export const items = sqliteTable('items_v2', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  type: text('type').notNull(), // 'weapon', 'potion', 'armor'
  description: text('description').notNull(),
  price: integer('price').notNull(),
  power: integer('power').notNull().default(0), // Damage for weapons, heal amount for potions
});

export const inventory = sqliteTable('inventory_v2', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  playerId: integer('player_id')
    .notNull()
    .references(() => players.id),
  itemId: integer('item_id')
    .notNull()
    .references(() => items.id),
  quantity: integer('quantity').notNull().default(1),
});
