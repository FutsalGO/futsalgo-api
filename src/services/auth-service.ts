import prisma from "@/prisma/client";
import bcrypt from "bcrypt";
import { signToken } from "@/utils/jwt";
import { loginSchema } from "@/validations/auth-validation";

export const loginUser = async (payload: { email: string; password: string }) => {
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

export async function registerUser(
  name: string,
  phone: string | null,
  email: string,
  password: string
) {
  // manual validation (mirip logic Joi)
  if (!name || name.length < 3 || name.length > 100) {
    throw new Error("Name must be between 3 and 100 characters");
  }

  const phoneRegex = /^(?:\+62|62|0)[0-9]{9,13}$/;
  if (phone && !phoneRegex.test(phone)) {
    throw new Error("Phone number must be a valid Indonesian number");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error("Invalid email format");
  }

  if (!password || password.length < 6) {
    throw new Error("Password must be at least 6 characters");
  }

  // hash password
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

  return user;
}
