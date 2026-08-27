CREATE TABLE "authorization_codes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"code" varchar(255) NOT NULL,
	"code_expiry" timestamp,
	"user_id" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "code_hash";--> statement-breakpoint
ALTER TABLE "authorization_codes" ADD CONSTRAINT "authorization_codes_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id");