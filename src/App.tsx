 
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import LandingPage from "./pages/LandingPage";
import Explorer from "./pages/tools/Explorer";
import Identify from "./pages/tools/Identify";
import SpeciesDetail from "./pages/species/SpeciesDetail";
import Map from "./pages/tools/Map";
import Species from "./pages/species/Species";
import Sightings from "./pages/sightings/Sightings";
import NewSighting from "./pages/sightings/NewSighting";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";
import Login from "./pages/auth/Login";
import GoogleCallback from "./pages/auth/GoogleCallback";
import About from "./pages/About";
import Learn from "./pages/learning/Learn";
import LearningPath from "./pages/learning/LearningPath";
import Lesson from "./pages/learning/Lesson";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/auth/callback" element={<GoogleCallback />} />
          <Route element={<Layout />}>
            <Route path="/home" element={<Dashboard />} />
            <Route path="/explorer" element={<Explorer />} />
            <Route path="/identify" element={<Identify />} />
            <Route path="/species" element={<Species />} />
            <Route path="/species/:id" element={<SpeciesDetail />} />
            <Route path="/map" element={<Map />} />
            <Route path="/sightings" element={<Sightings />} />
            <Route path="/sightings/new" element={<NewSighting />} />
            <Route path="/about" element={<About />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/learn/path/:pathId" element={<LearningPath />} />
            <Route path="/learn/lesson/:lessonId" element={<Lesson />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
