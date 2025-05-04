import { todoApi } from "@/lib/api/todos";
import { Todo } from "@/types/todo";
import { render, screen } from "@testing-library/react";
import TodoList from "../todo-list";

// Mock the todoApi
jest.mock("@/lib/api/todos", () => ({
  todoApi: {
    getAllTodos: jest.fn(),
    updateTodo: jest.fn(),
    deleteTodo: jest.fn(),
  },
}));

// Mock the TodoItem component
jest.mock("../todo-item", () => {
  return function MockTodoItem({ todo }: { todo: Todo }) {
    return <div data-testid={`todo-item-${todo.id}`}>{todo.title}</div>;
  };
});

describe("TodoList", () => {
  // Mock console.log before all tests
  const originalConsoleLog = console.log;
  
  beforeAll(() => {
    console.log = jest.fn();
  });
  
  afterAll(() => {
    console.log = originalConsoleLog;
  });
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders empty state when no todos are available", async () => {
    (todoApi.getAllTodos as jest.Mock).mockResolvedValue([]);

    const TodoListComponent = await TodoList();
    render(TodoListComponent);

    expect(screen.getByText("No todos yet. Add one above!")).toBeInTheDocument();
  });

  it("renders a list of todos when available", async () => {
    const mockTodos = [
      {
        id: "1",
        title: "Test Todo 1",
        description: "Description 1",
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "2",
        title: "Test Todo 2",
        description: "Description 2",
        completed: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    (todoApi.getAllTodos as jest.Mock).mockResolvedValue(mockTodos);

    const TodoListComponent = await TodoList();
    render(TodoListComponent);

    expect(screen.getByTestId("todo-item-1")).toBeInTheDocument();
    expect(screen.getByTestId("todo-item-2")).toBeInTheDocument();
    expect(screen.getByText("Test Todo 1")).toBeInTheDocument();
    expect(screen.getByText("Test Todo 2")).toBeInTheDocument();
  });

  it("handles errors when fetching todos", async () => {
    // Mock the console.error to prevent test output noise
    const originalConsoleError = console.error;
    console.error = jest.fn();

    (todoApi.getAllTodos as jest.Mock).mockRejectedValue(new Error("Failed to fetch"));

    const TodoListComponent = await TodoList();
    render(TodoListComponent);

    // Should show empty state when there's an error
    expect(screen.getByText("No todos yet. Add one above!")).toBeInTheDocument();
    
    // Restore console.error
    console.error = originalConsoleError;
  });
}); 