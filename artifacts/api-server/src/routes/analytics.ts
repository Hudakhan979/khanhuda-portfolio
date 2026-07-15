import { Router } from "express";
import { db } from "@workspace/db";
import {
  projectsTable,
  skillsTable,
  messagesTable,
  experienceTable,
  certificatesTable,
  testimonialsTable,
  achievementsTable,
} from "@workspace/db";
import { eq, count, sql } from "drizzle-orm";
import { requireAuth } from "../lib/auth.js";

const router = Router();

router.get("/analytics", requireAuth, async (req, res): Promise<void> => {
  const [
    [{ total: totalProjects }],
    [{ total: featuredProjects }],
    [{ total: totalSkills }],
    [{ total: totalMessages }],
    [{ total: unreadMessages }],
    [{ total: totalExperience }],
    [{ total: totalCertificates }],
    [{ total: totalTestimonials }],
    [{ total: totalAchievements }],
    recentMessages,
  ] = await Promise.all([
    db.select({ total: count() }).from(projectsTable),
    db.select({ total: count() }).from(projectsTable).where(eq(projectsTable.featured, true)),
    db.select({ total: count() }).from(skillsTable),
    db.select({ total: count() }).from(messagesTable),
    db.select({ total: count() }).from(messagesTable).where(eq(messagesTable.read, false)),
    db.select({ total: count() }).from(experienceTable),
    db.select({ total: count() }).from(certificatesTable),
    db.select({ total: count() }).from(testimonialsTable),
    db.select({ total: count() }).from(achievementsTable),
    db.select().from(messagesTable).orderBy(sql`${messagesTable.createdAt} desc`).limit(5),
  ]);

  res.json({
    totalProjects,
    featuredProjects,
    totalSkills,
    totalMessages,
    unreadMessages,
    totalExperience,
    totalCertificates,
    totalTestimonials,
    totalAchievements,
    recentMessages: recentMessages.map(m => ({
      ...m,
      createdAt: m.createdAt.toISOString(),
      phone: m.phone ?? null,
      budget: m.budget ?? null,
      projectType: m.projectType ?? null,
    })),
  });
});

export default router;
