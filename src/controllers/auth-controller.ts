import { RequestHandler, Request, Response } from "express";
import { loginUser, registerUser } from "@/services/auth-service";
import { registerSchema } from "@/validations/auth-validation";

export const login: RequestHandler = async (req, res, next) => {
  try {
    const { token, user } = await loginUser(req.body);

    res.status(200).json({
      code: 200,
      status: "success",
      message: "Login successful",
      data: { token, user },
    });
  } catch (error) {
    next(error);
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    // validasi input
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        code: 400,
        status: "error",
        message: "Validation error",
        errors: error.details[0]?.message,
      });
    }

    const { name, phone, email, password } = value;
    const user = await registerUser(name, phone, email, password);

    return res.status(201).json({
      code: 201,
      status: "success",
      message: "User registered successfully",
      data: {
        id: user.name,
        phone: user.phone,
        email: user.email,
        password: user.password,
      },
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ code: 500, status: "error", message: "Internal server error" });
  }
};
