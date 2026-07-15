import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const profileTable = pgTable("profile", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().default("Alex Johnson"),
  title: text("title").notNull().default("Full Stack Developer"),
  bio: text("bio").notNull().default(""),
  location: text("location"),
  email: text("email"),
  phone: text("phone"),
  website: text("website"),
  github: text("github"),
  linkedin: text("linkedin"),
  twitter: text("twitter"),
  instagram: text("instagram"),
  youtube: text("youtube"),
  avatarUrl: text("avatar_url"),
  resumeUrl: text("resume_url"),
  yearsOfExperience: integer("years_of_experience").notNull().default(5),
  projectsCompleted: integer("projects_completed").notNull().default(50),
  happyClients: integer("happy_clients").notNull().default(30),
  openSourceContributions: integer("open_source_contributions").notNull().default(200),
  tagline: text("tagline"),
  availableForWork: boolean("available_for_work").notNull().default(true),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertProfileSchema = createInsertSchema(profileTable).omit({ id: true, updatedAt: true });
export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type Profile = typeof profileTable.$inferSelect;
