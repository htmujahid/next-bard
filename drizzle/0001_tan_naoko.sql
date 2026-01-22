ALTER TABLE "organization_role" ALTER COLUMN "updated_at" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "organization_role" ALTER COLUMN "updated_at" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "organization_role" ADD COLUMN "role" text NOT NULL;--> statement-breakpoint
ALTER TABLE "organization_role" ADD COLUMN "permission" text NOT NULL;--> statement-breakpoint
CREATE INDEX "organizationRole_role_idx" ON "organization_role" USING btree ("role");--> statement-breakpoint
ALTER TABLE "organization_role" DROP COLUMN "name";--> statement-breakpoint
ALTER TABLE "organization_role" DROP COLUMN "permissions";