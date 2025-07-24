"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Trash2,
  Plus,
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Edit3,
  Save,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format, isToday, isTomorrow, isYesterday } from "date-fns";
import { auth } from "@/lib/firebase";
import { BACKEND_URL } from "../config";
import { onAuthStateChanged } from "firebase/auth";

const API_BASE = `${BACKEND_URL}/time-management`;

async function getIdToken() {
  const user = auth.currentUser;
  if (!user) return null;
  return await user.getIdToken();
}

const apiService = {
  async createTask(data) {
    const idToken = await getIdToken();
    const response = await fetch(API_BASE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to create task");
    const result = await response.json();
    return result.data;
  },

  async updateTask(id, data) {
    const idToken = await getIdToken();
    const response = await fetch(`${API_BASE}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update task");
    const result = await response.json();
    return result.data;
  },

  async toggleTask(id) {
    const idToken = await getIdToken();
    const response = await fetch(`${API_BASE}/${id}/toggle`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });
    if (!response.ok) throw new Error("Failed to toggle task");
    const result = await response.json();
    return result.data;
  },

  async deleteTask(id) {
    const idToken = await getIdToken();
    const response = await fetch(`${API_BASE}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });
    if (!response.ok) throw new Error("Failed to delete task");
    const result = await response.json();
    return result;
  },

  async deleteCompletedTasks() {
    const idToken = await getIdToken();
    const response = await fetch(`${API_BASE}/completed/all`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });
    if (!response.ok) throw new Error("Failed to delete completed tasks");
    const result = await response.json();
    return result;
  },
};

function TaskItem({ task, onToggle, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);
  const [editData, setEditData] = useState(task.data);
  const [isLoading, setIsLoading] = useState(false);

  const handleSaveEdit = async () => {
    if (!editText.trim()) return;

    setIsLoading(true);
    try {
      await onEdit(task.id, { text: editText.trim(), data: editData.trim() });
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to save edit:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditText(task.text);
    setEditData(task.data);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="p-4 rounded-lg border border-gray-300 bg-white">
        <div className="space-y-3">
          <div>
            <Label htmlFor="edit-text" className="text-xs text-gray-600">
              Task
            </Label>
            <Input
              id="edit-text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="mt-1"
              placeholder="Task title..."
            />
          </div>
          <div>
            <Label htmlFor="edit-data" className="text-xs text-gray-600">
              Details
            </Label>
            <Textarea
              id="edit-data"
              value={editData}
              onChange={(e) => setEditData(e.target.value)}
              className="mt-1 min-h-[60px]"
              placeholder="Task details..."
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button
              size="sm"
              variant="outline"
              onClick={handleCancelEdit}
              disabled={isLoading}
            >
              <X className="h-3 w-3 mr-1" />
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSaveEdit}
              disabled={isLoading || !editText.trim()}
            >
              {isLoading ? (
                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
              ) : (
                <Save className="h-3 w-3 mr-1" />
              )}
              Save
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "group flex items-start gap-3 p-4 rounded-lg border transition-all duration-200 hover:shadow-md",
        "bg-white border-gray-200 hover:border-gray-300",
        task.completedAt && "bg-gray-50 border-gray-100"
      )}
    >
      <button
        onClick={() => onToggle(task.id)}
        className="flex-shrink-0 mt-0.5 transition-all duration-200 hover:scale-110"
      >
        {task.completedAt ? (
          <CheckCircle2 className="h-5 w-5 text-black" />
        ) : (
          <div className="h-5 w-5 rounded-full border-2 border-gray-300 hover:border-gray-500 transition-colors" />
        )}
      </button>

      <div className="flex-1 min-w-0">
        <div
          className={cn(
            "text-sm font-medium transition-all duration-200 mb-1",
            task.completedAt ? "line-through text-gray-400" : "text-gray-900"
          )}
        >
          {task.text}
        </div>
        {task.data && (
          <div
            className={cn(
              "text-xs transition-all duration-200",
              task.completedAt ? "text-gray-400" : "text-gray-600"
            )}
          >
            {task.data}
          </div>
        )}
        <div className="text-xs text-gray-400 mt-2">
          Created {format(new Date(task.createdAt), "MMM d, HH:mm")}
        </div>
      </div>

      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
        <button
          onClick={() => setIsEditing(true)}
          className="flex-shrink-0 p-1 hover:bg-gray-100 rounded transition-colors text-gray-400 hover:text-blue-500"
        >
          <Edit3 className="h-3 w-3" />
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="flex-shrink-0 p-1 hover:bg-gray-100 rounded transition-colors text-gray-400 hover:text-red-500"
        >
          <Trash2 className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}

