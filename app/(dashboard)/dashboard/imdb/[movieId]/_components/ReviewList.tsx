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
import { PlusIcon, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AddReviewDialog from './AddReviewDialog';

type Props = {
  reviews: Review[];
};

const ReviewList = ({ reviews }: Props) => {
  const [isAddReviewModalOpen, setIsAddReviewModalOpen] = useState(false);

  return (
    <div className=" w-full space-y-5 ">
      <AddReviewDialog
        isAddReviewModalOpen={isAddReviewModalOpen}
        setIsAddReviewModalOpen={setIsAddReviewModalOpen}
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
      <div className="grid w-full grid-cols-2 lg:grid-cols-3">
        {reviews?.map((review, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="flex items-center gap-x-2">
                {review.user} : {review.rating}{' '}
                <Star className="text-red-500 dark:text-yellow-500" size={16} />
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
