import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, PlayCircle, CheckCircle, Lock, Clock, Award, BookOpen } from "lucide-react";

const learningPathsData = {
  1: {
    title: "Especies Locales Básicas",
    description: "Aprende a identificar y conocer las especies más comunes de tu región",
    difficulty: "Principiante",
    totalLessons: 8,
    completedLessons: 2,
    totalPoints: 120,
    lessons: [
      {
        id: 1,
        title: "Introducción a la Biodiversidad Local",
        description: "Conceptos básicos sobre la fauna y flora de tu región",
        duration: "15 min",
        points: 15,
        completed: true,
        type: "video"
      },
      {
        id: 2,
        title: "Aves Comunes: Identificación Visual",
        description: "Aprende a reconocer las aves más frecuentes por su apariencia",
        duration: "20 min",
        points: 20,
        completed: true,
        type: "interactive"
      },
      {
        id: 3,
        title: "Cantos y Sonidos de Aves",
        description: "Identifica especies por sus vocalizaciones características",
        duration: "18 min",
        points: 18,
        completed: false,
        type: "audio",
        current: true
      },
      {
        id: 4,
        title: "Mamíferos Pequeños de la Región",
        description: "Conoce los mamíferos pequeños y sus rastros",
        duration: "25 min",
        points: 25,
        completed: false,
        type: "video"
      },
      {
        id: 5,
        title: "Insectos Beneficiosos vs Peligrosos",
        description: "Diferencia entre insectos útiles y aquellos que debes evitar",
        duration: "22 min",
        points: 22,
        completed: false,
        type: "interactive"
      },
      {
        id: 6,
        title: "Plantas y Árboles Nativos",
        description: "Flora característica y su importancia ecológica",
        duration: "30 min",
        points: 30,
        completed: false,
        type: "video"
      },
      {
        id: 7,
        title: "Ecosistemas y Hábitats Locales",
        description: "Comprende los diferentes ecosistemas de tu área",
        duration: "28 min",
        points: 28,
        completed: false,
        type: "interactive"
      },
      {
        id: 8,
        title: "Examen Final: Identificación Práctica",
        description: "Demuestra tus conocimientos en un quiz interactivo",
        duration: "15 min",
        points: 50,
        completed: false,
        type: "quiz"
      }
    ]
  }
};

const LearningPath = () => {
  const { pathId } = useParams();
  const pathData = learningPathsData[parseInt(pathId || "1")];
  
  if (!pathData) {
    return <div>Ruta de aprendizaje no encontrada</div>;
  }

  const progress = (pathData.completedLessons / pathData.totalLessons) * 100;
  const earnedPoints = pathData.lessons
    .filter(lesson => lesson.completed)
    .reduce((sum, lesson) => sum + lesson.points, 0);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video": return "🎥";
      case "audio": return "🎵";
      case "interactive": return "🎮";
      case "quiz": return "📝";
      default: return "📖";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "video": return "bg-red-100 text-red-800";
      case "audio": return "bg-purple-100 text-purple-800";
      case "interactive": return "bg-blue-100 text-blue-800";
      case "quiz": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link to="/learn">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">{pathData.title}</h1>
            <p className="text-gray-600">{pathData.description}</p>
          </div>
          <Badge variant="outline">{pathData.difficulty}</Badge>
        </div>

        {/* Progress Card */}
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-yellow-500" />
              Tu Progreso
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{pathData.completedLessons}</div>
                <div className="text-sm text-gray-600">Lecciones Completadas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{pathData.totalLessons - pathData.completedLessons}</div>
                <div className="text-sm text-gray-600">Lecciones Restantes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{earnedPoints}</div>
                <div className="text-sm text-gray-600">Puntos Ganados</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{pathData.totalPoints - earnedPoints}</div>
                <div className="text-sm text-gray-600">Puntos Disponibles</div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progreso General</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-3" />
            </div>
          </CardContent>
        </Card>

        {/* Lessons List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Lecciones
          </h2>
          
          {pathData.lessons.map((lesson, index) => (
            <Card 
              key={lesson.id} 
              className={`bg-white/80 backdrop-blur-sm transition-all hover:shadow-md ${
                lesson.current ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  {/* Status Icon */}
                  <div className="flex-shrink-0">
                    {lesson.completed ? (
                      <CheckCircle className="h-8 w-8 text-green-500" />
                    ) : lesson.current ? (
                      <PlayCircle className="h-8 w-8 text-blue-500" />
                    ) : (
                      <Lock className="h-8 w-8 text-gray-400" />
                    )}
                  </div>

                  {/* Lesson Info */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold">{lesson.title}</h3>
                      <Badge className={getTypeColor(lesson.type)}>
                        {getTypeIcon(lesson.type)} {lesson.type}
                      </Badge>
                    </div>
                    <p className="text-gray-600">{lesson.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {lesson.duration}
                      </div>
                      <div className="flex items-center gap-1">
                        <Award className="h-4 w-4" />
                        +{lesson.points} puntos
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="flex-shrink-0">
                    {lesson.completed ? (
                      <Button variant="outline" size="sm">
                        Revisar
                      </Button>
                    ) : lesson.current ? (
                      <Link to={`/learn/lesson/${lesson.id}`}>
                        <Button size="sm">
                          Continuar
                        </Button>
                      </Link>
                    ) : index === 0 || pathData.lessons[index - 1].completed ? (
                      <Link to={`/learn/lesson/${lesson.id}`}>
                        <Button variant="outline" size="sm">
                          Comenzar
                        </Button>
                      </Link>
                    ) : (
                      <Button variant="outline" size="sm" disabled>
                        Bloqueado
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LearningPath;