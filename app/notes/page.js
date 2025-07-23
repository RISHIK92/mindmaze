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
import { FileText } from "lucide-react";

export default function NotesPage() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
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

  const handleAddNote = () => {
    if (!title.trim() && !content.trim()) return;
    setNotes([
      ...notes,
      {
        title,
        content,
        date: new Date().toLocaleString(),
      },
    ]);
    setTitle("");
    setContent("");
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
                  />
                  <Textarea
                    placeholder="Write your note here..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={4}
                  />
                  <Button onClick={handleAddNote}>Add Note</Button>
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
              {notes.map((note, idx) => (
                <Card key={idx}>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">
                      {note.title || "Untitled"}
                    </CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm whitespace-pre-line">
                      {note.content}
                    </div>
                  </CardContent>
                  <CardFooter className="text-xs text-muted-foreground">
                    {note.date}
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
