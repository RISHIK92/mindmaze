import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import clsx from "clsx";

export function ProjectWidget({ data = [] }) {
  const getStatusStyle = (status) => {
    switch (status) {
      case "on_track":
        return {
          label: "On Track",
          bg: "bg-green-100",
          text: "text-green-700",
          bar: "bg-green-500",
        };
      case "at_risk":
        return {
          label: "At Risk",
          bg: "bg-amber-100",
          text: "text-amber-700",
          bar: "bg-amber-500",
        };
      case "delayed":
        return {
          label: "Delayed",
          bg: "bg-red-100",
          text: "text-red-700",
          bar: "bg-red-500",
        };
      default:
        return {
          label: "Unknown",
          bg: "bg-gray-100",
          text: "text-gray-700",
          bar: "bg-gray-400",
        };
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="space-y-1">
          <CardTitle className="text-base">Projects</CardTitle>
          <CardDescription>Current project status</CardDescription>
        </div>
        <ClipboardList className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-4">
        {data.length === 0 && (
          <div className="text-sm text-muted-foreground">
            No active projects.
          </div>
        )}

        {data.map((project) => {
          const { id, name, progress, deadline, status } = project;
          const { label, bg, text, bar } = getStatusStyle(status.toLowerCase());

          const isCompleted = progress === 100;
          const daysLeft = Math.ceil(
            (new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
          );

          return (
            <div key={id} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">{name}</div>
                <div
                  className={clsx(
                    "flex h-5 items-center rounded-full px-2 text-xs font-medium",
                    isCompleted
                      ? "bg-green-100 text-green-700"
                      : `${bg} ${text}`
                  )}
                >
                  {isCompleted ? "Completed" : label}
                </div>
              </div>
              <div className="h-1.5 w-full rounded-full bg-muted">
                <div
                  className={clsx(
                    "h-full rounded-full transition-all duration-300",
                    isCompleted ? "bg-green-500" : bar
                  )}
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
              <div className="text-xs text-muted-foreground">
                {isCompleted
                  ? "Project complete"
                  : daysLeft > 0
                  ? `Due in ${daysLeft} day${daysLeft > 1 ? "s" : ""}`
                  : "Due today or overdue"}
              </div>
            </div>
          );
        })}
      </CardContent>
      <CardFooter>
        <Button variant="ghost" size="sm" asChild className="text-xs">
          <Link href="/projects">View all projects</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
