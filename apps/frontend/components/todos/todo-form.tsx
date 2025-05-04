"use client";

import { CreateTodoPayload } from "@/types/todo";
import { Button } from "@workspace/ui/components/button";
import { Card } from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Textarea } from "@workspace/ui/components/textarea";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

interface TodoFormProps {
  onSubmit: (todo: CreateTodoPayload) => Promise<void>;
}

export default function TodoForm({ onSubmit }: TodoFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setError(null);

    startTransition(async () => {
      try {
        await onSubmit({
          title: title.trim(),
          description: description.trim() || undefined,
        });

        setTitle("");
        setDescription("");
        router.refresh();
      } catch (err) {
        console.error(err);
        setError("Failed to create todo");
      }
    });
  };

  return (
    <Card className="p-4 shadow-none">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="text-destructive text-sm">{error}</div>}
        <div className="space-y-2">
          <Input
            name="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs to be done?"
            required
            disabled={isPending}
          />
        </div>
        <div className="space-y-2">
          <Textarea
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add a description (optional)"
            rows={3}
            disabled={isPending}
          />
        </div>
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Adding..." : "Add Todo"}
        </Button>
      </form>
    </Card>
  );
}
