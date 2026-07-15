import { Router } from "express";
import bcrypt from "bcrypt";
import { db } from "@workspace/db";
import { adminTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { signToken, requireAuth } from "../lib/auth.js";
import { AdminLoginBody } from "@workspace/api-zod";

const router = Router();

router.post("/auth/login", async (req, res): Promise<void> => {
  const parsed = AdminLoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { email, password } = parsed.data;
  const [admin] = await db.select().from(adminTable).where(eq(adminTable.email, email)).limit(1);
  if (!admin) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }
  const valid = await bcrypt.compare(password, admin.passwordHash);
  if (!valid) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }
  const token = signToken({ id: admin.id, email: admin.email, name: admin.name });
  res.json({ token, user: { id: admin.id, email: admin.email, name: admin.name } });
});

router.get("/auth/me", requireAuth, async (req, res): Promise<void> => {
  const admin = (req as any).admin;
  res.json({ id: admin.id, email: admin.email, name: admin.name });
});

export default router;
