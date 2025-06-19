'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { EditUserForm, type EditUserFormData } from './EditUserForm';
import type { User } from '@/types/user';

interface EditUserModalProps {
  user: User | null; // User to edit, or null to close the modal
  onClose: () => void;
  onSubmit: (data: EditUserFormData) => void;
  isSubmitting: boolean;
}

export const EditUserModal = ({ user, onClose, onSubmit, isSubmitting }: EditUserModalProps) => {
  const isOpen = !!user;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Make changes to the user's profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        {user && (
          <EditUserForm 
            user={user} 
            onSubmit={onSubmit}
            onCancel={onClose}
            isSubmitting={isSubmitting}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}; 