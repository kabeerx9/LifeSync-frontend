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
import { useParams } from 'next/navigation';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

type Props = {
  isEditReviewModalOpen: boolean;
  setIsEditReviewModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  comment: string;
  rating: string;
  reviewId: string;
};

const editReviewFormSchema = z.object({
  comment: z.string().min(1),
  rating: z.string({
    required_error: 'Please select a rating for the movie'
  })
});

const EditReviewDialog = ({
  isEditReviewModalOpen,
  setIsEditReviewModalOpen,
  comment,
  rating,
  reviewId
}: Props) => {
  const { movieId } = useParams();
  const queryClient = useQueryClient();

  const form = useForm({
    resolver: zodResolver(editReviewFormSchema),
    defaultValues: {
      comment: comment,
      rating: rating
    }
  });

  useEffect(() => {
    form.setValue('comment', comment);
    form.setValue('rating', rating);
  }, [comment, rating]);

  const editReviewMutation = useMutation({
    mutationFn: async (data: z.infer<typeof editReviewFormSchema>) => {
      const res = await axiosInstance.post('movies/review/edit-review/', {
        reviewId: reviewId,
        comment: data.comment,
        rating: Number(data.rating)
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['movieDetail', movieId]
      });
      toast.success('Review Edited successfully');
      setIsEditReviewModalOpen(false);
    }
  });

  const handleSubmit = (data: z.infer<typeof editReviewFormSchema>) => {
    editReviewMutation.mutate(data);
  };

  return (
    <Dialog
      open={isEditReviewModalOpen}
      onOpenChange={setIsEditReviewModalOpen}
    >
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
                    <FormLabel>Edit your comment</FormLabel>
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
                  <FormLabel>Rating</FormLabel>
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

            <Button type="submit" disabled={editReviewMutation.isPending}>
              {editReviewMutation.isPending ? 'Editing...' : 'Edit Review'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditReviewDialog;
