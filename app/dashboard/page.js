"use client";

import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
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
} from "lucide-react";
import { TodoWidget } from "@/components/widgets/todo-widget";
import { TimeWidget } from "@/components/widgets/time-widget";
import { PomodoroWidget } from "@/components/widgets/pomodoro-widget";
import { ProjectWidget } from "@/components/widgets/project-widget";
import { GoalWidget } from "@/components/widgets/goal-widget";
import { PlannerWidget } from "@/components/widgets/planner-widget";

export default function DashboardPage() {
  const [calendar, setCalendar] = useState(false);
  const [currentDate, setCurrentDate] = useState("");
  const calendarRef = useRef(null);
  const buttonRef = useRef(null);

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
                  <div className="text-2xl font-bold">12/20</div>
                  <Progress value={60} className="mt-2 h-1" />
                </CardContent>
                <CardFooter className="text-xs text-muted-foreground">
                  +8% from yesterday
                </CardFooter>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Habits Tracked
                  </CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">5/7</div>
                  <Progress value={71} className="mt-2 h-1" />
                </CardContent>
                <CardFooter className="text-xs text-muted-foreground">
                  On track for weekly goal
                </CardFooter>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Focus Time
                  </CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3h 45m</div>
                  <Progress value={75} className="mt-2 h-1" />
                </CardContent>
                <CardFooter className="text-xs text-muted-foreground">
                  75% of daily goal
                </CardFooter>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Projects
                  </CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">4</div>
                  <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                    <span>2 on track</span>
                    <div className="ml-2 h-1.5 w-1.5 rounded-full bg-amber-500"></div>
                    <span>1 at risk</span>
                    <div className="ml-2 h-1.5 w-1.5 rounded-full bg-red-500"></div>
                    <span>1 delayed</span>
                  </div>
                </CardContent>
                <CardFooter className="text-xs text-muted-foreground">
                  1 due this week
                </CardFooter>
              </Card>
            </div>

            <Tabs defaultValue="productivity">
              <div className="flex items-center justify-between">
                <TabsList>
                  <TabsTrigger value="productivity">Productivity</TabsTrigger>
                  <TabsTrigger value="planning">Planning</TabsTrigger>
                  <TabsTrigger value="collaboration">Collaboration</TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="productivity" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <TodoWidget />
                  <TimeWidget />
                  <PomodoroWidget />
                  <ProjectWidget />
                  <GoalWidget />
                </div>
              </TabsContent>
              <TabsContent value="planning" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <PlannerWidget />
                  <GoalWidget />
                  <ProjectWidget />
                </div>
              </TabsContent>
              <TabsContent value="collaboration" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <ProjectWidget />
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium">
                        Mind Maps
                      </CardTitle>
                      <BrainCircuit className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="text-sm">Project Brainstorm</div>
                        <div className="text-xs text-muted-foreground">
                          Updated 2h ago
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-sm">Marketing Strategy</div>
                        <div className="text-xs text-muted-foreground">
                          Updated 1d ago
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-sm">Product Roadmap</div>
                        <div className="text-xs text-muted-foreground">
                          Updated 3d ago
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <div className="text-xs text-muted-foreground">
                        3 shared maps
                      </div>
                    </CardFooter>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
