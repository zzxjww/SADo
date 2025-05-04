import { act, fireEvent, render, screen } from "@testing-library/react";
import TodoForm from "../todo-form";

// Mock the Next.js router
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    refresh: jest.fn(),
  }),
}));

describe("TodoForm", () => {
  const mockOnSubmit = jest.fn().mockResolvedValue(undefined);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the form correctly", () => {
    render(<TodoForm onSubmit={mockOnSubmit} />);

    expect(screen.getByPlaceholderText("What needs to be done?")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Add a description (optional)")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add Todo" })).toBeInTheDocument();
  });

  it("allows entering title and description", async () => {
    render(<TodoForm onSubmit={mockOnSubmit} />);

    const titleInput = screen.getByPlaceholderText("What needs to be done?");
    const descriptionInput = screen.getByPlaceholderText("Add a description (optional)");

    await act(async () => {
      fireEvent.change(titleInput, { target: { value: "Test Todo" } });
      fireEvent.change(descriptionInput, { target: { value: "Test Description" } });
    });

    expect(titleInput).toHaveValue("Test Todo");
    expect(descriptionInput).toHaveValue("Test Description");
  });

  it("submits the form with title and description", async () => {
    render(<TodoForm onSubmit={mockOnSubmit} />);

    const titleInput = screen.getByPlaceholderText("What needs to be done?");
    const descriptionInput = screen.getByPlaceholderText("Add a description (optional)");
    const submitButton = screen.getByRole("button", { name: "Add Todo" });

    await act(async () => {
      fireEvent.change(titleInput, { target: { value: "Test Todo" } });
      fireEvent.change(descriptionInput, { target: { value: "Test Description" } });
      fireEvent.click(submitButton);
    });

    expect(mockOnSubmit).toHaveBeenCalledWith({
      title: "Test Todo",
      description: "Test Description",
    });
  });

  it("submits the form with title only", async () => {
    render(<TodoForm onSubmit={mockOnSubmit} />);

    const titleInput = screen.getByPlaceholderText("What needs to be done?");
    const submitButton = screen.getByRole("button", { name: "Add Todo" });

    await act(async () => {
      fireEvent.change(titleInput, { target: { value: "Test Todo" } });
      fireEvent.click(submitButton);
    });

    expect(mockOnSubmit).toHaveBeenCalledWith({
      title: "Test Todo",
      description: undefined,
    });
  });

  it("does not submit the form with empty title", async () => {
    render(<TodoForm onSubmit={mockOnSubmit} />);

    const submitButton = screen.getByRole("button", { name: "Add Todo" });

    await act(async () => {
      fireEvent.click(submitButton);
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it("clears the form after successful submission", async () => {
    render(<TodoForm onSubmit={mockOnSubmit} />);

    const titleInput = screen.getByPlaceholderText("What needs to be done?");
    const descriptionInput = screen.getByPlaceholderText("Add a description (optional)");
    const submitButton = screen.getByRole("button", { name: "Add Todo" });

    await act(async () => {
      fireEvent.change(titleInput, { target: { value: "Test Todo" } });
      fireEvent.change(descriptionInput, { target: { value: "Test Description" } });
      fireEvent.click(submitButton);
    });

    expect(titleInput).toHaveValue("");
    expect(descriptionInput).toHaveValue("");
  });

  it("displays an error message when submission fails", async () => {
    // Mock console.error to prevent test output noise
    const originalConsoleError = console.error;
    console.error = jest.fn();

    const mockFailingSubmit = jest.fn().mockRejectedValue(new Error("Failed"));
    render(<TodoForm onSubmit={mockFailingSubmit} />);

    const titleInput = screen.getByPlaceholderText("What needs to be done?");
    const submitButton = screen.getByRole("button", { name: "Add Todo" });

    await act(async () => {
      fireEvent.change(titleInput, { target: { value: "Test Todo" } });
      fireEvent.click(submitButton);
    });

    expect(screen.getByText("Failed to create todo")).toBeInTheDocument();

    // Restore original console.error
    console.error = originalConsoleError;
  });
}); 