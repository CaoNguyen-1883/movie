import { useQuery } from '@tanstack/react-query';
import { getMovies } from '@/services/movieApi';
import { MovieCard } from '@/components/common/MovieCard';
import { Skeleton } from '@/components/ui/skeleton';
import { useState } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

const MoviesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);



  const { data, isLoading, isError } = useQuery({
    queryKey: ['movies', { page, status: statusFilter, title: debouncedSearchTerm }],
    queryFn: () =>
      getMovies({
        page,
        limit: 20,
        status: (statusFilter as 'NOW_SHOWING' | 'COMING_SOON' | 'RELEASED') || undefined,
        title: debouncedSearchTerm || undefined,
      }),
  });

  const totalPages = data?.totalPages ?? 1;

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleStatusChange = (value: string) => {
    // "all" is a special value to clear the filter.
    // We set the state to an empty string to remove the status filter from the API query.
    setStatusFilter(value === 'all' ? '' : value);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <Input
          placeholder="Search for a movie..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="grow"
        />
        <Select value={statusFilter} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="NOW_SHOWING">Now Showing</SelectItem>
            <SelectItem value="COMING_SOON">Coming Soon</SelectItem>
            <SelectItem value="RELEASED">Released</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {Array.from({ length: 10 }).map((_, index) => (
            <Skeleton key={index} className="w-full aspect-2/3" />
          ))}
        </div>
      ) : isError || !data || data.results.length === 0 ? (
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold">No movies found</h2>
          <p className="text-muted-foreground">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {data.results.map((movie) => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination className="mt-12">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    href="#" 
                    onClick={(e) => { e.preventDefault(); handlePageChange(page - 1); }}
                    className={page === 1 ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
                {[...Array(totalPages || 0)].map((_, i) => (
                   <PaginationItem key={i}>
                     <PaginationLink 
                       href="#" 
                       isActive={page === i + 1}
                       onClick={(e) => { e.preventDefault(); handlePageChange(i + 1); }}
                     >
                       {i + 1}
                     </PaginationLink>
                   </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext 
                    href="#" 
                    onClick={(e) => { e.preventDefault(); handlePageChange(page + 1); }} 
                    className={page === totalPages ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}
    </div>
  );
};

export default MoviesPage; 