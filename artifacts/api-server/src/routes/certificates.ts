import { Router } from "express";
import { db } from "@workspace/db";
import { certificatesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAuth } from "../lib/auth.js";
import {
  GetCertificatesResponse,
  CreateCertificateBody,
  UpdateCertificateBody,
  UpdateCertificateParams,
  DeleteCertificateParams,
} from "@workspace/api-zod";

const router = Router();

router.get("/certificates", async (req, res): Promise<void> => {
  const rows = await db.select().from(certificatesTable);
  const mapped = rows.map(r => ({ ...r, skills: r.skills ?? [] }));
  res.json(GetCertificatesResponse.parse(mapped));
});

router.post("/certificates", requireAuth, async (req, res): Promise<void> => {
  const parsed = CreateCertificateBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const [row] = await db.insert(certificatesTable).values(parsed.data).returning();
  res.status(201).json({ ...row, skills: row.skills ?? [] });
});

router.patch("/certificates/:id", requireAuth, async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const paramsParsed = UpdateCertificateParams.safeParse({ id: parseInt(rawId, 10) });
  if (!paramsParsed.success) { res.status(400).json({ error: "Invalid id" }); return; }
  const bodyParsed = UpdateCertificateBody.safeParse(req.body);
  if (!bodyParsed.success) { res.status(400).json({ error: bodyParsed.error.message }); return; }
  const [row] = await db.update(certificatesTable).set(bodyParsed.data).where(eq(certificatesTable.id, paramsParsed.data.id)).returning();
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json({ ...row, skills: row.skills ?? [] });
});

router.delete("/certificates/:id", requireAuth, async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const paramsParsed = DeleteCertificateParams.safeParse({ id: parseInt(rawId, 10) });
  if (!paramsParsed.success) { res.status(400).json({ error: "Invalid id" }); return; }
  await db.delete(certificatesTable).where(eq(certificatesTable.id, paramsParsed.data.id));
  res.status(204).send();
});

export default router;
