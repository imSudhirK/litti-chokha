import { EmptyState } from "@/components/ui/page-header";
import type { TodoList as TodoListData } from "../types";
import { TodoItem } from "./todo-item";

export function TodoList({ todos }: { todos: TodoListData }) {
  if (todos.open.length === 0 && todos.done.length === 0) {
    return (
      <EmptyState
        title="Nothing here yet"
        description="Add your first todo above to get started."
      />
    );
  }

  return (
    <div className="space-y-6">
      {todos.open.length > 0 ? (
        <ul className="space-y-2">
          {todos.open.map((todo) => (
            <TodoItem key={todo.id} todo={todo} />
          ))}
        </ul>
      ) : (
        <EmptyState
          title="All clear"
          description="Every todo is done. Add another when you're ready."
        />
      )}

      {todos.done.length > 0 ? (
        <details className="group">
          <summary className="cursor-pointer text-sm font-medium text-slate-600 select-none hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200">
            Completed ({todos.done.length})
          </summary>
          <ul className="mt-2 space-y-2">
            {todos.done.map((todo) => (
              <TodoItem key={todo.id} todo={todo} />
            ))}
          </ul>
        </details>
      ) : null}
    </div>
  );
}
