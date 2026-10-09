
import HeroSection from "@/components/home/HeroSection";
import SpeciesRecommendation from "@/components/home/SpeciesRecommendation";
import DailyFunFacts from "@/components/home/DailyFunFacts";
import EcosystemGridGallery from "@/components/home/EcosystemGridGallery";
import AnnouncementsSection from "@/components/home/AnnouncementsSection";

const Index = () => {
  return (
    <div>

      <div className="space-y-8 animate-fade-in ">
        {/* Hero Section */}
        <HeroSection />

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-forest-950 mb-2">Bienvenido a Ecoises</h1>
            <p className="text-forest-700">Sigue, explora y descubre el fascinante mundo que te rodea.</p>
          </div>
        </div>

        <AnnouncementsSection />

        {/* Species Recommendation */}
        <SpeciesRecommendation />

        {/* Species Gallery with flipping cards */}
        <DailyFunFacts />

        {/* Ecosystem Grid Gallery */}
        <EcosystemGridGallery />

      </div>
    </div>
  );
};

export default Index;
