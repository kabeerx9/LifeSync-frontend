'use client';
import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { useTodos } from '@/hooks/useTodos';
import { Todo } from '@/types';
import { Loader } from 'lucide-react';
import { useState } from 'react';
import AddTodoModal from './add-todo-modal';
import TodoCard from './todo-card';

type Props = {};

const TodoList = (props: Props) => {
  const { todos, isLoading, isError } = useTodos();

  const [isAddTodoDialogOpen, setIsAddTodoDialogOpen] = useState(false);
  const [isEditTodoDialogOpen, setIsEditTodoDialogOpen] = useState(false);

  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);

  const handleTodoUpdate = (id: number) => {
    setSelectedTodo(todos?.find((todo) => todo.id === id) || null);
    setIsEditTodoDialogOpen(true);
  };

  if (isLoading)
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader className="h-10 w-10 animate-spin opacity-50" />
      </div>
    );

  if (isError)
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Heading
          title="Error!!!"
          description="There was an error in getting the tasks"
        />
      </div>
    );

  return (
    <div>
      <AddTodoModal
        isDialogOpen={isAddTodoDialogOpen}
        setIsDialogOpen={setIsAddTodoDialogOpen}
        initialData={null}
      />
      <AddTodoModal
        isDialogOpen={isEditTodoDialogOpen}
        setIsDialogOpen={setIsEditTodoDialogOpen}
        initialData={selectedTodo ?? null}
      />

      <div className="grid grid-cols-1  md:grid-cols-2 md:gap-3 lg:grid-cols-3 lg:gap-5">
        {todos?.map((todo) => (
          <TodoCard
            key={todo.id}
            {...todo}
            handleTodoUpdate={handleTodoUpdate}
          />
        ))}
      </div>
      <Button className="mt-5" onClick={() => setIsAddTodoDialogOpen(true)}>
        Add
      </Button>
    </div>
  );
};

export default TodoList;
