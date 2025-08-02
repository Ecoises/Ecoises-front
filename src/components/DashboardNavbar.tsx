import { useState } from "react";
import { Search, Bell, User, X, LogOut } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const DashboardNavbar = () => {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const isMobile = useIsMobile();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  // Obtener las iniciales del nombre para el avatar
  const getInitials = (fullName: string) => {
    return fullName
      .split(' ')
      .map(name => name.charAt(0))
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <nav className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4">
        {/* Logo - Always visible on left in mobile, center-left in desktop */}
        <div className="flex items-center gap-2">
          <div className="bg-lime-400 h-8 w-8 rounded-lg flex items-center justify-center">
            <span className="text-forest-900 font-bold text-lg">B</span>
          </div>
          <h1 className="text-forest-900 font-bold text-xl">BirdWatch</h1>
        </div>

        {/* Desktop Layout */}
        {!isMobile && (
          <>
            {/* Center - Search */}
            <div className="flex-1 max-w-md mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar especies, avistamientos..."
                  className="pl-10 bg-muted/50"
                />
              </div>
            </div>

            {/* Right side - Notifications and Profile */}
            <div className="flex items-center gap-4">
              {/* Notifications */}
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-destructive rounded-full"></span>
              </Button>

              {/* Profile */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg" alt="Profile" />
                      <AvatarFallback>
                        {user?.full_name ? getInitials(user.full_name) : <User className="h-4 w-4" />}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.full_name || 'Usuario'}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email || 'usuario@ejemplo.com'}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Perfil</DropdownMenuItem>
                  <DropdownMenuItem>Configuración</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Cerrar sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </>
        )}

        {/* Mobile Layout */}
        {isMobile && (
          <div className="flex items-center gap-2">
            {/* Search - Expandable */}
            {isSearchExpanded ? (
              <div className="flex items-center gap-2 flex-1">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar..."
                    className="pl-10 bg-muted/50 text-sm"
                    autoFocus
                  />
                </div>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setIsSearchExpanded(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <>
                {/* Search Icon */}
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setIsSearchExpanded(true)}
                >
                  <Search className="h-5 w-5" />
                </Button>

                {/* Notifications */}
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-destructive rounded-full"></span>
                </Button>

                {/* Profile */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg" alt="Profile" />
                      <AvatarFallback>
                        {user?.full_name ? getInitials(user.full_name) : <User className="h-4 w-4" />}
                      </AvatarFallback>
                    </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user?.full_name || 'Usuario'}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user?.email || 'usuario@ejemplo.com'}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Perfil</DropdownMenuItem>
                    <DropdownMenuItem>Configuración</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Cerrar sesión
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default DashboardNavbar;