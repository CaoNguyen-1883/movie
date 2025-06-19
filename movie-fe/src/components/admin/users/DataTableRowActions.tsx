"use client"

import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import type { Row } from '@tanstack/react-table';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ConfirmationDialog } from '@/components/common/ConfirmationDialog';
import type { User } from '@/types/user';

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
  onDelete: (id: string) => void;
  onEdit: (user: TData) => void;
}

export function DataTableRowActions<TData>({ row, onDelete, onEdit }: DataTableRowActionsProps<TData>) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const user = row.original as User;

  const handleEdit = () => {
    onEdit(row.original);
  };

  const confirmDelete = () => {
    onDelete(user.id);
    setIsDeleteDialogOpen(false);
  };

  return (
    <>
      <ConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Are you absolutely sure?"
        description={`This action cannot be undone. This will permanently delete the user "${user.username}".`}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
            <DotsHorizontalIcon className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem onClick={handleEdit}>Edit</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setIsDeleteDialogOpen(true)} className="text-red-600">
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
} 