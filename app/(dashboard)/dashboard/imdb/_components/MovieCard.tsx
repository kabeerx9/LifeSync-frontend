import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import React from 'react';

type Props = {
  title: string;
  movieId: number;
  genre: string;
  description: string;
  release_year: number;
  imageUrl?: string;
};

const MovieCard = ({
  title,
  movieId,
  genre,
  description,
  release_year,
  imageUrl
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
        <CardTitle className="truncate text-lg">{title}</CardTitle>

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
