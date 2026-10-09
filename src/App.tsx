import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import ScrollToTop from "./components/ScrollToTop";

// Cada página se descarga solo cuando se visita (code splitting).
const Dashboard = lazy(() => import("./pages/Dashboard"));
const About = lazy(() => import("./pages/About"));
const AnnouncementDetail = lazy(() => import("./pages/AnnouncementDetail"));
const Certificate = lazy(() => import("./pages/Certificate"));
const Feedback = lazy(() => import("./pages/Feedback"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Profile = lazy(() => import("./pages/Profile"));
// Autenticación
const Login = lazy(() => import("./pages/auth/Login"));
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/auth/ResetPassword"));
// Biodiversidad
const Explorer = lazy(() => import("./pages/species/Explorer"));
const Species = lazy(() => import("./pages/species/Species"));
const SpeciesDetail = lazy(() => import("./pages/species/SpeciesDetail"));
// Retos de campo y avistamientos
const Challenges = lazy(() => import("./pages/challenges/Challenges"));
const ChallengeDetail = lazy(() => import("./pages/challenges/ChallengeDetail"));
const ObservationCreate = lazy(() => import("./pages/observations/ObservationCreate"));
const ObservationDetail = lazy(() => import("./pages/observations/ObservationDetail"));
const ObservationEdit = lazy(() => import("./pages/observations/ObservationEdit"));
// Aprendizaje
const Learn = lazy(() => import("./pages/learn/Learn"));
const CourseDetail = lazy(() => import("./pages/learn/CourseDetail"));
const ArticleDetail = lazy(() => import("./pages/learn/ArticleDetail"));
const ResourceDetail = lazy(() => import("./pages/learn/ResourceDetail"));
const LessonPlayer = lazy(() => import("./pages/learn/LessonPlayer"));
// Legal
const TermsOfService = lazy(() => import("./pages/legal/TermsOfService"));
const PrivacyPolicy = lazy(() => import("./pages/legal/PrivacyPolicy"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Evita repetir peticiones al cambiar de pestaña o volver a una página reciente.
      staleTime: 60 * 1000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lime-600" />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <ScrollToTop />
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Acceso (solo sin sesión) */}
              <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
              <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
              <Route path="/reset-password" element={<PublicRoute><ResetPassword /></PublicRoute>} />

              {/* Páginas públicas */}
              <Route element={<Layout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/home" element={<Navigate to="/" replace />} />
                <Route path="/announcements/:slug" element={<AnnouncementDetail />} />

                <Route path="/explorer" element={<Explorer />} />
                <Route path="/taxa" element={<Species />} />
                <Route path="/taxa/:id" element={<SpeciesDetail />} />

                <Route path="/retos" element={<Challenges />} />
                <Route path="/retos/:id" element={<ChallengeDetail />} />
                <Route path="/observations/:id" element={<ObservationDetail />} />

                <Route path="/learn" element={<Learn />} />
                <Route path="/learn/course/:slug" element={<CourseDetail />} />
                <Route path="/learn/article/:slug" element={<ArticleDetail />} />
                <Route path="/learn/resource/:slug" element={<ResourceDetail />} />
                <Route path="/certificates/:verificationCode" element={<Certificate />} />

                <Route path="/about" element={<About />} />
                <Route path="/feedback" element={<Feedback />} />
                <Route path="/terms" element={<TermsOfService />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />

                {/* Rutas antiguas de la versión tipo iNaturalist */}
                <Route path="/sightings" element={<Navigate to="/retos" replace />} />
                <Route path="/sightings/new" element={<Navigate to="/observations/create" replace />} />
              </Route>

              {/* Páginas que requieren sesión */}
              <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                <Route path="/learn/course/:courseSlug/lesson/:lessonSlug" element={<LessonPlayer />} />
                <Route path="/observations/create" element={<ObservationCreate />} />
                <Route path="/observations/edit/:id" element={<ObservationEdit />} />
                <Route path="/profile" element={<Profile />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
