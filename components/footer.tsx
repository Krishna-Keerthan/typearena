import React from 'react';
import { Github, Twitter, Facebook } from 'lucide-react';
import { AnimatedTooltip } from '@/components/ui/animated-tooltip';

const Footer = () => {
  const people = [
    {
      id: 2,
      name: "Madesh",
      designation: "Full Stack Developer",
      image: "https://avatars.githubusercontent.com/u/146449523?v=4",
    },
    {
      id: 1,
      name: "Umar Farooq",
      designation: "Full Stack Developer",
      image: "https://avatars.githubusercontent.com/u/118684694?v=4",
    },
    {
      id: 3,
      name: "Krishna Keerthan",
      designation: "Full Stack Developer",
      image: "https://avatars.githubusercontent.com/u/153193330?v=4",
    },
  ];

  return (
    <footer className="w-full py-12 px-6" style={{ backgroundColor: 'var(--background)' }}>
      <div className="max-w-6xl mx-auto">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          
          {/* Brand Section */}
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--primary)' }}>
              TypeArena
            </h2>
            <p style={{ color: 'var(--textMuted)' }}>Master Your Typing Skills</p>
          </div>

          {/* Connect With Us */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--primary)' }}>
              Connect With Us
            </h3>
            <div className="flex space-x-4">
              <a
                href="#"
                className="p-2 rounded-lg transition-transform duration-200 hover:scale-110"
                style={{ backgroundColor: 'var(--cardBackground)', color: 'var(--text)' }}
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="p-2 rounded-lg transition-transform duration-200 hover:scale-110"
                style={{ backgroundColor: 'var(--cardBackground)', color: 'var(--text)' }}
              >
                <Twitter size={20} />
              </a>
              <a
                href="#"
                className="p-2 rounded-lg transition-transform duration-200 hover:scale-110"
                style={{ backgroundColor: 'var(--cardBackground)', color: 'var(--text)' }}
              >
                <Github size={20} />
              </a>
            </div>
          </div>

          {/* Contributors */}
          <div className="flex gap-3.5 items-center md:items-end text-center md:text-right">
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--primary)' }}>
              Contributors
            </h3>
            <AnimatedTooltip  items={people} />
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-opacity-20" style={{ borderColor: 'var(--textMuted)' }}>
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-center md:text-left">
            <p style={{ color: 'var(--textMuted)' }}>© 2025 TypeArena. All rights reserved.</p>
            <p style={{ color: 'var(--textMuted)' }}>
              Designed and Developed with{' '}
              <span style={{ color: 'var(--primary)' }}>❤️</span> by{' '}
              <span style={{ color: 'var(--primary)' }}>Madesh</span>,{' '}
              <span style={{ color: 'var(--primary)' }}>Umar</span> &{' '}
              <span style={{ color: 'var(--primary)' }}>Krishna</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
