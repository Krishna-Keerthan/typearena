import React from 'react';
import { Github, Twitter, Facebook } from 'lucide-react';

const Footer = () => {
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

          {/* Quick Links */}
          <div>
            <h3 
              className="text-lg font-semibold mb-4"
              style={{ color: 'var(--textMuted)' }}
            >
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <a 
                  href="#"
                  className="transition-colors duration-200 hover:opacity-80"
                  style={{ color: 'var(--text)' }}
                >
                  About Us
                </a>
              </li>
              <li>
                <a 
                  href="#"
                  className="transition-colors duration-200 hover:opacity-80"
                  style={{ color: 'var(--text)' }}
                >
                  FAQ
                </a>
              </li>
              <li>
                <a 
                  href="#"
                  className="transition-colors duration-200 hover:opacity-80"
                  style={{ color: 'var(--text)' }}
                >
                  Contact
                </a>
              </li>
              <li>
                <a 
                  href="#"
                  className="transition-colors duration-200 hover:opacity-80"
                  style={{ color: 'var(--text)' }}
                >
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          {/* Connect With Us */}
          <div>
            <h3 
              className="text-lg font-semibold mb-4"
              style={{ color: 'var(--textMuted)' }}
            >
              Connect With Us
            </h3>
            <div className="flex space-x-4">
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
              <span style={{ color: 'var(--primary)' }}>Aman</span>{' '}
              &{' '}
              <span style={{ color: 'var(--primary)' }}>Aditya</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;