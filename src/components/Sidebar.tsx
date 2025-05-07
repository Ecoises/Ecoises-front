
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Map, Search, BookOpen, Calendar, User, Settings, LogOut, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  to: string;
  active: boolean;
}

const NavItem = ({ icon: Icon, label, to, active }: NavItemProps) => {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-xl transition-colors",
        active
          ? "bg-lime-100 text-forest-900 font-medium"
          : "text-forest-800 hover:bg-lime-50"
      )}
    >
      <Icon className={cn("h-5 w-5", active ? "text-lime-600" : "text-forest-700")} />
      <span>{label}</span>
    </Link>
  );
};

const navItems = [
  { icon: Home, label: "Dashboard", to: "/" },
  { icon: Search, label: "Bird Explorer", to: "/explorer" },
  { icon: Map, label: "Sightings Map", to: "/map" },
  { icon: BookOpen, label: "Species Guide", to: "/species" },
  { icon: Calendar, label: "My Sightings", to: "/sightings" },
];

interface SidebarProps {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar = ({ sidebarOpen, toggleSidebar }: SidebarProps) => {
  const location = useLocation();
  const isMobile = useIsMobile();

  return (
    <aside 
      className={cn(
        "bg-secondary fixed z-50 h-screen transition-all duration-300 shadow-lg md:shadow-none overflow-auto",
        isMobile 
          ? sidebarOpen ? "left-0 w-64" : "-left-64 w-64"
          : "w-64 left-0"
      )}
    >
      <div className="p-4 flex flex-col h-full">
        <div className="flex items-center gap-2 mb-8">
          <div className="bg-lime-400 h-8 w-8 rounded-lg flex items-center justify-center">
            <span className="text-forest-900 font-bold text-lg">A</span>
          </div>
          <h1 className="text-forest-900 font-bold text-xl">Avian Voyager</h1>
        </div>
        
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => (
            <NavItem
              key={item.to}
              icon={item.icon}
              label={item.label}
              to={item.to}
              active={location.pathname === item.to}
            />
          ))}
        </nav>
        
        <div className="mt-auto pt-4 border-t border-lime-100">
          <DropdownMenu>
            <DropdownMenuTrigger className="w-full">
              <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-lime-50 transition-colors cursor-pointer">
                <Avatar className="h-8 w-8 bg-lime-100">
                  <AvatarImage src="/avatar-placeholder.png" alt="User" />
                  <AvatarFallback className="text-forest-800 bg-lime-200">JD</AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left">
                  <p className="text-forest-900 font-medium text-sm">John Doe</p>
                  <p className="text-forest-700 text-xs">Bird Enthusiast</p>
                </div>
                <ChevronDown size={16} className="text-forest-700" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer text-red-500 focus:text-red-500">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
export { navItems };
