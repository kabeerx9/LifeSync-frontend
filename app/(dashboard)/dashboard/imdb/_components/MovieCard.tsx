import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Star } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

type Props = {
  title: string;
  movieId: number;
  genre: string;
  description: string;
  release_year: number;
  imageUrl?: string;
  avg_rating: number;
  numberOfReviews: number;
};

const MovieCard = ({
  title,
  movieId,
  genre,
  description,
  release_year,
  imageUrl,
  avg_rating,
  numberOfReviews
}: Props) => {
  const router = useRouter();
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
      <CardFooter className="flex  items-center justify-between ">
        <p className="pt-5">{genre.toLocaleUpperCase()}</p>
        <p className="pt-5">{release_year}</p>
      </CardFooter>
    </Card>
  );
};

export default MovieCard;
