# 🚀 TypeArena - Master Your Typing Skills

<div align="center">

![TypeArena Logo](https://img.shields.io/badge/TypeArena-Typing%20Mastery-00d9b7?style=for-the-badge&logo=keyboard)

**A modern, real-time typing application built with Next.js 15, featuring multiplayer races, comprehensive analytics, and a sleek minimalist interface.**

[![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-6.15.0-2D3748?style=flat-square&logo=prisma)](https://prisma.io/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=flat-square&logo=mongodb)](https://mongodb.com/)

[Live Demo](https://typefast-omega.vercel.app/) • [Features](#features) • [Installation](#installation) • [Usage](#usage)

</div>

---

## ✨ Features

### 🎯 **Core Functionality**
- **Real-time Typing Tests** - Practice with instant feedback on speed and accuracy
- **Multiplayer Races** - Challenge friends in live typing competitions
- **Comprehensive Statistics** - Track your progress with detailed analytics and charts
- **Leaderboards** - Compete globally and see top performers
- **User Profiles** - Personal dashboard with typing history and achievements

### 🎨 **User Experience**
- **Minimalist Interface** - Clean, distraction-free design for focused practice
- **Dark/Light Theme** - Customizable themes for comfortable typing sessions
- **Responsive Design** - Seamless experience across desktop, tablet, and mobile
- **Smooth Animations** - Polished UI with Framer Motion animations
- **Real-time Progress** - Live WPM tracking and visual progress indicators

### 🛠 **Technical Features**
- **Next.js 15** - Latest React framework with Turbopack for lightning-fast development
- **NextAuth.js** - Secure authentication with multiple providers
- **Real-time Communication** - WebSocket integration for multiplayer functionality
- **MongoDB Integration** - Scalable database with Prisma ORM
- **TypeScript** - Full type safety and enhanced developer experience

---

## 🏗 Tech Stack

### **Frontend**
- **Framework:** Next.js 15 with React 19
- **Styling:** Tailwind CSS 4 with custom design system
- **Animations:** Framer Motion for smooth transitions
- **UI Components:** Radix UI primitives with custom styling
- **Icons:** Lucide React and React Icons
- **Charts:** Recharts for data visualization

### **Backend**
- **Database:** MongoDB with Prisma ORM
- **Authentication:** NextAuth.js with multiple providers
- **API Routes:** Next.js API routes for server-side logic
- **Real-time:** WebSocket integration for multiplayer features

### **Development**
- **Language:** TypeScript for type safety
- **Linting:** ESLint with Next.js configuration
- **Package Manager:** npm with optional dependencies optimization
- **Build Tool:** Next.js with Turbopack

---

## 📦 Installation

### Prerequisites
- **Node.js** 18.x or later
- **MongoDB** database (local or cloud)
- **Git** for version control

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/typearena.git
   cd typearena
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Configure your `.env.local` file:
   ```env
   # Database
   DATABASE_URL="your_mongodb_connection_string"
   
   # NextAuth
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your_nextauth_secret"
   
   # OAuth Providers (optional)
   GOOGLE_CLIENT_ID="your_google_client_id"
   GOOGLE_CLIENT_SECRET="your_google_client_secret"
   
   # Supabase (if using)
   NEXT_PUBLIC_SUPABASE_URL="your_supabase_url"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="your_supabase_anon_key"
   ```

4. **Set up the database**
   ```bash
   npm run prisma:generate
   npx prisma db push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 🚀 Usage

### **Single Player Mode**
1. Navigate to `/type` from the main page
2. Select your preferred difficulty and word count
3. Start typing when ready - WPM and accuracy are tracked in real-time
4. View detailed statistics after completing the test

### **Multiplayer Mode**
1. Go to `/multiplayer` to access room features
2. **Create Room:** Set up a new typing race with custom settings
3. **Join Room:** Enter a room code to join an existing race
4. **Public Rooms:** Browse and join open races
5. Race begins when all participants are ready

### **Profile & Statistics**
- Visit `/profile` to view your typing history
- Track improvements over time with detailed charts
- View personal records and achievements
- Compare your progress with global leaderboards

---

## 🎮 Game Modes

### **Difficulty Levels**
- **Easy:** Common words with simple vocabulary
- **Medium:** Mixed complexity with punctuation
- **Hard:** Advanced vocabulary and symbols

### **Word Counts**
- **10 Words:** Quick practice sessions
- **25 Words:** Standard typing tests
- **50 Words:** Extended practice for endurance

### **Room Types**
- **Private:** Invitation-only races with friends
- **Public:** Open rooms for community racing
- **Custom:** Personalized settings and text content

---

## 📊 Database Schema

The application uses MongoDB with Prisma ORM:

- **Users:** Authentication and profile data
- **LeaderBoard:** Global rankings and scores
- **Rooms:** Multiplayer race configurations
- **Sessions/Accounts:** NextAuth.js integration

---

## 🛠 Development

### **Project Structure**
```
typearena/
├── app/                    # Next.js 15 App Router
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── leaderboard/       # Global rankings
│   ├── multiplayer/       # Room management
│   ├── profile/           # User dashboard
│   └── type/              # Typing practice
├── components/            # Reusable React components
│   ├── ui/               # Base UI components
│   ├── profile/          # Profile-specific components
│   └── room/             # Multiplayer room components
├── lib/                  # Utility functions and configurations
├── prisma/               # Database schema and migrations
└── public/               # Static assets
```

### **Key Scripts**
```bash
npm run dev          # Start development server with Turbopack
npm run build        # Build production application
npm run start        # Start production server
npm run lint         # Run ESLint
npm run prisma:generate  # Generate Prisma client
```

### **Contributing**
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 🔧 Configuration

### **Customizing Themes**
Edit CSS variables in `globals.css` to customize the color scheme:

```css
:root {
  --primary: #00d9b7;
  --secondary: #4fd1c7;
  --accent: #22d3ee;
  /* Add your custom colors */
}
```

### **Adding OAuth Providers**
Configure additional authentication providers in `lib/nextauth-options.ts`

### **Database Customization**
Modify `prisma/schema.prisma` to add new fields or models, then run:
```bash
npx prisma db push
npm run prisma:generate
```

---


<div align="center">

**⭐ If you found TypeArena helpful, please give it a star on GitHub! ⭐**

Made with ❤️ by Umar Farooq, Krishna Keerthan and Madesh

</div>
