import React from 'react';
import { Github, Twitter, Facebook } from 'lucide-react';
 import { AnimatedTooltip } from '@/components/ui/animated-tooltip';

const Footer = () => {
  const people = [
    {
      id: 2,
      name: "Madesh",
      designation: "Full Stack Developer",
      image:
      "https://avatars.githubusercontent.com/u/146449523?v=4",
    },
    {
      id: 1,
      name: "Umar Farooq",
      designation: "Full Stack Developer",
      image:
        "https://avatars.githubusercontent.com/u/118684694?v=4",
    },
  {
    id: 3,
    name: "Krishna Keerthan",
    designation: "Full Stack Developer",
    image:
      "https://avatars.githubusercontent.com/u/153193330?v=4",
  },
];
  return (
    <footer 
      className="w-full py-12 px-6"
      style={{ backgroundColor: 'var(--background)' }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand Section */}
          <div>
            <h2 
              className="text-2xl font-bold mb-2"
              style={{ color: 'var(--primary)' }}
            >
              TypeArena
            </h2>
            <p style={{ color: 'var(--textMuted)' }}>
              Master Your Typing Skills
            </p>
          </div>

         

          {/* Connect With Us */}
          <div>
            <h3 
              className="text-lg font-semibold mb-4 ml-20"
              style={{ color: 'var(--primary)' }}
            >
              Connect With Us
            </h3>
            <div className="flex space-x-4 ml-22">
              <a 
                href="#"
                className="p-2 rounded-lg transition-all duration-200 hover:scale-110"
                style={{ 
                  backgroundColor: 'var(--cardBackground)',
                  color: 'var(--text)'
                }}
              >
                <Facebook size={20} />
              </a>
              <a 
                href="#"
                className="p-2 rounded-lg transition-all duration-200 hover:scale-110"
                style={{ 
                  backgroundColor: 'var(--cardBackground)',
                  color: 'var(--text)'
                }}
              >
                <Twitter size={20} />
              </a>
              <a 
                href="#"
                className="p-2 rounded-lg transition-all duration-200 hover:scale-110"
                style={{ 
                  backgroundColor: 'var(--cardBackground)',
                  color: 'var(--text)'
                }}
              >
                <Github size={20} />
              </a>
            </div>
         
          </div>
            <div className="relative -top-4 flex flex-col items-end mt-3">
    <h3 
      className="text-lg font-semibold mb-4"
      style={{ color: 'var(--primary)' }}
    >
      Contributors
    </h3>
    <div className="flex justify-end">
      <AnimatedTooltip items={people} />
    </div>
  </div>
        </div>
 


        {/* Bottom Section */}
        <div className="pt-8 border-t border-opacity-20" style={{ borderColor: 'var(--textMuted)' }}>
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p style={{ color: 'var(--textMuted)' }}>
              © 2025 TypeArena. All rights reserved.
            </p>
            <p style={{ color: 'var(--textMuted)' }}>
              Designed and Developed with{' '}
              <span style={{ color: 'var(--primary)' }}>❤️</span>{' '}
              by{' '}
              <span style={{ color: 'var(--primary)' }}>Madesh</span>
              ,
              <span style={{ color: 'var(--primary)' }}>Umar </span>
              &{' '}
              <span style={{ color: 'var(--primary)' }}>Krishna</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;