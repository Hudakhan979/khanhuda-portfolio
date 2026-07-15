import { Router } from "express";
import { db } from "@workspace/db";
import { skillsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAuth } from "../lib/auth.js";
import {
  GetSkillsResponse,
  CreateSkillBody,
  UpdateSkillBody,
  UpdateSkillParams,
  DeleteSkillParams,
} from "@workspace/api-zod";

const router = Router();

router.get("/skills", async (req, res): Promise<void> => {
  const skills = await db.select().from(skillsTable).orderBy(skillsTable.order);
  res.json(GetSkillsResponse.parse(skills));
});

router.post("/skills", requireAuth, async (req, res): Promise<void> => {
  const parsed = CreateSkillBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const [skill] = await db.insert(skillsTable).values(parsed.data).returning();
  res.status(201).json(skill);
});

router.patch("/skills/:id", requireAuth, async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const paramsParsed = UpdateSkillParams.safeParse({ id: parseInt(rawId, 10) });
  if (!paramsParsed.success) { res.status(400).json({ error: "Invalid id" }); return; }
  const bodyParsed = UpdateSkillBody.safeParse(req.body);
  if (!bodyParsed.success) { res.status(400).json({ error: bodyParsed.error.message }); return; }
  const [skill] = await db.update(skillsTable).set(bodyParsed.data).where(eq(skillsTable.id, paramsParsed.data.id)).returning();
  if (!skill) { res.status(404).json({ error: "Not found" }); return; }
  res.json(skill);
});

router.delete("/skills/:id", requireAuth, async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const paramsParsed = DeleteSkillParams.safeParse({ id: parseInt(rawId, 10) });
  if (!paramsParsed.success) { res.status(400).json({ error: "Invalid id" }); return; }
  await db.delete(skillsTable).where(eq(skillsTable.id, paramsParsed.data.id));
  res.status(204).send();
});

export default router;
