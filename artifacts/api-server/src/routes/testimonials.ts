import { Router } from "express";
import { db } from "@workspace/db";
import { testimonialsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAuth } from "../lib/auth.js";
import {
  GetTestimonialsResponse,
  CreateTestimonialBody,
  UpdateTestimonialBody,
  UpdateTestimonialParams,
  DeleteTestimonialParams,
} from "@workspace/api-zod";

const router = Router();

router.get("/testimonials", async (req, res): Promise<void> => {
  const rows = await db.select().from(testimonialsTable);
  res.json(GetTestimonialsResponse.parse(rows));
});

router.post("/testimonials", requireAuth, async (req, res): Promise<void> => {
  const parsed = CreateTestimonialBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const [row] = await db.insert(testimonialsTable).values(parsed.data).returning();
  res.status(201).json(row);
});

router.patch("/testimonials/:id", requireAuth, async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const paramsParsed = UpdateTestimonialParams.safeParse({ id: parseInt(rawId, 10) });
  if (!paramsParsed.success) { res.status(400).json({ error: "Invalid id" }); return; }
  const bodyParsed = UpdateTestimonialBody.safeParse(req.body);
  if (!bodyParsed.success) { res.status(400).json({ error: bodyParsed.error.message }); return; }
  const [row] = await db.update(testimonialsTable).set(bodyParsed.data).where(eq(testimonialsTable.id, paramsParsed.data.id)).returning();
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json(row);
});

router.delete("/testimonials/:id", requireAuth, async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const paramsParsed = DeleteTestimonialParams.safeParse({ id: parseInt(rawId, 10) });
  if (!paramsParsed.success) { res.status(400).json({ error: "Invalid id" }); return; }
  await db.delete(testimonialsTable).where(eq(testimonialsTable.id, paramsParsed.data.id));
  res.status(204).send();
});

export default router;
