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
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { FileText, Trash2 } from "lucide-react";
import { auth } from "@/lib/firebase";
import { BACKEND_URL } from "@/app/config";
import { onAuthStateChanged } from "firebase/auth";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

const API_BASE = `${BACKEND_URL}/notes`;

async function getIdToken() {
  const user = auth.currentUser;
  if (!user) return null;
  return await user.getIdToken();
}

export default function NotesPage() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [calendar, setCalendar] = useState(false);
  const [currentDate, setCurrentDate] = useState("");
  const calendarRef = useRef(null);
  const buttonRef = useRef(null);

  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editCalendar, setEditCalendar] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setNotes([]);
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
          setNotes(Array.isArray(tasksArray) ? tasksArray : []);
        } else {
          console.error("Failed to fetch tasks:", res.status, res.statusText);
          setNotes([]);
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setNotes([]);
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

  const handleAddNote = async () => {
    if (!title.trim() && !content.trim()) return;
    const idToken = await getIdToken();
    if (!idToken) return;
    const res = await fetch(API_BASE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({
        title: title.trim(),
        notes: content.trim(),
        calendar: currentDate,
      }),
    });
    if (res.ok) {
      const newNote = await res.json();
      setNotes((prev) => [newNote, ...prev]);
      setTitle("");
      setContent("");
    }
  };

  const handleEditNote = async () => {
    if (!editTitle.trim() && !editContent.trim()) return;
    const idToken = await getIdToken();
    if (!idToken || !editId) return;
    const res = await fetch(`${API_BASE}/${editId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({
        title: editTitle.trim(),
        notes: editContent.trim(),
        calendar: editCalendar,
      }),
    });
    if (res.ok) {
      const updatedNote = await res.json();
      setNotes((prev) =>
        prev.map((note) => (note.id === editId ? updatedNote : note))
      );
      setEditId(null);
      setEditTitle("");
      setEditContent("");
      setEditCalendar("");
    }
  };

  const startEditNote = (note) => {
    setEditId(note.id);
    setEditTitle(note.title || "");
    setEditContent(note.notes || "");
    setEditCalendar(note.calendar || "");
  };

  // Cancel editing
  const cancelEditNote = () => {
    setEditId(null);
    setEditTitle("");
    setEditContent("");
    setEditCalendar("");
  };

  const handleDeleteNote = async (id) => {
    const idToken = await getIdToken();
    if (!idToken) return;
    const res = await fetch(`${API_BASE}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });
    if (res.ok) {
      setNotes((prev) => prev.filter((note) => note.id !== id));
      setDeleteId(null);
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
                  <BreadcrumbPage>Notes</BreadcrumbPage>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col p-4 pt-0">
          <div className="flex justify-between">
            <div>
              <h1 className="text-2xl ml-3 mt-3 font-bold">Notes</h1>
              <p className="ml-3">Capture and organize your thoughts</p>
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
                <CardTitle>Add a Note</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-3">
                  <Input
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    disabled={editId !== null}
                  />
                  <Textarea
                    placeholder="Write your note here..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={4}
                    disabled={editId !== null}
                  />
                  <Button onClick={handleAddNote} disabled={editId !== null}>
                    Add Note
                  </Button>
                </div>
              </CardContent>
            </Card>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {notes.length === 0 && (
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">
                      No Notes Yet
                    </CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-muted-foreground">
                      Start by adding your first note!
                    </div>
                  </CardContent>
                </Card>
              )}
              {notes.map((note, idx) =>
                editId === note.id ? (
                  <Card key={note.id ?? idx}>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium">
                        Edit Note
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col gap-3">
                        <Input
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          placeholder="Title"
                        />
                        <Textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          rows={4}
                          placeholder="Write your note here..."
                        />
                      </div>
                    </CardContent>
                    <CardFooter className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{editCalendar}</span>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleEditNote}
                        >
                          Save
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={cancelEditNote}
                        >
                          Cancel
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ) : (
                  <Card key={note.id ?? idx}>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium">
                        {note.title || "Untitled"}
                      </CardTitle>
                      <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm whitespace-pre-line">
                        {note.notes}
                      </div>
                    </CardContent>
                    <CardFooter className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{note.calendar}</span>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => startEditNote(note)}
                        >
                          Edit
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDeleteId(note.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Are you sure you want to delete this note?
                              </AlertDialogTitle>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel
                                onClick={() => setDeleteId(null)}
                              >
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteNote(note.id)}
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </CardFooter>
                  </Card>
                )
              )}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
