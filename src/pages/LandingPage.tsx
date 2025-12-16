import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Camera,
  MapPin,
  Users,
  Bird,
  Mail,
  ArrowRight,
  Database,
  Leaf,
  Globe,
  Search,
  BookOpen
} from "lucide-react";

const LandingPage = () => {
  const features = [
    {
      icon: <Search className="h-12 w-12 text-primary" />,
      title: "Exploración de Especies",
      description: "Accede a una base de datos completa con información científica detallada de miles de especies de aves y su estado de conservación."
    },
    {
      icon: <Camera className="h-12 w-12 text-primary" />,
      title: "Registro de Observaciones",
      description: "Documenta tus avistamientos con fotografías, ubicación geográfica y contribuye al conocimiento científico global."
    },
    {
      icon: <MapPin className="h-12 w-12 text-primary" />,
      title: "Mapeo de Distribución",
      description: "Visualiza patrones de distribución geográfica de especies y descubre áreas de alta biodiversidad en tiempo real."
    },
    {
      icon: <Users className="h-12 w-12 text-primary" />,
      title: "Ciencia Ciudadana",
      description: "Únete a una comunidad global de observadores y científicos comprometidos con la conservación de la biodiversidad."
    }
  ];

  const stats = [
    { number: "15,000+", label: "Especies documentadas" },
    { number: "2.5M+", label: "Observaciones registradas" },
    { number: "180+", label: "Países con datos" },
    { number: "50K+", label: "Contribuidores activos" }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Bird className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">Ecoises</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-muted-foreground hover:text-foreground">Características</a>
              <a href="#contact" className="text-muted-foreground hover:text-foreground">Contacto</a>
              <Link to="/login">
                <Button>Acceder</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 lg:py-32">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="secondary" className="w-fit">
                  <Leaf className="h-3 w-3 mr-1" />
                  Plataforma Científica de Biodiversidad
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold tracking-tight">
                  Explora y Documenta la
                  <span className="text-primary block">Biodiversidad del Planeta</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-lg">
                  Contribuye al conocimiento científico global registrando observaciones de especies,
                  explorando patrones de distribución y participando en la conservación de la biodiversidad.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/app">
                  <Button size="lg" className="gap-2">
                    <Search className="h-4 w-4" />
                    Explorar Especies
                  </Button>
                </Link>
                <Link to="/app">
                  <Button size="lg" variant="outline" className="gap-2">
                    <Camera className="h-4 w-4" />
                    Registrar Observación
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex justify-center lg:justify-end">
              <img
                src="/images/ilustracion.svg"
                alt="Ecoises - Sistema de Biodiversidad"
                className="max-w-md lg:max-w-lg w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/50">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold">
              Herramientas para la Ciencia y Conservación
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Ecoises combina tecnología avanzada con ciencia ciudadana para crear
              una plataforma integral de documentación y estudio de la biodiversidad.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-8 text-center space-y-4">
                  <div className="flex justify-center">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-muted/50">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="max-w-4xl mx-auto border-0 shadow-2xl">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-3xl lg:text-4xl font-bold mb-4">
                Únete a la Comunidad Científica
              </CardTitle>
              <p className="text-xl text-muted-foreground">
                Contribuye al conocimiento global de la biodiversidad. Cada observación
                cuenta para la ciencia y la conservación de nuestro planeta.
              </p>
            </CardHeader>
            <CardContent className="text-center space-y-8">
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/app">
                  <Button size="lg" className="gap-2">
                    <Database className="h-4 w-4" />
                    Explorar Plataforma
                  </Button>
                </Link>
                <Link to="/app">
                  <Button size="lg" variant="outline" className="gap-2">
                    <BookOpen className="h-4 w-4" />
                    Guía de Inicio
                  </Button>
                </Link>
              </div>
              <div className="flex flex-col sm:flex-row justify-center items-center gap-6 text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>contacto@ecoises.com</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Globe className="h-4 w-4" />
                  <span>Plataforma Global de Biodiversidad</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Bird className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">Ecoises</span>
            </div>
            <p className="text-muted-foreground text-center md:text-right">
              © 2024 Ecoises. Todos los derechos reservados. Hecho con ❤️ para la conservación.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;