"use client";

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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { useState, useEffect, useRef } from "react";
import {
  CheckSquare,
  BarChart3,
  Clock,
  FileText,
  BrainCircuit,
  Loader2,
} from "lucide-react";
import { TodoWidget } from "@/components/widgets/todo-widget";
import { TimeWidget } from "@/components/widgets/time-widget";
import { PomodoroWidget } from "@/components/widgets/pomodoro-widget";
import { ProjectWidget } from "@/components/widgets/project-widget";
import { GoalWidget } from "@/components/widgets/goal-widget";
import { PlannerWidget } from "@/components/widgets/planner-widget";
import { BACKEND_URL } from "../config";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function DashboardPage() {
  const [calendar, setCalendar] = useState(false);
  const [currentDate, setCurrentDate] = useState("");
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const calendarRef = useRef(null);
  const buttonRef = useRef(null);

  const handleCalender = () => {
    setCalendar((e) => !e);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const token = await firebaseUser.getIdToken();
        fetchDashboardData(token);
      }
    });
    return () => unsubscribe();
  }, []);

  const getAuthToken = async () => {
    try {
      if (user) {
        return await user.getIdToken();
      }
      return null;
    } catch (error) {
      console.error("Error getting auth token:", error);
      return null;
    }
  };

  const fetchDashboardData = async (token) => {
    try {
      setLoading(true);
      setError(null);

      if (!token) {
        token = await getAuthToken();
        if (!token) {
          setLoading(false);
          setError("User not authenticated");
          return;
        }
      }

      const response = await fetch(`${BACKEND_URL}/dashboard`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setDashboardData(result.data);
      } else {
        throw new Error(result.message || "Failed to fetch dashboard data");
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
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

  const getProjectStatusColor = (onTrack, atRisk, delayed) => {
    if (onTrack > 0) return "bg-green-500";
    if (atRisk > 0) return "bg-amber-500";
    if (delayed > 0) return "bg-red-500";
    return "bg-gray-500";
  };

  if (loading) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="flex items-center justify-center h-screen">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading dashboard...</span>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  if (error) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="flex items-center justify-center h-screen">
            <div className="text-center">
              <p className="text-red-500 mb-4">
                Error loading dashboard: {error}
              </p>
              <Button onClick={fetchDashboardData}>Retry</Button>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  const stats = dashboardData?.stats || {};
  const widgets = dashboardData?.widgets || {};

  console.log(stats, widgets);

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
                  <BreadcrumbPage>Dashboard</BreadcrumbPage>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col p-4 pt-0">
          <div className="flex justify-between">
            <div>
              <h1 className="text-2xl ml-3 mt-3 font-bold">Dashboard</h1>
              <p className="ml-3">Your productivity command center</p>
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
          <div className="grid gap-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Tasks Completed
                  </CardTitle>
                  <CheckSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.tasksCompleted?.current || 0}/
                    {stats.tasksCompleted?.total || 0}
                  </div>
                  <Progress
                    value={stats.tasksCompleted?.progress || 0}
                    className="mt-2 h-1"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Projects
                  </CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.projects?.total || 0}
                  </div>
                  <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                    <span>{stats.projects?.onTrack || 0} on track</span>
                    <div className="ml-2 h-1.5 w-1.5 rounded-full bg-amber-500"></div>
                    <span>{stats.projects?.atRisk || 0} at risk</span>
                    <div className="ml-2 h-1.5 w-1.5 rounded-full bg-red-500"></div>
                    <span>{stats.projects?.delayed || 0} delayed</span>
                  </div>
                </CardContent>
                <CardFooter className="text-xs text-muted-foreground">
                  {stats.projects?.dueThisWeek || 0} due this week
                </CardFooter>
              </Card>
            </div>

            <Tabs defaultValue="productivity">
              <div className="flex items-center justify-between">
                <TabsList>
                  <TabsTrigger value="productivity">Productivity</TabsTrigger>
                  <TabsTrigger value="planning">Planning</TabsTrigger>
                </TabsList>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchDashboardData}
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Refresh"
                  )}
                </Button>
              </div>
              <TabsContent value="productivity" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <TodoWidget
                    data={widgets.todos}
                    onUpdate={fetchDashboardData}
                  />
                  <TimeWidget
                    data={widgets.timeEntries}
                    onUpdate={fetchDashboardData}
                  />
                  <PomodoroWidget />
                  <ProjectWidget
                    data={widgets.projects}
                    onUpdate={fetchDashboardData}
                  />
                  <GoalWidget
                    data={widgets.goals}
                    onUpdate={fetchDashboardData}
                  />
                </div>
              </TabsContent>
              <TabsContent value="planning" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <PlannerWidget
                    data={widgets.planner}
                    onUpdate={fetchDashboardData}
                  />
                  <GoalWidget
                    data={widgets.goals}
                    onUpdate={fetchDashboardData}
                  />
                  <ProjectWidget
                    data={widgets.projects}
                    onUpdate={fetchDashboardData}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
