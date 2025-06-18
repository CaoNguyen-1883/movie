'use client';

import * as React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
  type Row,
} from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table/DataTable';
import { columns as initialColumns } from '@/components/admin/movies/columns';
import { getMovies, deleteMovie } from '@/services/movieApi';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/useDebounce';
import type { Movie } from '@/types/movie';
import { AddMovieModal } from '@/components/admin/movies/AddMovieModal';
import { EditMovieModal } from '@/components/admin/movies/EditMovieModal';
import { VideoPlayerModal } from '@/components/common/VideoPlayerModal';
import { ConfirmationDialog } from '@/components/common/ConfirmationDialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, PlayCircle, Video, Trash2, Pencil } from 'lucide-react';

const ActionsCell = ({ 
    row, 
    onPlay,
    onDelete,
    onEdit,
}: { 
    row: Row<Movie>, 
    onPlay: (url: string, title: string) => void,
    onDelete: (movie: Movie) => void,
    onEdit: (movie: Movie) => void,
}) => {
    const movie = row.original;
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => onEdit(movie)}>
                    <Pencil className="mr-2 h-4 w-4" /> Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDelete(movie)} className="text-red-500">
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Playback</DropdownMenuLabel>
                <DropdownMenuItem
                    disabled={!movie.trailerUrl}
                    onClick={() => movie.trailerUrl && onPlay(movie.trailerUrl, `${movie.title} (Trailer)`)}
                >
                    <PlayCircle className="mr-2 h-4 w-4" /> Play Trailer
                </DropdownMenuItem>
                <DropdownMenuItem
                    disabled={!movie.videoUrl}
                    onClick={() => movie.videoUrl && onPlay(movie.videoUrl, movie.title)}
                >
                    <Video className="mr-2 h-4 w-4" /> Play Movie
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

const MovieManagementPage = () => {
  const queryClient = useQueryClient();
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [editState, setEditState] = React.useState<{isOpen: boolean, movie: Movie | null}>({
    isOpen: false,
    movie: null,
  });
  const [playerState, setPlayerState] = React.useState<{isOpen: boolean, url: string | null, title: string}>({
    isOpen: false,
    url: null,
    title: ''
  });
  const [deleteState, setDeleteState] = React.useState<{isOpen: boolean, movie: Movie | null}>({
    isOpen: false,
    movie: null,
  });

  const deleteMutation = useMutation({
    mutationFn: (movieId: string) => deleteMovie(movieId),
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['movies'] });
        setDeleteState({ isOpen: false, movie: null });
    },
    onError: (error) => {
        // Here you could show a toast notification for the error
        console.error("Failed to delete movie:", error);
        setDeleteState({ isOpen: false, movie: null });
    }
  });
  
  const handleOpenDeleteDialog = (movie: Movie) => {
    setDeleteState({ isOpen: true, movie });
  };

  const handleOpenEditDialog = (movie: Movie) => {
    setEditState({ isOpen: true, movie });
  };

  const handlePlay = (url: string, title: string) => {
    setPlayerState({ isOpen: true, url, title });
  };
  
  const handleClosePlayer = () => {
    setPlayerState({ isOpen: false, url: null, title: '' });
  };
  
  const columns = React.useMemo<ColumnDef<Movie>[]>(() => {
    const actionsColumn: ColumnDef<Movie> = {
        id: 'actions',
        cell: ({ row }) => <ActionsCell 
            row={row} 
            onPlay={handlePlay} 
            onDelete={handleOpenDeleteDialog}
            onEdit={handleOpenEditDialog}
        />
    }
    return [...initialColumns.filter(c => c.id !== 'actions'), actionsColumn]
  }, []);

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
    queryKey: ['movies', pagination, sorting, debouncedSearchTerm],
    queryFn: () =>
      getMovies({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        sortBy: sorting.map((s) => `${s.id}:${s.desc ? 'desc' : 'asc'}`).join(',') || undefined,
        title: debouncedSearchTerm || undefined,
      }),
  });

  const table = useReactTable({
    data: data?.results ?? [],
    columns,
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
      <AddMovieModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
      <EditMovieModal
        isOpen={editState.isOpen}
        onClose={() => setEditState({ isOpen: false, movie: null })}
        movie={editState.movie}
      />
      <VideoPlayerModal 
        isOpen={playerState.isOpen}
        onClose={handleClosePlayer}
        videoUrl={playerState.url}
        title={playerState.title}
      />
      <ConfirmationDialog
        isOpen={deleteState.isOpen}
        onClose={() => setDeleteState({ isOpen: false, movie: null })}
        onConfirm={() => deleteState.movie && deleteMutation.mutate(deleteState.movie._id)}
        title={`Delete Movie: ${deleteState.movie?.title}`}
        description="Are you sure you want to delete this movie? This action cannot be undone."
        confirmText="Delete"
        isDestructive
        isLoading={deleteMutation.isPending}
      />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Movie Management</h1>
        <Button
        onClick={() => setIsAddModalOpen(true)}
        >
          Add Movie
        </Button>
      </div>
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter by movie title..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          className="max-w-sm"
        />
      </div>
      <DataTable
        table={table}
        columns={columns}
        isLoading={isLoading}
        isError={isError}
        error={error as Error | null}
      />
    </div>
  );
};

export default MovieManagementPage;