"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function HabitWidget() {
  const days = ["M", "T", "W", "T", "F", "S", "S"];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="space-y-1">
          <CardTitle className="text-base">Habit Tracker</CardTitle>
          <CardDescription>Your weekly progress</CardDescription>
        </div>
        <BarChart3 className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="text-sm font-medium">Morning Meditation</div>
            <div className="flex justify-between">
              {days.map((day, i) => (
                <div key={i} className="flex flex-col items-center gap-1.5">
                  <div className="text-xs text-muted-foreground">{day}</div>
                  <div
                    className={`h-8 w-8 rounded-full flex items-center justify-center ${
                      i < 5 ? "bg-primary/20 text-primary" : "bg-muted"
                    }`}
                  >
                    {i < 5 ? "✓" : ""}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-sm font-medium">Exercise</div>
            <div className="flex justify-between">
              {days.map((day, i) => (
                <div key={i} className="flex flex-col items-center gap-1.5">
                  <div className="text-xs text-muted-foreground">{day}</div>
                  <div
                    className={`h-8 w-8 rounded-full flex items-center justify-center ${
                      i % 2 === 0 ? "bg-primary/20 text-primary" : "bg-muted"
                    }`}
                  >
                    {i % 2 === 0 ? "✓" : ""}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="ghost" size="sm" asChild className="text-xs">
          <Link href="/habits">View all habits</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
