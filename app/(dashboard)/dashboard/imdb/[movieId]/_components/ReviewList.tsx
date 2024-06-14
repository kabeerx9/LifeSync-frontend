import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import React, { useState } from 'react';
import { Review } from '../../page';
import { formatDateTime } from '@/utils/date';
import { Edit, Edit2, PlusIcon, Star, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AddReviewDialog from './AddReviewDialog';
import { useUser } from '@/hooks/useUser';
import EditReviewDialog from './EditReviewDialog';
import DeleteReviewDialog from './DeleteReviewDialog';

type Props = {
  reviews: Review[];
};

const ReviewList = ({ reviews }: Props) => {
  const [isAddReviewModalOpen, setIsAddReviewModalOpen] = useState(false);
  const [isEditReviewModalOpen, setIsEditReviewModalOpen] = useState(false);
  const [isDeleteReviewDialogOpen, setIsDeleteReviewDialogOpen] =
    useState(false);

  const [selectedReview, setSelectedReview] = useState<Review | null>(null);

  const { username, email } = useUser();

  return (
    <div className=" w-full space-y-5 ">
      <AddReviewDialog
        isAddReviewModalOpen={isAddReviewModalOpen}
        setIsAddReviewModalOpen={setIsAddReviewModalOpen}
      />
      <EditReviewDialog
        isEditReviewModalOpen={isEditReviewModalOpen}
        setIsEditReviewModalOpen={setIsEditReviewModalOpen}
        comment={selectedReview?.comment || ''}
        rating={selectedReview?.rating.toString() || ''}
        reviewId={selectedReview?.id || ''}
      />
      <DeleteReviewDialog
        isDeleteReviewDialogOpen={isDeleteReviewDialogOpen}
        setIsDeleteReviewDialogOpen={setIsDeleteReviewDialogOpen}
        reviewId={selectedReview?.id || ''}
      />
      <div className="flex flex-row-reverse items-center">
        <Button
          onClick={() => {
            setIsAddReviewModalOpen(true);
          }}
        >
          Add Review <PlusIcon />
        </Button>
      </div>
      <div className="grid w-full grid-cols-2 gap-5 lg:grid-cols-3">
        {reviews?.map((review, index) => (
          <Card key={index} className="flex flex-col justify-between">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex gap-x-2">
                  {review.user} : {review.rating}{' '}
                  <Star
                    className="text-red-500 dark:text-yellow-500"
                    size={16}
                  />
                </span>
                {username === review.user && (
                  <div className="flex space-x-5">
                    <Edit
                      onClick={() => {
                        setIsEditReviewModalOpen(true);
                        setSelectedReview(review);
                      }}
                      size={17}
                      className="cursor-pointer text-purple-500"
                    />
                    <Trash2
                      onClick={() => {
                        setIsDeleteReviewDialogOpen(true);
                        setSelectedReview(review);
                      }}
                      size={17}
                      className="cursor-pointer text-red-500"
                    />
                  </div>
                )}
              </CardTitle>
              <CardDescription>{review.comment}</CardDescription>
            </CardHeader>
            <CardFooter>{formatDateTime(review.created_at)}</CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ReviewList;
