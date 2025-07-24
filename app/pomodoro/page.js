"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

function PomodoroTimer() {
  const [minutes, setMinutes] = useState(25);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef();
  const fullscreenRef = useRef(null);
  const inputRef = useRef(null);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60)
      .toString()
      .padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleMinutesChange = (e) => {
    const value = Math.max("", Math.min(120, Number(e.target.value)));
    setMinutes(value);
    setSecondsLeft(value * 60);
    inputRef.current?.focus();
  };

  const startTimer = () => {
    if (isRunning) return;
    setIsRunning(true);

    if (fullscreenRef.current?.requestFullscreen) {
      fullscreenRef.current.requestFullscreen();
    } else if (fullscreenRef.current?.webkitRequestFullscreen) {
      fullscreenRef.current.webkitRequestFullscreen();
    } else if (fullscreenRef.current?.msRequestFullscreen) {
      fullscreenRef.current.msRequestFullscreen();
    }

    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const pauseTimer = () => {
    setIsRunning(false);
    clearInterval(intervalRef.current);

    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  };

  const resetTimer = () => {
    setIsRunning(false);
    clearInterval(intervalRef.current);
    setSecondsLeft(minutes * 60);

    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <Card ref={fullscreenRef} className="w-full max-w-md shadow-lg">
      <CardHeader>
        <CardTitle className="text-center text-2xl">Pomodoro Timer</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-4 mb-6">
          <label className="text-sm font-medium">
            Set Minutes:&nbsp;
            <input
              ref={inputRef}
              type="number"
              min={1}
              max={120}
              value={minutes}
              disabled={isRunning}
              onChange={handleMinutesChange}
              className="border rounded px-2 py-1 w-16 text-center"
            />
          </label>
          <div className="text-6xl font-mono text-center">
            {formatTime(secondsLeft)}
          </div>
        </div>
        <div className="flex justify-center gap-4">
          <Button onClick={startTimer} disabled={isRunning}>
            Start
          </Button>
          <Button onClick={pauseTimer} disabled={!isRunning}>
            Pause
          </Button>
          <Button variant="outline" onClick={resetTimer}>
            Reset
          </Button>
        </div>
      </CardContent>
      <CardFooter className="justify-center text-sm text-muted-foreground">
        {secondsLeft === 0
          ? "Session Complete!"
          : `Stay focused for ${minutes} minute${minutes > 1 ? "s" : ""}.`}
      </CardFooter>
    </Card>
  );
}

export default function PomodoroPage() {
  return (
    <SidebarProvider>
      <SidebarInset>
        <AppSidebar />
        <main className="ml-[280px] px-6 py-12 min-h-screen bg-background flex items-center justify-center">
          <PomodoroTimer />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
