import { Router } from "express";
import { db } from "@workspace/db";
import { profileTable } from "@workspace/db";
import { requireAuth } from "../lib/auth.js";
import { UpdateProfileBody } from "@workspace/api-zod";

const router = Router();

router.get("/profile", async (req, res): Promise<void> => {
  let [profile] = await db.select().from(profileTable).limit(1);
  if (!profile) {
    const [created] = await db.insert(profileTable).values({ name: "Alex Johnson", title: "Full Stack Developer", bio: "Passionate developer building exceptional digital experiences." }).returning();
    profile = created;
  }
  res.json(profile);
});

router.patch("/profile", requireAuth, async (req, res): Promise<void> => {
  const parsed = UpdateProfileBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  let [existing] = await db.select().from(profileTable).limit(1);
  if (!existing) {
    const [created] = await db.insert(profileTable).values({ name: "Alex Johnson", title: "Full Stack Developer", bio: "" }).returning();
    existing = created;
  }
  const [updated] = await db.update(profileTable).set(parsed.data).where(
    (await import("drizzle-orm")).eq(profileTable.id, existing.id)
  ).returning();
  res.json(updated);
});

export default router;
