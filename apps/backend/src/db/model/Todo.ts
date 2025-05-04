import { Todo as ITodo } from "@/types/todo";
import mongoose from "mongoose";

const todoSchema = new mongoose.Schema<ITodo>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    completed: {
      type: Boolean,
      required: true,
      default: false,
    },
    createdAt: {
      type: String,
      required: true,
    },
    updatedAt: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: false, // We'll manage these manually since we're using string ISO dates
  },
);

// Create indexes
todoSchema.index({ title: 1 });
todoSchema.index({ completed: 1 });

const Todo = mongoose.model<ITodo>("Todo", todoSchema);

export default Todo;
