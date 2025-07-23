"use client";

import { useState } from "react";
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
import {
  Trash2,
  Plus,
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format, isToday, isTomorrow, isYesterday } from "date-fns";

function TaskItem({ task, onToggle, onDelete }) {
  return (
    <div
      className={cn(
        "group flex items-center gap-3 p-4 rounded-lg border transition-all duration-200 hover:shadow-md",
        "bg-white border-gray-200 hover:border-gray-300",
        task.completed && "bg-gray-50 border-gray-100"
      )}
    >
      <button
        onClick={() => onToggle(task.id)}
        className="flex-shrink-0 transition-all duration-200 hover:scale-110"
      >
        {task.completed ? (
          <CheckCircle2 className="h-5 w-5 text-black" />
        ) : (
          <div className="h-5 w-5 rounded-full border-2 border-gray-300 hover:border-gray-500 transition-colors" />
        )}
      </button>

      <span
        className={cn(
          "flex-1 text-sm font-medium transition-all duration-200",
          task.completed ? "line-through text-gray-400" : "text-gray-900"
        )}
      >
        {task.text}
      </span>

      <button
        onClick={() => onDelete(task.id)}
        className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 text-gray-400 hover:text-red-500"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}

function TaskList({ tasks, onToggle, onDelete }) {
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
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
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
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);

  const handleAddTask = () => {
    if (!task.trim() || !selectedDate) return;

    const newTask = {
      id: Date.now().toString(),
      text: task.trim(),
      date: selectedDate.toDateString(),
      completed: false,
      createdAt: new Date(),
    };

    setTasks([...tasks, newTask]);
    setTask("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleAddTask();
    }
  };

  const handleToggleTask = (id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleDeleteTask = (id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const selectedDateTasks = tasks.filter(
    (t) => selectedDate && t.date === selectedDate.toDateString()
  );

  const completedCount = selectedDateTasks.filter(
    (task) => task.completed
  ).length;
  const totalCount = selectedDateTasks.length;

  const allTasks = tasks.length;
  const allCompleted = tasks.filter((task) => task.completed).length;

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
          <div className="container max-w-6xl mx-auto p-6">
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
                {allTasks > 0 && (
                  <div className="flex gap-2">
                    <Badge variant="outline" className="bg-white">
                      {allTasks} total tasks
                    </Badge>
                    <Badge variant="outline" className="bg-black text-white">
                      {allCompleted} completed
                    </Badge>
                  </div>
                )}
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
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
                      caption: "flex justify-center pt-1 relative items-center",
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

              <div className="space-y-6">
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
                    <div className="flex gap-3">
                      <Input
                        value={task}
                        onChange={(e) => setTask(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Add a task for selected date..."
                        className="flex-1 border-gray-200 focus:border-gray-400 transition-colors"
                        disabled={!selectedDate}
                      />
                      <Button
                        onClick={handleAddTask}
                        className="bg-black hover:bg-gray-800 text-white px-6 transition-all duration-200 hover:shadow-md"
                        disabled={!task.trim() || !selectedDate}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add
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
