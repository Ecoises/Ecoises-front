import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Mail, Github, Linkedin, Bird, Users, MapPin, Camera } from "lucide-react";

const About = () => {
  const teamMembers = [
    {
      name: "María González",
      role: "Fundadora & CEO",
      bio: "Bióloga especializada en ornitología con 10 años de experiencia en conservación.",
      avatar: "/placeholder.svg",
      email: "maria@avoga.com",
      github: "mariagonzalez",
      linkedin: "maria-gonzalez"
    },
    {
      name: "Carlos Ruiz",
      role: "CTO",
      bio: "Desarrollador full-stack apasionado por la tecnología aplicada a la conservación.",
      avatar: "/placeholder.svg",
      email: "carlos@avoga.com",
      github: "carlosruiz",
      linkedin: "carlos-ruiz"
    },
    {
      name: "Ana Morales",
      role: "Científica de Datos",
      bio: "Especialista en machine learning e inteligencia artificial para reconocimiento de especies.",
      avatar: "/placeholder.svg",
      email: "ana@avoga.com",
      github: "anamorales",
      linkedin: "ana-morales"
    },
    {
      name: "Diego López",
      role: "Diseñador UX/UI",
      bio: "Diseñador enfocado en crear experiencias intuitivas para la observación de aves.",
      avatar: "/placeholder.svg",
      email: "diego@avoga.com",
      github: "diegolopez",
      linkedin: "diego-lopez"
    }
  ];

  const features = [
    {
      icon: <Camera className="h-8 w-8 text-primary" />,
      title: "Identificación por IA",
      description: "Identifica especies de aves instantáneamente usando fotografías y nuestra avanzada tecnología de inteligencia artificial."
    },
    {
      icon: <MapPin className="h-8 w-8 text-primary" />,
      title: "Mapeo Geográfico",
      description: "Registra la ubicación exacta de tus avistamientos y contribuye a mapas globales de biodiversidad."
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Comunidad Global",
      description: "Conecta con otros observadores de aves, comparte experiencias y aprende de expertos en ornitología."
    },
    {
      icon: <Bird className="h-8 w-8 text-primary" />,
      title: "Base de Datos Completa",
      description: "Accede a información detallada de miles de especies de aves con datos científicos actualizados."
    }
  ];

  return (
    <div className="space-y-12 animate-fade-in">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-6xl font-bold text-foreground">
          Sobre <span className="text-primary">Avoga</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Avoga es una plataforma innovadora que combina tecnología avanzada con la pasión por la observación de aves, 
          creando una comunidad global dedicada a la conservación y el estudio de la biodiversidad aviar.
        </p>
      </div>

      {/* Mission Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-center">Nuestra Misión</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-lg text-muted-foreground">
            Democratizar el acceso al conocimiento ornitológico y facilitar la contribución ciudadana 
            a la ciencia de la conservación a través de tecnología intuitiva y accesible.
          </p>
          <p className="text-muted-foreground">
            Creemos que cada observador de aves, desde principiantes hasta expertos, puede contribuir 
            significativamente al entendimiento y conservación de las especies aviares. Nuestra plataforma 
            elimina las barreras técnicas y hace que la identificación de aves sea precisa, rápida y educativa.
          </p>
        </CardContent>
      </Card>

      {/* Features Section */}
      <div className="space-y-8">
        <h2 className="text-3xl font-bold text-center">¿Qué hace especial a Avoga?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="card-hover">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Team Section */}
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold">Nuestro Equipo</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Un equipo multidisciplinario de biólogos, desarrolladores y diseñadores 
            unidos por la pasión por las aves y la tecnología.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((member, index) => (
            <Card key={index} className="card-hover">
              <CardContent className="p-6 text-center space-y-4">
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
                  <a href={`mailto:${member.email}`} className="text-muted-foreground hover:text-primary">
                    <Mail className="h-4 w-4" />
                  </a>
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

      {/* Contact Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-center">Contáctanos</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-lg text-muted-foreground">
            ¿Tienes preguntas, sugerencias o quieres colaborar con nosotros?
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <div className="flex items-center space-x-2">
              <Mail className="h-5 w-5 text-primary" />
              <span>contacto@avoga.com</span>
            </div>
            <div className="flex items-center space-x-2">
              <Github className="h-5 w-5 text-primary" />
              <span>github.com/avoga</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default About;