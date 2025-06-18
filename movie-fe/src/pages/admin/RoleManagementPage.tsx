'use client';

import { useQuery } from '@tanstack/react-query';
import { getAllRoles } from '@/services/roleApi';
import { RoleCard } from '@/components/admin/roles/RoleCard';
import { Skeleton } from '@/components/ui/skeleton';

const RoleManagementPage = () => {
  const { data: roles, isLoading, isError, error } = useQuery({
    queryKey: ['allRoles'],
    queryFn: getAllRoles,
  });



  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Roles & Permissions</h1>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      ) : isError ? (
        <div className="text-red-500">
          Error fetching roles: {error instanceof Error ? error.message : 'Unknown error'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roles?.map((role) => (
            <RoleCard key={role.id} role={role} />
          ))}
        </div>
      )}
    </div>
  );
};

export default RoleManagementPage; 