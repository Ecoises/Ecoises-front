import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { mobileNavItems } from "./Sidebar";

interface MobileNavbarProps {
  // No necesitamos props adicionales ahora
}

const MobileNavbar = ({}: MobileNavbarProps) => {
  const location = useLocation();
  
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
      <div className="flex justify-around items-center">
        {mobileNavItems.map((item, index) => {
          const Icon = item.icon;
          const active = location.pathname === item.to;
          const isCenter = index === Math.floor(mobileNavItems.length / 2);
          
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex flex-col items-center justify-center py-2",
                isCenter ? "relative -top-4" : ""
              )}
            >
              <div className={cn(
                "flex items-center justify-center rounded-lg",
                isCenter 
                  ? "bg-lime-500 p-4 shadow-lg" 
                  : "p-2",
                active && !isCenter ? "text-lime-600" : isCenter ? "text-white" : "text-forest-700"
              )}>
                <Icon className={cn(
                  isCenter ? "h-7 w-7" : "h-6 w-6"
                )} />
              </div>
              {!isCenter && (
                <span className="text-xs mt-1 font-medium">{item.label}</span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileNavbar;