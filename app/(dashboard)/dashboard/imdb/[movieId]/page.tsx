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
import { Edit, Trash } from 'lucide-react';
import DeleteMovieDialog from './_components/DeleteMovieDialog';
import { useState } from 'react';
import EditMovieDialog from './_components/EditMovieDialog';
import ReviewList from './_components/ReviewList';

type Props = {
  params: {
    movieId: number;
  };
};

const MovieDetail = ({ params: { movieId } }: Props) => {
  const [isDeleteMovieDialogOpen, setIsDeleteMovieDialogOpen] = useState(false);
  const [isEditMovieDialogOpen, setIsEditMovieDialogOpen] = useState(false);

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

  return (
    <div className="no-scrollbar h-full w-full space-y-5 overflow-auto p-5">
      <DeleteMovieDialog
        movieId={movieId}
        isDeleteMovieDialogOpen={isDeleteMovieDialogOpen}
        setIsDeleteMovieDialogOpen={setIsDeleteMovieDialogOpen}
      />
      <EditMovieDialog
        movieId={movieId}
        isEditMovieDialogOpen={isEditMovieDialogOpen}
        setIsEditMovieDialogOpen={setIsEditMovieDialogOpen}
        title={movieData?.title || ''}
        description={movieData?.description || ''}
        genre={movieData?.genre || ''}
        release_year={movieData?.release_year || 0}
        imageUrl={movieData?.imageUrl || ''}
      />

      {/* MOVIE DETAIL  */}

      <div className=" w-full p-5">
        <Card>
          <CardHeader>
            <CardTitle>
              <div className="flex items-center justify-between">
                <span>{movieData?.title}</span>
                <div className="flex gap-5">
                  <Edit
                    onClick={() => {
                      setIsEditMovieDialogOpen(true);
                    }}
                    className="cursor-pointer "
                  />
                  <Trash
                    onClick={() => {
                      setIsDeleteMovieDialogOpen(true);
                    }}
                    className="cursor-pointer text-red-300 "
                  />
                </div>
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

      {/* REVIEW LIST */}
      <div className="text-center text-3xl font-semibold">Reviews : </div>
      <ReviewList reviews={movieData?.reviews || []} />
    </div>
  );
};

export default MovieDetail;
