import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Search, 
  X,
  BookOpen,
  Layers,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Users,
  Shield
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data for lessons
const mockLessons = [
  {
    id: '1',
    title: 'Introducción a las Aves Migratorias',
    description: 'Conoce las especies más comunes que migran por Colombia',
    coverImage: '/images/hero-img-1.png',
    type: 'simple',
    status: 'published',
    views: 245,
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    title: 'Identificación de Rapaces',
    description: 'Aprende a identificar águilas, halcones y buitres',
    coverImage: '/images/hero-img-2.png',
    type: 'modular',
    status: 'draft',
    views: 0,
    createdAt: '2024-01-20',
  },
  {
    id: '3',
    title: 'Cantos y Vocalizaciones',
    description: 'Reconoce las aves por sus cantos característicos',
    coverImage: '/images/hero-img-3.png',
    type: 'modular',
    status: 'published',
    views: 189,
    createdAt: '2024-01-18',
  },
];

const EducatorDashboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAdmin] = useState(true); // This would come from auth context

  const filteredLessons = mockLessons.filter(lesson =>
    lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lesson.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge className="bg-primary/20 text-primary border-0">Publicado</Badge>;
      case 'draft':
        return <Badge className="bg-amber-500/20 text-amber-600 border-0">Borrador</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Panel del Educador</h1>
          <p className="text-muted-foreground mt-1">Gestiona tus lecciones y contenido educativo</p>
        </div>
        <Button 
          onClick={() => navigate("/educator/new")}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nueva Lección
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="lessons" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="lessons" className="gap-2">
            <BookOpen className="h-4 w-4" />
            Mis Lecciones
          </TabsTrigger>
          {isAdmin && (
            <TabsTrigger value="admin" className="gap-2">
              <Shield className="h-4 w-4" />
              Administración
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="lessons">
          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Buscar lecciones..."
              className="pl-10 pr-10 bg-card rounded-xl"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Lessons Grid */}
          {filteredLessons.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLessons.map((lesson) => (
                <Card key={lesson.id} className="overflow-hidden border-border hover:shadow-lg transition-shadow">
                  {/* Cover Image */}
                  <div className="relative h-40 bg-muted">
                    <img
                      src={lesson.coverImage}
                      alt={lesson.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2">
                      {lesson.type === 'modular' ? (
                        <Badge className="bg-secondary text-secondary-foreground gap-1">
                          <Layers className="h-3 w-3" />
                          Modular
                        </Badge>
                      ) : (
                        <Badge className="bg-card text-foreground gap-1">
                          <BookOpen className="h-3 w-3" />
                          Simple
                        </Badge>
                      )}
                    </div>
                    <div className="absolute top-2 right-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="secondary" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => navigate(`/educator/edit/${lesson.id}`)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigate(`/learn/${lesson.id}`)}>
                            <Eye className="h-4 w-4 mr-2" />
                            Ver
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-foreground line-clamp-1">{lesson.title}</h3>
                      {getStatusBadge(lesson.status)}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {lesson.description}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {lesson.views} vistas
                      </span>
                      <span>{new Date(lesson.createdAt).toLocaleDateString('es-ES')}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center border-border">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No hay lecciones</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm 
                  ? "No se encontraron lecciones con ese término"
                  : "Comienza creando tu primera lección educativa"
                }
              </p>
              {!searchTerm && (
                <Button 
                  onClick={() => navigate("/educator/new")}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Lección
                </Button>
              )}
            </Card>
          )}
        </TabsContent>

        {isAdmin && (
          <TabsContent value="admin">
            <Card className="p-6 border-border">
              <div className="flex items-center gap-3 mb-6">
                <Users className="h-6 w-6 text-primary" />
                <h2 className="text-xl font-semibold text-foreground">Gestión de Usuarios</h2>
              </div>

              <div className="space-y-4">
                {/* Mock users list */}
                {[
                  { name: 'María García', email: 'maria@example.com', role: 'educator', lessons: 5 },
                  { name: 'Carlos López', email: 'carlos@example.com', role: 'educator', lessons: 3 },
                  { name: 'Ana Martínez', email: 'ana@example.com', role: 'student', lessons: 0 },
                ].map((user, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-4 bg-muted/50 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="text-primary font-semibold">
                          {user.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={user.role === 'educator' ? 'default' : 'secondary'}>
                        {user.role === 'educator' ? 'Educador' : 'Estudiante'}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {user.lessons} lecciones
                      </span>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Ver perfil</DropdownMenuItem>
                          <DropdownMenuItem>Cambiar rol</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">Suspender</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default EducatorDashboard;
