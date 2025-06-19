"use client"

import type { ColumnDef } from "@tanstack/react-table"
import type { User } from "@/types/user"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header"
import { DataTableRowActions } from "./DataTableRowActions"

export const getColumns = (
  onDelete: (id: string) => void,
  onEdit: (user: User) => void
): ColumnDef<User>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "fullName",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Full Name" />,
    cell: ({ row }) => <div>{row.original.fullName || row.original.username}</div>,
  },
  {
    accessorKey: "email",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
  },
  {
    accessorKey: "roles",
    header: "Roles",
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-1">
        {row.original.roles?.map((role) => (
          <Badge key={role.id} variant="outline">{role.name}</Badge>
        ))}
      </div>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Created At" />,
    cell: ({ row }) => <div>{new Date(row.original.createdAt).toLocaleDateString()}</div>,
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} onDelete={onDelete} onEdit={onEdit} />,
  },
] 