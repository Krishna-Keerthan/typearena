"use client";
import React, { useState } from 'react';
import { Camera, Check, Edit2, MapPin, Globe, Calendar } from 'lucide-react';

const SimpleProfileCard = () => {
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(0);

  // Default cartoon avatars
  const avatarOptions = [
    { id: 0, emoji: '🐱', bg: 'from-pink-400 to-purple-500' },
    { id: 1, emoji: '🦊', bg: 'from-orange-400 to-red-500' },
    { id: 2, emoji: '🐸', bg: 'from-green-400 to-blue-500' },
    { id: 3, emoji: '🐨', bg: 'from-gray-400 to-gray-600' },
    { id: 4, emoji: '🦄', bg: 'from-purple-400 to-pink-500' },
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="bg-card rounded-3xl shadow-lg p-8 w-full max-w-md relative border border-gray-700">
        
        {/* Profile Picture Section */}
        <div className="text-center mb-6">
          <div className="relative inline-block">
            {/* Large Initials Circle */}
            
            
            {/* Profile Picture with Camera Icon */}
            <div className="relative mb-4">
              <div 
                className={`w-16 h-16 bg-gradient-to-br ${avatarOptions[selectedAvatar].bg} rounded-full flex items-center justify-center text-2xl cursor-pointer hover:scale-105 transition-transform mx-auto`}
                onClick={() => setShowAvatarSelector(!showAvatarSelector)}
              >
                {avatarOptions[selectedAvatar].emoji}
              </div>
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
                        onClick={() => {
                          setSelectedAvatar(avatar.id);
                          setShowAvatarSelector(false);
                        }}
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
            <h1 className="text-2xl font-bold" style={{color: 'var(--primary)'}}>Alex Chen</h1>
          </div>
          
        </div>

        {/* Info Section */}
        <div className="space-y-3 mb-6">
         
          
          <div className="flex items-center text-muted">
            <Calendar className="w-4 h-4 mr-2" />
            <span>Joined 1/15/2023</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-8 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold" style={{color: 'var(--primary)'}}>#156</div>
            <div className="text-sm text-muted">Global Rank</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold" style={{color: 'var(--primary)'}}>15</div>
            <div className="text-sm text-muted">Level</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold" style={{color: 'var(--primary)'}}>7</div>
            <div className="text-sm text-muted">Day Streak</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold" style={{color: 'var(--primary)'}}>342</div>
            <div className="text-sm text-muted">Tests</div>
          </div>
        </div>

        {/* Edit Profile Button */}
        <button className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-gray-600 rounded-lg hover:bg-gray-700 transition-colors" style={{color: 'var(--text)'}}>
          <Edit2 className="w-4 h-4" />
          <span>Edit Profile</span>
        </button>
      </div>
    </div>
  );
};

export default SimpleProfileCard;