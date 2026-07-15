import { Router } from "express";
import { db } from "@workspace/db";
import { projectsTable } from "@workspace/db";
import { eq, ilike, and, type SQL } from "drizzle-orm";
import { requireAuth } from "../lib/auth.js";
import {
  GetProjectsResponse,
  CreateProjectBody,
  UpdateProjectBody,
  GetProjectParams,
  UpdateProjectParams,
  DeleteProjectParams,
} from "@workspace/api-zod";

const router = Router();

router.get("/projects", async (req, res): Promise<void> => {
  const { category, featured, search } = req.query as Record<string, string>;
  const conditions: SQL[] = [];
  if (category) conditions.push(eq(projectsTable.category, category));
  if (featured === "true") conditions.push(eq(projectsTable.featured, true));
  if (search) conditions.push(ilike(projectsTable.title, `%${search}%`));

  const projects = conditions.length
    ? await db.select().from(projectsTable).where(and(...conditions)).orderBy(projectsTable.order)
    : await db.select().from(projectsTable).orderBy(projectsTable.order);

  const mapped = projects.map(p => ({
    ...p,
    techStack: p.techStack ?? [],
    createdAt: p.createdAt.toISOString(),
  }));
  res.json(GetProjectsResponse.parse(mapped));
});

router.post("/projects", requireAuth, async (req, res): Promise<void> => {
  const parsed = CreateProjectBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [project] = await db.insert(projectsTable).values(parsed.data).returning();
  res.status(201).json({ ...project, techStack: project.techStack ?? [], createdAt: project.createdAt.toISOString() });
});

router.get("/projects/:id", async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const paramsParsed = GetProjectParams.safeParse({ id: parseInt(rawId, 10) });
  if (!paramsParsed.success) { res.status(400).json({ error: "Invalid id" }); return; }
  const [project] = await db.select().from(projectsTable).where(eq(projectsTable.id, paramsParsed.data.id)).limit(1);
  if (!project) { res.status(404).json({ error: "Not found" }); return; }
  res.json({ ...project, techStack: project.techStack ?? [], createdAt: project.createdAt.toISOString() });
});

router.patch("/projects/:id", requireAuth, async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const paramsParsed = UpdateProjectParams.safeParse({ id: parseInt(rawId, 10) });
  if (!paramsParsed.success) { res.status(400).json({ error: "Invalid id" }); return; }
  const bodyParsed = UpdateProjectBody.safeParse(req.body);
  if (!bodyParsed.success) { res.status(400).json({ error: bodyParsed.error.message }); return; }
  const [project] = await db.update(projectsTable).set(bodyParsed.data).where(eq(projectsTable.id, paramsParsed.data.id)).returning();
  if (!project) { res.status(404).json({ error: "Not found" }); return; }
  res.json({ ...project, techStack: project.techStack ?? [], createdAt: project.createdAt.toISOString() });
});

router.delete("/projects/:id", requireAuth, async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const paramsParsed = DeleteProjectParams.safeParse({ id: parseInt(rawId, 10) });
  if (!paramsParsed.success) { res.status(400).json({ error: "Invalid id" }); return; }
  await db.delete(projectsTable).where(eq(projectsTable.id, paramsParsed.data.id));
  res.status(204).send();
});

export default router;
