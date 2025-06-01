
import { Link } from "react-router-dom";
import { Bird } from "lucide-react";
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
    image: "https://images.unsplash.com/photo-1497206365907-f5e630693df0?auto=format&fit=crop&w=500&h=500",
    funFact: "Flamingos get their pink coloration from the beta-carotene in their diet of brine shrimp and blue-green algae.",
    habitat: "Salt lakes, lagoons",
    lifespan: "20-30 years",
    wingspan: "95-100 cm"
  },
  {
    id: 2,
    name: "Barn Owl",
    image: "https://images.unsplash.com/photo-1548430075-47e8ecb8c55b?auto=format&fit=crop&w=500&h=500",
    funFact: "Barn Owls can detect and capture prey in complete darkness using only their hearing, which is so precise they can locate mice under snow or vegetation.",
    habitat: "Open grasslands, farms",
    lifespan: "4-10 years",
    wingspan: "80-95 cm"
  },
  {
    id: 3,
    name: "Peacock",
    image: "https://images.unsplash.com/photo-1602170284347-f9c28856c744?auto=format&fit=crop&w=500&h=500",
    funFact: "A peacock's tail feathers (known as a train) make up about 60% of its body length and contain a complex pattern of eyespots that help attract mates.",
    habitat: "Forests, grasslands",
    lifespan: "10-25 years",
    wingspan: "130-160 cm"
  },
  {
    id: 4,
    name: "Toucan",
    image: "https://images.unsplash.com/photo-1551085254-e96b210db58a?auto=format&fit=crop&w=500&h=500",
    funFact: "Despite its large size, a toucan's beak is lightweight and made of keratin with a hollow honeycomb structure inside, which helps regulate body temperature.",
    habitat: "Tropical rainforests",
    lifespan: "12-20 years",
    wingspan: "43-52 cm"
  },
  {
    id: 5,
    name: "Hummingbird",
    image: "https://images.unsplash.com/photo-1590143640485-b927afbc3d42?auto=format&fit=crop&w=500&h=500",
    funFact: "Hummingbirds are the only birds that can fly backwards and hover in mid-air. Their wings beat about 70 times per second!",
    habitat: "Gardens, forests",
    lifespan: "3-5 years",
    wingspan: "8-10 cm"
  }
];

const FlippingCard = ({ bird, isIntro = false }) => {
  if (isIntro) {
    return (
      <div className="h-64 md:h-80">
        <div className="relative w-full h-full [perspective:1000px] group">
          <div className="relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
            {/* Front side */}
            <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] bg-lime-500 text-white rounded-xl p-6 flex flex-col justify-center">
              <h3 className="font-heading font-bold text-xl md:text-2xl mb-2">Fascinating Birds</h3>
              <p>Discover the beautiful diversity of bird species from around the world</p>
            </div>
            
            {/* Back side */}
            <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] bg-forest-800 text-white rounded-xl p-6 flex flex-col justify-center">
              <h3 className="font-heading font-bold text-xl md:text-2xl mb-2">Bird Conservation</h3>
              <p>Learn how you can help protect these amazing creatures and their habitats</p>
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
                  <h3 className="font-heading font-bold text-lg md:text-xl">{bird.name}</h3>
                </div>
              </div>
            </AspectRatio>
          </div>
          
          {/* Back side - Information */}
          <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] bg-white border border-lime-200 rounded-xl p-6 flex flex-col justify-center">
            <h3 className="font-heading font-bold text-lg text-forest-900 mb-3">{bird.name}</h3>
            <p className="text-sm text-forest-700 mb-4 line-clamp-3">{bird.funFact}</p>
            <div className="space-y-2 text-xs text-forest-600">
              <div><span className="font-medium">Habitat:</span> {bird.habitat}</div>
              <div><span className="font-medium">Lifespan:</span> {bird.lifespan}</div>
              <div><span className="font-medium">Wingspan:</span> {bird.wingspan}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SpeciesGallery = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bird className="h-5 w-5 text-lime-600" />
          <h2 className="text-xl font-heading font-bold text-forest-900">Fascinating Species</h2>
        </div>
        <Link to="/species" className="text-lime-600 hover:text-lime-700 text-sm font-medium">
          Discover More Birds
        </Link>
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
