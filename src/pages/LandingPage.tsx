import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Camera, 
  MapPin, 
  Users, 
  Bird, 
  Github, 
  Linkedin, 
  Mail,
  ArrowRight,
  Play,
  Star,
  Globe
} from "lucide-react";

const LandingPage = () => {
  const teamMembers = [
    {
      name: "María González",
      role: "Fundadora & CEO",
      bio: "Bióloga especializada en ornitología con 10 años de experiencia en conservación.",
      avatar: "/placeholder.svg",
      github: "mariagonzalez",
      linkedin: "maria-gonzalez"
    },
    {
      name: "Carlos Ruiz",
      role: "CTO",
      bio: "Desarrollador full-stack apasionado por la tecnología aplicada a la conservación.",
      avatar: "/placeholder.svg",
      github: "carlosruiz",
      linkedin: "carlos-ruiz"
    },
    {
      name: "Ana Morales",
      role: "Científica de Datos",
      bio: "Especialista en machine learning e inteligencia artificial para reconocimiento de especies.",
      avatar: "/placeholder.svg",
      github: "anamorales",
      linkedin: "ana-morales"
    },
    {
      name: "Diego López",
      role: "Diseñador UX/UI",
      bio: "Diseñador enfocado en crear experiencias intuitivas para la observación de aves.",
      avatar: "/placeholder.svg",
      github: "diegolopez",
      linkedin: "diego-lopez"
    }
  ];

  const features = [
    {
      icon: <Camera className="h-12 w-12 text-primary" />,
      title: "Identificación por IA",
      description: "Identifica especies de aves instantáneamente usando fotografías y nuestra avanzada tecnología de inteligencia artificial."
    },
    {
      icon: <MapPin className="h-12 w-12 text-primary" />,
      title: "Mapeo Geográfico",
      description: "Registra la ubicación exacta de tus avistamientos y contribuye a mapas globales de biodiversidad."
    },
    {
      icon: <Users className="h-12 w-12 text-primary" />,
      title: "Comunidad Global",
      description: "Conecta con otros observadores de aves, comparte experiencias y aprende de expertos en ornitología."
    },
    {
      icon: <Bird className="h-12 w-12 text-primary" />,
      title: "Base de Datos Completa",
      description: "Accede a información detallada de miles de especies de aves con datos científicos actualizados."
    }
  ];

  const stats = [
    { number: "50K+", label: "Usuarios activos" },
    { number: "200K+", label: "Aves identificadas" },
    { number: "1,500+", label: "Especies catalogadas" },
    { number: "95%", label: "Precisión en identificación" }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Bird className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">Avoga</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-muted-foreground hover:text-foreground">Características</a>
              <a href="#team" className="text-muted-foreground hover:text-foreground">Equipo</a>
              <a href="#contact" className="text-muted-foreground hover:text-foreground">Contacto</a>
              <Link to="/login">
                <Button>Probar App</Button>
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
                  <Star className="h-3 w-3 mr-1" />
                  Tecnología de vanguardia
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold tracking-tight">
                  La revolución en la
                  <span className="text-primary block">observación de aves</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-lg">
                  Identifica, registra y explora el mundo de las aves con inteligencia artificial avanzada y una comunidad global de observadores.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/app">
                  <Button size="lg" className="gap-2">
                    Comenzar gratis
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="gap-2">
                  <Play className="h-4 w-4" />
                  Ver demo
                </Button>
              </div>
            </div>
            <div className="flex justify-center lg:justify-end">
              <img
                src="/images/ilustracion.svg"
                alt="Avoga - Observación de aves"
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
              Características revolucionarias
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Avoga combina tecnología de vanguardia con la pasión por la observación de aves
              para crear una experiencia única e innovadora.
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

      {/* Team Section */}
      <section id="team" className="py-20 bg-muted/50">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold">
              Conoce nuestro equipo
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Un equipo multidisciplinario de biólogos, desarrolladores y diseñadores 
              unidos por la pasión por las aves y la tecnología.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-8 text-center space-y-4">
                  <Avatar className="h-24 w-24 mx-auto">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback className="text-lg">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">{member.name}</h3>
                    <Badge variant="secondary">{member.role}</Badge>
                    <p className="text-sm text-muted-foreground">{member.bio}</p>
                  </div>
                  <div className="flex justify-center space-x-3">
                    <a href={`https://github.com/${member.github}`} className="text-muted-foreground hover:text-primary">
                      <Github className="h-4 w-4" />
                    </a>
                    <a href={`https://linkedin.com/in/${member.linkedin}`} className="text-muted-foreground hover:text-primary">
                      <Linkedin className="h-4 w-4" />
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="max-w-4xl mx-auto border-0 shadow-2xl">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-3xl lg:text-4xl font-bold mb-4">
                ¿Listo para comenzar?
              </CardTitle>
              <p className="text-xl text-muted-foreground">
                Únete a nuestra comunidad global de observadores de aves y contribuye 
                a la conservación de la biodiversidad.
              </p>
            </CardHeader>
            <CardContent className="text-center space-y-8">
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/app">
                  <Button size="lg" className="gap-2">
                    <Globe className="h-4 w-4" />
                    Probar Avoga gratis
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="gap-2">
                  <Mail className="h-4 w-4" />
                  Contáctanos
                </Button>
              </div>
              <div className="flex flex-col sm:flex-row justify-center items-center gap-6 text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>contacto@avoga.com</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Github className="h-4 w-4" />
                  <span>github.com/avoga</span>
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
              <span className="text-xl font-bold">Avoga</span>
            </div>
            <p className="text-muted-foreground text-center md:text-right">
              © 2024 Avoga. Todos los derechos reservados. Hecho con ❤️ para la conservación.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;