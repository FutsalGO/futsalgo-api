import prisma from "../prisma/client";
import bcrypt from "bcrypt";
import { signToken } from "../utils/jwt";
import { loginSchema } from "../validations/auth-validation";

export const loginService = async (payload: { email: string; password: string }) => {
  const { error, value } = loginSchema.validate(payload);
  if (error) throw { code: 400, message: error.message };

  const user = await prisma.user.findUnique({
    where: { email: value.email },
  });
  if (!user) throw { code: 404, message: "User not found" };

  const isPasswordValid = await bcrypt.compare(value.password, user.password);
  if (!isPasswordValid) throw { code: 401, message: "Invalid login" };

  const token = signToken(user);

  return { token, user };
};
