import { handleGetSchedules } from "@/controllers/schedule-controller";
import { requireAuth } from "@/middlewares/auth-middleware";
import express from "express";

const router = express.Router();

router.use(requireAuth);

router.get("/:field_id", handleGetSchedules);

export default router;
