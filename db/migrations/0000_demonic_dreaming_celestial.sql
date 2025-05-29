CREATE TABLE "administrative_roles" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_email" varchar(255) NOT NULL,
	"academic_year" varchar(9) NOT NULL,
	"role_title" varchar(100) NOT NULL,
	"hours_spent" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE "awards" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_email" varchar(255) NOT NULL,
	"entry_type" varchar(50) NOT NULL,
	"title" varchar(255) NOT NULL,
	"date" date NOT NULL,
	"level" varchar(50) NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE "basic_info" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_email" varchar(255) NOT NULL,
	"department" varchar(100) NOT NULL,
	"designation" varchar(100) NOT NULL,
	"joining_date" date NOT NULL,
	"phone" varchar(20) NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE "certifications" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_email" varchar(255) NOT NULL,
	"cert_title" varchar(255) NOT NULL,
	"domain" varchar(100) NOT NULL,
	"issuing_organization" varchar(255) NOT NULL,
	"cert_type" varchar(50) NOT NULL,
	"date_issued" date NOT NULL,
	"duration_hours" integer NOT NULL,
	"cert_img" text NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE "co_curricular_activities" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_email" varchar(255) NOT NULL,
	"academic_year" varchar(9) NOT NULL,
	"activity_type" varchar(50) NOT NULL,
	"hours_spent" integer DEFAULT 0 NOT NULL,
	"level" varchar(50) NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE "exam_duties" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_email" varchar(255) NOT NULL,
	"academic_year" varchar(9) NOT NULL,
	"duty_type" varchar(50) NOT NULL,
	"duty_date" date NOT NULL,
	"hours_spent" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE "professional_development" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_email" varchar(255) NOT NULL,
	"academic_year" varchar(9) NOT NULL,
	"event_type" varchar(50) NOT NULL,
	"event_title" text NOT NULL,
	"duration_days" integer NOT NULL,
	"date_from" date NOT NULL,
	"date_to" date NOT NULL,
	"organized_by" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_email" varchar(255) NOT NULL,
	"project_title" text NOT NULL,
	"funding_agency" varchar(255) NOT NULL,
	"amount_funded" numeric(12, 2) NOT NULL,
	"project_type" varchar(50) NOT NULL,
	"date_started" date NOT NULL,
	"date_completed" date,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE "research_guidance" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_email" varchar(255) NOT NULL,
	"scholar_name" varchar(255) NOT NULL,
	"degree" varchar(50) NOT NULL,
	"status" varchar(50) NOT NULL,
	"year" integer NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE "research_publications" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_email" varchar(255) NOT NULL,
	"title" text NOT NULL,
	"publication_type" varchar(50) NOT NULL,
	"journal_name" varchar(255) NOT NULL,
	"issn_isbn" varchar(20),
	"impact_factor" numeric(4, 2),
	"date_published" date NOT NULL,
	"level" varchar(50) NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE "teaching_activities" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_email" varchar(255) NOT NULL,
	"academic_year" varchar(9) NOT NULL,
	"subject_name" varchar(255) NOT NULL,
	"lecture_hours" integer DEFAULT 0 NOT NULL,
	"tutorial_hours" integer DEFAULT 0 NOT NULL,
	"practical_hours" integer DEFAULT 0 NOT NULL,
	"extra_hours" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE "teaching_innovations" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_email" varchar(255) NOT NULL,
	"academic_year" varchar(9) NOT NULL,
	"description" text NOT NULL,
	"hours_spent" integer DEFAULT 0 NOT NULL,
	"tool_used" varchar(100) NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "administrative_roles" ADD CONSTRAINT "administrative_roles_user_email_users_email_fk" FOREIGN KEY ("user_email") REFERENCES "public"."users"("email") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "awards" ADD CONSTRAINT "awards_user_email_users_email_fk" FOREIGN KEY ("user_email") REFERENCES "public"."users"("email") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "basic_info" ADD CONSTRAINT "basic_info_user_email_users_email_fk" FOREIGN KEY ("user_email") REFERENCES "public"."users"("email") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "certifications" ADD CONSTRAINT "certifications_user_email_users_email_fk" FOREIGN KEY ("user_email") REFERENCES "public"."users"("email") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "co_curricular_activities" ADD CONSTRAINT "co_curricular_activities_user_email_users_email_fk" FOREIGN KEY ("user_email") REFERENCES "public"."users"("email") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exam_duties" ADD CONSTRAINT "exam_duties_user_email_users_email_fk" FOREIGN KEY ("user_email") REFERENCES "public"."users"("email") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "professional_development" ADD CONSTRAINT "professional_development_user_email_users_email_fk" FOREIGN KEY ("user_email") REFERENCES "public"."users"("email") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_user_email_users_email_fk" FOREIGN KEY ("user_email") REFERENCES "public"."users"("email") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "research_guidance" ADD CONSTRAINT "research_guidance_user_email_users_email_fk" FOREIGN KEY ("user_email") REFERENCES "public"."users"("email") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "research_publications" ADD CONSTRAINT "research_publications_user_email_users_email_fk" FOREIGN KEY ("user_email") REFERENCES "public"."users"("email") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teaching_activities" ADD CONSTRAINT "teaching_activities_user_email_users_email_fk" FOREIGN KEY ("user_email") REFERENCES "public"."users"("email") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teaching_innovations" ADD CONSTRAINT "teaching_innovations_user_email_users_email_fk" FOREIGN KEY ("user_email") REFERENCES "public"."users"("email") ON DELETE cascade ON UPDATE no action;