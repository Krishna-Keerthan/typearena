"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function registerUser({ name, email, password }: { 
  name: string; 
  email: string; 
  password: string;
}) {
  try {
    // Check if user exists
    const existing = await prisma.user.findUnique({
      where: { email },
    });
    if (existing) {
      return { error: "User already exists" };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return { success: true, user };
  } catch (err) {
    console.error("Register error:", err);
    return { error: "Something went wrong" };
  }
}


export async function checkUsername(name: string) {
  if (!name) return { available: false };

  const existing = await prisma.user.findUnique({
    where: { name },
  });

  return { available: !existing };
}

