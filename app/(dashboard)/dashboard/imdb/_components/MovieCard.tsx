import axiosInstance from '@/axios/axios';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { BookmarkIcon, BookmarkX, Loader, Star } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

type Props = {
  title: string;
  movieId: number;
  genre: string;
  description: string;
  release_year: number;
  imageUrl?: string;
  avg_rating: number;
  numberOfReviews: number;
  is_watchlisted: boolean;
};

const MovieCard = ({
  title,
  movieId,
  genre,
  description,
  release_year,
  imageUrl,
  avg_rating,
  numberOfReviews,
  is_watchlisted
}: Props) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const addWatchListMutation = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.post('/movies/watchlist/', {
        movieId
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['movies']
      });
      toast.success('Movie added to watchlist');
    }
  });
  const removeWatchListMutation = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.post('/movies/watchlist/remove/', {
        movieId
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['movies']
      });
      toast.success('Movie removed from watchlist');
    }
  });

  return (
    <Card
      onClick={() => {
        router.push('/dashboard/imdb/' + movieId);
      }}
      className="flex cursor-pointer flex-col justify-between"
    >
      <CardHeader>
        <CardTitle className="flex gap-3 truncate text-lg">
          {title} :
          <div className="flex items-center gap-1">
            {numberOfReviews === 0 ? 'N/A' : avg_rating}
            <Star
              fill="currentColor"
              className="text-red-500 dark:text-yellow-500"
              size={16}
            />
          </div>
        </CardTitle>

        <CardDescription className="truncate">{description}</CardDescription>
      </CardHeader>
      <CardContent className=" p-0">
        {imageUrl && (
          <div className="relative h-48 w-full">
            <Image src={imageUrl} alt={title} layout="fill" objectFit="cover" />
          </div>
        )}
      </CardContent>
      <CardFooter className="flex items-center  justify-between text-xs lg:text-base ">
        <p className="pt-5">{genre.toLocaleUpperCase()}</p>
        <p className="pt-5">{release_year}</p>
        {!is_watchlisted && (
          <>
            {addWatchListMutation.isPending ? (
              <Loader className="h-8 w-8" />
            ) : (
              <BookmarkIcon
                onClick={(e) => {
                  e.stopPropagation();
                  addWatchListMutation.mutate();
                }}
                className="cursor-pointer"
                size={20}
              />
            )}
          </>
        )}
        {is_watchlisted && (
          <>
            {removeWatchListMutation.isPending ? (
              <Loader className="h-8 w-8" />
            ) : (
              <BookmarkIcon
                onClick={(e) => {
                  e.stopPropagation();
                  removeWatchListMutation.mutate();
                }}
                fill="currentColor"
                className="cursor-pointer text-green-500"
                size={20}
              />
            )}
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default MovieCard;
