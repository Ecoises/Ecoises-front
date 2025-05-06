
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import Sidebar from "./Sidebar";
import MobileNavbar from "./MobileNavbar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  
  return (
    <div className="flex bg-background min-h-screen">
      {/* Sidebar component */}
      <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      {/* Main content */}
      <main className={cn(
        "flex-1 transition-all duration-300 min-h-screen",
        isMobile 
          ? "pb-20" // Add padding at the bottom for the mobile navbar
          : "ml-64" // Always leave space for the sidebar on desktop
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
        
        {/* Mobile Navigation Bar */}
        {isMobile && <MobileNavbar />}
      </main>
    </div>
  );
};

export default Layout;
