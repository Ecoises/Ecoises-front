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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <section className="relative rounded-3xl overflow-hidden bg-forest-900">
      {/* Background Images */}
      <div className="absolute inset-0 z-0">
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
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
      </div>
      
      {/* Content Container */}
      <div className={`
        relative z-10 flex items-center 
        h-auto           /* En móvil se ajusta al contenido */
        lg:h-[330px]     /* En pantallas grandes vuelve a tu alto original */
        py-12            /* Espacio interno para que el texto respire en móvil */
        md:py-0          /* Quitamos el padding en desktop porque el alto es fijo */
        px-8 sm:px-12 lg:px-20
      `}>
        
        <div className="max-w-2xl w-full">
          {/* Título optimizado */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-[1.2] tracking-tight">
            Descubre y Protege <br className="hidden sm:block" />
            <span className="text-lime-400"> 
              la Biodiversidad Local
            </span>
          </h1>
          
          {/* Descripción: Se oculta en móvil para ahorrar espacio */}
          <p className="hidden sm:block mt-4 text-lg text-white/90 leading-relaxed max-w-xl">
            Únete a la aventura interactiva de conservación. Aprende, explora y protege las especies únicas de tu región.
          </p>
          
          {/* Botón: Solo visible en desktop, alineado con el alto de 330px */}
          <div className="hidden sm:flex mt-6">
            <Button className="bg-lime-500 hover:bg-lime-600 px-8 py-5 text-base font-bold shadow-lg">
              Comenzar Exploración
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;