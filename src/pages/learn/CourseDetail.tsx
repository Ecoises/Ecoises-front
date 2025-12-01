import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CheckCircle2, Clock, BookOpen, Play } from "lucide-react";

interface CourseModule {
  id: string;
  title: string;
  lessons: string[];
  duration: string;
}

interface Educator {
  name: string;
  avatar: string;
  verified: boolean;
}

interface CourseData {
  id: string;
  title: string;
  description: string;
  image: string;
  duration: string;
  level: string;
  category: string;
  educator: Educator;
  fullDescription: string;
  modules: CourseModule[];
}

const coursesData: Record<string, CourseData> = {
  "1": {
    id: "1",
    title: "Introducción a la Observación de Aves",
    description: "Aprende los conceptos básicos para identificar aves en tu entorno y comenzar tu viaje en el birdwatching.",
    image: "https://images.unsplash.com/photo-1444464666168-49d633b86797?auto=format&fit=crop&w=1200&h=600",
    duration: "2 horas",
    level: "Principiante",
    category: "Fundamentos",
    educator: {
      name: "María Rodríguez",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&h=200",
      verified: true
    },
    fullDescription: "Este curso te introducirá al fascinante mundo de la observación de aves. Aprenderás a identificar especies comunes, entender sus comportamientos básicos y desarrollar las habilidades necesarias para convertirte en un observador competente. Perfecto para quienes se inician en el birdwatching.",
    modules: [
      {
        id: "m1",
        title: "Fundamentos del Birdwatching",
        lessons: [
          "¿Qué es la observación de aves?",
          "Equipamiento básico necesario",
          "Ética del observador de aves"
        ],
        duration: "30 min"
      },
      {
        id: "m2",
        title: "Identificación Básica",
        lessons: [
          "Características principales de las aves",
          "Formas y siluetas",
          "Colores y patrones",
          "Comportamiento y hábitat"
        ],
        duration: "45 min"
      },
      {
        id: "m3",
        title: "Práctica de Campo",
        lessons: [
          "Mejores momentos para observar",
          "Técnicas de observación",
          "Registro de avistamientos"
        ],
        duration: "45 min"
      }
    ]
  },
  "2": {
    id: "2",
    title: "Identificación por Cantos y Llamados",
    description: "Desarrolla tu oído para reconocer las diferentes especies de aves por sus vocalizaciones.",
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=1200&h=600",
    duration: "3 horas",
    level: "Intermedio",
    category: "Técnicas",
    educator: {
      name: "Carlos Mendoza",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200",
      verified: true
    },
    fullDescription: "Aprende a identificar aves por sus vocalizaciones. Este curso te enseñará las técnicas para reconocer cantos y llamados, entender sus patrones y desarrollar tu memoria auditiva para convertirte en un experto en identificación sonora.",
    modules: [
      {
        id: "m1",
        title: "Introducción a las Vocalizaciones",
        lessons: [
          "Tipos de vocalizaciones aviares",
          "Anatomía del canto",
          "Diferencias entre cantos y llamados"
        ],
        duration: "40 min"
      },
      {
        id: "m2",
        title: "Técnicas de Reconocimiento",
        lessons: [
          "Patrones sonoros comunes",
          "Memoria auditiva",
          "Uso de aplicaciones de identificación"
        ],
        duration: "50 min"
      },
      {
        id: "m3",
        title: "Especies Comunes de Colombia",
        lessons: [
          "Cantos de aves urbanas",
          "Vocalizaciones de bosque",
          "Práctica con grabaciones reales"
        ],
        duration: "90 min"
      }
    ]
  }
};

const CourseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const course = id ? coursesData[id] : null;

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold text-forest-900 mb-2">Curso no encontrado</h2>
          <p className="text-forest-700 mb-4">El curso que buscas no existe</p>
          <Button onClick={() => navigate("/learn")}>
            Volver a Cursos
          </Button>
        </Card>
      </div>
    );
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Principiante":
        return "bg-green-100 text-green-800";
      case "Intermedio":
        return "bg-yellow-100 text-yellow-800";
      case "Avanzado":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Back Button */}
      <Button 
        variant="ghost" 
        onClick={() => navigate("/learn")}
        className="gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a Cursos
      </Button>

      {/* Hero Section with Cover Image */}
      <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden">
        <img
          src={course.image}
          alt={course.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <Badge className={`${getLevelColor(course.level)} mb-3`}>
            {course.level}
          </Badge>
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-white mb-2">
            {course.title}
          </h1>
          <div className="flex items-center gap-4 text-white/90 text-sm">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{course.duration}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              <span>{course.category}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Educator Info */}
          <Card className="p-6 border-lime-200">
            <h2 className="text-lg font-heading font-bold text-forest-900 mb-4">
              Educador
            </h2>
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={course.educator.avatar} alt={course.educator.name} />
                <AvatarFallback>{course.educator.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-forest-900">
                    {course.educator.name}
                  </h3>
                  {course.educator.verified && (
                    <CheckCircle2 className="h-5 w-5 text-blue-500" />
                  )}
                </div>
                <p className="text-sm text-forest-700">Educador Verificado</p>
              </div>
            </div>
          </Card>

          {/* Course Description */}
          <Card className="p-6 border-lime-200">
            <h2 className="text-lg font-heading font-bold text-forest-900 mb-3">
              Acerca de este curso
            </h2>
            <p className="text-forest-700 leading-relaxed">
              {course.fullDescription}
            </p>
          </Card>

          {/* Course Content */}
          <Card className="p-6 border-lime-200">
            <h2 className="text-lg font-heading font-bold text-forest-900 mb-4">
              Contenido del Curso
            </h2>
            <div className="space-y-4">
              {course.modules.map((module, index) => (
                <div key={module.id} className="border-b border-lime-100 last:border-0 pb-4 last:pb-0">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-forest-900">
                      Módulo {index + 1}: {module.title}
                    </h3>
                    <span className="text-sm text-forest-600 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {module.duration}
                    </span>
                  </div>
                  <ul className="space-y-2">
                    {module.lessons.map((lesson, lessonIndex) => (
                      <li key={lessonIndex} className="flex items-start gap-2 text-sm text-forest-700">
                        <Play className="h-4 w-4 text-forest-500 mt-0.5 flex-shrink-0" />
                        <span>{lesson}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Sidebar with Action */}
        <div className="lg:col-span-1">
          <Card className="p-6 border-lime-200 sticky top-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-heading font-bold text-2xl text-forest-900 mb-2">
                  Comienza Ahora
                </h3>
                <p className="text-sm text-forest-700">
                  Inicia tu aprendizaje con este curso completo
                </p>
              </div>
              
              <div className="space-y-3 py-4 border-y border-lime-100">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-forest-700">Duración</span>
                  <span className="font-medium text-forest-900">{course.duration}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-forest-700">Nivel</span>
                  <span className="font-medium text-forest-900">{course.level}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-forest-700">Módulos</span>
                  <span className="font-medium text-forest-900">{course.modules.length}</span>
                </div>
              </div>

              <Button 
                className="w-full gap-2 bg-forest-600 hover:bg-forest-700 text-white"
                size="lg"
              >
                <Play className="h-5 w-5" />
                Comenzar Curso
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
