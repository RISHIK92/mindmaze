"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Goal } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import clsx from "clsx";

export function GoalWidget({ data = [] }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="space-y-1">
          <CardTitle className="text-base">Goals</CardTitle>
          <CardDescription>Your progress tracker</CardDescription>
        </div>
        <Goal className="h-4 w-4 text-muted-foreground" />
      </CardHeader>

      <CardContent className="space-y-4">
        {data?.length > 0 ? (
          data.map((goal) => {
            const isComplete = goal.progress >= 100;
            return (
              <div key={goal.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div
                    className={clsx(
                      "text-sm font-medium",
                      isComplete && "line-through text-muted-foreground"
                    )}
                  >
                    {goal.title}
                  </div>
                  <div
                    className={clsx(
                      "text-sm",
                      isComplete
                        ? "text-green-600 font-semibold"
                        : "text-muted-foreground"
                    )}
                  >
                    {goal.progress}%
                  </div>
                </div>
                <div className="h-2 w-full rounded-full bg-muted">
                  <div
                    className={clsx(
                      "h-full rounded-full",
                      isComplete ? "bg-green-600" : "bg-primary"
                    )}
                    style={{ width: `${Math.min(goal.progress, 100)}%` }}
                  />
                </div>
                <div className="text-xs text-muted-foreground">
                  Target: {new Date(goal.deadline).toDateString()}
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-sm text-muted-foreground">No goals yet.</div>
        )}
      </CardContent>

      <CardFooter>
        <Button variant="ghost" size="sm" asChild className="text-xs">
          <Link href="/goals">View all goals</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
