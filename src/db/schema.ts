import { integer, pgTable, varchar, timestamp ,boolean} from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  firstName: varchar('first_name', { length: 255 }).notNull(),
  lastName: varchar('last_name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').$onUpdate(() => new Date()),
  isActive: boolean('is_active').notNull().default(true),
  refreshToken: varchar('refresh_token', { length: 255 }),
  resetToken: varchar('reset_token', { length: 255 }),
  resetTokenExpiresAt: timestamp('reset_token_expires_at'),
});
