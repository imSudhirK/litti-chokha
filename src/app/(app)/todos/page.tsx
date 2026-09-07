import { PageHeader } from "@/components/ui/page-header";
import { AddTodoForm } from "@/features/todos/components/add-todo-form";
import { TodoList } from "@/features/todos/components/todo-list";
import { listTodos } from "@/features/todos/queries";

export const metadata = { title: "Todos" };

export default async function TodosPage() {
  const todos = await listTodos();
  const remaining = todos.open.length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Todos"
        description={
          remaining === 0
            ? "Nothing open right now."
            : `${remaining} open ${remaining === 1 ? "item" : "items"}.`
        }
      />
      <AddTodoForm />
      <TodoList todos={todos} />
    </div>
  );
}
