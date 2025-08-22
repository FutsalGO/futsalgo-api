import { RequestHandler } from "express";
import { loginService } from "@/services/auth-service";

export const login: RequestHandler = async (req, res, next) => {
  try {
    const { token, user } = await loginService(req.body);

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
