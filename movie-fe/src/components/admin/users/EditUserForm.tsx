'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { getAllRoles } from '@/services/roleApi';
import type { User } from '@/types/user';

const formSchema = z.object({
  fullName: z.string().min(1, { message: 'Full name is required.' }),
  isActive: z.boolean(),
  roles: z.array(z.string()).min(1, { message: 'User must have at least one role.' }),
});

export type EditUserFormData = z.infer<typeof formSchema>;

interface EditUserFormProps {
  user: User;
  onSubmit: (data: EditUserFormData) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export const EditUserForm = ({ user, onSubmit, onCancel, isSubmitting }: EditUserFormProps) => {
  const form = useForm<EditUserFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: user.fullName || '',
      isActive: user.isActive,
      roles: user.roles.map(role => role.id),
    },
  });

  const { data: roles, isLoading: isLoadingRoles } = useQuery({
    queryKey: ['allRoles'],
    queryFn: getAllRoles,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="roles"
          render={({ 
            //field 
          }) => (
            <FormItem>
              <FormLabel>Roles</FormLabel>
              <FormDescription>Select the roles for this user.</FormDescription>
              {isLoadingRoles ? (
                <p>Loading roles...</p>
              ) : (
                <div className="space-y-2">
                  {roles?.map((role) => (
                    <FormField
                      key={role.id}
                      control={form.control}
                      name="roles"
                      render={({ field }) => {
                        return (
                          <FormItem key={role.id} className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(role.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, role.id])
                                    : field.onChange(field.value?.filter((value) => value !== role.id));
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">{role.name}</FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                </div>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel>Active Status</FormLabel>
                <FormDescription>
                  Inactive users cannot log in to the system.
                </FormDescription>
              </div>
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Form>
  );
}; 