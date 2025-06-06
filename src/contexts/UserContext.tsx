
import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { User, NewUser } from '@/types';

// Définir le type du contexte
interface UserContextType {
  users: User[];
  addUser: (user: NewUser) => Promise<string>;
  updateUser: (id: string, updatedUser: Partial<User>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  getUserById: (id: string) => User | undefined;
}

// Créer le contexte
const UserContext = createContext<UserContextType | undefined>(undefined);

// Fournisseur du contexte
export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);

  // Charger les utilisateurs depuis l'API au montage
  useEffect(() => {
    const fetchUsers = async (retries = 3, delay = 500) => {
      for (let attempt = 1; attempt <= retries; attempt++) {
        try {
          const response = await axios.get('http://localhost:5000/api/users');
          console.log('API response for /api/users:', response.data); // Debug
          if (Array.isArray(response.data)) {
            setUsers(response.data);
            return;
          } else {
            console.error('API did not return an array:', response.data);
            setUsers([]);
            toast.error('Erreur : Les données des utilisateurs ne sont pas valides.');
          }
        } catch (error: any) {
          console.error(`Tentative ${attempt} - Erreur lors de la récupération des utilisateurs:`, error);
          if (error.response?.status === 404) {
            toast.error('Endpoint API introuvable. Vérifiez la configuration du serveur.');
            setUsers([]);
            return;
          }
          if (attempt < retries) {
            await new Promise(resolve => setTimeout(resolve, delay));
            continue;
          }
          toast.error('Erreur lors du chargement des utilisateurs. Veuillez réessayer plus tard.');
          setUsers([]);
        }
      }
    };
    fetchUsers();
  }, []);

  // Ajouter un utilisateur
  const addUser = async (newUser: NewUser): Promise<string> => {
    // Validate required fields
    if (!newUser.name || !newUser.profession) {
      console.error('Validation error: name and profession are required');
      toast.error('Le nom et la profession sont requis.');
      throw new Error('Name and profession are required');
    }

    try {
      console.log('Sending POST /api/users with:', newUser); // Debug
      const response = await axios.post('http://localhost:5000/api/users', newUser);
      const newUserData = response.data;
      setUsers(prevUsers => [...prevUsers, newUserData]);
      return newUserData.id;
    } catch (error: any) {
      console.error('Erreur lors de l\'ajout de l\'utilisateur:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      if (error.response?.status === 404) {
        toast.error('Endpoint API introuvable. Vérifiez la configuration du serveur.');
      } else if (error.response?.status === 400) {
        toast.error(error.response.data.error || 'Données invalides. Veuillez vérifier les champs.');
      } else {
        toast.error(`Erreur lors de l'ajout de l'utilisateur: ${error.response?.data?.details || error.message}`);
      }
      throw error;
    }
  };

  // Mettre à jour un utilisateur
  const updateUser = async (id: string, updatedUser: Partial<User>): Promise<void> => {
    try {
      console.log(`Sending PUT /api/users/${id} with:`, updatedUser); // Debug
      const response = await axios.put(`http://localhost:5000/api/users/${id}`, updatedUser);
      setUsers(prevUsers =>
        prevUsers.map(user => (user.id === id ? response.data : user))
      );
    } catch (error: any) {
      console.error('Erreur lors de la mise à jour de l\'utilisateur:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      if (error.response?.status === 404) {
        toast.error('Endpoint API introuvable ou utilisateur non trouvé.');
      } else if (error.response?.status === 400) {
        toast.error(error.response.data.error || 'Données invalides. Veuillez vérifier les champs.');
      } else {
        toast.error(`Erreur lors de la mise à jour de l'utilisateur: ${error.response?.data?.details || error.message}`);
      }
      throw error;
    }
  };

  // Supprimer un utilisateur
  const deleteUser = async (id: string): Promise<void> => {
    try {
      console.log(`Sending DELETE /api/users/${id}`); // Debug
      await axios.delete(`http://localhost:5000/api/users/${id}`);
      setUsers(prevUsers => prevUsers.filter(user => user.id !== id));
    } catch (error: any) {
      console.error('Erreur lors de la suppression de l\'utilisateur:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      if (error.response?.status === 404) {
        toast.error('Endpoint API introuvable ou utilisateur non trouvé.');
      } else {
        toast.error(`Erreur lors de la suppression de l'utilisateur: ${error.response?.data?.details || error.message}`);
      }
      throw error;
    }
  };

  // Récupérer un utilisateur par ID (côté client)
  const getUserById = (id: string): User | undefined => {
    return users.find(user => user.id === id);
  };

  return (
    <UserContext.Provider
      value={{
        users,
        addUser,
        updateUser,
        deleteUser,
        getUserById
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Hook pour utiliser le contexte
export const useUsers = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUsers must be used within a UserProvider');
  }
  return context;
};