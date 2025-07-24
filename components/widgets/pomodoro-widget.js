"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pause, Play, RotateCcw, Timer } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function PomodoroWidget() {
  const [isRunning, setIsRunning] = useState(false);
  const router = useRouter();

  const handlePlayClick = () => {
    router.push("/pomodoro");
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="space-y-1">
          <CardTitle className="text-base">Pomodoro Timer</CardTitle>
          <CardDescription>Focus sessions</CardDescription>
        </div>
        <Timer className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center">
        <div className="text-4xl font-bold">25:00</div>
        <div className="mt-2 text-sm text-muted-foreground">Focus Session</div>
        <div className="mt-4 flex gap-2">
          <Button variant="outline" size="icon" onClick={handlePlayClick}>
            {isRunning ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>
          <Button variant="outline" size="icon">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="ghost" size="sm" asChild className="text-xs">
          <Link href="/pomodoro">Open timer</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
