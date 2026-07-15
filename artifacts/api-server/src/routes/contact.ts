import { Router } from "express";
import { db } from "@workspace/db";
import { messagesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAuth } from "../lib/auth.js";
import {
  SubmitContactBody,
  GetMessagesResponse,
  UpdateMessageBody,
  UpdateMessageParams,
  DeleteMessageParams,
} from "@workspace/api-zod";
import { logger } from "../lib/logger.js";

const router = Router();

function mapMessage(m: typeof messagesTable.$inferSelect) {
  return {
    ...m,
    createdAt: m.createdAt.toISOString(),
    phone: m.phone ?? null,
    budget: m.budget ?? null,
    projectType: m.projectType ?? null,
  };
}

router.post("/contact", async (req, res): Promise<void> => {
  const parsed = SubmitContactBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [msg] = await db.insert(messagesTable).values(parsed.data).returning();

  // Attempt to send email notification (non-blocking)
  try {
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      const nodemailer = await import("nodemailer");
      const transporter = nodemailer.default.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT ?? 587),
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      });
      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: process.env.CONTACT_EMAIL ?? process.env.SMTP_USER,
        subject: `Portfolio Contact: ${parsed.data.subject}`,
        text: `From: ${parsed.data.name} <${parsed.data.email}>\n\n${parsed.data.message}`,
      });
    }
  } catch (err) {
    logger.warn({ err }, "Failed to send contact email");
  }

  res.status(201).json(mapMessage(msg));
});

router.get("/messages", requireAuth, async (req, res): Promise<void> => {
  const msgs = await db.select().from(messagesTable).orderBy(messagesTable.createdAt);
  res.json(GetMessagesResponse.parse(msgs.map(mapMessage)));
});

router.patch("/messages/:id", requireAuth, async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const paramsParsed = UpdateMessageParams.safeParse({ id: parseInt(rawId, 10) });
  if (!paramsParsed.success) { res.status(400).json({ error: "Invalid id" }); return; }
  const bodyParsed = UpdateMessageBody.safeParse(req.body);
  if (!bodyParsed.success) { res.status(400).json({ error: bodyParsed.error.message }); return; }
  const [msg] = await db.update(messagesTable).set(bodyParsed.data).where(eq(messagesTable.id, paramsParsed.data.id)).returning();
  if (!msg) { res.status(404).json({ error: "Not found" }); return; }
  res.json(mapMessage(msg));
});

router.delete("/messages/:id", requireAuth, async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const paramsParsed = DeleteMessageParams.safeParse({ id: parseInt(rawId, 10) });
  if (!paramsParsed.success) { res.status(400).json({ error: "Invalid id" }); return; }
  await db.delete(messagesTable).where(eq(messagesTable.id, paramsParsed.data.id));
  res.status(204).send();
});

export default router;
