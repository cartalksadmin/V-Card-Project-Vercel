import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useUsers } from '@/contexts/UserContext';
import { Phone, Mail, Globe, MapPin, Building, Download, X, Linkedin, Github, Instagram, Twitter, ChevronDown } from 'lucide-react';

const Portfolio = () => {
  const { id } = useParams();
  const { getUserById } = useUsers();
  const [showModal, setShowModal] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [showContactInfo, setShowContactInfo] = useState(false);
  const user = getUserById(id || "");

  useEffect(() => {
    setAnimate(true);
    const timer = setTimeout(() => {
      setShowModal(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleSaveContact = () => {
    if (!user) return;
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
      user.bio ? `NOTE:${user.bio}` : '',
      user.linkedin ? `URL:${user.linkedin}` : '',
      user.github ? `URL:${user.github}` : '',
      user.instagram ? `URL:${user.instagram}` : '',
      user.twitter ? `URL:${user.twitter}` : '',
      user.skills ? `NOTE:Compétences: ${user.skills.join(', ')}` : '',
      user.years_of_experience ? `NOTE:${user.years_of_experience} années d'expérience` : '',
      user.specializations ? `NOTE:Spécialisations: ${user.specializations.join(', ')}` : '',
      user.languages ? `NOTE:Langues: ${user.languages.join(', ')}` : '',
      user.certifications ? `NOTE:Certifications: ${user.certifications.join(', ')}` : '',
      user.awards ? `NOTE:Récompenses: ${user.awards.join(', ')}` : '',
      'END:VCARD'
    ].filter(Boolean).join('\n');
    
    const blob = new Blob([vCardData], { type: 'text/vcard' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${user.name.replace(/\s+/g, '_')}.vcf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    console.log("Contact téléchargé avec succès!");
  };

  const Header = () => (
    <header className="bg-white border-b border-gray-200 py-3">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <div className="font-semibold text-lg text-blue-700">Portfolio</div>
      </div>
    </header>
  );

  const Footer = () => (
    <footer className="bg-gray-100 text-gray-600 py-6">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm">© {new Date().getFullYear()} Portfolio. Tous droits réservés.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="text-gray-500 hover:text-blue-700 transition-colors">Mentions légales</a>
            <a href="#" className="text-gray-500 hover:text-blue-700 transition-colors">Politique de confidentialité</a>
          </div>
        </div>
      </div>
    </footer>
  );

  const ContactModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
          <div className="flex justify-between items-center border-b border-gray-200 p-4">
            <h3 className="text-lg font-medium text-gray-900">Enregistrer le contact</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500 focus:outline-none">
              <X size={20} />
            </button>
          </div>
          <div className="p-6">
            <p className="text-gray-600 mb-4">
              Voulez-vous enregistrer les coordonnées de {user?.name || 'l\'utilisateur'} dans vos contacts ?
            </p>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  handleSaveContact();
                  onClose();
                }}
                className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-white hover:bg-blue-700 focus:outline-none"
              >
                Télécharger vCard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-100">
        <Header />
        <div className="flex-grow flex items-center justify-center p-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600">Profil non trouvé</h1>
            <p className="mt-2 text-gray-600">Le profil demandé n'existe pas ou a été supprimé.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const animationClass = animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8";

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      <main className="flex-grow py-6 px-4 sm:px-6">
        <div className={`max-w-5xl mx-auto transition-all duration-700 ease-out transform ${animationClass}`}>
          {/* Banner */}
          <div className="relative h-48 sm:h-64 bg-blue-200 rounded-t-lg overflow-hidden">
            {user.coverImage ? (
              <img src={user.coverImage} alt="Couverture" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-green-500 to-green-500" />
            )}
          </div>

          {/* Profile Card */}
          <div className="bg-white rounded-b-lg shadow-md -mt-16 sm:-mt-20 relative">
            <div className="px-4 sm:px-6 pt-4 pb-6">
              <div className="flex flex-col sm:flex-row sm:items-end">
                <img
                  src={user.photo || "/api/placeholder/150/150"}
                  alt={user.name}
                  className="h-24 w-24 sm:h-32 sm:w-32 rounded-full border-4 border-white shadow-md object-cover mb-4 sm:mb-0"
                />
                <div className="flex-1 sm:ml-6 text-center sm:text-left">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{user.name}</h1>
                  <p className="text-lg text-gray-700">{user.profession}</p>
                  {user.company && (
                    <p className="text-md text-gray-600">{user.company}</p>
                  )}
                  {user.address && (
                    <p className="text-sm text-gray-500 flex items-center justify-center sm:justify-start mt-1">
                      <MapPin size={16} className="mr-1" /> {user.address}
                    </p>
                  )}
                  {user.years_of_experience && (
                    <p className="text-sm text-gray-500 mt-1">{user.years_of_experience} années d'expérience</p>
                  )}
                  <div className="mt-4 flex flex-col sm:flex-row gap-2 justify-center sm:justify-start">
                    <button
                      onClick={() => setShowModal(true)}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 focus:outline-none"
                    >
                      <Download size={16} className="mr-2" />
                      Enregistrer le contact
                    </button>
                    {user.cv_url && (
                      <a
                        href={user.cv_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-50 focus:outline-none"
                      >
                        <Download size={16} className="mr-2" />
                        Télécharger le CV
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column (Main Content) */}
            <div className="lg:col-span-2 space-y-6">
              {/* About Section */}
              {user.bio && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">À propos</h2>
                  <p className="text-gray-600">{user.bio}</p>
                </div>
              )}

              {/* Experience Section */}
              {user.previous_positions?.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Expérience</h2>
                  {user.previous_positions.map((position, index) => (
                    <div key={index} className="mb-6 last:mb-0">
                      <h3 className="text-lg font-medium text-gray-900">{position.title}</h3>
                      <p className="text-md text-gray-700">{position.company}</p>
                      <p className="text-sm text-gray-500">{position.duration}</p>
                      <p className="text-gray-600 mt-2">{position.description}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Education Section */}
              {user.education?.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Formation</h2>
                  {user.education.map((edu, index) => (
                    <div key={index} className="mb-6 last:mb-0">
                      <h3 className="text-lg font-medium text-gray-900">{edu.degree}</h3>
                      <p className="text-md text-gray-700">{edu.institution}</p>
                      <p className="text-sm text-gray-500">{edu.year}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Projects Section */}
              {user.projects?.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Projets</h2>
                  {user.projects.map((project, index) => (
                    <div key={index} className="mb-6 last:mb-0">
                      <h3 className="text-lg font-medium text-gray-900">{project.title}</h3>
                      <p className="text-gray-600">{project.description}</p>
                      {project.link && (
                        <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Voir le projet</a>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Personal Projects Section */}
              {user.personal_projects?.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Projets personnels</h2>
                  {user.personal_projects.map((project, index) => (
                    <div key={index} className="mb-6 last:mb-0">
                      <h3 className="text-lg font-medium text-gray-900">{project.title}</h3>
                      <p className="text-gray-600">{project.description}</p>
                      {project.link && (
                        <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Voir le projet</a>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Skills Section */}
              {user.skills?.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Compétences</h2>
                  <div className="flex flex-wrap gap-2">
                    {user.skills.map((skill, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">{skill}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Specializations Section */}
              {user.specializations?.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Spécialisations</h2>
                  <div className="flex flex-wrap gap-2">
                    {user.specializations.map((spec, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">{spec}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Languages Section */}
              {user.languages?.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Langues</h2>
                  <div className="flex flex-wrap gap-2">
                    {user.languages.map((lang, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">{lang}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Certifications and Awards Section */}
              {(user.certifications?.length > 0 || user.awards?.length > 0) && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Certifications et Récompenses</h2>
                  {user.certifications?.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Certifications</h3>
                      <ul className="list-disc pl-5 text-gray-600">
                        {user.certifications.map((cert, index) => (
                          <li key={index}>{cert}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {user.awards?.length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Récompenses</h3>
                      <ul className="list-disc pl-5 text-gray-600">
                        {user.awards.map((award, index) => (
                          <li key={index}>{award}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Column (Contact Info) */}
            <div className="space-y-6">
              {/* Contact Info Card */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <button
                  onClick={() => setShowContactInfo(!showContactInfo)}
                  className="flex items-center justify-between w-full text-lg font-semibold text-gray-900 mb-4 focus:outline-none"
                >
                  Informations de contact
                  <ChevronDown size={20} className={`transform transition-transform ${showContactInfo ? 'rotate-180' : ''}`} />
                </button>
                {showContactInfo && (
                  <div className="space-y-4">
                    {user.email && (
                      <div className="flex items-start">
                        <Mail className="h-5 w-5 text-blue-600 flex-shrink-0" />
                        <div className="ml-3 text-sm">
                          <p className="text-gray-500">Email</p>
                          <a href={`mailto:${user.email}`} className="text-blue-600 hover:underline">{user.email}</a>
                        </div>
                      </div>
                    )}
                    {user.phone && (
                      <div className="flex items-start">
                        <Phone className="h-5 w-5 text-blue-600 flex-shrink-0" />
                        <div className="ml-3 text-sm">
                          <p className="text-gray-500">Téléphone</p>
                          <a href={`tel:${user.phone}`} className="text-blue-600 hover:underline">{user.phone}</a>
                        </div>
                      </div>
                    )}
                    {user.website && (
                      <div className="flex items-start">
                        <Globe className="h-5 w-5 text-blue-600 flex-shrink-0" />
                        <div className="ml-3 text-sm">
                          <p className="text-gray-500">Site web</p>
                          <a href={user.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            {user.website.replace(/^https?:\/\//, '')}
                          </a>
                        </div>
                      </div>
                    )}
                    {(user.linkedin || user.github || user.instagram || user.twitter) && (
                      <div className="pt-4 border-t border-gray-200">
                        <h3 className="text-md font-medium text-gray-900 mb-2">Réseaux sociaux</h3>
                        <div className="flex space-x-4">
                          {user.linkedin && (
                            <a href={user.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600">
                              <Linkedin size={20} />
                            </a>
                          )}
                          {user.github && (
                            <a href={user.github} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600">
                              <Github size={20} />
                            </a>
                          )}
                          {user.instagram && (
                            <a href={user.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600">
                              <Instagram size={20} />
                            </a>
                          )}
                          {user.twitter && (
                            <a href={user.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600">
                              <Twitter size={20} />
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <ContactModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
};

export default Portfolio;
