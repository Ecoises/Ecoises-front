
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import Sidebar from "./Sidebar";
import MobileNavbar from "./MobileNavbar";
import { PlusCircle } from "lucide-react";
import { Link, Outlet } from "react-router-dom";
import ActionDialog from "./ActionDialog";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
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
          <div className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
            <div className="flex justify-center items-center h-14">
              <div className="flex items-center gap-2">
                <div className="bg-lime-400 h-8 w-8 rounded-lg flex items-center justify-center">
                  <span className="text-forest-900 font-bold text-lg">B</span>
                </div>
                <h1 className="text-forest-900 font-bold text-xl">BirdWatch</h1>
              </div>
            </div>
          </div>
        )}

        <div className="container p-6 max-w-6xl mx-auto">
          <Outlet />
        </div>
        
        {/* Floating action button */}
        <button
          onClick={() => setActionDialogOpen(true)}
          className="fixed bottom-24 right-6 z-50 bg-gradient-to-r from-lime-500 to-green-600 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          aria-label="Quick Actions"
        >
          <PlusCircle className="h-6 w-6" />
        </button>
        
        {/* Mobile Navigation Bar */}
        {isMobile && (
          <MobileNavbar />
        )}
        
        {/* Action Dialog */}
        <ActionDialog 
          open={actionDialogOpen} 
          onOpenChange={setActionDialogOpen} 
        />
      </main>
    </div>
  );
};

export default Layout;
