import axiosInstance from '@/axios/axios';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import React from 'react';
import { toast } from 'sonner';

type Props = {
  isDeleteReviewDialogOpen: boolean;
  setIsDeleteReviewDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  reviewId: string;
};

const DeleteReviewDialog = ({
  isDeleteReviewDialogOpen,
  setIsDeleteReviewDialogOpen,
  reviewId
}: Props) => {
  const { movieId } = useParams();
  const queryClient = useQueryClient();

  const deleteReviewMutation = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.post('movies/review/delete-review/', {
        reviewId: reviewId
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success('Review Deleted Successfully');
      queryClient.invalidateQueries({
        queryKey: ['movieDetail', movieId]
      });
      queryClient.invalidateQueries({
        queryKey: ['movies']
      });
      setIsDeleteReviewDialogOpen(false);
    }
  });

  return (
    <Dialog
      open={isDeleteReviewDialogOpen}
      onOpenChange={setIsDeleteReviewDialogOpen}
    >
      <DialogContent>
        Are you sure you want to delete this review from the database ?
        <div className="flex items-center justify-between">
          <Button
            variant="destructive"
            onClick={() => {
              deleteReviewMutation.mutate();
            }}
            disabled={deleteReviewMutation.isPending}
          >
            {deleteReviewMutation.isPending ? 'Deleting...' : 'Yes'}
          </Button>
          <Button onClick={() => setIsDeleteReviewDialogOpen(false)}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteReviewDialog;
