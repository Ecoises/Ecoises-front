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
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import About from "./pages/About";
import Profile from "./pages/Profile";
import ObservationDetail from "./pages/observations/ObservationDetail";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } />
            <Route path="/forgot-password" element={
              <PublicRoute>
                <ForgotPassword />
              </PublicRoute>
            } />
            <Route path="/reset-password" element={
              <PublicRoute>
                <ResetPassword />
              </PublicRoute>
            } />
            
            <Route element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route path="/home" element={<Dashboard />} />
              <Route path="/explorer" element={<Explorer />} />
              <Route path="/identify" element={<Identify />} />
              <Route path="/species" element={<Species />} />
              <Route path="/species/:id" element={<SpeciesDetail />} />
              <Route path="/map" element={<Map />} />
              <Route path="/sightings" element={<Sightings />} />
              <Route path="/sightings/new" element={<NewSighting />} />
              <Route path="/observations/:id" element={<ObservationDetail />} />
              <Route path="/about" element={<About />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/profile/:userId" element={<Profile />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
