"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import SimpleProfileCardSkeleton from "./ProfileCardSkeleton";

const SimpleProfileCard = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") return;

    if (session?.user) {
      setName(session.user.name || "");
      setEmail(session.user.email || "");
      setImage(session.user.image || "");
    }
    setIsLoading(false);
  }, [session, status]);

  if (isLoading) {
    return <SimpleProfileCardSkeleton />;
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="bg-card rounded-3xl shadow-lg p-8 w-full max-w-md relative border border-gray-700 overflow-hidden group">
        {/* Animated glow border */}
        <div className="absolute inset-0 rounded-3xl border border-primary/20 group-hover:border-primary/40 transition-all duration-500 pointer-events-none" />

        {/* Profile Picture Section */}
        <div className="text-center mb-6">
          <div className="relative inline-block">
            <div className="relative mb-4">
              <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center text-2xl mx-auto shadow-md group-hover:scale-105 transition-transform duration-300">
                {image ? (
                  <Image
                    src={image}
                    alt="Avatar"
                    width={80}
                    height={80}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                ) : (
                  <span className="uppercase text-3xl font-bold">
                    {name.charAt(0) || "?"}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Name Section */}
        <div className="text-center mb-3">
          <h1
            className="text-2xl font-extrabold tracking-wide animate-pulse"
            style={{ color: "var(--primary)" }}
          >
            {name || "No Name"}
          </h1>
        </div>

        {/* Email Section */}
        <div className="text-center mb-6">
          <p className="text-muted text-sm tracking-wide">{email || "No Email"}</p>
        </div>

        {/* Typing tagline */}
        <div className="text-center">
          <p className="text-xs italic text-muted  overflow-hidden whitespace-nowrap  pr-2">
            Keep typing, keep improving 🚀
          </p>
        </div>
      </div>
    </div>
  );
};

export default SimpleProfileCard;
