import { api } from "../axios";
import { CreateTodoPayload, Todo, UpdateTodoPayload } from "@/types/todo";

export const todoApi = {
  async getAllTodos(): Promise<Todo[]> {
    const response = await api.get<Todo[]>("/api/todos");
    return response.data;
  },

  async createTodo(todo: CreateTodoPayload): Promise<Todo> {
    const response = await api.post<Todo>("/api/todos", todo);
    return response.data;
  },

  async updateTodo(todo: UpdateTodoPayload): Promise<Todo> {
    const response = await api.put<Todo>(`/api/todos/${todo.id}`, todo);
    return response.data;
  },

  async deleteTodo(id: string): Promise<void> {
    await api.delete(`/api/todos/${id}`);
  },
};
