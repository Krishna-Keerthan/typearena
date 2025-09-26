'use client';

import { useState } from 'react';
import { deleteRoomByCode } from '@/actions/room';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

interface Room {
  code: string;
}

const DeleteRoomButton = ({ room }: { room: Room }) => {
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const result = await deleteRoomByCode(room.code);
      if (result?.success) {
        toast.success('Room deleted successfully!');
        router.refresh(); 
      }
    } catch (err) {
      toast.error('Error deleting room');
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      className="px-4 py-2 rounded-md font-medium transition-colors duration-200 bg-red-500 text-white"
    >
      {deleting ? (
    <>
      <div className='flex gap-1 justify-center items-center'>
      <span>Deleting</span>
      <Loader2 className="animate-spin w-4 h-4" />
      </div>
    </>
  ) : (
    'Delete'
  )}
    </button>
  );
};

export default DeleteRoomButton;
