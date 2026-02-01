import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home, Map, Search, BookOpen, Calendar, User, GraduationCap,
  Settings, LogOut, ChevronDown, Trophy
} from "lucide-react";
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

export const navItems = [
  { icon: Home, label: "Inicio", to: "/" },
  { icon: Search, label: "Exporar", to: "/explorer" },
  { icon: Trophy, label: "Ranking", to: "/ranking" },
  { icon: GraduationCap, label: "Aprende", to: "/learn" },
];

export const mobileNavItems = [
  { icon: Home, label: "Inicio", to: "/" },
  { icon: Search, label: "Explorar", to: "/explorer" },
  { icon: GraduationCap, label: "Aprende", to: "/learn" },
  { icon: Trophy, label: "Ranking", to: "/ranking" },
  { icon: User, label: "Perfil", to: "/profile" },
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
        "fixed z-40 transition-all duration-300 md:shadow-none top-16",
        isMobile
          ? sidebarOpen ? "left-0 w-64" : "-left-64 w-64"
          : "w-64 left-0"
      )}
    >
      {/* Ajustado: calcula la altura restante después del navbar superior */}
      <div className="h-[calc(100vh-4rem)] overflow-auto p-4 flex flex-col">
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const isSpeciesDetail = item.to === '/explorer' && location.pathname.startsWith('/taxa/');
            const isSpeciesGuideSimple = item.to === '/taxa' && location.pathname === '/taxa';
            // Special case overrides
            let isActive = false;

            if (item.to === '/') {
              // Home: active on root path or /home
              isActive = location.pathname === '/' || location.pathname === '/home';
            } else if (item.to === '/taxa') {
              isActive = isSpeciesGuideSimple;
            } else if (item.to === '/explorer') {
              isActive = location.pathname === item.to || isSpeciesDetail;
            } else {
              isActive = location.pathname === item.to || location.pathname.startsWith(item.to + '/');
            }

            return (
              <NavItem
                key={item.to}
                icon={item.icon}
                label={item.label}
                to={item.to}
                active={isActive}
              />
            );
          })}
        </nav>

        {/* Footer / Menú inferior */}
        <div className="mt-auto pt-2 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-2 pb-2">
          <div className="flex flex-col items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex flex-wrap justify-center gap-2">
              <a href="/privacy" className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors">Privacidad</a>
              <span className="text-gray-400 dark:text-gray-500">•</span>
              <a href="/terms" className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors">Condiciones</a>
              
            </div>
            <div className="text-gray-400 dark:text-gray-500 flex flex-col items-center gap-2">
              <span>&copy; {new Date().getFullYear()} Ecoises v1.0.0 </span>
              <span>Desarrollado con ❤️ por <a href="https://www.instagram.com/jcamelo__/" target="_blank">Camelo</a></span> 
              
            </div>
          </div>
        </div>

      </div>
    </aside>
  );
};

export default Sidebar;
