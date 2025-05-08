
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Explorer from "./pages/Explorer";
import Identify from "./pages/Identify";
import SpeciesDetail from "./pages/SpeciesDetail";
import Map from "./pages/Map";
import Species from "./pages/Species";
import Sightings from "./pages/Sightings";
import NewSighting from "./pages/NewSighting";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";
import Login from "./pages/Login";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<Layout />}>
            <Route path="/" element={<Index />} />
            <Route path="/explorer" element={<Explorer />} />
            <Route path="/identify" element={<Identify />} />
            <Route path="/species" element={<Species />} />
            <Route path="/species/:id" element={<SpeciesDetail />} />
            <Route path="/map" element={<Map />} />
            <Route path="/sightings" element={<Sightings />} />
            <Route path="/sightings/new" element={<NewSighting />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
