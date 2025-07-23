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
import { Plus, ListChecks, Clock } from "lucide-react";

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

  const categories = [
    "Work",
    "Personal",
    "Health",
    "Learning",
    "Shopping",
    "Other",
  ];

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

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!task.trim() || !deadline.trim()) return;
    setTasks([
      ...tasks,
      {
        id: Date.now(),
        text: task.trim(),
        deadline,
        priority,
        category,
        completed: false,
      },
    ]);
    setTask("");
    setDeadline("");
    setPriority("medium");
    setCategory("Work");
  };

  const handleToggleTask = (idx) => {
    setTasks((tasks) =>
      tasks.map((t, i) => (i === idx ? { ...t, completed: !t.completed } : t))
    );
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
                  {tasks.map((t, idx) => (
                    <li
                      key={t.id}
                      className={`flex items-center gap-2 ${
                        t.completed ? "line-through text-muted-foreground" : ""
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={t.completed}
                        onChange={() => handleToggleTask(idx)}
                      />
                      <span>{t.text}</span>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground ml-2">
                        <Clock className="h-4 w-4" />
                        {t.deadline}
                      </span>
                      <span className="ml-2 text-xs px-2 py-0.5 rounded bg-gray-100 border">
                        {t.priority}
                      </span>
                      <span className="ml-2 text-xs px-2 py-0.5 rounded bg-gray-100 border">
                        {t.category}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
