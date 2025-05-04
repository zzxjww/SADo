import { todoApi } from "@/lib/api/todos";
import { Card } from "@workspace/ui/components/card";
import TodoItem from "./todo-item";

async function getTodos() {
  try {
    const data = await todoApi.getAllTodos();
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default async function TodoList() {
  const todos = await getTodos();

  if (todos.length === 0) {
    return (
      <Card className="p-8 border-2 border-dotted shadow-none">
        <p className="text-muted-foreground text-center">
          No todos yet. Add one above!
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {todos &&
        todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onUpdate={async (id: string, completed: boolean) => {
              "use server";
              await todoApi.updateTodo({ id, completed });
            }}
            onDelete={async (id: string) => {
              "use server";
              await todoApi.deleteTodo(id);
            }}
          />
        ))}
    </div>
  );
}
