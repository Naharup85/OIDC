import type { usersTable } from "../db/schema.js";
import type { InferSelectModel } from "drizzle-orm";

declare global {
  namespace Express {
    interface Request {
      user?: InferSelectModel<typeof usersTable>;
    }
  }
}
