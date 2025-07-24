"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Clock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import clsx from "clsx";

function isTodayTask(taskDateStr) {
  const taskDate = new Date(taskDateStr);
  const today = new Date();
  return (
    taskDate.getDate() === today.getDate() &&
    taskDate.getMonth() === today.getMonth() &&
    taskDate.getFullYear() === today.getFullYear()
  );
}

function parseTaskData(data) {
  const lines = data.split("\n");
  const dateLine = lines.find((line) => line.startsWith("Date:")) || "";
  const detailLine = lines.find((line) => line.startsWith("Details:")) || "";
  const dateStr = dateLine.replace("Date:", "").trim();
  const details = detailLine.replace("Details:", "").trim();
  return { dateStr, details };
}

export function TimeWidget({ data = [] }) {
  const todayTasks = data.filter((task) => {
    if (!task.data) return false;
    const { dateStr } = parseTaskData(task.data);
    return isTodayTask(dateStr);
  });

  return (
    <Card className="rounded-2xl shadow-md">
      <CardHeader className="flex flex-row items-center justify-between pb-1">
        <CardTitle className="text-base font-semibold text-muted-foreground">
          Today's Tasks
        </CardTitle>
        <Clock className="h-4 w-4 text-muted-foreground" />
      </CardHeader>

      <CardContent className="pt-0">
        {todayTasks.length > 0 ? (
          <div className="space-y-4 mt-2">
            {todayTasks.slice(0, 3).map((task) => {
              const { details } = parseTaskData(task.data);
              return (
                <div
                  key={task.id}
                  className={clsx(
                    "flex items-start gap-3 p-2 rounded-md transition-all",
                    task.completed
                      ? "bg-green-50 dark:bg-green-950/40"
                      : "bg-muted/10"
                  )}
                >
                  <div className="pt-1">
                    {task.completed ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    ) : (
                      <div className="h-4 w-4 rounded-full bg-muted-foreground/40 mt-1" />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <p
                      className={clsx(
                        "text-sm font-medium",
                        task.completed && "line-through text-muted-foreground"
                      )}
                    >
                      {task.text}
                    </p>
                    <p className="text-xs text-muted-foreground">{details}</p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground mt-4">
            🎉 No tasks scheduled for today!
          </p>
        )}
      </CardContent>

      <CardFooter className="pt-2">
        <Button variant="ghost" size="sm" asChild className="text-xs">
          <Link href="/task">View time report</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
