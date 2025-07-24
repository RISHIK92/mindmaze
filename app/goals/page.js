"use client";

import { useState, useEffect, useRef } from "react";
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
import { Progress } from "@/components/ui/progress";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Calendar as CalendarIcon, Trash2 } from "lucide-react";
import { auth } from "@/lib/firebase";
import { BACKEND_URL } from "@/app/config";
import { onAuthStateChanged } from "firebase/auth";

const API_BASE = `${BACKEND_URL}/goals`;

async function getIdToken() {
  const user = auth.currentUser;
  if (!user) return null;
  return await user.getIdToken();
}

export default function GoalsPage() {
  const [calendar, setCalendar] = useState(false);
  const [currentDate, setCurrentDate] = useState("");
  const calendarRef = useRef(null);
  const buttonRef = useRef(null);

  const [goals, setGoals] = useState([]);
  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState("");
  const [progress, setProgress] = useState(0);
  const [editingIdx, setEditingIdx] = useState(null);
  const [editProgress, setEditProgress] = useState(0);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setGoals([]);
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
          console.log("Tasks response:", response);
          const tasksArray = Array.isArray(response)
            ? response
            : response?.data || [];
          setGoals(Array.isArray(tasksArray) ? tasksArray : []);
        } else {
          console.error("Failed to fetch tasks:", res.status, res.statusText);
          setGoals([]);
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setGoals([]);
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

  const handleAddGoal = async () => {
    if (!title.trim() || !deadline.trim()) return;
    const idToken = await getIdToken();
    if (!idToken) return;
    const res = await fetch(API_BASE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({
        goal: title.trim(),
        deadline,
        progress: Number(progress),
      }),
    });
    if (res.ok) {
      const newGoal = await res.json();
      setGoals((prev) => [newGoal, ...prev]);
      setTitle("");
      setDeadline("");
      setProgress(0);
    }
  };

  const handleEditProgress = (idx, currentProgress) => {
    setEditingIdx(idx);
    setEditProgress(currentProgress);
  };

  const handleSaveProgress = async (idx) => {
    const goal = goals[idx];
    const idToken = await getIdToken();
    if (!idToken) return;
    const res = await fetch(`${API_BASE}/${goal.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({
        goal: goal.goal,
        deadline: goal.deadline,
        progress: Number(editProgress),
      }),
    });
    if (res.ok) {
      const updatedGoal = await res.json();
      setGoals((goals) => goals.map((g, i) => (i === idx ? updatedGoal : g)));
      setEditingIdx(null);
      setEditProgress(0);
    }
  };

  // Delete goal in backend
  const handleDeleteGoal = async (idx) => {
    const goal = goals[idx];
    const idToken = await getIdToken();
    if (!idToken) return;
    const res = await fetch(`${API_BASE}/${goal.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });
    if (res.ok) {
      setGoals((goals) => goals.filter((_, i) => i !== idx));
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
                  <BreadcrumbPage>Goals</BreadcrumbPage>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col p-4 pt-0">
          <div className="flex justify-between">
            <div>
              <h1 className="text-2xl ml-3 mt-3 font-bold">Goals</h1>
              <p className="ml-3">Create and track your goals</p>
            </div>
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                ref={buttonRef}
                onClick={handleCalender}
              >
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
                <CardTitle>Add Goal</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-3">
                  <Input
                    placeholder="Goal Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <Input
                    type="date"
                    placeholder="Deadline"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                  />
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    placeholder="Progress (%)"
                    value={progress}
                    onChange={(e) => setProgress(e.target.value)}
                  />
                  <Button onClick={handleAddGoal}>Add Goal</Button>
                </div>
              </CardContent>
            </Card>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {goals.length === 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>No Goals Yet</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-muted-foreground">
                      Start by adding your first goal!
                    </div>
                  </CardContent>
                </Card>
              )}
              {goals.map((goal, idx) => (
                <Card key={goal.id ?? idx}>
                  <CardHeader>
                    <CardTitle>{goal.goal}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 mb-2">
                      <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Deadline: {goal.deadline}</span>
                    </div>
                    <Progress value={goal.progress} className="mt-2 h-2" />
                    <div className="text-xs text-muted-foreground mt-2 flex items-center gap-2">
                      Progress:{" "}
                      {editingIdx === idx ? (
                        <>
                          <input
                            type="number"
                            min={0}
                            max={100}
                            value={editProgress}
                            onChange={(e) => setEditProgress(e.target.value)}
                            className="border rounded px-2 py-1 w-16 text-xs"
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleSaveProgress(idx)}
                          >
                            Save
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setEditingIdx(null)}
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <>
                          {goal.progress}%
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              handleEditProgress(idx, goal.progress)
                            }
                            className="ml-2"
                          >
                            Edit
                          </Button>
                        </>
                      )}
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteGoal(idx)}
                        className="ml-2"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
