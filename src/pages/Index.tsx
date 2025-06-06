import * as React from 'react';
import { useUsers } from '@/contexts/UserContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import UserCard from '@/components/UserCard';

const Index: React.FC = () => {
  const { users } = useUsers();

  return (
    <div className="min-h-screen flex flex-col bg-green-50">
      <Header />
      <main className="flex-grow">
        {/* Hero section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-green-600 text-white">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-white">
              Des cartes de visite NFC professionnelles
            </h1>
            <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8 text-white/90">
              Créez votre portfolio en ligne et partagez vos coordonnées en un scan.
            </p>
            <Button size="lg" asChild className="bg-green-800 hover:bg-green-700">
              <Link to="/admin">
                Commencer maintenant
              </Link>
            </Button>
          </div>
        </section>

        {/* Features section */}
        <section className="w-full py-12 md:py-24 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-green-600">Comment ça marche</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Un processus simple pour créer et partager votre profil professionnel.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="profile-card text-center p-6">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl font-bold">1</span>
                </div>
                <h3 className="text-xl font-bold mb-2 text-green-600">Créez votre profil</h3>
                <p className="text-gray-600">
                  Ajoutez vos informations personnelles et professionnelles via notre interface d'administration.
                </p>
              </div>

              <div className="profile-card text-center p-6">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl font-bold">2</span>
                </div>
                <h3 className="text-xl font-bold mb-2 text-green-600">Obtenez votre lien</h3>
                <p className="text-gray-600">
                  Recevez instantanément un lien vers votre portfolio en ligne personnel.
                </p>
              </div>

              <div className="profile-card text-center p-6">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl font-bold">3</span>
                </div>
                <h3 className="text-xl font-bold mb-2 text-green-600">Partagez facilement</h3>
                <p className="text-gray-600">
                  Associez votre lien à une carte NFC pour permettre aux autres de vous ajouter à leurs contacts en un scan.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Example profiles section */}
        {users.length > 0 && (
          <section className="w-full py-12 md:py-24 bg-gray-100">
            <div className="container mx-auto px-4 md:px-6">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4 text-green-600">Exemples de profils</h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Découvrez à quoi ressemblent nos portfolios professionnels.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {users.slice(0, 3).map(user => (
                  <div key={user.id} className="flex flex-col items-center">
                    <UserCard user={user} showActions={false} className="profile-card w-full" />
                    <div className="mt-4">
                      <Button asChild className="bg-green-800 hover:bg-green-700">
                        <Link to={`/portfolio/${user.id}`}>
                          Voir le profil
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA section */}
        <section className="w-full py-12 md:py-24 bg-green-600">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="text-3xl font-bold mb-4 text-white">Prêt à créer votre carte de visite numérique ?</h2>
            <p className="text-lg text-white/90 max-w-2xl mx-auto mb-8">
              Commencez dès maintenant et créez votre portfolio professionnel en quelques minutes.
            </p>
            <Button size="lg" asChild className="bg-green-800 hover:bg-green-700">
              <Link to="/admin">
                Accéder au panneau d'administration
              </Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;