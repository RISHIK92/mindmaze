"use client";

import * as React from "react";
import {
  AudioWaveform,
  Command,
  GalleryVerticalEnd,
  LayoutDashboardIcon,
  BrainCircuit,
  Calendar,
  CheckSquare,
  ClipboardList,
  Clock,
  FileText,
  Goal,
  Timer,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Personal Management",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      icon: LayoutDashboardIcon,
      href: "/dashboard",
    },
    {
      title: "To-Do List",
      icon: CheckSquare,
      href: "/todos",
    },
    {
      title: "Task Management",
      icon: Clock,
      href: "/task",
    },
    {
      title: "Pomodoro Timer",
      icon: Timer,
      href: "/pomodoro",
    },
    {
      title: "Projects",
      icon: ClipboardList,
      href: "/projects",
    },
    {
      title: "Notes",
      icon: FileText,
      href: "/notes",
    },
    {
      title: "Goals",
      icon: Goal,
      href: "/goals",
    },
    {
      title: "Daily Planner",
      icon: Calendar,
      href: "/planner",
    },
    {
      title: "Mind Maps",
      icon: BrainCircuit,
      href: "/maze",
    },
  ],
  projects: [],
};

function UpdatedNavMain({ items }) {
  const router = useRouter();

  return (
    <div className="grid gap-1">
      <nav className="grid gap-1 mx-4">
        {items?.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-800 transition-all hover:text-foreground hover:bg-muted"
          >
            <item.icon className="h-4 w-4" />
            <span>{item.title}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}

export function AppSidebar({ ...props }) {
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("shadcn");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      setUserEmail(firebaseUser?.email || "m@example.com");
      setUserName(firebaseUser?.displayName || "shadcn");
    });
    return () => unsubscribe();
  }, []);

  const sidebarUser = {
    ...data.user,
    name: userName,
    email: userEmail,
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <UpdatedNavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={sidebarUser} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
