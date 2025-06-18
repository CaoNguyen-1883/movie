"use client"

import type { ColumnDef } from "@tanstack/react-table"
import type { User } from "@/types/user"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header"
import { DataTableRowActions } from "./DataTableRowActions"

export const columns: ColumnDef<User>[] = [
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
    accessorKey: "username",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Username" />
    ),
    cell: ({ row }) => <div>{row.getValue("username")}</div>,
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => <div>{row.getValue("email")}</div>,
  },
  {
    accessorKey: "roles",
    header: "Roles",
    cell: ({ row }) => {
      const roles = row.original.roles;
      return (
        <div className="flex flex-wrap gap-1">
          {roles.map((role) => (
            <Badge key={role._id} variant="outline">{role.name}</Badge>
          ))}
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return row.original.roles.some(role => value.includes(role.name));
    },
    enableSorting: false,
  },
  {
    accessorKey: "isActive",
    header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
        const isActive = row.getValue("isActive");
        return (
            <Badge variant={isActive ? "default" : "destructive"}>
                {isActive ? "Active" : "Inactive"}
            </Badge>
        )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id) ? "Active" : "Inactive");
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
] 