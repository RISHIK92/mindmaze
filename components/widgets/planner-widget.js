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

export function PlannerWidget() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="space-y-1">
          <CardTitle className="text-base">Daily Planner</CardTitle>
          <CardDescription>Today schedule</CardDescription>
        </div>
        <Calendar className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-start gap-2">
          <div className="flex h-6 w-16 items-center justify-center rounded bg-primary/10 text-xs font-medium text-primary">
            9:00 AM
          </div>
          <div className="text-sm">Team standup meeting</div>
        </div>
        <div className="flex items-start gap-2">
          <div className="flex h-6 w-16 items-center justify-center rounded bg-primary/10 text-xs font-medium text-primary">
            11:00 AM
          </div>
          <div className="text-sm">Client presentation</div>
        </div>
        <div className="flex items-start gap-2">
          <div className="flex h-6 w-16 items-center justify-center rounded bg-primary/10 text-xs font-medium text-primary">
            2:00 PM
          </div>
          <div className="text-sm">Design review</div>
        </div>
        <div className="flex items-start gap-2">
          <div className="flex h-6 w-16 items-center justify-center rounded bg-primary/10 text-xs font-medium text-primary">
            4:30 PM
          </div>
          <div className="text-sm">Project planning</div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="ghost" size="sm" asChild className="text-xs">
          <Link href="/planner">View full schedule</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
