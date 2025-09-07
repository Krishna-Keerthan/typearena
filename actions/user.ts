"use server";

import  prisma  from "@/lib/prisma"; // You'll need to set up your Prisma client

// Fetch user profile data
export async function getUserProfile(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        imageUrl: true, // This stores the Google profile picture URL
        createdAt: true,
        // Add any other fields you need for rank calculation
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Calculate user rank (pseudo-code - adjust based on your ranking system)
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw new Error("Failed to fetch user profile");
  }
}
