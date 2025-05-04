import { todoService } from "@/services/todoService";
import { Router } from "express";

export const todoRouter: Router = Router();

// Get all todos
todoRouter.get("/", async (req, res) => {
  try {
    const todos = await todoService.getAllTodos();
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch todos" });
  }
});

// Create todo
todoRouter.post("/", async (req, res) => {
  try {
    const todo = await todoService.createTodo(req.body);
    res.status(201).json(todo);
  } catch (error) {
    res.status(400).json({ error: "Failed to create todo" });
  }
});

// Update todo
todoRouter.put("/:id", async (req, res) => {
  try {
    const todo = await todoService.updateTodo(req.params.id, req.body);
    res.json(todo);
  } catch (error) {
    res.status(404).json({ error: "Todo not found" });
  }
});

// Delete todo
todoRouter.delete("/:id", async (req, res) => {
  try {
    await todoService.deleteTodo(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(404).json({ error: "Todo not found" });
  }
});
