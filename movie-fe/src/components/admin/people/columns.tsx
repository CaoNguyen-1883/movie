'use client';

import type { ColumnDef } from '@tanstack/react-table';
import type { Person } from '@/types/person';
import { DataTableColumnHeader } from '@/components/ui/data-table/data-table-column-header';
import { DataTableRowActions } from './DataTableRowActions';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export const columns: ColumnDef<Person>[] = [
  {
    accessorKey: 'photoUrl',
    header: 'Photo',
    cell: ({ row }) => {
      const photoUrl: string = row.getValue('photoUrl');
      const name: string = row.getValue('name');
      return (
        <Avatar>
          <AvatarImage src={photoUrl} alt={name} />
          <AvatarFallback>{name?.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => <div>{row.getValue('name')}</div>,
  },
  {
    accessorKey: 'bio',
    header: 'Bio',
    cell: ({ row }) => {
        const bio: string = row.getValue('bio');
        return <div className="truncate max-w-xs">{bio || '-'}</div>
    },
    enableSorting: false,
  },
  {
    accessorKey: 'birthDate',
    header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Birth Date" />
    ),
    cell: ({ row }) => {
        const birthDate: string = row.getValue('birthDate');
        return <div>{birthDate ? new Date(birthDate).toLocaleDateString() : '-'}</div>
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]; 