"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckSquare, Plus, Loader2, Trash2 } from "lucide-react";
import { auth } from "@/lib/firebase";

export function TodoWidget({ data = [], onUpdate }) {
  const [todos, setTodos] = useState(data);
  const [newTodo, setNewTodo] = useState("");
  const [loading, setLoading] = useState(false);

  const getAuthToken = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        return await user.getIdToken();
      }
      return null;
    } catch (error) {
      console.error("Error getting auth token:", error);
      return null;
    }
  };

  const addTodo = async () => {
    if (!newTodo.trim()) return;

    try {
      setLoading(true);
      const token = await getAuthToken();

      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000"
        }/todos`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            todo: newTodo.trim(),
          }),
        }
      );

      if (response.ok) {
        const result = await response.json();
        const newTodoItem = {
          id: result.id,
          task: newTodo.trim(),
          completed: false,
          createdAt: new Date().toISOString(),
        };

        setTodos((prev) => [newTodoItem, ...prev]);
        setNewTodo("");

        if (onUpdate) onUpdate();
      }
    } catch (error) {
      console.error("Error adding todo:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTodo = async (todoId, currentStatus) => {
    try {
      const token = await getAuthToken();

      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000"
        }/todos/${todoId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: !currentStatus,
          }),
        }
      );

      if (response.ok) {
        setTodos((prev) =>
          prev.map((todo) =>
            todo.id === todoId ? { ...todo, completed: !currentStatus } : todo
          )
        );

        if (onUpdate) onUpdate();
      }
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  const deleteTodo = async (todoId) => {
    try {
      const token = await getAuthToken();

      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000"
        }/todos/${todoId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        setTodos((prev) => prev.filter((todo) => todo.id !== todoId));

        if (onUpdate) onUpdate();
      }
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  useEffect(() => {
    setTodos(data);
  }, [data]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">Tasks</CardTitle>
        <CheckSquare className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex space-x-2">
          <Input
            placeholder="Add a new task..."
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addTodo()}
            disabled={loading}
          />
          <Button
            size="sm"
            onClick={addTodo}
            disabled={loading || !newTodo.trim()}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
          </Button>
        </div>

        <div className="space-y-2 max-h-40 overflow-y-auto">
          {todos.length === 0 ? (
            <div className="text-sm text-muted-foreground text-center py-4">
              No tasks yet. Add one above!
            </div>
          ) : (
            todos.map((todo) => (
              <div key={todo.id} className="flex items-center space-x-2 group">
                <Checkbox
                  checked={todo.completed}
                  onCheckedChange={() => toggleTodo(todo.id, todo.completed)}
                />
                <span
                  className={`text-sm flex-1 ${
                    todo.completed ? "line-through text-muted-foreground" : ""
                  }`}
                >
                  {todo.task}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteTodo(todo.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))
          )}
        </div>
      </CardContent>
      <CardFooter>
        <div className="text-xs text-muted-foreground">
          {todos.filter((t) => t.completed).length} of {todos.length} completed
        </div>
      </CardFooter>
    </Card>
  );
}
