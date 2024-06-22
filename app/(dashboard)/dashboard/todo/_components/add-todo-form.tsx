'use client';
import axiosInstance from '@/axios/axios';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Todo } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
const formSchema = z.object({
  title: z.string().min(1, 'Title is Required'),
  description: z.string().min(1, 'Description is Required'),
  dueDate: z.coerce.date()
});
interface AddTodoFormProps {
  initialData: Todo | null;
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
const AddTodoForm: React.FC<AddTodoFormProps> = ({
  initialData,
  setIsDialogOpen
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      dueDate: initialData
        ? new Date(initialData?.due_date!) || new Date()
        : new Date()
    }
  });

  const action = initialData ? 'Update' : 'Create';
  const loadingAction = initialData ? 'Updating' : 'Creating';

  const queryClient = useQueryClient();

  const createTodoMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const res = await axiosInstance.post('/tasks/create/', {
        title: values.title,
        description: values.description,
        due_date: values.dueDate
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['todos']
      });
      toast.success('Todo created Successfully');
      setIsDialogOpen(false);
    }
  });

  const editTodoMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const res = await axiosInstance.post('/tasks/edit/', {
        id: initialData?.id,
        title: values.title,
        description: values.description,
        due_date: values.dueDate
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['todos']
      });
      toast.success('Todo edited Successfully');
      setIsDialogOpen(false);
    }
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (initialData) {
      // NEED TO CALL EDIT MUTATION HERE
      editTodoMutation.mutate(values);
    } else {
      // NEED TO CALL CREATE MUTATION HERE
      createTodoMutation.mutate(values);
    }
  };

  useEffect(() => {
    if (initialData) {
      form.setValue('title', initialData.title);
      form.setValue('description', initialData.description);
    }
  }, [initialData]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <Label>Title</Label>
              <FormControl>
                <Input placeholder="Todo Title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <Label>Description</Label>
              <FormControl>
                {/* <Input placeholder="Todo Description" {...field} /> */}
                <Textarea placeholder="Todo Description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dueDate"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  type="date"
                  placeholder="Data de nascimento"
                  {...field}
                  value={
                    field.value instanceof Date
                      ? field.value.toISOString().split('T')[0]
                      : field.value
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex w-full justify-end gap-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsDialogOpen(false)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={createTodoMutation.isPaused || editTodoMutation.isPending}
          >
            {createTodoMutation.isPending || editTodoMutation.isPending
              ? loadingAction
              : action}
          </Button>
        </div>
      </form>
    </Form>
  );
};
export { AddTodoForm };
