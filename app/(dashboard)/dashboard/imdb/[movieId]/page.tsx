'use client';
import axiosInstance from '@/axios/axios';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { TMovie } from '../page';
import Image from 'next/image';
import { Trash } from 'lucide-react';
import DeleteMovieDialog from './_components/DeleteMovieDialog';
import { useState } from 'react';

type Props = {
  params: {
    movieId: number;
  };
};

const MovieDetail = ({ params: { movieId } }: Props) => {
  const [isDeleteMovieDialogOpen, setIsDeleteMovieDialogOpen] = useState(false);

  const fetchMovieDetail = async () => {
    const res = await axiosInstance.post('/movies/movie-detail/', {
      id: movieId
    });
    return res.data;
  };

  const { data: movieData, isLoading } = useQuery<TMovie>({
    queryFn: fetchMovieDetail,
    queryKey: ['movieDetail', movieId],
    enabled: !!movieId,
    staleTime: 1000 * 60 * 5
  });

  console.log('this movie data is ', movieData);

  return (
    <>
      <DeleteMovieDialog
        movieId={movieId}
        isDeleteMovieDialogOpen={isDeleteMovieDialogOpen}
        setIsDeleteMovieDialogOpen={setIsDeleteMovieDialogOpen}
      />
      <div className="h-full w-full p-5">
        <Card>
          <CardHeader>
            <CardTitle>
              <div className="flex items-center justify-between">
                <span>{movieData?.title}</span>
                <Trash onClick={()=>{
                  setIsDeleteMovieDialogOpen(true);
                }} className="cursor-pointer text-red-500" />
              </div>
            </CardTitle>
            <CardDescription>{movieData?.description}</CardDescription>
          </CardHeader>
          <CardContent className=" p-0">
            {movieData?.imageUrl && (
              <div className="relative h-96 w-full">
                <Image
                  src={movieData?.imageUrl}
                  alt={movieData?.title}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
            )}
          </CardContent>
          <CardFooter className="flex  items-center justify-between ">
            <p className="pt-5">{movieData?.genre.toLocaleUpperCase()}</p>
            <p className="pt-5">{movieData?.release_year}</p>
          </CardFooter>
        </Card>
      </div>
    </>
  );
};

export default MovieDetail;
