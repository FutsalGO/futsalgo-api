import { Request, Response } from "express";
import bcrypt from "bcrypt";
import prisma from "../prisma/client";
import { registerSchema } from "../validations/auth-validation";

export const register = async (req: Request, res: Response) => {
  try {
    // validasi input
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0]?.message });
    }

    const { name, phone, email, password } = value;
    const hashedPassword = await bcrypt.hash(password, 10);
    // simpan ke database
    const user = await prisma.user.create({
      data: {
        name,
        phone,
        email,
        password: hashedPassword,
      },
    });

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user.name,
        phone: user.phone,
        email: user.email,
        password: user.password,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
