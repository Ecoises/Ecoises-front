
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import DashboardNavbar from "@/components/DashboardNavbar";
import HeroSection from "@/components/home/HeroSection";
import StatsSection from "@/components/home/StatsSection";
import SpeciesRecommendation from "@/components/home/SpeciesRecommendation";
import SpeciesGallery from "@/components/home/SpeciesGallery";
import LeaderboardSection from "@/components/home/LeaderboardSection";
import RecentSightingsSection from "@/components/home/RecentSightingsSection";
import FeaturesSection from "@/components/home/FeaturesSection";

const Index = () => {
  return (
    <div>
      <DashboardNavbar />
      <div className="space-y-8 animate-fade-in p-6">
        {/* Hero Section */}
        <HeroSection />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-forest-950 mb-2">Welcome to Logo Here</h1>
          <p className="text-forest-700">Track, explore, and discover the fascinating world of birds</p>
        </div>
        <Link to="/sightings/new">
          <Button className="bg-lime-500 hover:bg-lime-600 text-white gap-2 rounded-full">
            <Plus className="h-4 w-4" />
            Record Sighting
          </Button>
        </Link>
      </div>
      
      {/* Stats */}
      <StatsSection />
      
      {/* Species Recommendation */}
      <SpeciesRecommendation />
      
      {/* Species Gallery with flipping cards */}
      <SpeciesGallery />
      
      {/* Leaderboard Section */}
      <LeaderboardSection />
      
      {/* Recent Sightings Section */}
      <RecentSightingsSection />
      
        {/* Features */}
        <FeaturesSection />
      </div>
    </div>
  );
};

export default Index;
