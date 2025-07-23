"use client";

import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function ProjectPage() {
  const [projectName, setProjectName] = useState("");
  const [deadline, setDeadline] = useState("");
  const [projects, setProjects] = useState([]);

  const handleCreateProject = () => {
    if (!projectName.trim() || !deadline) return;
    setProjects((prev) => [
      ...prev,
      { name: projectName.trim(), deadline, percentage: 0 },
    ]);
    setProjectName("");
    setDeadline("");
  };

  const handlePercentageChange = (index, newPercent) => {
    const updated = [...projects];
    updated[index].percentage = Math.max(0, Math.min(100, newPercent));
    setProjects(updated);
  };

  return (
    <SidebarProvider>
      <SidebarInset>
        <AppSidebar />
        <main className="ml-[280px] px-6 py-12 min-h-screen bg-background">
          <Card className="max-w-xl mx-auto">
            <CardHeader>
              <CardTitle className="text-center text-2xl">
                Create Project
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <Input
                placeholder="Project name"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />
              <Input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
              <Button onClick={handleCreateProject}>Create</Button>
            </CardContent>

            <CardFooter className="flex-col gap-4 items-start w-full">
              <div className="text-sm text-muted-foreground">
                Your Projects:
              </div>
              {projects.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  No projects yet.
                </p>
              ) : (
                <ul className="flex flex-col gap-4 w-full">
                  {projects.map((proj, idx) => (
                    <li key={idx} className="w-full border p-4 rounded-lg">
                      <div className="font-semibold">{proj.name}</div>
                      <div className="text-sm text-muted-foreground">
                        Deadline: {proj.deadline}
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-sm">Progress:</span>
                        <Input
                          type="number"
                          className="w-20"
                          value={proj.percentage}
                          min={0}
                          max={100}
                          onChange={(e) =>
                            handlePercentageChange(idx, Number(e.target.value))
                          }
                        />
                        <span>%</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardFooter>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
