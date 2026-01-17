import React from "react";
import { Leaf, ChevronRight, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";

const ecosystemData = [
  {
    id: 1,
    title: "Insectos",
    count: "6,355 Especies",
    image: "public/images/hero-img-3.png",
    className: "md:col-span-2 md:row-span-1",
    taxon: "Insecta"
  },
  {
    id: 2,
    title: "Mamíferos",
    subtitle: "Explora animales con base en su taxonomía, hábitat, dieta y estilo de vida",
    count: "36,073 Especies",
    image: "https://plus.unsplash.com/premium_photo-1661947474212-151e08a94a33?q=80&w=892&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    className: "md:col-span-2 md:row-span-2",
    featured: false,
    taxon: "Mammalia" // All animalia
  },
  {
    id: 3,
    title: "Plantas",
    count: "Plantas",
    image: "https://images.unsplash.com/photo-1567991722999-74f27f53f33a?q=80&w=386&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    className: "md:col-span-1 md:row-span-2",
    taxon: "Plantae"
  },
  {
    id: 4,
    title: "Aves",
    count: "10,363 Especies",
    image: "https://plus.unsplash.com/premium_photo-1729791088946-c3994880b47c?q=80&w=455&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    className: "md:col-span-1 md:row-span-1",
    taxon: "Aves"
  },
  {
    id: 5,
    title: "Anfibios",
    count: "3,424 Especies",
    image: "public/images/hero-img-6.png  ",
    className: "md:col-span-2 md:row-span-1",
    taxon: "Amphibia"
  },
  {
    id: 6,
    title: "Reptiles",
    count: "5,892 Especies",
    image: "https://images.unsplash.com/photo-1661481072791-1df445889e4b?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    className: "md:col-span-1 md:row-span-1",
    taxon: "Reptilia"
  }
];

const EcosystemCard = ({ item, index }: { item: any; index: number }) => {
  const location = useLocation();
  const searchParams = new URLSearchParams();
  if (item.taxon) searchParams.set("iconic_taxa", item.taxon);

  return (
    <Link
      to={`/explorer?${searchParams.toString()}`}
      state={{ from: location }}
      className={item.className}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="relative overflow-hidden rounded-3xl group cursor-pointer h-full min-h-[220px] border border-white/10"
      >
        {/* Background Image with Zoom Effect */}
        <div className="absolute inset-0 z-0">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
          {/* Dynamic Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/0 to-transparent group-hover:via-black/50 transition-colors duration-300" />
        </div>

        {/* Glassmorphism Border Overlay on Hover */}
        <div className="absolute inset-0 border-2 border-lime-500/0 group-hover:border-lime-500/30 rounded-3xl transition-all duration-300 pointer-events-none z-20" />

        {/* Content */}
        <div className="relative z-10 h-full p-6 md:p-8 flex flex-col justify-end text-white">
          {item.featured ? (
            <div className="space-y-4">
              <motion.div
                initial={{ scale: 0.8 }}
                whileInView={{ scale: 1 }}
                className="inline-flex p-3 bg-lime-500/20 backdrop-blur-md rounded-2xl border border-white/20 mb-2"
              >
                <Leaf className="h-6 w-6 text-lime-400" />
              </motion.div>
              <h2 className="text-3xl lg:text-5xl font-heading font-bold tracking-tight leading-tight">
                {item.title}
              </h2>
              <p className="text-sm lg:text-base max-w-md opacity-80 font-sans leading-relaxed">
                {item.subtitle}
              </p>
              <div className="flex items-center gap-3">
                <span className="text-xl font-heading font-bold text-lime-400">{item.count}</span>
                <div className="h-1 w-12 bg-lime-500/30 rounded-full" />
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              
              <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                <p className="text-xl lg:text-2xl font-heading font-bold  group-hover:text-lime-400 transition-colors">{item.title}</p>
                <ArrowRight className="h-4 w-4 text-lime-400" />
              </div>
              {/* Default count display when not hovered */}
              <p className="text-xl lg:text-2xl font-heading font-bold group-hover:opacity-0 transition-opacity">
                {item.title}
              </p>
            </div>
          )}
        </div>

        {/* Decorative Shine Effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      </motion.div>
    </Link>
  );
};

const EcosystemGridGallery = () => {
  return (
    <section className="py-8 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-l-4 border-lime-500 pl-4 md:pl-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-lime-600 font-semibold text-sm uppercase tracking-wider">
            <Leaf className="h-4 w-4" />
            <span>Naturaleza Viva</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-forest-900">
            Explora por Ecosistema
          </h2>
          <p className="text-forest-600 max-w-xl">
            Sumérgete en la vasta biodiversidad del planeta filtrada por categorías taxonómicas y ecosistemas vitales.
          </p>
        </div>
        <button className="flex items-center gap-2 text-lime-600 hover:text-lime-700 font-bold group">
          Ver todos los grupos
          <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Mosaic Grid Container */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 auto-rows-[250px] gap-4 lg:gap-6">
        {ecosystemData.map((item, index) => (
          <EcosystemCard key={item.id} item={item} index={index} />
        ))}
      </div>
    </section>
  );
};

export default EcosystemGridGallery;
