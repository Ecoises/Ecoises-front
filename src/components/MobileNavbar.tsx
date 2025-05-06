
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { navItems } from "./Sidebar";

const MobileNavbar = () => {
  const location = useLocation();
  
  // Filter out the "/sightings/new" route as it will be handled by the floating action button
  const filteredNavItems = navItems.filter(item => item.to !== "/sightings/new");
  
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
      <div className="flex justify-around">
        {filteredNavItems.map((item) => {
          const Icon = item.icon;
          const active = location.pathname === item.to;
          
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex flex-col items-center py-3 px-2",
                active ? "text-lime-600" : "text-forest-700"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileNavbar;
