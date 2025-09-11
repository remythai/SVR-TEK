import { pgTable, text, timestamp, boolean, unique, integer, varchar, jsonb } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity({ 
    name: "User_id_seq", 
    startWith: 1, 
    increment: 1, 
    minValue: 1, 
    maxValue: 2147483647 
  }),
  email: varchar().notNull(),
  name: varchar().notNull(),
  role: varchar().notNull(),
  founderId: integer("founder_id"),
  investorId: integer("investor_id"),
  image: varchar(),
}, (table) => [
  unique("User_email_key").on(table.email),
]);

export const startups = pgTable("startups", {
  id: integer().primaryKey().generatedAlwaysAsIdentity({ 
    name: "Startup_id_seq", 
    startWith: 1, 
    increment: 1, 
    minValue: 1, 
    maxValue: 2147483647 
  }),
  name: varchar().notNull(),
  legalStatus: varchar("legal_status"),
  address: varchar(),
  email: varchar().notNull(),
  phone: varchar(),
  createdAt: varchar("created_at"),
  description: varchar(),
  websiteUrl: varchar("website_url"),
  socialMediaUrl: varchar("social_media_url"),
  projectStatus: varchar("project_status"),
  needs: varchar(),
  sector: varchar(),
  maturity: varchar(),
  founders: jsonb(),
}, (table) => [
  unique("Startup_name_key").on(table.name),
  unique("Startup_email_key").on(table.email),
]);

export const events = pgTable("events", {
  id: integer().primaryKey().generatedAlwaysAsIdentity({ 
    name: "events_id_seq", 
    startWith: 1, 
    increment: 1, 
    minValue: 1, 
    maxValue: 2147483647, 
    cache: 1 
  }),
  name: varchar().notNull(),
  dates: varchar(),
  location: varchar(),
  description: varchar(),
  eventType: varchar("event_type"),
  targetAudience: varchar("target_audience"),
  image: varchar(),
});

export const investors = pgTable("investors", {
  id: integer().primaryKey().generatedAlwaysAsIdentity({ 
    name: "Investor_id_seq", 
    startWith: 1, 
    increment: 1, 
    minValue: 1, 
    maxValue: 2147483647 
  }),
  name: varchar().notNull(),
  legalStatus: varchar("legal_status"),
  address: varchar(),
  email: varchar().notNull(),
  phone: varchar(),
  createdAt: varchar("created_at"),
  description: varchar(),
  investorType: varchar("investor_type"),
  investmentFocus: varchar("investment_focus"),
  image: varchar(),
}, (table) => [
  unique("Investor_email_key").on(table.email),
]);

export const partners = pgTable("partners", {
  id: integer().primaryKey().generatedAlwaysAsIdentity({ 
    name: "Partener_id_seq", 
    startWith: 1, 
    increment: 1, 
    minValue: 1, 
    maxValue: 2147483647 
  }),
  name: varchar().notNull(),
  legalStatus: varchar("legal_status"),
  address: varchar(),
  email: varchar().notNull(),
  phone: varchar(),
  createdAt: varchar("created_at"),
  description: varchar(),
  partnershipType: varchar("partnership_type"),
}, (table) => [
  unique("Partener_email_key").on(table.email),
]);

export const news = pgTable("news", {
  id: integer().primaryKey().generatedAlwaysAsIdentity({ 
    name: "News_id_seq", 
    startWith: 1, 
    increment: 1, 
    minValue: 1, 
    maxValue: 2147483647 
  }),
  newsDate: varchar("news_date"),
  location: varchar(),
  title: varchar().notNull(),
  category: varchar(),
  startupId: integer("startup_id"),
  description: varchar().notNull(),
  image: varchar(),
});

export const founders = pgTable("founders", {
  id: integer().primaryKey().generatedAlwaysAsIdentity({ 
    name: "Founder_id_seq", 
    startWith: 1, 
    increment: 1, 
    minValue: 1, 
    maxValue: 2147483647 
  }),
  name: varchar().notNull(),
  startupId: integer("startup_id"),
});

export const authUsers = pgTable("auth_users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified")
    .$defaultFn(() => false)
    .notNull(),
  image: text("image"),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

export const authSessions = pgTable("auth_sessions", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => authUsers.id, { onDelete: "cascade" }),
});

export const authAccounts = pgTable("auth_accounts", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => authUsers.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const authVerifications = pgTable("auth_verifications", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").$defaultFn(
    () => new Date(),
  ),
  updatedAt: timestamp("updated_at").$defaultFn(
    () => new Date(),
  ),
});