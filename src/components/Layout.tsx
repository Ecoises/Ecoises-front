
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Map, Search, BookOpen, Calendar, Menu, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

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

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();

  const navItems = [
    { icon: Home, label: "Dashboard", to: "/" },
    { icon: Search, label: "Bird Explorer", to: "/explorer" },
    { icon: Map, label: "Sightings Map", to: "/map" },
    { icon: BookOpen, label: "Species Guide", to: "/species" },
    { icon: Calendar, label: "My Sightings", to: "/sightings" },
  ];

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  
  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside 
        className={cn(
          "bg-secondary fixed md:relative z-50 h-screen transition-all duration-300 shadow-lg md:shadow-none",
          isMobile 
            ? sidebarOpen ? "left-0 w-64" : "-left-64 w-64"
            : "w-64"
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
            <div className="bg-lime-50 rounded-xl p-3">
              <h3 className="text-forest-900 font-medium text-sm mb-1">Pro Tip</h3>
              <p className="text-forest-700 text-xs">Take photos to help with bird identification.</p>
            </div>
          </div>
        </div>
      </aside>
      
      {/* Main content */}
      <main className={cn(
        "flex-1 transition-all duration-300 relative",
        isMobile && sidebarOpen ? "ml-64" : "ml-0"
      )}>
        {isMobile && (
          <button 
            onClick={toggleSidebar}
            className="fixed top-4 left-4 z-50 bg-white p-2 rounded-full shadow-md"
          >
            {sidebarOpen ? (
              <X className="h-5 w-5 text-forest-900" />
            ) : (
              <Menu className="h-5 w-5 text-forest-900" />
            )}
          </button>
        )}
        <div className="container p-6 max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
