import axiosInstance from '@/axios/axios';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter } from '@/components/ui/dialog';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import React from 'react';
import { toast } from 'sonner';

type Props = {
  isDeleteMovieDialogOpen: boolean;
  setIsDeleteMovieDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  movieId: number;
};

const DeleteMovieDialog = ({
  isDeleteMovieDialogOpen,
  setIsDeleteMovieDialogOpen,
  movieId
}: Props) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const deleteMovieMutation = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.post('movies/movie-delete/', {
        id: movieId
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success('Movie Deleted Successfully');
      queryClient.invalidateQueries({
        queryKey: ['movies']
      });
      router.push('/dashboard/imdb');
    }
  });

  return (
    <Dialog
      open={isDeleteMovieDialogOpen}
      onOpenChange={setIsDeleteMovieDialogOpen}
    >
      <DialogContent>
        Are you sure you want to delete this Movie from the database ?
        <div className="flex items-center justify-between">
          <Button
            variant="destructive"
            onClick={() => {
              deleteMovieMutation.mutate();
            }}
            disabled={deleteMovieMutation.isPending}
          >
            {deleteMovieMutation.isPending ? 'Deleting...' : 'Yes'}
          </Button>
          <Button onClick={() => setIsDeleteMovieDialogOpen(false)}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteMovieDialog;
