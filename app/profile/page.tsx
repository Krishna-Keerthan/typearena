import { authOptions } from "@/lib/nextauth-options";
import { getServerSession } from "next-auth";
import Image from "next/image";


const ProfilePage = async () => {
  const session = await getServerSession(authOptions)
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
                {session?.user.image ? (
                  <Image
                    src={session?.user.image}
                    alt="Avatar"
                    width={80}
                    height={80}
                    priority={false}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                ) : (
                  <span className="uppercase text-3xl font-bold">
                    {session?.user.name ? session.user.name.charAt(0) : "?"}
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
            {session?.user.name || "No Name"}
          </h1>
        </div>

        {/* Email Section */}
        <div className="text-center mb-6">
          <p className="text-muted text-sm tracking-wide">{session?.user.name || "No Email"}</p>
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

export default ProfilePage;
