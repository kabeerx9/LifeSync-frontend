'use client';
import axiosInstance from '@/axios/axios';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { Loader } from 'lucide-react';
import { useState } from 'react';
import AddMovieDialog from './_components/AddMovieDialog';
import MovieCard from './_components/MovieCard';
import { useUser } from '@/hooks/useUser';

export type Review = {
  movie: any;
  user: any;
  rating: number;
  comment: string;
  created_at: string;
  id: string;
};

export type TMovie = {
  id: number;
  title: string;
  genre: string;
  description: string;
  reviews: Review[];
  release_year: number;
  imageUrl?: string;
  avg_rating: number;
  is_watchlisted: boolean;
};

export default function Imdb() {
  const [isAddMoiveDialogOpen, setIsAddMovieDialogOpen] = useState(false);
  const { is_staff } = useUser();

  const fetchMovies = async () => {
    const res = await axiosInstance.get('/movies/');
    return res.data;
  };

  const { data: moviesData, isLoading } = useQuery<TMovie[]>({
    queryFn: fetchMovies,
    queryKey: ['movies'],
    staleTime: 1000 * 60 * 5
  });

  return (
    <>
      {isLoading ? (
        <div className="flex h-full w-full items-center justify-center">
          <Loader className="h-10 w-10" />
        </div>
      ) : (
        <div className="no-scrollbar h-full w-full space-y-2 overflow-auto p-5">
          <div className="flex flex-row-reverse">
            <Button
              onClick={() => {
                setIsAddMovieDialogOpen(true);
              }}
              disabled={!is_staff}
            >
              Add Movie
            </Button>
          </div>
          <AddMovieDialog
            isAddMoiveDialogOpen={isAddMoiveDialogOpen}
            setIsAddMovieDialogOpen={setIsAddMovieDialogOpen}
          />

          <div className="grid w-full grid-cols-1 gap-5  sm:grid-cols-2 lg:grid-cols-3">
            {moviesData?.map((movie) => (
              <MovieCard
                key={movie.id}
                movieId={movie.id}
                title={movie.title}
                genre={movie.genre}
                description={movie.description}
                release_year={movie.release_year}
                imageUrl={movie.imageUrl}
                avg_rating={movie.avg_rating}
                numberOfReviews={movie.reviews.length}
                is_watchlisted={movie.is_watchlisted}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
