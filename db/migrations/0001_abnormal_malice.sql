ALTER TABLE "basic_info" DROP CONSTRAINT "basic_info_user_email_users_email_fk";
--> statement-breakpoint
ALTER TABLE "basic_info" ALTER COLUMN "user_email" SET DATA TYPE varchar(256);--> statement-breakpoint
ALTER TABLE "basic_info" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "basic_info" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "basic_info" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "basic_info" ALTER COLUMN "updated_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "email" SET DATA TYPE varchar(256);--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "name" SET DATA TYPE varchar(256);--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "basic_info" ADD COLUMN "is_hod" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "basic_info" ADD COLUMN "bio" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "basic_info" ADD CONSTRAINT "basic_info_user_email_users_email_fk" FOREIGN KEY ("user_email") REFERENCES "public"."users"("email") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "basic_info" DROP COLUMN "joining_date";--> statement-breakpoint
ALTER TABLE "basic_info" DROP COLUMN "phone";