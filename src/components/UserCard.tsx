import React from 'react';
import { User } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import Swal from 'sweetalert2'; // Importer SweetAlert2
import { Heart, Award } from 'lucide-react';

interface UserCardProps {
  user: User;
  showActions?: boolean;
}

const UserCard: React.FC<UserCardProps> = ({ user, showActions = true }) => {
  // Fonction pour sauvegarder le contact
  const saveContact = () => {
    // Préparation des données de contact pour le format vCard
    const vCardData = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `FN:${user.name}`,
      `TITLE:${user.profession}`,
      user.company ? `ORG:${user.company}` : '',
      user.address ? `ADR:;;${user.address};;;` : '',
      user.email ? `EMAIL:${user.email}` : '',
      user.phone ? `TEL:${user.phone}` : '',
      user.website ? `URL:${user.website}` : '',
      'END:VCARD'
    ].filter(Boolean).join('\n');
    
    // Création d'un Blob et d'un URL pour le téléchargement
    const blob = new Blob([vCardData], { type: 'text/vcard' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${user.name.replace(/\s+/g, '_')}.vcf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Utilisation de SweetAlert2 pour le message de succès
    Swal.fire({
      icon: 'success',
      title: 'Succès',
      text: "Contact téléchargé avec succès!",
    });
  };

  return (
    <Card className="profile-card w-full max-w-md mx-auto overflow-hidden card-shadow">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30 z-0"></div>
        <CardHeader className="gradient-header p-8 text-center relative z-10">
          <div className="rounded-full w-36 h-36 mx-auto border-4 border-white overflow-hidden bg-white shadow-lg float">
            <img 
              src={user.photo || "/placeholder.svg"} 
              alt={`Photo de ${user.name}`} 
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-3xl font-bold mt-6 tracking-tight">{user.name}</h2>
          <div className="flex items-center justify-center mt-2 space-x-2">
            <Award className="h-5 w-5 text-yellow-300" />
            <p className="text-lg opacity-90">{user.profession}</p>
          </div>
          {user.company && <p className="text-sm opacity-80 mt-1 font-medium">{user.company}</p>}
        </CardHeader>
      </div>
      
      <CardContent className="p-8 space-y-6 bg-gradient-to-b from-white to-gray-50">
        <div className="space-y-4">
          {user.address && (
            <div className="flex items-start group">
              <div className="min-w-10 text-brand-600 group-hover:text-brand-700 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <span className="text-gray-700 group-hover:text-gray-900 transition-colors">{user.address}</span>
            </div>
          )}
          
          {user.email && (
            <div className="flex items-center group">
              <div className="min-w-10 text-brand-600 group-hover:text-brand-700 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
              </div>
              <a href={`mailto:${user.email}`} className="text-gray-700 hover:text-brand-600 transition-colors">{user.email}</a>
            </div>
          )}
          
          {user.phone && (
            <div className="flex items-center group">
              <div className="min-w-10 text-brand-600 group-hover:text-brand-700 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </div>
              <a href={`tel:${user.phone}`} className="text-gray-700 hover:text-brand-600 transition-colors">{user.phone}</a>
            </div>
          )}
          
          {user.website && (
            <div className="flex items-center group">
              <div className="min-w-10 text-brand-600 group-hover:text-brand-700 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  <path d="M2 12h20" />
                </svg>
              </div>
              <a href={user.website.startsWith('http') ? user.website : `https://${user.website}`} target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-brand-600 transition-colors">
                {user.website}
              </a>
            </div>
          )}
        </div>
        
        {showActions && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <Button 
              onClick={saveContact}
              className="w-full bg-brand-600 hover:bg-brand-700 hover-scale group"
            >
              <Heart 
                className="mr-2 transition-transform group-hover:scale-110 duration-300" 
                size={18}
              /> 
              Enregistrer le contact
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserCard;