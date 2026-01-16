
import { Link } from "react-router-dom";
import { Bird, Brain } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const birdGallery = [
  {
    id: 1,
    name: "Flamingo",
    image: "https://inaturalist-open-data.s3.amazonaws.com/photos/123574818/large.jpg",
    funFact: "Flamingos get their pink coloration from the beta-carotene in their diet of brine shrimp and blue-green algae.",
    habitat: "Salt lakes, lagoons",
    lifespan: "20-30 years",
    wingspan: "95-100 cm"
  },
  {
    id: 2,
    name: "Barn Owl",
    image: "https://inaturalist-open-data.s3.amazonaws.com/photos/48987498/medium.jpeg",
    funFact: "Barn Owls can detect and capture prey in complete darkness using only their hearing, which is so precise they can locate mice under snow or vegetation.",
    habitat: "Open grasslands, farms",
    lifespan: "4-10 years",
    wingspan: "80-95 cm"
  },
  
  
];

const FlippingCard = ({ bird, isIntro = false }) => {
  if (isIntro) {
    return (
      <div className="h-64 md:h-80">
        <div className="relative w-full h-full [perspective:1000px] group">
          <div className="relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
            {/* Front side */}
            <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] bg-lime-500 text-white rounded-xl p-6 flex flex-col justify-center">
              <h3 className="font-heading font-bold text-xl md:text-2xl mb-2">Especies fascinantes</h3>
              <p>Descubre la diversidad hermosa de las especies de aves del mundo</p>
            </div>

            {/* Back side */}
            <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] bg-forest-800 text-white rounded-xl p-6 flex flex-col justify-center">
              <h3 className="font-heading font-bold text-xl md:text-2xl mb-2">Conservación de las aves</h3>
              <p>Aprende cómo puedes ayudar a proteger estas maravillosas criaturas y sus hábitats</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-64 md:h-80">
      <div className="relative w-full h-full [perspective:1000px] group">
        <div className="relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
          {/* Front side - Image */}
          <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] rounded-xl overflow-hidden">
            <AspectRatio ratio={1}>
              <img
                src={bird.image}
                alt={bird.name}
                className="object-cover w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                <div className="text-white">
                  <h3 className="font-heading font-bold text-lg md:text-xl mb-3">{bird.name}</h3>
                </div>
              </div>
            </AspectRatio>
          </div>

          {/* Back side - Information */}
          <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] bg-forest-800 text-white rounded-xl p-6 flex flex-col justify-center">
            <h3 className="font-heading font-bold text-xl ">{bird.name}</h3>
             <p className="italic text-base  flex items-center  mb-3">Nombre Cientifico</p>
            <p className="">{bird.funFact}</p>

          </div>
        </div>
      </div>
    </div>
  );
};

const SpeciesGallery = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 mt-4">
          <div className="p-2 bg-gradient-to-br from-lime-500 to-lime-600 rounded-xl shadow-lg shadow-lime-500/20">
            <Brain className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-heading font-bold text-forest-900">
              ¿Sabias que?
            </h2>
            <p className="text-sm text-forest-600">Datos interesantes del día</p>
          </div>
        </div>
      </div>

      {/* Mobile view - carousel */}
      <div className="block md:hidden">
        <Carousel className="w-full">
          <CarouselContent>
            <CarouselItem>
              <FlippingCard bird={null} isIntro={true} />
            </CarouselItem>
            {birdGallery.map((bird) => (
              <CarouselItem key={bird.id}>
                <FlippingCard bird={bird} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="-left-4" />
          <CarouselNext className="-right-4" />
        </Carousel>
      </div>

      {/* Desktop view - grid */}
      <div className="hidden md:grid grid-cols-3 gap-4">
        <FlippingCard bird={null} isIntro={true} />
        {birdGallery.slice(0, 5).map((bird) => (
          <FlippingCard key={bird.id} bird={bird} />
        ))}
      </div>
    </div>
  );
};

export default SpeciesGallery;
