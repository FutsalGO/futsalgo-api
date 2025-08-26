import express from "express";
import {
  handleCreate,
  handleDelete,
  handleGet,
} from "@/controllers/user/booking-controller";
import { requireAuth } from "@/middlewares/auth-middleware";

const router = express.Router();

router.use(requireAuth);

router.get("/", handleGet);
router.post("/", handleCreate);
router.delete("/:id", handleDelete);

export default router;
