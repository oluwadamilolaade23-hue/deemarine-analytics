import { useState } from "react";
import { NavLink, useNavigate, Outlet } from "react-router-dom";
import {
  Home,
  BookOpen,
  FlaskConical,
  Users,
  ClipboardList,
  Calendar,
  FolderOpen,
  Award,
  TrendingUp,
  BarChart3,
  Briefcase,
  Megaphone,
  LifeBuoy,
  User,
  Bell,
  LogOut,
  Menu,
  Ship,
  Shield,
} from "lucide-react";
import { usePortalAuth } from "./PortalAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const NAV_ITEMS = [
  { to: "/portal", label: "Home", icon: Home, end: true },
  { to: "/portal/project-lab", label: "My Project", icon: FlaskConical },
  { to: "/portal/team", label: "My Team", icon: Users },
  { to: "/portal/assignments", label: "My Tasks", icon: ClipboardList },
  { to: "/portal/learning", label: "Project Resources", icon: BookOpen },
  { to: "/portal/sessions", label: "Mentor Check-Ins", icon: Calendar },
  { to: "/portal/skill-passport", label: "Skill Passport", icon: Award },
  { to: "/portal/portfolio", label: "Evidence & Deliverables", icon: Briefcase },
  { to: "/portal/programme", label: "My Programme", icon: TrendingUp },
  { to: "/portal/progress", label: "My Progress", icon: BarChart3 },
  { to: "/portal/resources", label: "Resources", icon: FolderOpen },
  { to: "/portal/announcements", label: "Announcements", icon: Megaphone },
  { to: "/portal/support", label: "Support", icon: LifeBuoy },
  { to: "/portal/profile", label: "Profile", icon: User },
];

const MOBILE_NAV_ITEMS = [
  { to: "/portal", label: "Home", icon: Home, end: true },
  { to: "/portal/project-lab", label: "Project", icon: FlaskConical },
  { to: "/portal/team", label: "Team", icon: Users },
  { to: "/portal/assignments", label: "Tasks", icon: ClipboardList },
  { to: "/portal/learning", label: "Resources", icon: BookOpen },
];

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const { participant, logout } = usePortalAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/portal/login");
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-300">
      {/* Brand */}
      <div className="px-6 py-5 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
            <Ship className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-tight">DMA BlueData Hub</p>
            <p className="text-cyan-400 text-xs">Learn. Build. Analyse. Solve.</p>
          </div>
        </div>
      </div>

      {/* Participant info */}
      {participant && (
        <div className="px-4 py-3 border-b border-slate-800">
          <p className="text-white text-sm font-medium truncate">{participant.full_name}</p>
          <p className="text-slate-500 text-xs font-mono">{participant.reference_number}</p>
          <Badge className="mt-1 bg-green-500/20 text-green-400 text-xs">ACTIVE</Badge>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`
            }
          >
            <item.icon className="h-4 w-4 flex-shrink-0" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Admin + Logout */}
      <div className="px-3 py-4 border-t border-slate-800 space-y-1">
        <a
          href="/portal/admin"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-500 hover:text-amber-400 hover:bg-slate-800 transition-colors"
        >
          <Shield className="h-4 w-4 flex-shrink-0" />
          <span>Admin Centre</span>
        </a>
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full justify-start text-slate-400 hover:text-white hover:bg-slate-800"
        >
          <LogOut className="h-4 w-4 mr-3" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}

export function PortalLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-shrink-0 fixed inset-y-0 left-0 z-30">
        <SidebarContent />
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-slate-900 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
            <Ship className="h-4 w-4 text-white" />
          </div>
          <span className="text-white font-bold text-sm">BlueData Hub</span>
        </div>
        <div className="flex items-center gap-3">
          <button className="relative text-slate-400">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <button className="text-slate-400">
                <Menu className="h-6 w-6" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              <SidebarContent onNavigate={() => setMobileOpen(false)} />
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 pt-14 lg:pt-0 pb-16 lg:pb-0">
        <main className="min-h-screen">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-slate-900 border-t border-slate-800 flex items-center justify-around px-2 py-2">
        {MOBILE_NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-2 py-1 rounded-lg text-xs ${
                isActive ? "text-blue-400" : "text-slate-500"
              }`
            }
          >
            <item.icon className="h-5 w-5" />
            <span className="text-[10px]">{item.label}</span>
          </NavLink>
        ))}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <button className="flex flex-col items-center gap-1 px-2 py-1 text-slate-500">
              <Menu className="h-5 w-5" />
              <span className="text-[10px]">Menu</span>
            </button>
          </SheetTrigger>
        </Sheet>
      </nav>
    </div>
  );
}