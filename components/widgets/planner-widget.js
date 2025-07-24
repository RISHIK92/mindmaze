import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import clsx from "clsx";

export function PlannerWidget({ data }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="space-y-1">
          <CardTitle className="text-base">Daily Planner</CardTitle>
          <CardDescription>Todays schedule</CardDescription>
        </div>
        <Calendar className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-3">
        {data.length === 0 && (
          <p className="text-sm text-muted-foreground">No plans yet.</p>
        )}
        {data.map((item) => (
          <div key={item.id} className="flex items-start gap-2">
            <div className="flex h-6 w-16 items-center justify-center rounded bg-primary/10 text-xs font-medium text-primary">
              {item.deadline}
            </div>
            <div className="space-y-1">
              <div className="text-sm font-medium">{item.task}</div>
              <div className="text-xs text-muted-foreground">
                {item.category} •{" "}
                <span
                  className={clsx(
                    "font-semibold",
                    item.priority === "high" && "text-red-500",
                    item.priority === "medium" && "text-yellow-500",
                    item.priority === "low" && "text-green-500"
                  )}
                >
                  {item.priority}
                </span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
      <CardFooter>
        <Button variant="ghost" size="sm" asChild className="text-xs">
          <Link href="/planner">View full schedule</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
