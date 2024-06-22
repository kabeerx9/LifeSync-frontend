import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { AddTodoForm } from './add-todo-form';
import { Todo } from '@/types';

type Props = {
  isDialogOpen: boolean;
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  initialData: Todo | null;
};

const AddTodoModal = ({
  isDialogOpen,
  setIsDialogOpen,
  initialData
}: Props) => {
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Todo' : 'Add Todo'}</DialogTitle>
          <DialogDescription>
            {initialData ? 'Update todo with form' : 'Create todo with form'}
          </DialogDescription>
        </DialogHeader>
        <AddTodoForm
          initialData={initialData}
          setIsDialogOpen={setIsDialogOpen}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddTodoModal;
