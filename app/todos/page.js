"use client";

import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import { BACKEND_URL } from "@/app/config";
import { onAuthStateChanged } from "firebase/auth";

function TodoItem({ todo, onToggle, onDelete }) {
  return (
    <div
      className={cn(
        "group flex items-center gap-3 p-4 rounded-lg border transition-all duration-200 hover:shadow-md",
        "bg-white border-gray-200 hover:border-gray-300",
        todo.status && "bg-gray-50 border-gray-100"
      )}
    >
      <button
        onClick={() => onToggle(todo.id, !todo.status)}
        className="flex-shrink-0 transition-all duration-200 hover:scale-110"
      >
        {todo.status ? (
          <CheckCircle2 className="h-5 w-5 text-black" />
        ) : (
          <Circle className="h-5 w-5 text-gray-400 hover:text-gray-600" />
        )}
      </button>

      <span
        className={cn(
          "flex-1 text-sm font-medium transition-all duration-200",
          todo.status ? "line-through text-gray-400" : "text-gray-900"
        )}
      >
        {todo.todo}
      </span>

      <button
        onClick={() => onDelete(todo.id)}
        className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 text-gray-400 hover:text-red-500"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}

function TodoList({ todos, onToggle, onDelete }) {
  if (todos.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
          <CheckCircle2 className="h-8 w-8 text-gray-400" />
        </div>
        <p className="text-gray-500 text-sm font-medium">No todos yet</p>
        <p className="text-gray-400 text-xs mt-1">Add your first task above</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {todos.map((todo, id) => (
        <TodoItem
          key={todo.id ?? id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

async function getIdToken() {
  const user = auth.currentUser;
  if (!user) return null;
  return await user.getIdToken();
}

export default function TodosPage() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setTodos([]);
        return;
      }

      try {
        const idToken = await user.getIdToken();
        const res = await fetch(`${BACKEND_URL}/todos`, {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          // Ensure data is an array
          setTodos(Array.isArray(data) ? data : []);
        } else {
          setTodos([]);
        }
      } catch (error) {
        console.error("Error fetching todos:", error);
        setTodos([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleAddTodo = async () => {
    if (input.trim() === "") return;
    setLoading(true);
    try {
      const idToken = await getIdToken();
      if (!idToken) return;
      const res = await fetch(`${BACKEND_URL}/todos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ todo: input.trim(), status: false }),
      });

      if (res.ok) {
        const newTodo = await res.json();
        setTodos((prev) => [newTodo, ...prev]);
        setInput("");
      }
    } catch (error) {
      console.error("Error adding todo:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleAddTodo();
    }
  };

  // Toggle todo status
  const handleToggleTodo = async (id, newStatus) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    try {
      const idToken = await getIdToken();
      if (!idToken) return;

      const res = await fetch(`${BACKEND_URL}/todos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ todo: todo.todo, status: newStatus }),
      });

      if (res.ok) {
        setTodos((prev) =>
          prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
        );
      }
    } catch (error) {
      console.error("Error toggling todo:", error);
    }
  };

  // Delete todo
  const handleDeleteTodo = async (id) => {
    try {
      const idToken = await getIdToken();
      if (!idToken) return;

      const res = await fetch(`${BACKEND_URL}/todos/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      if (res.ok) {
        setTodos((prev) => prev.filter((t) => t.id !== id));
      }
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  // Ensure todos is always an array before using filter
  const todosArray = Array.isArray(todos) ? todos : [];
  const completedCount = todosArray.filter((todo) => todo.status).length;
  const totalCount = todosArray.length;

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-gray-200 px-6 bg-white/80 backdrop-blur-sm">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="text-lg font-semibold text-gray-900">Tasks</h1>
        </header>

        <main className="flex-1 overflow-auto bg-gray-50/50">
          <div className="container max-w-2xl mx-auto p-6">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    My Todo List
                  </h2>
                  <p className="text-gray-600 text-sm">
                    Stay organized and productive with your daily tasks
                  </p>
                </div>
                {totalCount > 0 && (
                  <div className="flex gap-2">
                    <Badge variant="outline" className="bg-white">
                      {totalCount} total
                    </Badge>
                    <Badge variant="outline" className="bg-black text-white">
                      {completedCount} done
                    </Badge>
                  </div>
                )}
              </div>

              <Card className="border-gray-200 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Add a new task..."
                      className="flex-1 border-gray-200 focus:border-gray-400 transition-colors"
                    />
                    <Button
                      onClick={handleAddTodo}
                      className="bg-black hover:bg-gray-800 text-white px-6 transition-all duration-200 hover:shadow-md"
                      disabled={!input.trim() || loading}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <TodoList
                todos={todosArray}
                onToggle={handleToggleTodo}
                onDelete={handleDeleteTodo}
              />
            </div>

            {totalCount > 0 && (
              <div className="mt-8 text-center">
                <p className="text-xs text-gray-400">
                  {completedCount === totalCount
                    ? "🎉 All tasks completed! Great job!"
                    : `${totalCount - completedCount} task${
                        totalCount - completedCount !== 1 ? "s" : ""
                      } remaining`}
                </p>
              </div>
            )}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
