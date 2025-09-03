CREATE TABLE "auth_accounts" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "auth_sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "auth_sessions_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "auth_users" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean NOT NULL,
	"image" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "auth_users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "auth_verifications" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "events" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "events_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar NOT NULL,
	"dates" varchar,
	"location" varchar,
	"description" varchar,
	"event_type" varchar,
	"target_audience" varchar,
	"image" varchar
);
--> statement-breakpoint
CREATE TABLE "founders" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "Founder_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar NOT NULL,
	"startup_id" integer
);
--> statement-breakpoint
CREATE TABLE "investors" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "Investor_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar NOT NULL,
	"legal_status" varchar,
	"address" varchar,
	"email" varchar NOT NULL,
	"phone" varchar,
	"created_at" varchar,
	"description" varchar,
	"investor_type" varchar,
	"investment_focus" varchar,
	"image" varchar,
	CONSTRAINT "Investor_email_key" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "news" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "News_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"news_date" varchar,
	"location" varchar,
	"title" varchar NOT NULL,
	"category" varchar,
	"startup_id" integer,
	"description" varchar NOT NULL,
	"image" varchar
);
--> statement-breakpoint
CREATE TABLE "partners" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "Partener_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar NOT NULL,
	"legal_status" varchar,
	"address" varchar,
	"email" varchar NOT NULL,
	"phone" varchar,
	"created_at" varchar,
	"description" varchar,
	"partnership_type" varchar,
	CONSTRAINT "Partener_email_key" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "startups" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "Startup_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar NOT NULL,
	"legal_status" varchar,
	"address" varchar,
	"email" varchar NOT NULL,
	"phone" varchar,
	"created_at" varchar,
	"description" varchar,
	"website_url" varchar,
	"social_media_url" varchar,
	"project_status" varchar,
	"needs" varchar,
	"sector" varchar,
	"maturity" varchar,
	"founders" jsonb,
	CONSTRAINT "Startup_name_key" UNIQUE("name"),
	CONSTRAINT "Startup_email_key" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "User_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"email" varchar NOT NULL,
	"name" varchar NOT NULL,
	"role" varchar NOT NULL,
	"founder_id" integer,
	"investor_id" integer,
	"image" varchar,
	CONSTRAINT "User_email_key" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "auth_accounts" ADD CONSTRAINT "auth_accounts_user_id_auth_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."auth_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "auth_sessions" ADD CONSTRAINT "auth_sessions_user_id_auth_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."auth_users"("id") ON DELETE cascade ON UPDATE no action;