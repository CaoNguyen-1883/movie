import { useMemo, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getColumns } from '@/components/admin/users/columns';
import { UsersTable } from '@/components/admin/users/UsersTable';
import { deleteUser, updateUser } from '@/services/userApi';
import type { User } from '@/types/user';
import { EditUserModal } from '@/components/admin/users/EditUserModal';
import type { EditUserFormData } from '@/components/admin/users/EditUserForm';

const UserManagementPage = () => {
  const queryClient = useQueryClient();
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const deleteUserMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      alert('User deleted successfully!');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (err) => {
      alert(`Error deleting user: ${err instanceof Error ? err.message : 'Unknown error'}`);
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: (data: { userId: string; updateData: EditUserFormData }) =>
      updateUser(data.userId, data.updateData as any),
    onSuccess: () => {
      alert('User updated successfully!');
      setEditingUser(null);
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (err) => {
      alert(`Error updating user: ${err instanceof Error ? err.message : 'Unknown error'}`);
    },
  });

  const handleEditSubmit = (data: EditUserFormData) => {
    if (!editingUser) return;
    updateUserMutation.mutate({ userId: editingUser.id, updateData: data });
  };

  const columns = useMemo(
    () => getColumns(deleteUserMutation.mutate, (user: User) => setEditingUser(user)),
    [deleteUserMutation.mutate]
  );

  return (
    <>
      <EditUserModal
        user={editingUser}
        onClose={() => setEditingUser(null)}
        onSubmit={handleEditSubmit}
        isSubmitting={updateUserMutation.isPending}
      />
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">User Management</h1>
        <UsersTable<User, unknown> columns={columns} />
      </div>
    </>
  );
};

export default UserManagementPage; 