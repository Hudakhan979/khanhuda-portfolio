import { Router } from "express";
import { db } from "@workspace/db";
import { experienceTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAuth } from "../lib/auth.js";
import {
  GetExperienceResponse,
  CreateExperienceBody,
  UpdateExperienceBody,
  UpdateExperienceParams,
  DeleteExperienceParams,
} from "@workspace/api-zod";

const router = Router();

router.get("/experience", async (req, res): Promise<void> => {
  const rows = await db.select().from(experienceTable).orderBy(experienceTable.order);
  const mapped = rows.map(r => ({ ...r, responsibilities: r.responsibilities ?? [], techStack: r.techStack ?? [] }));
  res.json(GetExperienceResponse.parse(mapped));
});

router.post("/experience", requireAuth, async (req, res): Promise<void> => {
  const parsed = CreateExperienceBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const [row] = await db.insert(experienceTable).values(parsed.data).returning();
  res.status(201).json({ ...row, responsibilities: row.responsibilities ?? [], techStack: row.techStack ?? [] });
});

router.patch("/experience/:id", requireAuth, async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const paramsParsed = UpdateExperienceParams.safeParse({ id: parseInt(rawId, 10) });
  if (!paramsParsed.success) { res.status(400).json({ error: "Invalid id" }); return; }
  const bodyParsed = UpdateExperienceBody.safeParse(req.body);
  if (!bodyParsed.success) { res.status(400).json({ error: bodyParsed.error.message }); return; }
  const [row] = await db.update(experienceTable).set(bodyParsed.data).where(eq(experienceTable.id, paramsParsed.data.id)).returning();
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json({ ...row, responsibilities: row.responsibilities ?? [], techStack: row.techStack ?? [] });
});

router.delete("/experience/:id", requireAuth, async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const paramsParsed = DeleteExperienceParams.safeParse({ id: parseInt(rawId, 10) });
  if (!paramsParsed.success) { res.status(400).json({ error: "Invalid id" }); return; }
  await db.delete(experienceTable).where(eq(experienceTable.id, paramsParsed.data.id));
  res.status(204).send();
});

export default router;
