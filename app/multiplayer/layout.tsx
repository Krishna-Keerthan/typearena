'use client'
import { RoomProvider } from '@/context/roomContext';
import { createClient } from '@/lib/client';

const supabase = createClient();

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <RoomProvider supabase={supabase}>
      {children}
    </RoomProvider>
  );
}