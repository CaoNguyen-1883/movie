import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useMutation } from '@tanstack/react-query';
import { updateMyProfile } from '@/services/userApi';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserHistoryTab } from '@/components/profile/UserHistoryTab';
import { UserReviewsTab } from '@/components/profile/UserReviewsTab';
import { ChangePasswordDialog } from '@/components/profile/ChangePasswordDialog';

const profileFormSchema = z.object({
  fullName: z.string().min(1, { message: "Full name cannot be empty." }),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const ProfilePage = () => {
  const { user, isLoading, refetchUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      fullName: user?.fullName || ''
    }
  });

  const { reset } = form;
  useEffect(() => {
    if (user) {
      reset({
        fullName: user.fullName || ''
      });
    }
  }, [user, reset]);

  const updateProfileMutation = useMutation({
    mutationFn: updateMyProfile,
    onSuccess: () => { // 'updatedUser' is declared but its value is never read
      refetchUser();

      setIsEditing(false);
      
      alert("Profile updated successfully!");
    },
    onError: (error) => {
      alert(`Error updating profile: ${error.message}`);
    }
  });

  const onSubmit = (values: ProfileFormValues) => {
    if (!user) {
      alert("Cannot update profile. User data is not available.");
      return;
    }
    updateProfileMutation.mutate(values);
  }

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <p>Loading user profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto py-8">
        <p>User not found. Please log in.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-2xl mx-auto">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="history">Viewing History</TabsTrigger>
          <TabsTrigger value="reviews">My Reviews</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card className="max-w-2xl mx-auto mt-4">
            <CardHeader>
              <div className="flex items-center gap-6">
                <Avatar className="h-24 w-24 border-2 border-primary">
                  <AvatarImage src={user.avatarUrl} alt={user.fullName || user.username} />
                  <AvatarFallback className="text-3xl">{getInitials(user.fullName || user.username)}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-3xl">{user.fullName || user.username}</CardTitle>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {user.roles.map((role) => (
                      typeof role !== 'string' && <Badge key={role._id} variant="outline">{role.name}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent className="space-y-4 pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-x-4">
                    <h3 className="font-semibold text-muted-foreground">Full Name</h3>
                    {isEditing ? (
                      <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormControl>
                              <Input placeholder="Your full name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ) : (
                      <p className="md:col-span-2">{user.fullName || 'N/A'}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4">
                    <h3 className="font-semibold text-muted-foreground">Username</h3>
                    <p className="md:col-span-2">{user.username}</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4">
                    <h3 className="font-semibold text-muted-foreground">Email</h3>
                    <p className="md:col-span-2">{user.email}</p>
                  </div>
                </CardContent>

                {isEditing && (
                  <CardFooter className="border-t px-6 py-4 justify-end gap-2">
                    <Button type="button" variant="ghost" onClick={() => {
                      setIsEditing(false);
                      form.reset();
                    }} disabled={updateProfileMutation.isPending}>Cancel</Button>
                    <Button type="submit" disabled={updateProfileMutation.isPending}>
                      {updateProfileMutation.isPending ? 'Saving...' : 'Save'}
                    </Button>
                  </CardFooter>
                )}
              </form>
            </Form>
            {!isEditing && (
              <CardFooter className="border-t px-6 py-4 justify-end gap-2">
                {user.authProvider !== 'google' && (
                  <Button type="button" variant="outline" onClick={() => setIsChangePasswordOpen(true)}>Change Password</Button>
                )}
                <Button type="button" onClick={() => setIsEditing(true)}>Edit Profile</Button>
              </CardFooter>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card className="max-w-2xl mx-auto mt-4">
            <CardHeader>
              <CardTitle>Viewing History</CardTitle>
              <CardDescription>Movies you've watched.</CardDescription>
            </CardHeader>
            <CardContent>
              <UserHistoryTab />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews">
          <Card className="max-w-2xl mx-auto mt-4">
            <CardHeader>
              <CardTitle>My Reviews</CardTitle>
              <CardDescription>Reviews you've written.</CardDescription>
            </CardHeader>
            <CardContent>
              <UserReviewsTab />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <ChangePasswordDialog isOpen={isChangePasswordOpen} onOpenChange={setIsChangePasswordOpen} />
    </div>
  );
};

export default ProfilePage; 