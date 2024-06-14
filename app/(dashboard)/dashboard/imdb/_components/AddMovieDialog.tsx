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
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'sonner';

type Props = {
  isAddMoiveDialogOpen: boolean;
  setIsAddMovieDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const createMovieFormSchema = z.object({
  title: z.string().min(1),
  genre: z.string({
    required_error: 'Please select a genre'
  }),
  description: z.string().min(1),
  release_year: z.string().min(1),
  imageUrl: z.string().optional()
});

const AddMovieDialog = ({
  isAddMoiveDialogOpen,
  setIsAddMovieDialogOpen
}: Props) => {
  const queryClient = useQueryClient();

  const form = useForm({
    resolver: zodResolver(createMovieFormSchema),
    defaultValues: {
      title: '',
      genre: '',
      description: '',
      release_year: '2023',
      imageUrl: ''
    }
  });

  const createMovieMutation = useMutation({
    mutationFn: async (data: z.infer<typeof createMovieFormSchema>) => {
      const res = await axiosInstance.post('/movies/create/', {
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
      toast.success('Movie added successfully');
      setIsAddMovieDialogOpen(false);
    }
  });

  const handleSubmit = (data: z.infer<typeof createMovieFormSchema>) => {
    createMovieMutation.mutate(data);
  };

  return (
    <Dialog open={isAddMoiveDialogOpen} onOpenChange={setIsAddMovieDialogOpen}>
      <DialogContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-2"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Movie title..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
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
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Movie description..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <FormField
              control={form.control}
              name="release_year"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Release Year</FormLabel>
                    <FormControl>
                      <Input placeholder="Release year..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => {
                return (
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
                );
              }}
            />

            <Button type="submit" disabled={createMovieMutation.isPending}>
              {createMovieMutation.isPending ? 'Adding...' : 'Add'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddMovieDialog;
