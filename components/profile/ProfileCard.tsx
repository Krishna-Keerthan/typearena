"use client";
import React, { useEffect, useState } from 'react';
import { Edit2, Save } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { getUserById, updateUserById } from '@/actions/user';
import SimpleProfileCardSkeleton from './ProfileCardSkeleton';

interface UserData {
  id: string;
  name: string;
  email: string;
  imageUrl: string | null;
}

const SimpleProfileCard = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [isLoading, setIsLoading] = useState(true); // Loading state
  
  const { data: session } = useSession();

  const fetchUserData = async () => {
    try {
      if (session?.user.id) {
        setIsLoading(true); // Start loading
        const res = await getUserById(session.user.id);
        if (res) {
          setUserData(res);
          setEditedName(res.name);
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setIsLoading(false); // End loading
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [session]);

  const handleSave = async () => {
    if (!userData || !session?.user.id) {
      console.error("Cannot save: missing user data or session");
      return;
    }

    try {
      const updated = await updateUserById(session.user.id, {
        name: editedName
      });
      setUserData((prev) => prev ? { ...prev, name: editedName } : prev);
      setIsEditing(false);
      console.log("Saved data:", updated);
    } catch (error) {
      console.error("Error saving user data:", error);
    }
  };

  if (isLoading) {
    return <SimpleProfileCardSkeleton />;
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="bg-card rounded-3xl shadow-lg p-8 w-full max-w-md relative border border-gray-700">

        {/* Profile Picture Section */}
        <div className="text-center mb-6">
          <div className="relative inline-block">
            <div className="relative mb-4">
              <div 
                className="w-16 h-16 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center text-2xl cursor-pointer hover:scale-105 transition-transform mx-auto"
              >
                {userData?.imageUrl ? (
                  <img 
                    src={userData.imageUrl}
                    alt="Avatar"
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <span className="uppercase">{userData?.name.charAt(0)}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Name Section */}
        <div className="text-center mb-4">
          {isEditing ? (
            <input
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              className="border border-gray-600 rounded-lg px-3 py-2 w-full text-white bg-card"
              placeholder="Enter name"
            />
          ) : (
            <h1 className="text-2xl font-bold" style={{color: 'var(--primary)'}}>
              {userData?.name || 'No Name'}
            </h1>
          )}
        </div>

        {/* Email Section */}
        <div className="text-center mb-6">
          <p className="text-muted">{userData?.email || 'No Email'}</p>
        </div>

        {/* Edit / Save Button */}
        <button
          className={`w-full ${isEditing ? 'bg-blue-500 hover:bg-blue-600' : 'bg-green-500 hover:bg-green-600'} text-black font-semibold py-2 rounded-lg transition-colors flex justify-center items-center gap-1.5 cursor-pointer`}
          onClick={() => {
            if (isEditing) {
              handleSave();
            } else {
              setIsEditing(true);
            }
          }}
        >
          {isEditing ? <Save className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
          <span>{isEditing ? 'Save' : 'Edit Profile'}</span>
        </button>
      </div>
    </div>
  );
};

export default SimpleProfileCard;
