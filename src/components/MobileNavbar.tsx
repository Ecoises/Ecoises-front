import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { mobileNavItems } from "./Sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { User, LogIn } from "lucide-react";

interface MobileNavbarProps {
  // No necesitamos props adicionales ahora
}

const MobileNavbar = ({ }: MobileNavbarProps) => {
  const location = useLocation();
  const { user } = useAuth();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 px-4 pb-4 pt-2 pointer-events-none">
      {/* Isla Dinámica con Glassmorphism */}
      <div className="pointer-events-auto bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-3xl shadow-2xl shadow-black/10 mx-auto max-w-md">
        <div className="flex justify-around items-center px-2 py-3">
          {mobileNavItems.map((item) => {
            const Icon = item.icon;

            const isSpeciesDetail = item.to === '/explorer' && location.pathname.startsWith('/taxa/');
            let active = false;

            if (item.to === '/explorer') {
              active = location.pathname === item.to || isSpeciesDetail;
            } else if (item.to === '/') {
              // Home: active on root path or /home
              active = location.pathname === '/' || location.pathname === '/home';
            } else {
              // General prefix match (excluding root mismatch)
              active = location.pathname === item.to || (item.to !== '/' && location.pathname.startsWith(item.to + '/'));
            }

            if (item.label === 'Perfil' && !user) {
              // Replace Profile with Login for guests
              const loginActive = location.pathname === '/login';
              return (
                <Link
                  key="/login"
                  to="/login"
                  className="flex flex-col items-center justify-center gap-1 relative group"
                >
                  {loginActive && (
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-lime-400 to-lime-600 rounded-full shadow-lg shadow-lime-500/50" />
                  )}
                  <div className={cn(
                    "flex items-center justify-center rounded-2xl p-3 transition-all duration-300",
                    loginActive
                      ? "bg-gradient-to-br from-lime-500 to-lime-600 text-white shadow-lg shadow-lime-500/30 scale-105"
                      : "text-forest-700 group-hover:bg-lime-50 group-hover:scale-105"
                  )}>
                    <LogIn className={cn(
                      "h-5 w-5 transition-transform duration-300",
                      loginActive && "drop-shadow-sm"
                    )} />
                  </div>
                  <span className={cn(
                    "text-[10px] font-semibold transition-all duration-300 tracking-tight",
                    loginActive
                      ? "text-lime-600 scale-105"
                      : "text-forest-600 group-hover:text-lime-600"
                  )}>
                    Ingresar
                  </span>
                </Link>
              );
            }

            return (
              <Link
                key={item.to}
                to={item.to}
                className="flex flex-col items-center justify-center gap-1 relative group"
              >
                {/* Indicador de activo - Pill animado */}
                {active && (
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-lime-400 to-lime-600 rounded-full shadow-lg shadow-lime-500/50 animate-in fade-in slide-in-from-top-2 duration-300" />
                )}

                {/* Contenedor del ícono con efecto hover */}
                <div className={cn(
                  "flex items-center justify-center rounded-2xl p-3 transition-all duration-300",
                  active
                    ? "bg-gradient-to-br from-lime-500 to-lime-600 text-white shadow-lg shadow-lime-500/30 scale-105"
                    : "text-forest-700 group-hover:bg-lime-50 group-hover:scale-105"
                )}>
                  <Icon className={cn(
                    "h-5 w-5 transition-transform duration-300",
                    active && "drop-shadow-sm"
                  )} />
                </div>

                {/* Label con animación */}
                <span className={cn(
                  "text-[10px] font-semibold transition-all duration-300 tracking-tight",
                  active
                    ? "text-lime-600 scale-105"
                    : "text-forest-600 group-hover:text-lime-600"
                )}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default MobileNavbar;