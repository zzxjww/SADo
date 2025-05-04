import { db } from "@/db/connect";
import { CreateTodoPayload, Todo, UpdateTodoPayload } from "@/types/todo";
import { Collection } from "mongodb";
import { v4 as uuidv4 } from "uuid";

interface TodoService {
  getAllTodos(): Promise<Todo[]>;
  createTodo(input: CreateTodoPayload): Promise<Todo>;
  updateTodo(id: string, input: UpdateTodoPayload): Promise<Todo>;
  deleteTodo(id: string): Promise<void>;
  getTodoById(id: string): Promise<Todo>;
}

// MongoDB Implementation
const todos: Collection<Todo> = db.collection("todos");

export const mongoTodoService: TodoService = {
  async getAllTodos() {
    return await todos.find().toArray();
  },

  async createTodo(input) {
    const now = new Date().toISOString();
    const newTodo: Todo = {
      id: uuidv4(),
      title: input.title,
      description: input.description,
      completed: false,
      createdAt: now,
      updatedAt: now,
    };

    await todos.insertOne(newTodo);
    return newTodo;
  },

  async updateTodo(id, input) {
    const result = await todos.findOneAndUpdate(
      { id },
      {
        $set: {
          ...input,
          updatedAt: new Date().toISOString(),
        },
      },
      { returnDocument: "after" },
    );

    if (!result) {
      throw new Error("Todo not found");
    }

    return result;
  },

  async deleteTodo(id) {
    const result = await todos.deleteOne({ id });
    if (result.deletedCount === 0) {
      throw new Error("Todo not found");
    }
  },

  async getTodoById(id) {
    const todo = await todos.findOne({ id });
    if (!todo) {
      throw new Error("Todo not found");
    }
    return todo;
  },
};

// In-memory Implementation
const inMemoryTodos: Todo[] = [];

export const inMemoryTodoService: TodoService = {
  async getAllTodos() {
    return inMemoryTodos;
  },

  async createTodo(input) {
    const now = new Date().toISOString();
    const newTodo: Todo = {
      id: uuidv4(),
      title: input.title,
      description: input.description,
      completed: false,
      createdAt: now,
      updatedAt: now,
    };

    inMemoryTodos.push(newTodo);
    return newTodo;
  },

  async updateTodo(id, input) {
    const todoIndex = inMemoryTodos.findIndex((todo) => todo.id === id);
    if (todoIndex === -1) {
      throw new Error("Todo not found");
    }

    const updatedTodo = {
      ...(inMemoryTodos[todoIndex] as Todo),
      ...input,
      completed: input.completed || false,
      updatedAt: new Date().toISOString(),
    };

    inMemoryTodos[todoIndex] = updatedTodo;
    return updatedTodo;
  },

  async deleteTodo(id) {
    const todoIndex = inMemoryTodos.findIndex((todo) => todo.id === id);
    if (todoIndex === -1) {
      throw new Error("Todo not found");
    }

    inMemoryTodos.splice(todoIndex, 1);
  },

  async getTodoById(id) {
    const todo = inMemoryTodos.find((todo) => todo.id === id);
    if (!todo) {
      throw new Error("Todo not found");
    }
    return todo;
  },
};

// Export the service you want to use
export const todoService =
  process.env.USE_MONGO === "true" ? mongoTodoService : inMemoryTodoService;
