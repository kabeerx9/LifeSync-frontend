import axiosInstance from '@/axios/axios';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { useMutationContext } from '@/context/mutation-context';
import { cn } from '@/lib/utils';
import { Todo } from '@/types';
import { formatDateTime } from '@/utils/date';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CheckCircle, Circle, Edit, Loader2, Trash } from 'lucide-react';
import { useRef } from 'react';
import { toast } from 'sonner';

type Props = Partial<Todo> & {
  handleTodoUpdate: (id: number) => void;
};

const TodoCard = ({
  id,
  title,
  description,
  status,
  due_date,
  handleTodoUpdate
}: Props) => {
  const { incrementPending, decrementPending, getPendingCount } =
    useMutationContext();
  const queryClient = useQueryClient();

  const updateTodoStatusMutation = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.put('tasks/update/' + id);
      return res.data;
    },
    onMutate: async () => {
      // add the mutation to the pending list
      incrementPending();

      await queryClient.cancelQueries({
        queryKey: ['todos']
      });

      // snapshot of the previous values
      const previousTodos = queryClient.getQueryData(['todos']);

      // optimistically update to the new value

      queryClient.setQueryData(['todos'], (old: Todo[]) => {
        return old?.map((todo) =>
          todo.id === id
            ? { ...todo, status: todo.status === 'TODO' ? 'DONE' : 'TODO' }
            : todo
        );
      });

      return { previousTodos };
    },
    onError: (err, _, context) => {
      queryClient.setQueryData(['todos'], context?.previousTodos);
      toast.error('Failed to update todo status');
    },
    onSettled: () => {
      // remove the mutation from the pending list
      decrementPending();

      if (getPendingCount() === 0) {
        queryClient.invalidateQueries({
          queryKey: ['todos']
        });
      }
    }
  });

  const deleteTodoMutation = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.delete('tasks/delete/' + id);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['todos']
      });
      toast.success('Todo deleted');
    }
  });

  return (
    <Card>
      <CardHeader className={cn('', status !== 'TODO' && 'line-through')}>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-between">
        {status === 'TODO' ? (
          <Circle
            onClick={() => updateTodoStatusMutation.mutate()}
            className="cursor-pointer"
          />
        ) : (
          <CheckCircle
            onClick={() => updateTodoStatusMutation.mutate()}
            className="cursor-pointer text-green-500"
          />
        )}

        <Edit
          className="cursor-pointer"
          onClick={() => handleTodoUpdate(id!)}
        />
        {deleteTodoMutation.isPending ? (
          <Loader2 className="h-8 w-8" />
        ) : (
          <Trash
            onClick={() => deleteTodoMutation.mutate()}
            className="cursor-pointer text-red-500"
          />
        )}
      </CardContent>
      <CardFooter className="flex  items-center justify-between text-sm text-muted-foreground">
        <div>{status}</div>
        <div className="text-xs">
          {formatDateTime(due_date || new Date().toISOString())}
        </div>
      </CardFooter>
    </Card>
  );
};

export default TodoCard;
