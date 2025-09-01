import express from "express";
import {
  getAllFields,
  HandleCreateField,
  HandleDeleteField,
  HandleUpdateField,
} from "@/controllers/fields-controller";
import { uploadField } from "@/utils/multer-field";
import { requireAuth } from "@/middlewares/auth-middleware";
import { requireAdmin } from "@/middlewares/admin-middleware";

const router = express.Router();

router.use(requireAuth, requireAdmin);

router.get("/", getAllFields);
router.post("/add", uploadField.single("imageUrl"), HandleCreateField);
router.put("/:id", uploadField.single("imageUrl"), HandleUpdateField);
router.delete("/del/:id", HandleDeleteField);

export default router;
