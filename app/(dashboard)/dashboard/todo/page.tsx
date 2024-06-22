import BreadCrumb from '@/components/breadcrumb';

import { Heading } from '@/components/ui/heading';
import TodoList from './_components/todo-list';

const breadcrumbItems = [{ title: 'Todo', link: '/dashboard/todo' }];
export default function page() {
  return (
    <>
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <BreadCrumb items={breadcrumbItems} />
        <div className="flex items-start justify-between">
          <Heading title={`Todos`} description="Manage your personal tasks" />
        </div>
        <TodoList />
      </div>
    </>
  );
}
