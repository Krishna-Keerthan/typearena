"use client";
import React, { useState, useEffect } from 'react';
import { Camera, Check,  Calendar } from 'lucide-react';
import { getUserProfile } from '@/actions/user.ts';

// Define user type
interface UserProfile {
  id: string;
  name: string | null;
  email: string;
  image: string | null; // Google profile picture URL
  createdAt: Date;
  rank: number;
}

const SimpleProfileCard = ({ userId }: { userId: string }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(0);

  // Default cartoon avatars - stored in localStorage for persistence
  const avatarOptions = [
    { id: 0, emoji: '🐱', bg: 'from-pink-400 to-purple-500' },
    { id: 1, emoji: '🦊', bg: 'from-orange-400 to-red-500' },
    { id: 2, emoji: '🐸', bg: 'from-green-400 to-blue-500' },
    { id: 3, emoji: '🐨', bg: 'from-gray-400 to-gray-600' },
    { id: 4, emoji: '🦄', bg: 'from-purple-400 to-pink-500' },
  ];

  useEffect(() => {
    // Load selected avatar from localStorage if available
    const savedAvatar = localStorage.getItem(`avatar_${userId}`);
    if (savedAvatar) {
      setSelectedAvatar(parseInt(savedAvatar));
    }

    // Fetch user data from the database
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const userData = await getUserProfile(userId);
        setUser(user);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId]);

  const handleAvatarChange = (avatarId: number) => {
    setSelectedAvatar(avatarId);
    setShowAvatarSelector(false);
    
    // Save to localStorage for persistence
    localStorage.setItem(`avatar_${userId}`, avatarId.toString());
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-card rounded-3xl shadow-lg p-8 w-full max-w-md text-center">
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-card rounded-3xl shadow-lg p-8 w-full max-w-md text-center">
          <p className="text-red-500">Error: {error || 'User not found'}</p>
        </div>
      </div>
    );
  }

  // Format join date
  const joinDate = new Date(user.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="bg-card rounded-3xl shadow-lg p-8 w-full max-w-md relative border border-gray-700">
        
        {/* Profile Picture Section */}
        <div className="text-center mb-6">
          <div className="relative inline-block">
            {/* Profile Picture with Camera Icon */}
            <div className="relative mb-4">
              {user.image ? (
                // Show Google profile picture if available
                <div 
                  className="w-16 h-16 rounded-full overflow-hidden cursor-pointer hover:scale-105 transition-transform mx-auto"
                  onClick={() => setShowAvatarSelector(!showAvatarSelector)}
                >
                  <img 
                    src={user.image} 
                    alt={user.name || 'User'} 
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                // Show selected avatar if no Google profile picture
                <div 
                  className={`w-16 h-16 bg-gradient-to-br ${avatarOptions[selectedAvatar].bg} rounded-full flex items-center justify-center text-2xl cursor-pointer hover:scale-105 transition-transform mx-auto`}
                  onClick={() => setShowAvatarSelector(!showAvatarSelector)}
                >
                  {avatarOptions[selectedAvatar].emoji}
                </div>
              )}
              <button 
                className="absolute -bottom-1 -right-1 w-6 h-6 bg-card border-2 border-gray-600 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors shadow-sm"
                onClick={() => setShowAvatarSelector(!showAvatarSelector)}
              >
                <Camera className="w-3 h-3 text-muted" />
              </button>
              
              {/* Avatar Selector Modal */}
              {showAvatarSelector && (
                <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-card border border-gray-600 rounded-xl p-4 shadow-xl z-10 min-w-[200px]">
                  <h3 className="font-semibold mb-3 text-center" style={{color: 'var(--text)'}}>Choose Avatar</h3>
                  <div className="grid grid-cols-5 gap-3">
                    {avatarOptions.map((avatar) => (
                      <button
                        key={avatar.id}
                        onClick={() => handleAvatarChange(avatar.id)}
                        className={`w-10 h-10 bg-gradient-to-br ${avatar.bg} rounded-full flex items-center justify-center text-lg hover:scale-110 transition-transform relative`}
                      >
                        {avatar.emoji}
                        {selectedAvatar === avatar.id && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center" style={{backgroundColor: 'var(--primary)'}}>
                            <Check className="w-2 h-2 text-white" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Name Section */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <h1 className="text-2xl font-bold" style={{color: 'var(--primary)'}}>
              {user.name || 'Unknown User'}
            </h1>
          </div>
        </div>

        {/* Info Section */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center text-muted">
            <Calendar className="w-4 h-4 mr-2"/>
            <span>Joined {joinDate}</span>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold pr-7" style={{color: 'var(--primary)'}}>
              #{user.rank}
            </div>
            <div className="text-sm text-muted pr-7">Global Rank</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleProfileCard;