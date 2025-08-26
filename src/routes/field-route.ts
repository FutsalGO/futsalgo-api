import express from "express";
import { getAllFields } from "@/controllers/field-controller";

const router = express.Router();

router.get("/", getAllFields);

export default router;
