
import * as React from 'react';
import { useUsers } from '@/contexts/UserContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { User, NewUser } from '@/types';
import { Link } from 'react-router-dom';
import { Plus, X } from 'lucide-react';
import Swal from 'sweetalert2';

const AdminDashboard: React.FC = () => {
  const { users, addUser, updateUser, deleteUser } = useUsers();
  const [currentTab, setCurrentTab] = React.useState('overview');
  const [searchTerm, setSearchTerm] = React.useState('');
  const [newUser, setNewUser] = React.useState<Partial<NewUser>>({
    skills: [], specializations: [], languages: [], personal_projects: [], certifications: [], awards: [], previous_positions: [], education: [], projects: []
  });
  const [editingUser, setEditingUser] = React.useState<User | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [hasError, setHasError] = React.useState(false);

  React.useEffect(() => {
    if (Array.isArray(users)) {
      setIsLoading(false);
      setHasError(false);
    } else {
      setIsLoading(false);
      setHasError(true);
    }
  }, [users]);

  const filteredUsers = Array.isArray(users)
    ? users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.profession.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.company && user.company.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : [];

  const uploadToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'V-Card2');

    try {
      const response = await fetch('https://api.cloudinary.com/v1_1/dq7avew9h/image/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        return data.secure_url;
      } else {
        throw new Error(data.error.message);
      }
    } catch (error) {
      console.error('Erreur lors de l\'upload sur Cloudinary:', error);
      toast.error("Erreur lors de l'upload de l'image");
      return null;
    }
  };

  const formatArrayForPostgres = (arr: string[] | undefined): string => {
    if (!arr || arr.length === 0) return '{}';
    return `{${arr.map(item => `"${item.replace(/"/g, '\\"')}"`).join(',')}}`;
  };

const handleAddUser = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!newUser.name || !newUser.profession || !newUser.photo) {
    Swal.fire({
      icon: 'error',
      title: 'Erreur',
      text: 'Le nom, la profession et la photo sont requis',
    });
    return;
  }

  const payload: NewUser = {
    ...newUser,
    skills: newUser.skills?.filter(s => s.trim()) || [],
    specializations: newUser.specializations?.filter(s => s.trim()) || [],
    languages: newUser.languages?.filter(l => l.trim()) || [],
    certifications: newUser.certifications?.filter(c => c.trim()) || [],
    awards: newUser.awards?.filter(a => a.trim()) || [],
    personal_projects: newUser.personal_projects?.filter(p => p.title.trim()) || [],
    previous_positions: newUser.previous_positions?.filter(p => p.title.trim()) || [],
    education: newUser.education?.filter(e => e.degree.trim()) || [],
    projects: newUser.projects?.filter(p => p.title.trim()) || [],
  } as NewUser;

  const formattedPayload = {
    ...payload,
    skills: formatArrayForPostgres(payload.skills),
    specializations: formatArrayForPostgres(payload.specializations),
    languages: formatArrayForPostgres(payload.languages),
    certifications: formatArrayForPostgres(payload.certifications),
    awards: formatArrayForPostgres(payload.awards),
    personal_projects: JSON.stringify(payload.personal_projects || []),
    previous_positions: JSON.stringify(payload.previous_positions || []),
    education: JSON.stringify(payload.education || []),
    projects: JSON.stringify(payload.projects || []),
  };

  console.log('Sending to backend:', formattedPayload);

  try {
    const userId = await addUser(formattedPayload);
    setNewUser({
      skills: [], specializations: [], languages: [], personal_projects: [], certifications: [], awards: [], previous_positions: [], education: [], projects: []
    });
    
    Swal.fire({
      icon: 'success',
      title: 'Succès',
      text: 'Utilisateur ajouté avec succès',
    });

    const portfolioLink = `${window.location.origin}/portfolio/${userId}`;
    await navigator.clipboard.writeText(portfolioLink);
    
    Swal.fire({
      icon: 'success',
      title: 'Lien copié',
      text: 'Lien copié dans le presse-papiers',
    });
    
    setCurrentTab('list');
  } catch (error: any) {
    console.error('Erreur dans handleAddUser:', error);
    Swal.fire({
      icon: 'error',
      title: 'Erreur',
      text: `Erreur lors de l'ajout: ${error.message || 'Erreur inconnue'}`,
    });
  }
};

  const handleUpdateUser = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!editingUser) return;

  if (!editingUser.name || !editingUser.profession || !editingUser.photo) {
    Swal.fire({
      icon: 'error',
      title: 'Erreur',
      text: "Le nom, la profession et la photo sont requis",
    });
    return;
  }

  const formattedPayload = {
    ...editingUser,
    skills: formatArrayForPostgres(editingUser.skills),
    specializations: formatArrayForPostgres(editingUser.specializations),
    languages: formatArrayForPostgres(editingUser.languages),
    certifications: formatArrayForPostgres(editingUser.certifications || []),
    awards: formatArrayForPostgres(editingUser.awards || []),
    personal_projects: JSON.stringify(editingUser.personal_projects || []),
    previous_positions: JSON.stringify(editingUser.previous_positions || []),
    education: JSON.stringify(editingUser.education || []),
    projects: JSON.stringify(editingUser.projects || []),
  };

  console.log('Updating user:', formattedPayload);

  try {
    await updateUser(editingUser.id, formattedPayload);
    setEditingUser(null);
    
    Swal.fire({
      icon: 'success',
      title: 'Succès',
      text: "Utilisateur mis à jour avec succès",
    });
    
    setCurrentTab('list');
  } catch (error: any) {
    console.error('Erreur dans handleUpdateUser:', error);
    Swal.fire({
      icon: 'error',
      title: 'Erreur',
      text: `Erreur lors de la mise à jour: ${error.message || 'Erreur inconnue'}`,
    });
  }
};

