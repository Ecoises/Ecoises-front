import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  const images = [
    "/images/hero-img-1.png",
    "/images/hero-img.png",
    "/images/hero-img-2.png",
    "/images/hero-img-4.png",
    "/images/hero-img-6.png",
  ];

  const [current, setCurrent] = useState(0);

  // Cambiar imagen cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <section className="relative rounded-3xl overflow-hidden">
      <div className="relative w-full h-80 md:h-50 lg:h-[330px]">
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Slide ${index}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              index === current ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
      
      <div className="absolute inset-0 flex items-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl space-y-4 sm:space-y-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight text-left">
              Descubre y Protege la 
              <span className="text-primary"> Biodiversidad Local</span>
            </h1>
            
            {/* Párrafo oculto en pantallas muy pequeñas */}
            <p className="hidden sm:block text-base sm:text-lg md:text-xl text-gray-200 leading-relaxed">
              Únete a la aventura interactiva de conservación. Aprende, explora y protege las especies únicas de tu región.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="bg-lime-500 hover:bg-lime-600 w-full sm:w-auto px-6 py-3 text-sm sm:text-base">
                Comenzar Exploración
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;