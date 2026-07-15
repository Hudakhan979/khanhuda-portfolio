import { Router } from "express";
import { db } from "@workspace/db";
import { achievementsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAuth } from "../lib/auth.js";
import {
  GetAchievementsResponse,
  CreateAchievementBody,
  UpdateAchievementBody,
  UpdateAchievementParams,
  DeleteAchievementParams,
} from "@workspace/api-zod";

const router = Router();

router.get("/achievements", async (req, res): Promise<void> => {
  const rows = await db.select().from(achievementsTable).orderBy(achievementsTable.order);
  res.json(GetAchievementsResponse.parse(rows));
});

router.post("/achievements", requireAuth, async (req, res): Promise<void> => {
  const parsed = CreateAchievementBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const [row] = await db.insert(achievementsTable).values(parsed.data).returning();
  res.status(201).json(row);
});

router.patch("/achievements/:id", requireAuth, async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const paramsParsed = UpdateAchievementParams.safeParse({ id: parseInt(rawId, 10) });
  if (!paramsParsed.success) { res.status(400).json({ error: "Invalid id" }); return; }
  const bodyParsed = UpdateAchievementBody.safeParse(req.body);
  if (!bodyParsed.success) { res.status(400).json({ error: bodyParsed.error.message }); return; }
  const [row] = await db.update(achievementsTable).set(bodyParsed.data).where(eq(achievementsTable.id, paramsParsed.data.id)).returning();
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json(row);
});

router.delete("/achievements/:id", requireAuth, async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const paramsParsed = DeleteAchievementParams.safeParse({ id: parseInt(rawId, 10) });
  if (!paramsParsed.success) { res.status(400).json({ error: "Invalid id" }); return; }
  await db.delete(achievementsTable).where(eq(achievementsTable.id, paramsParsed.data.id));
  res.status(204).send();
});

export default router;
