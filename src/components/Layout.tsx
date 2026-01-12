import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import Sidebar from "./Sidebar";
import MobileNavbar from "./MobileNavbar";
import DashboardNavbar from "./DashboardNavbar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex flex-col min-h-screen"> {/* Cambiado a flex-col para apilar verticalmente */}

      {/* 1. DashboardNavbar: Siempre en la parte superior y abarcando todo el ancho */}
      <DashboardNavbar />

      {/* 2. Contenedor para Sidebar y Contenido Principal: Ocupa el espacio restante en altura y los organiza horizontalmente */}
      <div className="flex flex-1"> {/* flex-1 para ocupar el espacio vertical restante, flex para organizar horizontalmente */}

        {/* Sidebar Component: Asegúrate que Sidebar.jsx tenga sus propias clases para ser fijo/pegajoso y con el ancho (e.g., w-64, sticky top-0 h-screen) */}
        <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

        {/* Contenido Principal: Ocupa el espacio restante horizontalmente */}
        {/* Aquí el ml-64 (o el ancho de tu sidebar) es crucial para empujar el contenido más allá del sidebar */}
        <main className={cn(
          "flex-1 transition-all duration-300", // flex-1 para ocupar el espacio horizontal restante
          isMobile
            ? "pb-24" // Padding para la navbar inferior en móvil
            : "ml-64" // Margen izquierdo para dejar espacio al sidebar en escritorio
        )}>
          {/* El contenido de la página se renderiza aquí */}
          <div className="container px-4 py-6 sm:p-6 max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Navigation Bar (la barra de abajo en móvil) */}
      {isMobile && <MobileNavbar />}
    </div>
  );
};

export default Layout;