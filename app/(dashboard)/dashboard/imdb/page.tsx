'use client';
import axiosInstance from '@/axios/axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useUser } from '@/hooks/useUser';
import { useQuery } from '@tanstack/react-query';
import { Loader, Plus } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import AddMovieDialog from './_components/AddMovieDialog';
import MovieCard from './_components/MovieCard';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

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

export type TPaginatedMovies = {
  count: number;
  next: string;
  previous: string;
  results: TMovie[];
};

export default function Imdb() {
  const [isAddMoiveDialogOpen, setIsAddMovieDialogOpen] = useState(false);
  const { is_staff } = useUser();

  const [searchQuery, setSearchQuery] = useState('');
  const [orderingQuery, setOrderingQuery] = useState('');
  const [currentPageNumber, setCurrentPageNumber] = useState(1);

  const fetchMovies = async () => {
    const res = await axiosInstance.get(
      '/movies/?page=' +
        currentPageNumber +
        '&title=' +
        searchQuery +
        '&ordering=' +
        orderingQuery
    );

    // this .results comes from the pagination thing .
    return res.data;
  };

  const { data, isLoading, refetch, isRefetching } = useQuery<TPaginatedMovies>(
    {
      queryFn: fetchMovies,
      queryKey: ['movies'],
      staleTime: 1000 * 60 * 5
    }
  );

  const moviesData: TMovie[] = useMemo(() => data?.results || [], [data]);

  const handleNextPage = () => {
    if (data?.next) {
      setCurrentPageNumber((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (data?.previous) {
      setCurrentPageNumber((prev) => prev - 1);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setCurrentPageNumber(1);
      refetch();
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchQuery, orderingQuery]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    refetch();
  }, [currentPageNumber]);

  return (
    <>
      {isLoading || isRefetching ? (
        <div className="flex h-full w-full items-center justify-center ">
          <Loader className="h-10 w-10" />
        </div>
      ) : (
        <div className="no-scrollbar h-full w-full space-y-2 overflow-auto p-5">
          <div className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-center md:gap-5">
            <Input
              placeholder="Search for a movie (using django-filter in backend)"
              value={searchQuery}
              onChange={handleChange}
              autoFocus
            />

            <Select
              onValueChange={(value) => {
                setOrderingQuery(value);
              }}
            >
              <SelectTrigger className="w-full md:w-1/3">
                <SelectValue placeholder="Order By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="title">Title</SelectItem>
                <SelectItem value="avg_rating">Rating Ascending</SelectItem>
                <SelectItem value="-avg_rating">Rating Desceding</SelectItem>
                <SelectItem value="genre">Genre</SelectItem>
                <SelectItem value="release_year">Release Year (Asc)</SelectItem>
                <SelectItem value="-release_year">
                  Release Year (Desc)
                </SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={() => {
                setIsAddMovieDialogOpen(true);
              }}
              disabled={!is_staff}
            >
              Add
              <Plus />
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
          <div className="flex w-full items-center justify-between">
            <Button onClick={handlePreviousPage} disabled={!data?.previous}>
              Previous
            </Button>
            <Button onClick={handleNextPage} disabled={!data?.next}>
              Next
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
