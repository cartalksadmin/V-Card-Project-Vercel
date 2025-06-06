
import React from 'react';
import { User } from '@/types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ContactModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

const ContactModal: React.FC<ContactModalProps> = ({ user, isOpen, onClose, onSave }) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Enregistrer le contact</AlertDialogTitle>
          <AlertDialogDescription>
            Souhaitez-vous enregistrer les informations de contact de {user.name} ?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Non</AlertDialogCancel>
          <AlertDialogAction onClick={() => { onSave(); onClose(); }}>
            Oui
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ContactModal;
