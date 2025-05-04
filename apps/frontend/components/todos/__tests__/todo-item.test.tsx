import { Todo } from "@/types/todo";
import { act, fireEvent, render, screen } from "@testing-library/react";
import TodoItem from "../todo-item";

// Mock the Next.js router
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    refresh: jest.fn(),
  }),
}));

describe("TodoItem", () => {
  const mockTodo: Todo = {
    id: "1",
    title: "Test Todo",
    description: "Test Description",
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const mockOnUpdate = jest.fn().mockResolvedValue(undefined);
  const mockOnDelete = jest.fn().mockResolvedValue(undefined);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the todo item correctly", () => {
    render(
      <TodoItem todo={mockTodo} onUpdate={mockOnUpdate} onDelete={mockOnDelete} />
    );

    expect(screen.getByText("Test Todo")).toBeInTheDocument();
    expect(screen.getByText("Test Description")).toBeInTheDocument();
  });

  it("renders a completed todo with line-through style", () => {
    const completedTodo = { ...mockTodo, completed: true };
    render(
      <TodoItem todo={completedTodo} onUpdate={mockOnUpdate} onDelete={mockOnDelete} />
    );

    const titleElement = screen.getByText("Test Todo");
    expect(titleElement.className).toContain("line-through");
  });

  it("renders todo without description when not provided", () => {
    const todoWithoutDescription = { ...mockTodo, description: undefined };
    render(
      <TodoItem todo={todoWithoutDescription} onUpdate={mockOnUpdate} onDelete={mockOnDelete} />
    );

    expect(screen.getByText("Test Todo")).toBeInTheDocument();
    expect(screen.queryByText("Test Description")).not.toBeInTheDocument();
  });

  it("calls onUpdate when checkbox is clicked", async () => {
    render(
      <TodoItem todo={mockTodo} onUpdate={mockOnUpdate} onDelete={mockOnDelete} />
    );

    const checkbox = screen.getByRole("checkbox");
    
    await act(async () => {
      fireEvent.click(checkbox);
    });

    expect(mockOnUpdate).toHaveBeenCalledWith(mockTodo.id, true);
  });

  it("calls onDelete when delete button is clicked", async () => {
    render(
      <TodoItem todo={mockTodo} onUpdate={mockOnUpdate} onDelete={mockOnDelete} />
    );

    const deleteButton = screen.getByRole("button", { name: /delete/i });
    
    await act(async () => {
      fireEvent.click(deleteButton);
    });

    expect(mockOnDelete).toHaveBeenCalledWith(mockTodo.id);
  });
});
