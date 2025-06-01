
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <div className="relative rounded-lg overflow-hidden mx-auto my-6">
      <div className="bg-lime-100 rounded-lg">
        <div className="container max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-6 md:mb-0">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-forest-950 mb-4">
              Bienvenido a Avoga
            </h1>
            <p className="text-forest-700 text-base sm:text-lg mb-6">
              Track, explore, and discover the fascinating world of birds
            </p>
          </div>
          <div className="md:w-1/2 flex justify-center md:justify-end hidden md:flex">
            <img
              src="/images/ilustracion.svg"
              alt="Bird illustration"
              className="max-h-72 md:max-h-80 object-contain w-[340px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
