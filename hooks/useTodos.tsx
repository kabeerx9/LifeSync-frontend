import axiosInstance from '@/axios/axios';
import { Todo } from '@/types';
import { useQuery } from '@tanstack/react-query';

export const useTodos = () => {
  const fetchTodos = async () => {
    const res = await axiosInstance.get('/tasks');
    return res.data;
  };

  const {
    data: todos,
    isLoading,
    isError
  } = useQuery<Todo[]>({
    queryKey: ['todos'],
    queryFn: fetchTodos,
    staleTime: 1000 * 60 * 5
  });

  return {
    todos,
    isLoading,
    isError
  };
};
