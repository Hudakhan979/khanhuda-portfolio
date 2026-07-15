import { pgTable, text, serial, integer, boolean, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const experienceTable = pgTable("experience", {
  id: serial("id").primaryKey(),
  company: text("company").notNull(),
  role: text("role").notNull(),
  description: text("description"),
  responsibilities: text("responsibilities").array().notNull().default([]),
  startDate: date("start_date", { mode: "string" }).notNull(),
  endDate: date("end_date", { mode: "string" }),
  current: boolean("current").notNull().default(false),
  companyLogo: text("company_logo"),
  companyUrl: text("company_url"),
  location: text("location"),
  techStack: text("tech_stack").array().notNull().default([]),
  order: integer("order").notNull().default(0),
});

export const insertExperienceSchema = createInsertSchema(experienceTable).omit({ id: true });
export type InsertExperience = z.infer<typeof insertExperienceSchema>;
export type Experience = typeof experienceTable.$inferSelect;
