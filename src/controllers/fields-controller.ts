import { Request, Response, NextFunction } from "express";
import {
  getAllFieldsService,
  createField,
  updateField,
  deleteField,
} from "@/services/fields-service";

export const HandleCreateField = async (req: Request, res: Response) => {
  try {
    const { name, description, weekday_price, weekend_price } = req.body;

    // ambil file upload dari multer
    const imagePath = req.file ? req.file.filename : null;
    const field = await createField({
      name,
      description,
      weekday_price: Number(weekday_price), // pastikan number
      weekend_price: Number(weekend_price),
      imageUrl: imagePath,
    });

    res.status(201).json({ message: "Field created", data: field });
  } catch (error) {
    console.error("Create Field Error:", error);
    res.status(500).json({
      message: "Failed to create field",
      error: (error as Error).message,
    });
  }
};

export const HandleUpdateField = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, weekday_price, weekend_price } = req.body;
    // ambil file (kalau ada)
    const imageUrl = req.file ? `${req.file.filename}` : undefined;
    // bikin objek data update
    const updateData: {
      name?: string;
      description?: string;
      weekday_price?: number;
      weekend_price?: number;
      imageUrl?: string;
    } = {};

    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (weekday_price) updateData.weekday_price = Number(weekday_price);
    if (weekend_price) updateData.weekend_price = Number(weekend_price);
    if (imageUrl) updateData.imageUrl = imageUrl;

    const field = await updateField(Number(id), updateData);

    res.json({ message: "Field updated", data: field });
  } catch (error) {
    console.error("Update Field Error:", error);
    res.status(500).json({ message: "Failed to update field", error });
  }
};

export const HandleDeleteField = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await deleteField(Number(id));
    res.json({ message: "Field deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete field", error });
  }
};

export async function getAllFields(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const normalized = await getAllFieldsService();
    return res.status(200).json({
      code: 200,
      status: "success",
      message: "GET Fields Success",
      count: normalized.length,
      data: normalized,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
}
