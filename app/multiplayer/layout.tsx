
import { RoomProvider } from '@/context/roomContext';


export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <RoomProvider>
      {children}
    </RoomProvider>
  );
}