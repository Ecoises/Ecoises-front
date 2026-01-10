import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import LandingPage from "./pages/LandingPage";
import Explorer from "./pages/species/Explorer";
import Identify from "./pages/tools/Identify";
import SpeciesDetail from "./pages/species/SpeciesDetail";
import Map from "./pages/tools/Map";
import Species from "./pages/species/Species";
import Sightings from "./pages/sightings/Sightings";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";
import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import About from "./pages/About";
import ObservationDetail from "./pages/observations/ObservationDetail";
import Learn from "./pages/learn/Learn";
import CourseDetail from "./pages/learn/CourseDetail";
import ArticleDetail from "./pages/learn/ArticleDetail";
import LessonPlayer from "./pages/learn/LessonPlayer";
import EducatorDashboard from "./pages/educator/EducatorDashboard";
import LessonEditor from "./pages/educator/LessonEditor";
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
              <Route path="/observations/:id" element={<ObservationDetail />} />
              <Route path="/about" element={<About />} />

              <Route path="/learn" element={<Learn />} />
              <Route path="/learn/course/:slug" element={<CourseDetail />} />
              <Route path="/learn/article/:slug" element={<ArticleDetail />} />
              <Route path="/learn/course/:courseSlug/lesson/:lessonId" element={<LessonPlayer />} />

              {/* Educator Routes */}
              <Route path="/educator" element={<EducatorDashboard />} />
              <Route path="/educator/new" element={<LessonEditor />} />
              <Route path="/educator/edit/:id" element={<LessonEditor />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
