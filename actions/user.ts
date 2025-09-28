"use server"
import prisma from '@/lib/prisma';

export async function getUserById(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      email: true,
      image: true,
    },
  });
  return user;
}


// export async function updateUserById(userId: string, userData: { name: string}) {
//   const updatedUser = await prisma.user.update({
//     where: { id: userId },
//     data: {
//       name: userData.name,
//     },
//     select: {
//       name: true,
//       imageUrl: true,
//     },
//   });

//   revalidatePath('/profile')

//   return updatedUser;
// }