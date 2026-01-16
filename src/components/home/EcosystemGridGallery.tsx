import React from "react";
import { Leaf } from "lucide-react";

const ecosystemData = [
  {
    id: 1,
    title: "MAMÍFEROS",
    count: "6355 Especies",
    image: "https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?w=800&q=80",
    gridArea: "mamiferos"
  },
  {
    id: 2,
    title: "REINO ANIMALIA",
    subtitle: "Explora animales con base en su taxonomía, hábitat, dieta, estilo de vida y más",
    count: "36073 Especies",
    image: "https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=800&q=80",
    gridArea: "centro",
    featured: true
  },
  {
    id: 3,
    title: "MOLUSCOS",
    count: "4910 Especies",
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80",
    gridArea: "moluscos"
  },
  {
    id: 4,
    title: "AVES",
    count: "10363 Especies",
    image: "https://images.unsplash.com/photo-1551771331-14eb264b5542?w=800&q=80",
    gridArea: "aves"
  },
  {
    id: 5,
    title: "ANFIBIOS",
    count: "3424 Especies",
    image: "https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=800&q=80",
    gridArea: "anfibios"
  },
  {
    id: 6,
    title: "REPTILES",
    count: "5892 Especies",
    image: "https://images.unsplash.com/photo-1531386151447-fd76ad50012f?w=800&q=80",
    gridArea: "reptiles"
  }
];

const EcosystemCard = ({ item }) => {
  return (
    <div
      style={{ gridArea: item.gridArea }}
      className="relative overflow-hidden rounded-2xl group cursor-pointer transition-transform duration-300 hover:scale-[1.02]"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full p-6 flex flex-col justify-end text-white">
        {item.featured ? (
          <div className="text-center space-y-3">
            <div className="inline-block p-3 bg-yellow-400 rounded-full mb-2">
              <Leaf className="h-6 w-6 text-forest-900" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-wide">
              {item.title}
            </h2>
            <p className="text-sm md:text-base max-w-md mx-auto opacity-90">
              {item.subtitle}
            </p>
            <p className="text-lg font-semibold italic">{item.count}</p>
          </div>
        ) : (
          <>
            <h3 className="text-2xl md:text-3xl font-bold mb-2 tracking-wide">
              {item.title}
            </h3>
            <p className="text-sm font-medium">{item.count}</p>
          </>
        )}
      </div>

      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-lime-500/0 group-hover:bg-lime-500/10 transition-colors duration-300" />
    </div>
  );
};

const EcosystemGridGallery = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-lime-500 to-lime-600 rounded-xl shadow-lg shadow-lime-500/20">
            <Leaf className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-heading font-bold text-forest-900">
              Explora por Ecosistema
            </h2>
            <p className="text-sm text-forest-600">Descubre la biodiversidad del planeta</p>
          </div>
        </div>
      </div>

      {/* Mobile - Single Column Stack */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {ecosystemData.map((item) => (
          <div key={item.id} className="h-64">
            <EcosystemCard item={item} />
          </div>
        ))}
      </div>

      {/* Desktop - Asymmetric Grid Layout */}
      <div 
        className="hidden md:grid gap-4"
        style={{
          gridTemplateColumns: 'repeat(5, 1fr)',
          gridTemplateRows: 'repeat(3, 220px)',
          gridTemplateAreas: `
            "mamiferos mamiferos centro centro moluscos"
            "aves aves centro centro moluscos"
            "aves aves anfibios anfibios reptiles"
          `
        }}
      >
        {ecosystemData.map((item) => (
          <EcosystemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default EcosystemGridGallery;