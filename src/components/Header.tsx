
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  showAdminLink?: boolean;
}

const Header: React.FC<HeaderProps> = ({ showAdminLink = true }) => {
  return (
    <header className="w-full py-4 px-6 bg-white border-b border-gray-100 shadow-sm">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <div className="bg-brand-600 text-white p-2 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="M12 8v8" />
              <path d="M8 12h8" />
            </svg>
          </div>
          <span className="font-bold text-xl text-brand-900">NFC Card</span>
        </Link>
        
        <nav>
          <ul className="flex items-center space-x-4">
            {showAdminLink && (
              <li>
                <Button variant="outline" asChild>
                  <Link to="/admin">
                    Espace Admin
                  </Link>
                </Button>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
