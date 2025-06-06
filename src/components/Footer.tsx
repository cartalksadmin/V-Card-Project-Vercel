
import React from 'react';
import { Heart } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full py-8 px-6 bg-gradient-to-r from-brand-600/10 to-brand-700/10 border-t border-gray-200 mt-10">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="text-sm text-gray-600 mb-4 md:mb-0">
            © {currentYear} NFC Contact Card. Tous droits réservés.
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600 flex items-center">
              Créé avec <Heart className="h-4 w-4 text-red-500 mx-1" /> par votre équipe
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
