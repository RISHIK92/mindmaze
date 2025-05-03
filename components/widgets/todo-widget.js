"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { CheckSquare, Plus } from "lucide-react";
import Link from "next/link";

export function TodoWidget() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="space-y-1">
          <CardTitle className="text-base">To-Do List</CardTitle>
          <CardDescription>Track your daily tasks</CardDescription>
        </div>
        <CheckSquare className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox id="task1" />
          <label
            htmlFor="task1"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Prepare client presentation
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="task2" />
          <label
            htmlFor="task2"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Review project proposal
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="task3" checked />
          <label
            htmlFor="task3"
            className="text-sm font-medium leading-none line-through text-muted-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Schedule team meeting
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="task4" />
          <label
            htmlFor="task4"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Update project timeline
          </label>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="ghost"
          size="sm"
          className="text-xs text-muted-foreground"
        >
          <Plus className="mr-1 h-3 w-3" />
          Add task
        </Button>
        <Button variant="ghost" size="sm" asChild className="text-xs">
          <Link href="/todos">View all</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
