import prisma from '@/lib/prisma';
import PublicRoom from '@/components/publicRoom';

interface PublicRoomServerProps {
  userId: string;
}

export default async function PublicRoomServer({ userId }: PublicRoomServerProps) {
  const rooms = await prisma.room.findMany({
    where: { hostId: userId },
  });
  return <PublicRoom rooms={rooms} />;
}
