import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Filter, X, BookOpen, Clock, FileText, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { getEducationalContents, EducationalContent } from "@/api/services/educationalContentService";

const CourseCard = ({ course }: { course: EducationalContent }) => {
  const getLevelColor = (level: string) => {
    switch (level) {
      case "beginner":
        return "bg-green-100 text-green-800";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800";
      case "advanced":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getLevelLabel = (level: string) => {
    switch (level) {
      case "beginner": return "Principiante";
      case "intermediate": return "Intermedio";
      case "advanced": return "Avanzado";
      default: return level;
    }
  };

  const categoryName = course.categories?.[0]?.name || "General";
  // Fallback image if thumbnail_url is empty
  const imageUrl = course.thumbnail_url
    ? (course.thumbnail_url.startsWith('http') ? course.thumbnail_url : `${import.meta.env.VITE_APP_API_URL || 'http://localhost:8000'}/storage/${course.thumbnail_url}`)
    : "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=600&h=400"; // Generic nature image

  const getDetailLink = (content: EducationalContent) => {
    return content.content_type === 'article'
      ? `/learn/article/${content.slug}`
      : `/learn/course/${content.slug}`;
  };

  const linkTo = getDetailLink(course);

  return (
    <Link to={linkTo}>
      <Card className="overflow-hidden card-hover h-full transition-all duration-300 flex flex-col">
        <div className="relative h-48 flex-shrink-0">
          <img
            src={imageUrl}
            alt={course.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=600&h=400";
            }}
          />
          <div className="absolute top-3 right-3">
            <Badge className={getLevelColor(course.difficulty_level)}>
              {getLevelLabel(course.difficulty_level)}
            </Badge>
          </div>
        </div>
        <div className="p-4 flex flex-col flex-grow">
          <div className="flex items-center gap-2 mb-2 text-forest-600 text-xs text-muted-foreground">
            <BookOpen className="h-3 w-3" />
            <span>{categoryName}</span>
            <span className="text-forest-400">•</span>
            <Clock className="h-3 w-3" />
            <span>{course.estimated_duration} min</span>
          </div>
          <h3 className="font-heading font-bold text-forest-900 text-lg mb-2">
            {course.title}
          </h3>
          <p className="text-forest-700 text-sm line-clamp-2 mb-4 flex-grow">
            {course.description}
          </p>

          <div className="mt-auto pt-2 border-t border-gray-100">
            <Badge variant="outline" className="gap-1.5 font-normal text-forest-600 border-lime-200 bg-lime-50/50">
              {course.content_type === 'article' ? (
                <>
                  <FileText className="h-3 w-3" />
                  <span>Artículo</span>
                </>
              ) : (
                <>
                  <GraduationCap className="h-3 w-3" />
                  <span>Curso Modular</span>
                </>
              )}
            </Badge>
          </div>
        </div>
      </Card>
    </Link>
  );
};

const Learn = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [contents, setContents] = useState<EducationalContent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContents = async () => {
      setLoading(true);
      try {
        const data = await getEducationalContents();
        console.log("Datos recibidos:", data); // Debug
        setContents(data);
      } catch (error) {
        console.error("Error fetching educational contents:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContents();
  }, []);

  const filteredCourses = contents.filter((course) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      course.title.toLowerCase().includes(searchLower) ||
      course.description.toLowerCase().includes(searchLower)
      // Category search matches internal structure
    );
  });

  const toggleFilters = () => setFiltersVisible(!filtersVisible);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-forest-950 mb-2">
          Centro de Aprendizaje
        </h1>
        <p className="text-forest-700">Recursos educativos para explorar y conservar la biodiversidad</p>
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
            {loading ? "Cargando..." : `${filteredCourses.length} Recursos Disponibles`}
          </h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="h-72 animate-pulse bg-gray-100" />
            ))}
          </div>
        ) : filteredCourses.length > 0 ? (
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
