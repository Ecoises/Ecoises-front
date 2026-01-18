import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Error404Image from "@/assets/404-error.svg";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="text-center space-y-6 max-w-lg mx-auto">
        <div className="flex justify-center">
          <img
            src="public/404-error.svg"
            alt="404 Error - Especies perdidas"
            className="w-full max-w-md h-auto object-contain"
          />
        </div>

        <div className="space-y-4">
          <p className="text-xl text-gray-600 font-medium leading-relaxed">
            La página que buscas no existe o se ha perdido en la selva. 
            ¿Quieres volver a casa?
          </p>

          <Link to="/">
            <Button size="lg" className="mt-4 font-semibold px-8">
              Volver a la página principal
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
