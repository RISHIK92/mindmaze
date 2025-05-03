import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function TeamWidget() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="space-y-1">
          <CardTitle className="text-base">Team Collaboration</CardTitle>
          <CardDescription>Recent activity</CardDescription>
        </div>
        <Users className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder.svg" alt="Alex" />
            <AvatarFallback>A</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <div className="text-sm font-medium">
              Alex updated Project Timeline
            </div>
            <div className="text-xs text-muted-foreground">2 hours ago</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder.svg" alt="Taylor" />
            <AvatarFallback>T</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <div className="text-sm font-medium">
              Taylor commented on Design Doc
            </div>
            <div className="text-xs text-muted-foreground">5 hours ago</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder.svg" alt="Jordan" />
            <AvatarFallback>J</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <div className="text-sm font-medium">Jordan shared a file</div>
            <div className="text-xs text-muted-foreground">Yesterday</div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="ghost" size="sm" asChild className="text-xs">
          <Link href="/team">View team activity</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
