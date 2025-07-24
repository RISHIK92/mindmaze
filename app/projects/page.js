"use client";

import React, { useState, useEffect } from "react";
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
import { auth } from "@/lib/firebase";
import { BACKEND_URL } from "@/app/config";
import { onAuthStateChanged } from "firebase/auth";

const API_BASE = `${BACKEND_URL}/projects`;

async function getIdToken() {
  const user = auth.currentUser;
  if (!user) return null;
  return await user.getIdToken();
}

export default function ProjectPage() {
  const [projectName, setProjectName] = useState("");
  const [deadline, setDeadline] = useState("");
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editIdx, setEditIdx] = useState(null);
  const [editProgress, setEditProgress] = useState(0);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setProjects([]);
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
          //   const tasksArray = response?.data;
          const tasksArray = Array.isArray(response)
            ? response
            : response?.data || [];
          setProjects(Array.isArray(tasksArray) ? tasksArray : []);
        } else {
          console.error("Failed to fetch tasks:", res.status, res.statusText);
          setProjects([]);
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setProjects([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleCreateProject = async () => {
    if (!projectName.trim() || !deadline) return;
    setLoading(true);
    try {
      const idToken = await getIdToken();
      if (!idToken) return;
      const res = await fetch(`${BACKEND_URL}/projects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          projectName: projectName.trim(),
          deadline,
          progress: 0,
        }),
      });
      if (res.ok) {
        const newProject = await res.json();
        setProjects((prev) => [newProject, ...prev]);
        setProjectName("");
        setDeadline("");
      }
    } finally {
      setLoading(false);
    }
  };

  // Edit progress
  const handleToggleEdit = (index) => {
    setEditIdx(index);
    setEditProgress(projects[index].progress);
  };

  const handleSaveEdit = async (index) => {
    const project = projects[index];
    setLoading(true);
    try {
      const idToken = await getIdToken();
      if (!idToken) return;
      const res = await fetch(`${BACKEND_URL}/projects/${project.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          projectName: project.projectName,
          deadline: project.deadline,
          progress: editProgress,
        }),
      });
      if (res.ok) {
        const updated = await res.json();
        setProjects((prev) =>
          prev.map((p, idx) => (idx === index ? updated : p))
        );
        setEditIdx(null);
      }
    } finally {
      setLoading(false);
    }
  };

  // Delete project
  const handleDeleteProject = async (index) => {
    const project = projects[index];
    setLoading(true);
    try {
      const idToken = await getIdToken();
      if (!idToken) return;
      const res = await fetch(`${BACKEND_URL}/projects/${project.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });
      if (res.ok) {
        setProjects((prev) => prev.filter((_, idx) => idx !== index));
      }
    } finally {
      setLoading(false);
    }
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
              <Button onClick={handleCreateProject} disabled={loading}>
                Create
              </Button>
            </CardContent>

            <CardFooter className="flex-col gap-4 items-start w-full">
              <div className="text-sm text-muted-foreground">
                Your Projects:
              </div>
              {loading ? (
                <p className="text-muted-foreground text-sm">Loading...</p>
              ) : projects.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  No projects yet.
                </p>
              ) : (
                <ul className="flex flex-col gap-4 w-full">
                  {projects.map((proj, idx) => (
                    <li
                      key={proj.id ?? idx}
                      className="w-full border p-4 rounded-lg"
                    >
                      <div className="font-semibold">{proj.projectName}</div>
                      <div className="text-sm text-muted-foreground">
                        Deadline: {proj.deadline}
                      </div>

                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-sm">Progress:</span>
                        {editIdx === idx ? (
                          <>
                            <Input
                              type="number"
                              className="w-20"
                              value={editProgress}
                              min={0}
                              max={100}
                              onChange={(e) =>
                                setEditProgress(
                                  Math.max(
                                    0,
                                    Math.min(100, Number(e.target.value))
                                  )
                                )
                              }
                            />
                            <span>%</span>
                            <Button
                              variant="outline"
                              size="sm"
                              className="ml-2"
                              onClick={() => handleSaveEdit(idx)}
                              disabled={loading}
                            >
                              Save
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="ml-2"
                              onClick={() => setEditIdx(null)}
                              disabled={loading}
                            >
                              Cancel
                            </Button>
                          </>
                        ) : (
                          <span className="text-sm font-medium">
                            {proj.progress}%
                          </span>
                        )}

                        <Button
                          variant="outline"
                          size="sm"
                          className="ml-4"
                          onClick={() => handleToggleEdit(idx)}
                        >
                          {editIdx === idx ? "Cancel" : "Edit"}
                        </Button>

                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteProject(idx)}
                          disabled={loading}
                        >
                          Delete
                        </Button>
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
