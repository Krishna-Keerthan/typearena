'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRoom } from '@/context/roomContext';
import { useSession } from 'next-auth/react';

const ChatBox = () => {
  const { currentRoom, messages, sendMessage, isConnected } = useRoom();
  const [messageInput, setMessageInput] = useState('');
  const { data: session } = useSession();
  const currentUserName = session?.user?.name;

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageInput.trim() && isConnected) {
      sendMessage(messageInput.trim());
      setMessageInput('');
    }
  };

  // Auto scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!currentRoom) {
    return (
      <div className="bg-gray-900 rounded-lg p-4 text-center">
        <p className="text-gray-400">Join a room to start chatting</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-lg p-4 h-[500px] flex flex-col w-[700px]">
      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto mb-4 p-4 space-y-3 
                   scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900 
                   hover:scrollbar-thumb-purple-600 rounded-md"
      >
        {messages.map((msg) => {
          const isOwnMessage = msg.user.name === currentUserName;
          const time = new Date(msg.createdAt).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          });

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-xs px-3 py-2 rounded-lg text-sm shadow 
                  ${
                    isOwnMessage
                      ? 'bg-purple-600 text-white rounded-br-none'
                      : 'bg-gray-800 text-gray-100 rounded-bl-none'
                  }`}
              >
                {!isOwnMessage && (
                  <span className="block text-xs text-purple-400 font-medium mb-1">
                    {msg.user.name}
                  </span>
                )}
                {msg.content}
              </div>
              <span
                className={`text-xs text-gray-400 mt-1 ${
                  isOwnMessage ? 'text-right' : 'text-left'
                }`}
              >
                {time}
              </span>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="flex gap-2">
        <input
          type="text"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-gray-800 text-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          disabled={!isConnected}
        />
        <button
          type="submit"
          disabled={!messageInput.trim() || !isConnected}
          className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-md"
        >
          Send
        </button>
      </form>

      <div className="text-xs text-gray-500 mt-2">
        {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
      </div>
    </div>
  );
};

export default ChatBox;
