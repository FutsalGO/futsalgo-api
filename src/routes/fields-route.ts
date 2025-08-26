import express from "express";
import { getAllFields } from "@/controllers/fields-controller";

const router = express.Router();

router.get("/", getAllFields);

export default router;
