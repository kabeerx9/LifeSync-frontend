import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import React from 'react';
import { Review } from '../../page';
import { formatDateTime } from '@/utils/date';
import { Star } from 'lucide-react';

type Props = {
  reviews: Review[];
};

const ReviewList = ({ reviews }: Props) => {
  return (
    <div className="grid w-full grid-cols-2 lg:grid-cols-3">
      {reviews?.map((review, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle className="flex items-center gap-x-2">
              {review.reviewer} : {review.rating}{' '}
              <Star className="text-red-500 dark:text-yellow-500" size={16} />
            </CardTitle>
            <CardDescription>{review.comment}</CardDescription>
          </CardHeader>
          <CardFooter>{formatDateTime(review.created_at)}</CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default ReviewList;
