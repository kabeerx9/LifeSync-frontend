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
import { useParams } from 'next/navigation';

type Props = {
  isAddReviewModalOpen: boolean;
  setIsAddReviewModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const createReviewFormSchema = z.object({
  comment: z.string().min(1),
  rating: z.string({
    required_error: 'Please select a rating for the movie'
  })
});

const AddReviewDialog = ({
  isAddReviewModalOpen,
  setIsAddReviewModalOpen
}: Props) => {
  const { movieId } = useParams();
  const queryClient = useQueryClient();

  const form = useForm({
    resolver: zodResolver(createReviewFormSchema),
    defaultValues: {
      comment: '',
      rating: '5'
    }
  });

  const createReviewMutation = useMutation({
    mutationFn: async (data: z.infer<typeof createReviewFormSchema>) => {
      const res = await axiosInstance.post('movies/review/create-review/', {
        movieId: Number(movieId),
        comment: data.comment,
        rating: Number(data.rating)
      });
      return res.data;
    },
    onSuccess: () => {
      form.reset();
      queryClient.invalidateQueries({
        queryKey: ['movieDetail', movieId]
      });
      queryClient.invalidateQueries({
        queryKey: ['movies']
      });
      toast.success('Review Added successfully');
      setIsAddReviewModalOpen(false);
    }
  });

  const handleSubmit = (data: z.infer<typeof createReviewFormSchema>) => {
    createReviewMutation.mutate(data);
  };

  return (
    <Dialog open={isAddReviewModalOpen} onOpenChange={setIsAddReviewModalOpen}>
      <DialogContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-2"
          >
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Add a comment</FormLabel>
                    <FormControl>
                      <Input placeholder="Comment on the movie..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Genre</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a rating for the movie" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {[...Array(10)].map((_, index) => (
                        <SelectItem key={index} value={`${index + 1}`}>
                          {index + 1}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={createReviewMutation.isPending}>
              {createReviewMutation.isPending ? 'Adding...' : 'Add Review'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddReviewDialog;
