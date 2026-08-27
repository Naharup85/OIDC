import { uuid,pgTable, varchar, timestamp ,boolean} from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: uuid('id').primaryKey().defaultRandom(),
  firstName: varchar('first_name', { length: 255 }).notNull(),
  lastName: varchar('last_name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').$onUpdate(() => new Date()),
  isActive: boolean('is_active').notNull().default(true),
  refreshToken: varchar('refresh_token', { length: 255 }),
  resetToken: varchar('reset_token', { length: 255 }),
  resetTokenExpiryAt: timestamp('reset_token_expires_at'),
});


export const clientsTable = pgTable("clients", {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 255 }).notNull(),
    secret:varchar('secret',{length:255}).notNull(),
    ownerId: uuid('owner_id').notNull().references(()=>usersTable.id),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').$onUpdate(() => new Date()),
});

export const authorizationCodesTable=pgTable("authorization_codes",{
    id:uuid('id').primaryKey().defaultRandom(),
    code:varchar('code',{length:255}).notNull(),
    codeExpiry:timestamp('code_expiry'),
    userId: uuid('user_id').notNull().references(() => usersTable.id),
})