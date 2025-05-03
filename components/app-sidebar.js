"use client";

import * as React from "react";
import {
  AudioWaveform,
  Command,
  GalleryVerticalEnd,
  LayoutDashboardIcon,
  BarChart3,
  BrainCircuit,
  Calendar,
  CheckSquare,
  ClipboardList,
  Clock,
  FileText,
  Goal,
  Timer,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
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
      title: "Habit Tracker",
      icon: BarChart3,
      href: "/habits",
    },
    {
      title: "Time Management",
      icon: Clock,
      href: "/time",
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
      title: "Team",
      icon: Users,
      href: "/team",
    },
    {
      title: "Mind Maps",
      icon: BrainCircuit,
      href: "/mindmaps",
    },
    {
      title: "Daily Planner",
      icon: Calendar,
      href: "/planner",
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
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <UpdatedNavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
