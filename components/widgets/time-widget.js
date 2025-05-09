import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function TimeWidget() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="space-y-1">
          <CardTitle className="text-base">Time Management</CardTitle>
          <CardDescription>Today time allocation</CardDescription>
        </div>
        <Clock className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">Deep Work</div>
              <div className="text-sm text-muted-foreground">2h 15m</div>
            </div>
            <div className="h-2 w-full rounded-full bg-muted">
              <div className="h-full w-[60%] rounded-full bg-primary"></div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">Meetings</div>
              <div className="text-sm text-muted-foreground">1h 30m</div>
            </div>
            <div className="h-2 w-full rounded-full bg-muted">
              <div className="h-full w-[40%] rounded-full bg-amber-500"></div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">Breaks</div>
              <div className="text-sm text-muted-foreground">45m</div>
            </div>
            <div className="h-2 w-full rounded-full bg-muted">
              <div className="h-full w-[20%] rounded-full bg-green-500"></div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="ghost" size="sm" asChild className="text-xs">
          <Link href="/time">View time report</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
