import express from "express";
import { handleCreate, handleDelete, handleGet, handleUpdate } from "@/controllers/admin/booking-controller";
import { requireAuth } from "@/middlewares/auth-middleware";
import { requireAdmin } from "@/middlewares/admin-middleware";

const router = express.Router();

router.use(requireAuth, requireAdmin);

router.get('/', handleGet);
router.post('/', handleCreate);
router.patch('/:id', handleUpdate);
router.delete('/:id', handleDelete);

export default router;