const handleDeleteUser = async (id: string) => {
  const result = await Swal.fire({
    title: 'Êtes-vous sûr ?',
    text: "Cette action est irréversible.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Oui, supprimer',
    cancelButtonText: 'Annuler',
  });

  if (result.isConfirmed) {
    try {
      await deleteUser(id);
      Swal.fire({
        icon: 'success',
        title: 'Succès',
        text: "Utilisateur supprimé avec succès",
      });
    } catch (error: any) {
      console.error('Erreur dans handleDeleteUser:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: `Erreur lors de la suppression: ${error.message || 'Erreur inconnue'}`,
      });
    }
  }
};

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setCurrentTab('edit');
  };

  const handleCopyLink = async (userId: string) => {
    const portfolioLink = `${window.location.origin}/portfolio/${userId}`;
    try {
      await navigator.clipboard.writeText(portfolioLink);
      toast.success("Lien copié dans le presse-papiers");
    } catch (error) {
      console.error('Erreur dans handleCopyLink:', error);
      toast.error("Impossible de copier le lien");
    }
  };

  const handleRetry = () => {
    setIsLoading(true);
    setHasError(false);
  };

  const DynamicFieldArray = ({ label, value, setValue, fields, placeholder }: {
    label: string;
    value: any[];
    setValue: (newValue: any[]) => void;
    fields: { name: string; label: string; type?: string }[];
    placeholder: string;
  }) => {
    const addItem = () => {
      const newItem = fields.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {});
      setValue([...value, newItem]);
    };

    const updateItem = (index: number, field: string, newValue: string) => {
      const newItems = [...value];
      newItems[index] = { ...newItems[index], [field]: newValue };
      setValue(newItems);
    };

    const removeItem = (index: number) => {
      setValue(value.filter((_, i) => i !== index));
    };

    return (
      <div className="space-y-2 sm:col-span-2">
        <label className="block text-sm font-medium">{label}</label>
        {value.map((item, index) => (
          <div key={index} className="border p-4 rounded-md relative">
            <button
              type="button"
              onClick={() => removeItem(index)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
            >
              <X size={16} />
            </button>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {fields.map(field => (
                <div key={field.name} className="space-y-2">
                  <label className="block text-sm font-medium">{field.label}</label>
                  {field.type === 'textarea' ? (
                    <textarea
                      value={item[field.name] || ''}
                      onChange={(e) => updateItem(index, field.name, e.target.value)}
                      placeholder={placeholder}
                      className="border border-gray-300 rounded-md p-2 w-full min-h-[80px]"
                    />
                  ) : (
                    <Input
                      type={field.type || 'text'}
                      value={item[field.name] || ''}
                      onChange={(e) => updateItem(index, field.name, e.target.value)}
                      placeholder={placeholder}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
        <Button type="button" variant="outline" onClick={addItem} className="mt-2">
          <Plus size={16} className="mr-2" /> Ajouter
        </Button>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow py-6 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Panneau d'administration</h1>
            <Card>
              <CardContent className="pt-6">
                <p className="text-center">Chargement des utilisateurs...</p>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow py-6 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Panneau d'administration</h1>
            <Card>
              <CardContent className="pt-6">
                <p className="text-red-500 text-center mb-4">
                  Erreur : Impossible de charger les utilisateurs.
                </p>
                <div className="flex justify-center">
                  <Button onClick={handleRetry} className="bg-brand-600 hover:bg-brand-700">
                    Réessayer
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-6 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Panneau d'administration</h1>

          <Tabs defaultValue="overview" value={currentTab} onValueChange={setCurrentTab}>
            <div className="mb-6">
              <TabsList className="grid grid-cols-3 gap-4 w-full sm:w-auto sm:flex">
                <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
                <TabsTrigger value="add">Ajouter un utilisateur</TabsTrigger>
                <TabsTrigger value="list">Liste des utilisateurs</TabsTrigger>
                {editingUser && <TabsTrigger value="edit">Modifier l'utilisateur</TabsTrigger>}
              </TabsList>
            </div>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total des utilisateurs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{users.length}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Dernier utilisateur ajouté</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {users.length > 0 ? (
                      <div>
                        <div className="text-xl font-bold">{users[users.length - 1].name}</div>
                        <div className="text-sm text-gray-500">{users[users.length - 1].profession}</div>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500">Aucun utilisateur</div>
                    )}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Actions rapides</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button variant="outline" onClick={() => setCurrentTab('add')} className="w-full">
                      Ajouter un utilisateur
                    </Button>
                    <Button variant="outline" onClick={() => setCurrentTab('list')} className="w-full">
                      Voir tous les utilisateurs
                    </Button>
                  </CardContent>
                </Card>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>Utilisateurs récents</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="py-3 px-2 text-left">Nom</th>
                          <th className="py-3 px-2 text-left">Profession</th>
                          <th className="py-3 px-2 text-left">Date d'ajout</th>
                          <th className="py-3 px-2 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.slice(-5).reverse().map(user => (
                          <tr key={user.id} className="border-b">
                            <td className="py-3 px-2">{user.name}</td>
                            <td className="py-3 px-2">{user.profession}</td>
                            <td className="py-3 px-2">{new Date(user.created_at).toLocaleDateString()}</td>
                            <td className="py-3 px-2 text-right space-x-1">
                              <Button size="sm" variant="outline" asChild>
                                <Link to={`/portfolio/${user.id}`} target="_blank">
                                  Voir
                                </Link>
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => handleCopyLink(user.id)}>
                                Copier le lien
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => handleEditUser(user)}>
                                Éditer
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-500 hover:text-red-700"
                                onClick={() => handleDeleteUser(user.id)}
                              >
                                Supprimer
                              </Button>
                            </td>
                          </tr>
                        ))}
                        {users.length === 0 && (
                          <tr>
                            <td colSpan={4} className="py-4 text-center text-gray-500">
                              Aucun utilisateur trouvé
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="add">
              <Card>
                <CardHeader>
                  <CardTitle>Ajouter un nouvel utilisateur</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddUser} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <label htmlFor="name" className="block text-sm font-medium">Nom *</label>
                        <Input
                          id="name"
                          value={newUser.name || ''}
                          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                          placeholder="Jean Dupont"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="profession" className="block text-sm font-medium">Profession *</label>
                        <Input
                          id="profession"
                          value={newUser.profession || ''}
                          onChange={(e) => setNewUser({ ...newUser, profession: e.target.value })}
                          placeholder="Développeur Web"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="company" className="block text-sm font-medium">Entreprise</label>
                        <Input
                          id="company"
                          value={newUser.company || ''}
                          onChange={(e) => setNewUser({ ...newUser, company: e.target.value })}
                          placeholder="Tech Solutions"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="address" className="block text-sm font-medium">Adresse</label>
                        <Input
                          id="address"
                          value={newUser.address || ''}
                          onChange={(e) => setNewUser({ ...newUser, address: e.target.value })}
                          placeholder="Paris, France"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="email" className="block text-sm font-medium">Email</label>
                        <Input
                          id="email"
                          type="email"
                          value={newUser.email || ''}
                          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                          placeholder="jean@example.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="phone" className="block text-sm font-medium">Téléphone</label>
                        <Input
                          id="phone"
                          value={newUser.phone || ''}
                          onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                          placeholder="+33 6 12 34 56 78"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="website" className="block text-sm font-medium">Site web</label>
                        <Input
                          id="website"
                          value={newUser.website || ''}
                          onChange={(e) => setNewUser({ ...newUser, website: e.target.value })}
                          placeholder="https://jeandupont.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="photo" className="block text-sm font-medium">Photo *</label>
                        <input
                          id="photo"
                          type="file"
                          accept="image/*"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const url = await uploadToCloudinary(file);
                              if (url) setNewUser({ ...newUser, photo: url });
                            }
                          }}
                          className="border border-gray-300 rounded-md p-2 w-full"
                          required
                        />
                        {newUser.photo && (
                          <img src={newUser.photo} alt="Aperçu" className="mt-2 w-32 h-32 object-cover rounded" />
                        )}
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="coverImage" className="block text-sm font-medium">Image de couverture</label>
                        <input
                          id="coverImage"
                          type="file"
                          accept="image/*"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const url = await uploadToCloudinary(file);
                              if (url) setNewUser({ ...newUser, coverImage: url });
                            }
                          }}
                          className="border border-gray-300 rounded-md p-2 w-full"
                        />
                        {newUser.coverImage && (
                          <img src={newUser.coverImage} alt="Aperçu" className="mt-2 w-32 h-32 object-cover rounded" />
                        )}
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="cv_url" className="block text-sm font-medium">URL du CV</label>
                        <Input
                          id="cv_url"
                          value={newUser.cv_url || ''}
                          onChange={(e) => setNewUser({ ...newUser, cv_url: e.target.value })}
                          placeholder="https://example.com/cv.pdf"
                        />
                      </div>
                      <div className="space-y-2 sm:col-span-2">
                        <label htmlFor="bio" className="block text-sm font-medium">Biographie</label>
                        <textarea
                          id="bio"
                          value={newUser.bio || ''}
                          onChange={(e) => setNewUser({ ...newUser, bio: e.target.value })}
                          placeholder="Une brève biographie"
                          className="border border-gray-300 rounded-md p-2 w-full min-h-[100px]"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="linkedIn" className="block text-sm font-medium">LinkedIn</label>
                        <Input
                          id="linkedIn"
                          value={newUser.linkedIn || ''}
                          onChange={(e) => setNewUser({ ...newUser, linkedIn: e.target.value })}
                          placeholder="https://linkedin.com/in/jeandupont"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="github" className="block text-sm font-medium">GitHub</label>
                        <Input
                          id="github"
                          value={newUser.github || ''}
                          onChange={(e) => setNewUser({ ...newUser, github: e.target.value })}
                          placeholder="https://github.com/jeandupont"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="twitter" className="block text-sm font-medium">Twitter</label>
                        <Input
                          id="twitter"
                          value={newUser.twitter || ''}
                          onChange={(e) => setNewUser({ ...newUser, twitter: e.target.value })}
                          placeholder="https://twitter.com/jeandupont"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="instagram" className="block text-sm font-medium">Instagram</label>
                        <Input
                          id="instagram"
                          value={newUser.instagram || ''}
                          onChange={(e) => setNewUser({ ...newUser, instagram: e.target.value })}
                          placeholder="https://instagram.com/jeandupont"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="skills" className="block text-sm font-medium">Compétences</label>
                        <Input
                          id="skills"
                          value={newUser.skills?.join(', ') || ''}
                          onChange={(e) => setNewUser({ 
                            ...newUser, 
                            skills: e.target.value ? e.target.value.split(',').map(s => s.trim()).filter(s => s) : [] 
                          })}
                          placeholder="JavaScript, React"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="years_of_experience" className="block text-sm font-medium">Années d'expérience</label>
                        <Input
                          id="years_of_experience"
                          type="number"
                          value={newUser.years_of_experience || ''}
                          onChange={(e) => setNewUser({ ...newUser, years_of_experience: parseInt(e.target.value) || undefined })}
                          placeholder="5"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="specializations" className="block text-sm font-medium">Spécialisations</label>
                        <Input
                          id="specializations"
                          value={newUser.specializations?.join(', ') || ''}
                          onChange={(e) => setNewUser({ 
                            ...newUser, 
                            specializations: e.target.value ? e.target.value.split(',').map(s => s.trim()).filter(s => s) : [] 
                          })}
                          placeholder="Développement Front-end, UI/UX"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="languages" className="block text-sm font-medium">Langues</label>
                        <Input
                          id="languages"
                          value={newUser.languages?.join(', ') || ''}
                          onChange={(e) => setNewUser({ 
                            ...newUser, 
                            languages: e.target.value ? e.target.value.split(',').map(s => s.trim()).filter(s => s) : [] 
                          })}
                          placeholder="Français, Anglais"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="certifications" className="block text-sm font-medium">Certifications</label>
                        <Input
                          id="certifications"
                          value={newUser.certifications?.join(', ') || ''}
                          onChange={(e) => setNewUser({ 
                            ...newUser, 
                            certifications: e.target.value ? e.target.value.split(',').map(s => s.trim()).filter(s => s) : [] 
                          })}
                          placeholder="AWS Certified Developer, Scrum Master"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="awards" className="block text-sm font-medium">Récompenses</label>
                        <Input
                          id="awards"
                          value={newUser.awards?.join(', ') || ''}
                          onChange={(e) => setNewUser({ 
                            ...newUser, 
                            awards: e.target.value ? e.target.value.split(',').map(s => s.trim()).filter(s => s) : [] 
                          })}
                          placeholder="Hackathon 2023, Prix de l'innovation"
                        />
                      </div>
                      <DynamicFieldArray
                        label="Projets personnels"
                        value={newUser.personal_projects || []}
                        setValue={(newValue) => setNewUser({ ...newUser, personal_projects: newValue })}
                        fields={[
                          { name: 'title', label: 'Titre' },
                          { name: 'description', label: 'Description', type: 'textarea' },
                          { name: 'link', label: 'Lien', type: 'url' }
                        ]}
                        placeholder="Ex: Portfolio personnel"
                      />
                      <DynamicFieldArray
                        label="Expériences professionnelles"
                        value={newUser.previous_positions || []}
                        setValue={(newValue) => setNewUser({ ...newUser, previous_positions: newValue })}
                        fields={[
                          { name: 'title', label: 'Poste' },
                          { name: 'company', label: 'Entreprise' },
                          { name: 'duration', label: 'Durée' },
                          { name: 'description', label: 'Description', type: 'textarea' }
                        ]}
                        placeholder="Ex: Développeur Senior"
                      />
                      <DynamicFieldArray
                        label="Formation"
                        value={newUser.education || []}
                        setValue={(newValue) => setNewUser({ ...newUser, education: newValue })}
                        fields={[
                          { name: 'degree', label: 'Diplôme' },
                          { name: 'institution', label: 'Établissement' },
                          { name: 'year', label: 'Année' }
                        ]}
                        placeholder="Ex: Master Informatique"
                      />
                      <DynamicFieldArray
                        label="Projets professionnels"
                        value={newUser.projects || []}
                        setValue={(newValue) => setNewUser({ ...newUser, projects: newValue })}
                        fields={[
                          { name: 'title', label: 'Titre' },
                          { name: 'description', label: 'Description', type: 'textarea' },
                          { name: 'link', label: 'Lien', type: 'url' }
                        ]}
                        placeholder="Ex: Application d'entreprise"
                      />
                    </div>
                    <div className="mt-6 flex justify-end">
                      <Button type="submit" className="bg-brand-600 hover:bg-brand-700">
                        Ajouter l'utilisateur
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="list">
              <Card>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <CardTitle>Liste des utilisateurs</CardTitle>
                    <div className="w-full sm:w-64">
                      <Input
                        placeholder="Rechercher..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="py-3 px-2 text-left">Nom</th>
                          <th className="py-3 px-2 text-left">Profession</th>
                          <th className="py-3 px-2 text-left">Email</th>
                          <th className="py-3 px-2 text-left">Date d'ajout</th>
                          <th className="py-3 px-2 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map(user => (
                          <tr key={user.id} className="border-b">
                            <td className="py-3 px-2">{user.name}</td>
                            <td className="py-3 px-2">{user.profession}</td>
                            <td className="py-3 px-2">{user.email || '-'}</td>
                            <td className="py-3 px-2">{new Date(user.created_at).toLocaleDateString()}</td>
                            <td className="py-3 px-2 text-right space-x-1">
                              <Button size="sm" variant="outline" asChild>
                                <Link to={`/portfolio/${user.id}`} target="_blank">
                                  Voir
                                </Link>
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => handleCopyLink(user.id)}>
                                Copier le lien
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => handleEditUser(user)}>
                                Éditer
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-500 hover:text-red-700"
                                onClick={() => handleDeleteUser(user.id)}
                              >
                                Supprimer
                              </Button>
                            </td>
                          </tr>
                        ))}
                        {filteredUsers.length === 0 && (
                          <tr>
                            <td colSpan={5} className="py-4 text-center text-gray-500">
                              Aucun utilisateur trouvé
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {editingUser && (
              <TabsContent value="edit">
                <Card>
                  <CardHeader>
                    <CardTitle>Modifier l'utilisateur</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleUpdateUser} className="space-y-4">
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <label htmlFor="edit-name" className="block text-sm font-medium">Nom *</label>
                          <Input
                            id="edit-name"
                            value={editingUser.name || ''}
                            onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="edit-profession" className="block text-sm font-medium">Profession *</label>
                          <Input
                            id="edit-profession"
                            value={editingUser.profession || ''}
                            onChange={(e) => setEditingUser({ ...editingUser, profession: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="edit-company" className="block text-sm font-medium">Entreprise</label>
                          <Input
                            id="edit-company"
                            value={editingUser.company || ''}
                            onChange={(e) => setEditingUser({ ...editingUser, company: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="edit-address" className="block text-sm font-medium">Adresse</label>
                          <Input
                            id="edit-address"
                            value={editingUser.address || ''}
                            onChange={(e) => setEditingUser({ ...editingUser, address: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="edit-email" className="block text-sm font-medium">Email</label>
                          <Input
                            id="edit-email"
                            type="email"
                            value={editingUser.email || ''}
                            onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="edit-phone" className="block text-sm font-medium">Téléphone</label>
                          <Input
                            id="edit-phone"
                            value={editingUser.phone || ''}
                            onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="edit-website" className="block text-sm font-medium">Site web</label>
                          <Input
                            id="edit-website"
                            value={editingUser.website || ''}
                            onChange={(e) => setEditingUser({ ...editingUser, website: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="edit-photo" className="block text-sm font-medium">Photo *</label>
                          <input
                            id="edit-photo"
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const url = await uploadToCloudinary(file);
                                if (url) setEditingUser({ ...editingUser, photo: url });
                              }
                            }}
                            className="border border-gray-300 rounded-md p-2 w-full"
                          />
                          {editingUser.photo && (
                            <img src={editingUser.photo} alt="Aperçu" className="mt-2 w-32 h-32 object-cover rounded" />
                          )}
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="edit-coverImage" className="block text-sm font-medium">Image de couverture</label>
                          <input
                            id="edit-coverImage"
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const url = await uploadToCloudinary(file);
                                if (url) setEditingUser({ ...editingUser, coverImage: url });
                              }
                            }}
                            className="border border-gray-300 rounded-md p-2 w-full"
                          />
                          {editingUser.coverImage && (
                            <img src={editingUser.coverImage} alt="Aperçu" className="mt-2 w-32 h-32 object-cover rounded" />
                          )}
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="edit-cv_url" className="block text-sm font-medium">URL du CV</label>
                          <Input
                            id="edit-cv_url"
                            value={editingUser.cv_url || ''}
                            onChange={(e) => setEditingUser({ ...editingUser, cv_url: e.target.value })}
                            placeholder="https://example.com/cv.pdf"
                          />
                        </div>
                        <div className="space-y-2 sm:col-span-2">
                          <label htmlFor="edit-bio" className="block text-sm font-medium">Biographie</label>
                          <textarea
                            id="edit-bio"
                            value={editingUser.bio || ''}
                            onChange={(e) => setEditingUser({ ...editingUser, bio: e.target.value })}
                            placeholder="Une brève biographie"
                            className="border border-gray-300 rounded-md p-2 w-full min-h-[100px]"
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="edit-linkedIn" className="block text-sm font-medium">LinkedIn</label>
                          <Input
                            id="edit-linkedIn"
                            value={editingUser.linkedIn || ''}
                            onChange={(e) => setEditingUser({ ...editingUser, linkedIn: e.target.value })}
                            placeholder="https://linkedin.com/in/jeandupont"
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="edit-github" className="block text-sm font-medium">GitHub</label>
                          <Input
                            id="edit-github"
                            value={editingUser.github || ''}
                            onChange={(e) => setEditingUser({ ...editingUser, github: e.target.value })}
                            placeholder="https://github.com/jeandupont"
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="edit-twitter" className="block text-sm font-medium">Twitter</label>
                          <Input
                            id="edit-twitter"
                            value={editingUser.twitter || ''}
                            onChange={(e) => setEditingUser({ ...editingUser, twitter: e.target.value })}
                            placeholder="https://twitter.com/jeandupont"
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="edit-instagram" className="block text-sm font-medium">Instagram</label>
                          <Input
                            id="edit-instagram"
                            value={editingUser.instagram || ''}
                            onChange={(e) => setEditingUser({ ...editingUser, instagram: e.target.value })}
                            placeholder="https://instagram.com/jeandupont"
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="edit-skills" className="block text-sm font-medium">Compétences</label>
                          <Input
                            id="edit-skills"
                            value={editingUser.skills?.join(', ') || ''}
                            onChange={(e) => setEditingUser({ 
                              ...editingUser, 
                              skills: e.target.value ? e.target.value.split(',').map(s => s.trim()).filter(s => s) : [] 
                            })}
                            placeholder="JavaScript, React"
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="edit-years_of_experience" className="block text-sm font-medium">Années d'expérience</label>
                          <Input
                            id="edit-years_of_experience"
                            type="number"
                            value={editingUser.years_of_experience || ''}
                            onChange={(e) => setEditingUser({ ...editingUser, years_of_experience: parseInt(e.target.value) || undefined })}
                            placeholder="5"
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="edit-specializations" className="block text-sm font-medium">Spécialisations</label>
                          <Input
                            id="edit-specializations"
                            value={editingUser.specializations?.join(', ') || ''}
                            onChange={(e) => setEditingUser({ 
                              ...editingUser, 
                              specializations: e.target.value ? e.target.value.split(',').map(s => s.trim()).filter(s => s) : [] 
                            })}
                            placeholder="Développement Front-end, UI/UX"
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="edit-languages" className="block text-sm font-medium">Langues</label>
                          <Input
                            id="edit-languages"
                            value={editingUser.languages?.join(', ') || ''}
                            onChange={(e) => setEditingUser({ 
                              ...editingUser, 
                              languages: e.target.value ? e.target.value.split(',').map(s => s.trim()).filter(s => s) : [] 
                            })}
                            placeholder="Français, Anglais"
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="edit-certifications" className="block text-sm font-medium">Certifications</label>
                          <Input
                            id="edit-certifications"
                            value={editingUser.certifications?.join(', ') || ''}
                            onChange={(e) => setEditingUser({ 
                              ...editingUser, 
                              certifications: e.target.value ? e.target.value.split(',').map(s => s.trim()).filter(s => s) : [] 
                            })}
                            placeholder="AWS Certified Developer, Scrum Master"
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="edit-awards" className="block text-sm font-medium">Récompenses</label>
                          <Input
                            id="edit-awards"
                            value={editingUser.awards?.join(', ') || ''}
                            onChange={(e) => setEditingUser({ 
                              ...editingUser, 
                              awards: e.target.value ? e.target.value.split(',').map(s => s.trim()).filter(s => s) : [] 
                            })}
                            placeholder="Hackathon 2023, Prix de l'innovation"
                          />
                        </div>
                        <DynamicFieldArray
                          label="Projets personnels"
                          value={editingUser.personal_projects || []}
                          setValue={(newValue) => setEditingUser({ ...editingUser, personal_projects: newValue })}
                          fields={[
                            { name: 'title', label: 'Titre' },
                            { name: 'description', label: 'Description', type: 'textarea' },
                            { name: 'link', label: 'Lien', type: 'url' }
                          ]}
                          placeholder="Ex: Portfolio personnel"
                        />
                        <DynamicFieldArray
                          label="Expériences professionnelles"
                          value={editingUser.previous_positions || []}
                          setValue={(newValue) => setEditingUser({ ...editingUser, previous_positions: newValue })}
                          fields={[
                            { name: 'title', label: 'Poste' },
                            { name: 'company', label: 'Entreprise' },
                            { name: 'duration', label: 'Durée' },
                            { name: 'description', label: 'Description', type: 'textarea' }
                          ]}
                          placeholder="Ex: Développeur Senior"
                        />
                        <DynamicFieldArray
                          label="Formation"
                          value={editingUser.education || []}
                          setValue={(newValue) => setEditingUser({ ...editingUser, education: newValue })}
                          fields={[
                            { name: 'degree', label: 'Diplôme' },
                            { name: 'institution', label: 'Établissement' },
                            { name: 'year', label: 'Année' }
                          ]}
                          placeholder="Ex: Master Informatique"
                        />
                        <DynamicFieldArray
                          label="Projets professionnels"
                          value={editingUser.projects || []}
                          setValue={(newValue) => setEditingUser({ ...editingUser, projects: newValue })}
                          fields={[
                            { name: 'title', label: 'Titre' },
                            { name: 'description', label: 'Description', type: 'textarea' },
                            { name: 'link', label: 'Lien', type: 'url' }
                          ]}
                          placeholder="Ex: Application d'entreprise"
                        />
                      </div>
                      <div className="mt-6 flex justify-between">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setEditingUser(null);
                            setCurrentTab('list');
                          }}
                        >
                          Annuler
                        </Button>
                        <Button type="submit" className="bg-brand-600 hover:bg-brand-700">
                          Mettre à jour
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;