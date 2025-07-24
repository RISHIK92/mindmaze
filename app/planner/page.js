"use client";

import { useState, useRef, useEffect } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Plus, ListChecks, Clock, Trash2 } from "lucide-react";
import { auth } from "@/lib/firebase";
import { BACKEND_URL } from "@/app/config";
import { onAuthStateChanged } from "firebase/auth";

const API_BASE = `${BACKEND_URL}/planner`;

async function getIdToken() {
  const user = auth.currentUser;
  if (!user) return null;
  return await user.getIdToken();
}

export default function PlannerPage() {
  const [calendar, setCalendar] = useState(false);
  const [currentDate, setCurrentDate] = useState("");
  const calendarRef = useRef(null);
  const buttonRef = useRef(null);

  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState("");
  const [deadline, setDeadline] = useState("");
  const [priority, setPriority] = useState("medium");
  const [category, setCategory] = useState("Work");

  const [editingId, setEditingId] = useState(null);
  const [editTask, setEditTask] = useState("");
  const [editDeadline, setEditDeadline] = useState("");
  const [editPriority, setEditPriority] = useState("medium");
  const [editCategory, setEditCategory] = useState("Work");

  const categories = [
    "Work",
    "Personal",
    "Health",
    "Learning",
    "Shopping",
    "Other",
  ];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setTasks([]);
        return;
      }

      try {
        const idToken = await user.getIdToken();
        const res = await fetch(`${API_BASE}`, {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        });

        if (res.ok) {
          const response = await res.json();
          console.log("Tasks response:", response);
          const tasksArray = Array.isArray(response)
            ? response
            : response?.data || [];
          setTasks(Array.isArray(tasksArray) ? tasksArray : []);
        } else {
          console.error("Failed to fetch tasks:", res.status, res.statusText);
          setTasks([]);
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setTasks([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleCalender = () => {
    setCalendar((e) => !e);
  };

  useEffect(() => {
    const today = new Date();
    const formatted = today.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    setCurrentDate(formatted);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        calendar &&
        calendarRef.current &&
        !calendarRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setCalendar(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [calendar]);

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!task.trim() || !deadline.trim()) return;
    const idToken = await getIdToken();
    if (!idToken) return;
    const res = await fetch(API_BASE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({
        task: task.trim(),
        priority,
        categories: category,
        deadline,
        date: new Date().toISOString(),
      }),
    });
    if (res.ok) {
      const newTask = await res.json();
      setTasks((prev) => [newTask, ...prev]);
      setTask("");
      setDeadline("");
      setPriority("medium");
      setCategory("Work");
    }
  };

  const handleEditTask = async () => {
    if (!editTask.trim() || !editDeadline.trim() || !editingId) return;
    const idToken = await getIdToken();
    if (!idToken) return;
    const res = await fetch(`${API_BASE}/${editingId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({
        task: editTask.trim(),
        priority: editPriority,
        categories: editCategory,
        deadline: editDeadline,
        date: new Date().toISOString(),
      }),
    });
    if (res.ok) {
      const updatedTask = await res.json();
      setTasks((prev) =>
        prev.map((t) => (t.id === editingId ? updatedTask : t))
      );
      setEditingId(null);
      setEditTask("");
      setEditDeadline("");
      setEditPriority("medium");
      setEditCategory("Work");
    }
  };

  const startEditTask = (t) => {
    setEditingId(t.id);
    setEditTask(t.task);
    setEditDeadline(t.deadline);
    setEditPriority(t.priority);
    setEditCategory(t.categories);
  };

  const cancelEditTask = () => {
    setEditingId(null);
    setEditTask("");
    setEditDeadline("");
    setEditPriority("medium");
    setEditCategory("Work");
  };

  const handleDeleteTask = async (id) => {
    const idToken = await getIdToken();
    if (!idToken) return;
    const res = await fetch(`${API_BASE}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });
    if (res.ok) {
      setTasks((prev) => prev.filter((t) => t.id !== id));
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbPage>Planner</BreadcrumbPage>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col p-4 pt-0">
          <div className="flex justify-between">
            <div>
              <h1 className="text-2xl ml-3 mt-3 font-bold">Daily Planner</h1>
              <p className="ml-3">Plan your day and stay organized</p>
            </div>
            <div className="relative">
              <Button variant="outline" size="sm" onClick={handleCalender}>
                {currentDate}
              </Button>
              {calendar && (
                <div ref={calendarRef} className="absolute right-0 mt-2 z-50">
                  <Calendar
                    mode="single"
                    className="rounded-md border bg-white shadow-lg"
                  />
                </div>
              )}
            </div>
          </div>
          <div className="grid gap-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  <span className="flex items-center gap-2">
                    <ListChecks className="h-5 w-5 text-muted-foreground" />
                    Todays Tasks
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={handleAddTask}
                  className="flex flex-col gap-4 mb-4"
                >
                  <div className="flex flex-col md:flex-row gap-2">
                    <Input
                      value={task}
                      onChange={(e) => setTask(e.target.value)}
                      placeholder="Add a new task"
                    />
                    <Input
                      type="time"
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                      placeholder="Deadline"
                    />
                    <Select value={priority} onValueChange={setPriority}>
                      <SelectTrigger>
                        <SelectValue placeholder="Priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button type="submit">
                      <Plus className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                  </div>
                </form>
                <ul className="space-y-2">
                  {tasks.length === 0 && (
                    <li className="text-muted-foreground">No tasks yet.</li>
                  )}
                  {tasks.map((t, idx) =>
                    editingId === t.id ? (
                      <li
                        key={t.id}
                        className="flex flex-col gap-2 border p-2 rounded"
                      >
                        <Input
                          value={editTask}
                          onChange={(e) => setEditTask(e.target.value)}
                          placeholder="Edit task"
                        />
                        <Input
                          type="time"
                          value={editDeadline}
                          onChange={(e) => setEditDeadline(e.target.value)}
                          placeholder="Deadline"
                        />
                        <Select
                          value={editPriority}
                          onValueChange={setEditPriority}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Priority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select
                          value={editCategory}
                          onValueChange={setEditCategory}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((cat) => (
                              <SelectItem key={cat} value={cat}>
                                {cat}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <div className="flex gap-2 mt-2">
                          <Button size="sm" onClick={handleEditTask}>
                            Save
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={cancelEditTask}
                          >
                            Cancel
                          </Button>
                        </div>
                      </li>
                    ) : (
                      <li
                        key={t.id}
                        className={`flex items-center gap-2 ${
                          t.completed
                            ? "line-through text-muted-foreground"
                            : ""
                        }`}
                      >
                        <span>{t.task}</span>
                        <span className="flex items-center gap-1 text-xs text-muted-foreground ml-2">
                          <Clock className="h-4 w-4" />
                          {t.deadline}
                        </span>
                        <span className="ml-2 text-xs px-2 py-0.5 rounded bg-gray-100 border">
                          {t.priority}
                        </span>
                        <span className="ml-2 text-xs px-2 py-0.5 rounded bg-gray-100 border">
                          {t.categories}
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          className="ml-2"
                          onClick={() => startEditTask(t)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="ml-2"
                          onClick={() => handleDeleteTask(t.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </li>
                    )
                  )}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
