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

export function GoalWidget() {
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
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">Learn React Native</div>
            <div className="text-sm text-muted-foreground">65%</div>
          </div>
          <div className="h-2 w-full rounded-full bg-muted">
            <div className="h-full w-[65%] rounded-full bg-primary"></div>
          </div>
          <div className="text-xs text-muted-foreground">
            Target: June 30, 2025
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">Complete 10 Projects</div>
            <div className="text-sm text-muted-foreground">40%</div>
          </div>
          <div className="h-2 w-full rounded-full bg-muted">
            <div className="h-full w-[40%] rounded-full bg-primary"></div>
          </div>
          <div className="text-xs text-muted-foreground">
            Target: December 31, 2025
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="ghost" size="sm" asChild className="text-xs">
          <Link href="/goals">View all goals</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
