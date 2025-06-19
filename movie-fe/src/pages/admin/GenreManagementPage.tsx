'use client';

import * as React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  getFilteredRowModel,
  type ColumnDef,
  type SortingState,
  type VisibilityState,
  type ColumnFiltersState,
} from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table/DataTable';
import { columns } from '@/components/admin/genres/columns';
import { queryGenres } from '@/services/genreApi';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/useDebounce';
import type { Genre } from '@/types/genre';
import { AddGenreModal } from '@/components/admin/genres/AddGenreModal';

const GenreManagementPage = () => {
  const queryClient = useQueryClient();
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);

  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [searchTerm, setSearchTerm] = React.useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const [{ pageIndex, pageSize }, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const pagination = React.useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  );

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['genres', pagination, sorting, debouncedSearchTerm],
    queryFn: () =>
      queryGenres({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        sortBy: sorting.map((s) => `${s.id}:${s.desc ? 'desc' : 'asc'}`).join(',') || undefined,
        name: debouncedSearchTerm || undefined, // Assuming API supports filtering by name
      }),
  });

  const table = useReactTable({
    data: data?.results ?? [],
    columns: columns as ColumnDef<Genre>[],
    pageCount: data?.totalPages ?? -1,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
  });

  return (
    <div className="container mx-auto py-10">
      <AddGenreModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ['genres'] });
        }}
      />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Genre Management</h1>
        <Button onClick={() => setIsAddModalOpen(true)}>Add Genre</Button>
      </div>
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter by genre name..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          className="max-w-sm"
        />
      </div>
      <DataTable
        table={table}
        columns={columns as ColumnDef<Genre>[]}
        isLoading={isLoading}
        isError={isError}
        error={error as Error | null}
      />
    </div>
  );
};

export default GenreManagementPage;
