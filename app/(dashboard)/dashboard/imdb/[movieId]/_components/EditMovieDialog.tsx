import { Dialog, DialogContent } from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

import axiosInstance from '@/axios/axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'sonner';

type Props = {
  movieId: number;
  isEditMovieDialogOpen: boolean;
  setIsEditMovieDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;
  description: string;
  genre: string;
  release_year: number;
  imageUrl: string;
};

const editMovieFormSchema = z.object({
  title: z.string().min(1),
  genre: z.string({
    required_error: 'Please select a genre'
  }),
  description: z.string().min(1),
  release_year: z.string().min(1),
  imageUrl: z.string().optional()
});

const EditMovieDialog = ({
  movieId,
  isEditMovieDialogOpen,
  setIsEditMovieDialogOpen,
  title,
  description,
  genre,
  release_year,
  imageUrl
}: Props) => {
  const queryClient = useQueryClient();

  const form = useForm({
    resolver: zodResolver(editMovieFormSchema),
    defaultValues: {
      title,
      genre,
      description,
      release_year: release_year.toString(),
      imageUrl
    }
  });

  useEffect(() => {
    form.reset({
      title,
      genre,
      description,
      release_year: release_year.toString(),
      imageUrl
    });
  }, [title, genre, description, release_year, imageUrl, form]);

  const editMovieMutation = useMutation({
    mutationFn: async (data: z.infer<typeof editMovieFormSchema>) => {
      const res = await axiosInstance.put(`/movies/movie-detail/`, {
        id: movieId,
        title: data.title,
        genre: data.genre,
        release_year: Number(data.release_year),
        description: data.description,
        imageUrl: data.imageUrl || ''
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['movies']
      });
      queryClient.invalidateQueries({
        queryKey: ['movieDetail', movieId]
      });
      toast.success('Movie updated successfully');
      setIsEditMovieDialogOpen(false);
    }
  });

  const handleSubmit = (data: z.infer<typeof editMovieFormSchema>) => {
    editMovieMutation.mutate(data);
  };

  return (
    <Dialog
      open={isEditMovieDialogOpen}
      onOpenChange={setIsEditMovieDialogOpen}
    >
      <DialogContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-2"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Movie title..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="genre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Genre</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a genre for the movie" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="romance">Romance</SelectItem>
                      <SelectItem value="action">Action</SelectItem>
                      <SelectItem value="comedy">Comedy</SelectItem>
                      <SelectItem value="drama">Drama</SelectItem>
                      <SelectItem value="scifi">Science Fiction</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Movie description..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="release_year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Release Year</FormLabel>
                  <FormControl>
                    <Input placeholder="Release year..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Add image url(if possible)..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={editMovieMutation.isPending}>
              {editMovieMutation.isPending ? 'Updating...' : 'Update'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditMovieDialog;
