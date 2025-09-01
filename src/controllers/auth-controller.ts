import { Request, Response, NextFunction } from "express";
import { loginUser, registerUser } from "@/services/auth-service";
import { registerSchema } from "@/validations/auth-validation";

export async function handleLogin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { token, user } = await loginUser(req.body);

    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      code: 200,
      status: "success",
      message: "Login successful",
      data: { user, token },
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
}

export async function handleRegister(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
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
    const { user, token } = await registerUser(name, phone, email, password);

    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      code: 201,
      status: "success",
      message: "User registered successfully",
      data: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        token,
      },
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
}

export async function handleLogout(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    res.clearCookie("auth_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({
      code: 200,
      status: "success",
      message: "Logout successful",
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
}
