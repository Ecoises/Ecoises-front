import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Trophy, Map, Award, Clock, Users, Star } from "lucide-react";
import { Link } from "react-router-dom";

const learningPaths = [
  {
    id: 1,
    title: "Especies Locales Básicas",
    description: "Aprende a identificar y conocer las especies más comunes de tu región",
    lessons: 8,
    duration: "2-3 horas",
    difficulty: "Principiante",
    progress: 25,
    points: 120,
    icon: BookOpen,
    color: "bg-emerald-500",
    topics: ["Identificación", "Hábitats", "Comportamiento"]
  },
  {
    id: 2,
    title: "Encuentros con Fauna Peligrosa",
    description: "Protocolos de seguridad y qué hacer ante encuentros con especies peligrosas",
    lessons: 6,
    duration: "1-2 horas",
    difficulty: "Intermedio",
    progress: 0,
    points: 200,
    icon: Trophy,
    color: "bg-orange-500",
    topics: ["Seguridad", "Protocolos", "Primeros Auxilios"]
  },
  {
    id: 3,
    title: "Conservación y Restauración",
    description: "Acciones prácticas para la conservación y restauración de ecosistemas",
    lessons: 10,
    duration: "3-4 horas",
    difficulty: "Avanzado",
    progress: 60,
    points: 300,
    icon: Map,
    color: "bg-blue-500",
    topics: ["Reforestación", "Protección", "Participación Comunitaria"]
  }
];

const dailyChallenges = [
  {
    id: 1,
    title: "Identifica 3 especies nuevas",
    description: "Registra avistamientos de 3 especies que no hayas visto antes",
    points: 50,
    timeLeft: "12h",
    difficulty: "Fácil",
    icon: Star
  },
  {
    id: 2,
    title: "Explora un nuevo hábitat",
    description: "Visita y documenta un ecosistema diferente al habitual",
    points: 100,
    timeLeft: "18h",
    difficulty: "Medio",
    icon: Map
  }
];

const userStats = {
  totalPoints: 1250,
  completedPaths: 1,
  currentStreak: 7,
  rank: "Explorador Novato"
};

const Learn = () => {
  const [selectedPath, setSelectedPath] = useState(null);

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">Centro de Aprendizaje</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Descubre la biodiversidad local de forma interactiva y gana puntos mientras aprendes
          </p>
        </div>

        {/* User Stats */}
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-yellow-500" />
              Mi Progreso
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">{userStats.totalPoints}</div>
                <div className="text-sm text-gray-600">Puntos Totales</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{userStats.completedPaths}</div>
                <div className="text-sm text-gray-600">Rutas Completadas</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{userStats.currentStreak}</div>
                <div className="text-sm text-gray-600">Días Consecutivos</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-lg font-semibold text-purple-600">{userStats.rank}</div>
                <div className="text-sm text-gray-600">Rango Actual</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Daily Challenges */}
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-orange-500" />
              Desafíos Diarios
            </CardTitle>
            <CardDescription>
              Completa estos retos para ganar puntos extra
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dailyChallenges.map((challenge) => (
                <div key={challenge.id} className="p-4 border rounded-lg bg-white">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <challenge.icon className="h-4 w-4 text-orange-500" />
                      <Badge variant="outline">{challenge.difficulty}</Badge>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-orange-600">+{challenge.points} pts</div>
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {challenge.timeLeft}
                      </div>
                    </div>
                  </div>
                  <h4 className="font-semibold mb-1">{challenge.title}</h4>
                  <p className="text-sm text-gray-600 mb-3">{challenge.description}</p>
                  <Button size="sm" className="w-full">
                    Aceptar Desafío
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Learning Paths */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-green-600" />
            Rutas de Aprendizaje
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {learningPaths.map((path) => (
              <Card key={path.id} className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className={`p-2 rounded-lg ${path.color} text-white`}>
                      <path.icon className="h-6 w-6" />
                    </div>
                    <Badge variant="outline">{path.difficulty}</Badge>
                  </div>
                  <CardTitle className="text-lg">{path.title}</CardTitle>
                  <CardDescription>{path.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progreso</span>
                      <span>{path.progress}%</span>
                    </div>
                    <Progress value={path.progress} className="h-2" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4" />
                      {path.lessons} lecciones
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {path.duration}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {path.topics.map((topic, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {topic}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      <span className="text-yellow-600 font-semibold">+{path.points} pts</span>
                    </div>
                    <Link to={`/learn/path/${path.id}`}>
                      <Button size="sm">
                        {path.progress > 0 ? 'Continuar' : 'Comenzar'}
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Community Section */}
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              Comunidad de Aprendizaje
            </CardTitle>
            <CardDescription>
              Conecta con otros exploradores y comparte tus descubrimientos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="h-16">
                <div className="text-center">
                  <div className="font-semibold">Foro de Discusión</div>
                  <div className="text-xs text-gray-500">Comparte experiencias</div>
                </div>
              </Button>
              <Button variant="outline" className="h-16">
                <div className="text-center">
                  <div className="font-semibold">Ranking Global</div>
                  <div className="text-xs text-gray-500">Compite con otros</div>
                </div>
              </Button>
              <Button variant="outline" className="h-16">
                <div className="text-center">
                  <div className="font-semibold">Grupos Locales</div>
                  <div className="text-xs text-gray-500">Únete a tu región</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Learn;