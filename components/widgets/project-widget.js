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

export function ProjectWidget() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="space-y-1">
          <CardTitle className="text-base">Projects</CardTitle>
          <CardDescription>Current project status</CardDescription>
        </div>
        <ClipboardList className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">Website Redesign</div>
            <div className="flex h-5 items-center rounded-full bg-green-100 px-2 text-xs font-medium text-green-700">
              On Track
            </div>
          </div>
          <div className="h-1.5 w-full rounded-full bg-muted">
            <div className="h-full w-[75%] rounded-full bg-green-500"></div>
          </div>
          <div className="text-xs text-muted-foreground">Due in 5 days</div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">Mobile App Development</div>
            <div className="flex h-5 items-center rounded-full bg-amber-100 px-2 text-xs font-medium text-amber-700">
              At Risk
            </div>
          </div>
          <div className="h-1.5 w-full rounded-full bg-muted">
            <div className="h-full w-[45%] rounded-full bg-amber-500"></div>
          </div>
          <div className="text-xs text-muted-foreground">Due in 2 days</div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="ghost" size="sm" asChild className="text-xs">
          <Link href="/projects">View all projects</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