function TaskList({ tasks, onToggle, onDelete, onEdit, isLoading }) {
  if (isLoading) {
    return (
      <div className="text-center py-8">
        <Loader2 className="h-6 w-6 mx-auto mb-3 animate-spin text-gray-400" />
        <p className="text-gray-500 text-sm">Loading tasks...</p>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
          <CalendarIcon className="h-6 w-6 text-gray-400" />
        </div>
        <p className="text-gray-500 text-sm font-medium">
          No tasks for this date
        </p>
        <p className="text-gray-400 text-xs mt-1">Add your first task above</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task, idx) => (
        <TaskItem
          key={task.id ?? idx}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}

function DateDisplay({ date }) {
  if (!date) return null;

  let dateLabel = format(date, "EEEE, MMMM d, yyyy");

  if (isToday(date)) {
    dateLabel = `Today, ${format(date, "MMMM d")}`;
  } else if (isTomorrow(date)) {
    dateLabel = `Tomorrow, ${format(date, "MMMM d")}`;
  } else if (isYesterday(date)) {
    dateLabel = `Yesterday, ${format(date, "MMMM d")}`;
  }

  return (
    <div className="flex items-center gap-2 text-gray-700">
      <CalendarIcon className="h-4 w-4" />
      <span className="font-medium">{dateLabel}</span>
    </div>
  );
}

export default function TimeManagementPage() {
  const [selectedDate, setSelectedDate] = useState();
  const [taskText, setTaskText] = useState("");
  const [taskData, setTaskData] = useState("");
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setTasks([]);
        return;
      }

      try {
        const idToken = await user.getIdToken();
        const res = await fetch(`${API_BASE}/?page=1&limit=1000`, {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        });

        if (res.ok) {
          const response = await res.json();
          console.log("Tasks response:", response); // Debug log
          // Backend returns {success: true, data: [...], pagination: {...}}
          const tasksArray = response?.data;
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

  const handleAddTask = async () => {
    if (!taskText.trim() || !selectedDate) return;

    setIsLoading(true);
    setError("");
    try {
      const taskDataFormatted = `Date: ${selectedDate.toDateString()}${
        taskData.trim() ? `\nDetails: ${taskData.trim()}` : ""
      }`;

      const newTask = await apiService.createTask({
        text: taskText.trim(),
        data: taskDataFormatted,
        completedAt: false,
      });

      setTasks((prev) => [newTask, ...prev]);
      setTaskText("");
      setTaskData("");
    } catch (error) {
      setError("Failed to add task. Please try again.");
      console.error("Error adding task:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAddTask();
    }
  };

  const handleToggleTask = async (id) => {
    try {
      const updatedTask = await apiService.toggleTask(id);
      setTasks((prev) =>
        prev.map((task) => (task.id === id ? updatedTask : task))
      );
    } catch (error) {
      setError("Failed to update task. Please try again.");
      console.error("Error toggling task:", error);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await apiService.deleteTask(id);
      setTasks((prev) => prev.filter((task) => task.id !== id));
    } catch (error) {
      setError("Failed to delete task. Please try again.");
      console.error("Error deleting task:", error);
    }
  };

  const handleEditTask = async (id, updateData) => {
    try {
      const updatedTask = await apiService.updateTask(id, updateData);
      setTasks((prev) =>
        prev.map((task) => (task.id === id ? updatedTask : task))
      );
    } catch (error) {
      setError("Failed to update task. Please try again.");
      console.error("Error editing task:", error);
      throw error;
    }
  };

  const selectedDateTasks = tasks.filter((task) => {
    if (!selectedDate || !task.data) return false;

    const selectedDateString = selectedDate.toDateString();
    const taskContainsDate = task.data.includes(selectedDateString);

    return taskContainsDate;
  });

  const completedCount = selectedDateTasks.filter(
    (task) => task.completedAt
  ).length;
  const totalCount = selectedDateTasks.length;

  console.log("Component state:", {
    totalTasks: tasks.length,
    selectedDate: selectedDate?.toDateString(),
    selectedDateTasks: selectedDateTasks.length,
    allTasks: tasks.map((t) => ({ id: t.id, text: t.text, data: t.data })),
  });

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-gray-200 px-6 bg-white/80 backdrop-blur-sm">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="text-lg font-semibold text-gray-900">
            Time Management
          </h1>
        </header>

        <main className="flex-1 overflow-auto bg-gray-50/50">
          <div className="container max-w-7xl mx-auto p-6">
            {error && (
              <Alert className="mb-6 border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Schedule & Tasks
                  </h2>
                  <p className="text-gray-600 text-sm">
                    Plan your days and stay organized with calendar-based task
                    management
                  </p>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 space-y-6">
                <Card className="border-gray-200 shadow-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-gray-900">
                      <CalendarIcon className="h-5 w-5" />
                      Calendar
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      className="rounded-md border border-gray-200 bg-white"
                      classNames={{
                        months:
                          "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                        month: "space-y-4",
                        caption:
                          "flex justify-center pt-1 relative items-center",
                        caption_label: "text-sm font-medium text-gray-900",
                        nav: "space-x-1 flex items-center",
                        nav_button:
                          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 hover:bg-gray-100 rounded-md transition-colors",
                        nav_button_previous: "absolute left-1",
                        nav_button_next: "absolute right-1",
                        table: "w-full border-collapse space-y-1",
                        head_row: "flex",
                        head_cell:
                          "text-gray-500 rounded-md w-9 font-normal text-[0.8rem]",
                        row: "flex w-full mt-2",
                        cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-gray-100 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                        day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-gray-100 rounded-md transition-colors",
                        day_selected:
                          "bg-black text-white hover:bg-black hover:text-white focus:bg-black focus:text-white",
                        day_today: "bg-gray-100 text-gray-900 font-medium",
                        day_outside: "text-gray-400 opacity-50",
                        day_disabled: "text-gray-400 opacity-50",
                        day_range_middle:
                          "aria-selected:bg-gray-100 aria-selected:text-gray-900",
                        day_hidden: "invisible",
                      }}
                    />
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-2 space-y-6">
                <Card className="border-gray-200 shadow-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-gray-900">
                      <Plus className="h-5 w-5" />
                      Add Task
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedDate && (
                      <div className="mb-4">
                        <DateDisplay date={selectedDate} />
                      </div>
                    )}
                    <div className="space-y-4">
                      <div>
                        <Label
                          htmlFor="task-title"
                          className="text-sm text-gray-700 mb-2 block"
                        >
                          Task Title
                        </Label>
                        <Input
                          id="task-title"
                          value={taskText}
                          onChange={(e) => setTaskText(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="What needs to be done?"
                          className="border-gray-200 focus:border-gray-400 transition-colors"
                          disabled={!selectedDate || isLoading}
                        />
                      </div>
                      <div>
                        <Label
                          htmlFor="task-details"
                          className="text-sm text-gray-700 mb-2 block"
                        >
                          Details (optional)
                        </Label>
                        <Textarea
                          id="task-details"
                          value={taskData}
                          onChange={(e) => setTaskData(e.target.value)}
                          placeholder="Add more details about this task..."
                          className="min-h-[80px] border-gray-200 focus:border-gray-400 transition-colors"
                          disabled={!selectedDate || isLoading}
                        />
                      </div>
                      <Button
                        onClick={handleAddTask}
                        className="w-full bg-black hover:bg-gray-800 text-white transition-all duration-200 hover:shadow-md"
                        disabled={
                          !taskText.trim() || !selectedDate || isLoading
                        }
                      >
                        {isLoading ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Plus className="h-4 w-4 mr-2" />
                        )}
                        Add Task
                      </Button>
                    </div>
                    {!selectedDate && (
                      <p className="text-xs text-gray-400 mt-2">
                        Please select a date to add tasks
                      </p>
                    )}
                  </CardContent>
                </Card>

                <Card className="border-gray-200 shadow-sm">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2 text-gray-900">
                        <Clock className="h-5 w-5" />
                        Tasks
                        {selectedDate && (
                          <span className="text-sm font-normal text-gray-500">
                            for {format(selectedDate, "MMM d")}
                          </span>
                        )}
                      </CardTitle>
                      {totalCount > 0 && (
                        <div className="flex gap-2">
                          <Badge variant="outline" className="bg-white text-xs">
                            {totalCount} tasks
                          </Badge>
                          {completedCount > 0 && (
                            <Badge
                              variant="outline"
                              className="bg-black text-white text-xs"
                            >
                              {completedCount} done
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <TaskList
                      tasks={selectedDateTasks}
                      onToggle={handleToggleTask}
                      onDelete={handleDeleteTask}
                      onEdit={handleEditTask}
                      isLoading={isLoading && tasks.length === 0}
                    />

                    {totalCount > 0 && (
                      <div className="mt-6 text-center">
                        <p className="text-xs text-gray-400">
                          {completedCount === totalCount
                            ? "🎉 All tasks completed for this day!"
                            : `${totalCount - completedCount} task${
                                totalCount - completedCount !== 1 ? "s" : ""
                              } remaining`}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
