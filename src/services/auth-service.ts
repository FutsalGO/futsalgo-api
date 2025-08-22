import bcrypt from "bcrypt";
import prisma from "../prisma/client";

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
