import * as React from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  updateMovie,
  type UpdateMoviePayload,
} from '@/services/movieApi';
import type { Movie } from '@/types/movie';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MultiSelect, type MultiSelectOption } from '@/components/ui/multi-select';
import { getAllGenres } from '@/services/genreApi';
import { getAllPeople } from '@/services/personApi';

interface EditMovieModalProps {
  isOpen: boolean;
  onClose: () => void;
  movie: Movie | null;
}

const movieSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  releaseDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format',
  }),
  duration: z.coerce.number().int().positive('Duration must be a positive number'),
  status: z.enum(['COMING_SOON', 'NOW_SHOWING', 'RELEASED']),
  posterUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  trailerUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  videoUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  backdropUrls: z.array(z.object({
    value: z.string().url({ message: 'Please enter a valid URL.' })
  })).optional(),
  genres: z.array(z.string()).optional(),
  directors: z.array(z.string()).optional(),
  cast: z.array(z.object({
    actor: z.string().min(1, 'Actor is required'),
    characterName: z.string().min(1, 'Character name is required'),
  })).optional(),
});

type EditMovieFormData = z.infer<typeof movieSchema>;

export function EditMovieModal({ isOpen, onClose, movie }: EditMovieModalProps) {
  const queryClient = useQueryClient();

  const { data: genres, isLoading: isLoadingGenres } = useQuery({ queryKey: ['allGenres'], queryFn: getAllGenres });
  const { data: people, isLoading: isLoadingPeople } = useQuery({ queryKey: ['allPeople'], queryFn: getAllPeople });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setError,
  } = useForm<EditMovieFormData>({
    resolver: zodResolver(movieSchema),
  });

  React.useEffect(() => {
    if (movie) {
      const backdrops = movie.backdropUrls && movie.backdropUrls.length > 0 
        ? movie.backdropUrls.map(url => ({ value: url }))
        : [{ value: '' }];

      reset({
        ...movie,
        releaseDate: movie.releaseDate.split('T')[0], // Format date for input
        genres: movie.genres.map(g => g._id),
        directors: movie.directors.map(d => d._id),
        cast: movie.cast.map(c => ({ actor: c.actor._id, characterName: c.characterName })),
        backdropUrls: backdrops,
      });
    }
  }, [movie, reset]);

  const mutation = useMutation({
    mutationFn: (updatedMovie: UpdateMoviePayload) => {
      if (!movie) throw new Error('No movie to update');
      return updateMovie(movie._id, updatedMovie);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['movies'] });
      onClose();
    },
    onError: (error: any) => {
      if (error?.response?.data?.message?.includes('E11000') && error?.response?.data?.message?.includes('slug')) {
        setError('title', {
          type: 'manual',
          message: 'A movie with this title already exists. Please choose a different title.',
        });
      }
    },
  });
  
  const { fields, append, remove } = useFieldArray({ control, name: "cast" });
  const { fields: backdropFields, append: appendBackdrop, remove: removeBackdrop } = useFieldArray({ control, name: "backdropUrls" });

  const onSubmit = (data: EditMovieFormData) => {
    const submissionData: UpdateMoviePayload = {
      ...data,
      backdropUrls: data.backdropUrls?.map(url => url.value).filter(Boolean),
    };

    mutation.mutate(submissionData);
  };
  
  const genreOptions: MultiSelectOption[] = React.useMemo(() => genres?.map(g => ({ value: g._id, label: g.name })) ?? [], [genres]);
  const peopleOptions: MultiSelectOption[] = React.useMemo(() => people?.map(p => ({ value: p._id, label: p.name })) ?? [], [people]);

  if (!movie) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
                <DialogTitle>Edit Movie: {movie.title}</DialogTitle>
                <DialogDescription>
                    Update the movie details below.
                </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-4 items-center gap-x-4 gap-y-2 py-4">
            
            <Label htmlFor="title" className="text-right">Title</Label>
            <div className="col-span-3">
              <Input id="title" {...register('title')} />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
            </div>

            <Label htmlFor="description" className="text-right self-start pt-2">Description</Label>
            <div className="col-span-3">
              <Textarea id="description" {...register('description')} />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
            </div>

            <Label htmlFor="releaseDate" className="text-right">Release Date</Label>
            <div className="col-span-3">
              <Input id="releaseDate" type="date" {...register('releaseDate')} />
              {errors.releaseDate && <p className="text-red-500 text-sm mt-1">{errors.releaseDate.message}</p>}
            </div>

            <Label htmlFor="duration" className="text-right">Duration (min)</Label>
            <div className="col-span-3">
              <Input id="duration" type="number" {...register('duration')} />
              {errors.duration && <p className="text-red-500 text-sm mt-1">{errors.duration.message}</p>}
            </div>

            <Label className="text-right">Status</Label>
            <div className="col-span-3">
              <Controller
                control={control}
                name="status"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="COMING_SOON">Coming Soon</SelectItem>
                      <SelectItem value="NOW_SHOWING">Now Showing</SelectItem>
                      <SelectItem value="RELEASED">Released</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            
            <Label htmlFor="posterUrl" className="text-right">Poster URL</Label>
            <div className="col-span-3">
              <Input id="posterUrl" {...register('posterUrl')} />
              {errors.posterUrl && <p className="text-red-500 text-sm mt-1">{errors.posterUrl.message}</p>}
            </div>

            <div className="col-span-4 mt-2">
              <Label>Backdrop URLs</Label>
              <div className="space-y-2 mt-2">
                {backdropFields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-2">
                      <Input
                        {...register(`backdropUrls.${index}.value`)}
                        placeholder="https://example.com/backdrop.jpg"
                      />
                      <Button type="button" variant="ghost" size="icon" onClick={() => removeBackdrop(index)} disabled={backdropFields.length <= 1}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                ))}
                 {errors.backdropUrls && <p className="text-red-500 text-sm mt-1">{errors.backdropUrls.message}</p>}
              </div>
              <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => appendBackdrop({ value: '' })}
                >
                  Add Backdrop URL
              </Button>
            </div>

            <Label htmlFor="trailerUrl" className="text-right">Trailer URL</Label>
            <div className="col-span-3">
                <Input id="trailerUrl" {...register('trailerUrl')} />
                {errors.trailerUrl && <p className="text-red-500 text-sm mt-1">{errors.trailerUrl.message}</p>}
            </div>

            <Label htmlFor="videoUrl" className="text-right">Movie URL</Label>
            <div className="col-span-3">
                <Input id="videoUrl" {...register('videoUrl')} />
                {errors.videoUrl && <p className="text-red-500 text-sm mt-1">{errors.videoUrl.message}</p>}
            </div>

            <Label className="text-right self-start pt-2">Genres</Label>
            <div className="col-span-3">
              <Controller
                  control={control}
                  name="genres"
                  render={({ field }) => (
                    <MultiSelect
                      options={genreOptions}
                      selected={field.value ?? []}
                      onChange={field.onChange}
                      placeholder="Select genres..."
                    />
                  )}
                />
              {errors.genres && <p className="text-red-500 text-sm mt-1">{errors.genres.message}</p>}
            </div>

            <Label className="text-right self-start pt-2">Directors</Label>
             <div className="col-span-3">
                <Controller
                  control={control}
                  name="directors"
                  render={({ field }) => (
                    <MultiSelect
                      options={peopleOptions}
                      selected={field.value ?? []}
                      onChange={field.onChange}
                      placeholder="Select directors..."
                    />
                  )}
                />
                {errors.directors && <p className="text-red-500 text-sm mt-1">{errors.directors.message}</p>}
            </div>
            
            <div className="col-span-4 mt-2">
              <Label>Cast</Label>
              <div className="space-y-2 mt-2">
                {fields.map((field, index) => (
                  <div key={field.id} className="grid grid-cols-10 gap-2 items-center">
                    <div className="col-span-5">
                      <Controller
                        name={`cast.${index}.actor`}
                        control={control}
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Actor" />
                            </SelectTrigger>
                            <SelectContent>
                              {people?.map(p => <SelectItem key={p._id} value={p._id}>{p.name}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                    <div className="col-span-4">
                      <Input
                        {...register(`cast.${index}.characterName`)}
                        placeholder="Character Name"
                      />
                    </div>
                    <div className="col-span-1">
                      <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
               <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => append({ actor: '', characterName: '' })}
                >
                  Add Cast Member
                </Button>
            </div>
          </div>
                <DialogFooter>
                    <Button type="button" variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={mutation.isPending}>
                        {mutation.isPending ? 'Saving...' : 'Save Changes'}
                    </Button>
                </DialogFooter>
            </form>
        </DialogContent>
    </Dialog>
  );
} 