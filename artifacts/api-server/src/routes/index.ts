import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import profileRouter from "./profile";
import projectsRouter from "./projects";
import skillsRouter from "./skills";
import experienceRouter from "./experience";
import testimonialsRouter from "./testimonials";
import certificatesRouter from "./certificates";
import achievementsRouter from "./achievements";
import contactRouter from "./contact";
import analyticsRouter from "./analytics";
import githubRouter from "./github";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(profileRouter);
router.use(projectsRouter);
router.use(skillsRouter);
router.use(experienceRouter);
router.use(testimonialsRouter);
router.use(certificatesRouter);
router.use(achievementsRouter);
router.use(contactRouter);
router.use(analyticsRouter);
router.use(githubRouter);

export default router;
