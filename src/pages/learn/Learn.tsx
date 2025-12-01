import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Filter, X, BookOpen, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

interface Course {
  id: string;
  title: string;
  description: string;
  image: string;
  duration: string;
  level: string;
  category: string;
}

const courses: Course[] = [
  {
    id: "1",
    title: "Introducción a la Observación de Aves",
    description: "Aprende los conceptos básicos para identificar aves en tu entorno y comenzar tu viaje en el birdwatching.",
    image: "https://images.unsplash.com/photo-1444464666168-49d633b86797?auto=format&fit=crop&w=600&h=400",
    duration: "2 horas",
    level: "Principiante",
    category: "Fundamentos"
  },
  {
    id: "2",
    title: "Identificación por Cantos y Llamados",
    description: "Desarrolla tu oído para reconocer las diferentes especies de aves por sus vocalizaciones.",
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=600&h=400",
    duration: "3 horas",
    level: "Intermedio",
    category: "Técnicas"
  },
  {
    id: "3",
    title: "Fotografía de Aves",
    description: "Técnicas y consejos para capturar imágenes espectaculares de aves en su hábitat natural.",
    image: "https://images.unsplash.com/photo-1452570053594-1b985d6ea890?auto=format&fit=crop&w=600&h=400",
    duration: "4 horas",
    level: "Avanzado",
    category: "Fotografía"
  },
  {
    id: "4",
    title: "Aves Migratorias de Colombia",
    description: "Conoce las especies migratorias que visitan Colombia y los mejores momentos para observarlas.",
    image: "https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?auto=format&fit=crop&w=600&h=400",
    duration: "2.5 horas",
    level: "Intermedio",
    category: "Ecología"
  },
  {
    id: "5",
    title: "Conservación y Hábitats",
    description: "Entiende la importancia de la conservación de hábitats para la supervivencia de las aves.",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=600&h=400",
    duration: "3 horas",
    level: "Principiante",
    category: "Conservación"
  },
  {
    id: "6",
    title: "Aves Endémicas de Colombia",
    description: "Descubre las especies únicas que solo pueden encontrarse en territorio colombiano.",
    image: "https://images.unsplash.com/photo-1470093851219-69951fcbb533?auto=format&fit=crop&w=600&h=400",
    duration: "3.5 horas",
    level: "Intermedio",
    category: "Biodiversidad"
  },
  {
    id: "7",
    title: "Equipamiento para Observación de Aves",
    description: "Guía completa sobre binoculares, telescopios y otros equipos esenciales para el birdwatching.",
    image: "https://images.unsplash.com/photo-1516567727245-ad8290f92f3d?auto=format&fit=crop&w=600&h=400",
    duration: "1.5 horas",
    level: "Principiante",
    category: "Fundamentos"
  },
  {
    id: "8",
    title: "Comportamiento y Etología Aviar",
    description: "Profundiza en los patrones de comportamiento de las aves y su significado ecológico.",
    image: "https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?auto=format&fit=crop&w=600&h=400",
    duration: "4 horas",
    level: "Avanzado",
    category: "Ecología"
  }
];

const CourseCard = ({ course }: { course: Course }) => {
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
    <Link to={`/learn/${course.id}`}>
      <Card className="overflow-hidden card-hover h-full transition-all duration-300">
        <div className="relative h-48">
          <img
            src={course.image}
            alt={course.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 right-3">
            <Badge className={getLevelColor(course.level)}>
              {course.level}
            </Badge>
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-center gap-2 mb-2 text-forest-600 text-xs">
            <BookOpen className="h-3 w-3" />
            <span>{course.category}</span>
            <span className="text-forest-400">•</span>
            <Clock className="h-3 w-3" />
            <span>{course.duration}</span>
          </div>
          <h3 className="font-heading font-bold text-forest-900 text-lg mb-2">
            {course.title}
          </h3>
          <p className="text-forest-700 text-sm line-clamp-2">
            {course.description}
          </p>
        </div>
      </Card>
    </Link>
  );
};

const Learn = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filtersVisible, setFiltersVisible] = useState(false);

  const filteredCourses = courses.filter((course) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      course.title.toLowerCase().includes(searchLower) ||
      course.description.toLowerCase().includes(searchLower) ||
      course.category.toLowerCase().includes(searchLower)
    );
  });

  const toggleFilters = () => setFiltersVisible(!filtersVisible);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-forest-950 mb-2">
          Aprende sobre Aves
        </h1>
        <p className="text-forest-700">Cursos y recursos para convertirte en un experto observador de aves</p>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-forest-500 h-4 w-4" />
          <Input
            type="text"
            placeholder="Buscar cursos por título, categoría o descripción..."
            className="pl-10 bg-white rounded-xl border-lime-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
              onClick={() => setSearchTerm("")}
            >
              <X className="h-4 w-4 text-forest-500" />
            </button>
          )}
        </div>

        <Button
          variant="outline"
          className="md:w-auto border-lime-200 gap-2 rounded-xl"
          onClick={toggleFilters}
        >
          <Filter className="h-4 w-4" />
          Filtros
        </Button>
      </div>

      {/* Results */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-heading font-bold text-forest-900">
            {filteredCourses.length} Cursos Disponibles
          </h2>
        </div>

        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center border-lime-200">
            <h3 className="text-forest-900 font-medium mb-2">
              No se encontraron cursos
            </h3>
            <p className="text-forest-700 mb-4">
              Intenta ajustar tu búsqueda
            </p>
            <Button
              variant="outline"
              className="border-lime-200"
              onClick={() => setSearchTerm("")}
            >
              Limpiar búsqueda
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Learn;