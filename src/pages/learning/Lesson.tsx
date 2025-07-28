import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, Award, Clock, CheckCircle } from "lucide-react";

const lessonsData = {
  3: {
    id: 3,
    title: "Cantos y Sonidos de Aves",
    description: "Identifica especies por sus vocalizaciones características",
    duration: "18 min",
    points: 18,
    type: "audio",
    pathId: 1,
    content: {
      introduction: "Los cantos de las aves son una herramienta fundamental para su identificación. Cada especie tiene patrones vocales únicos que puedes aprender a reconocer.",
      sections: [
        {
          title: "Conceptos Básicos",
          content: "Las aves utilizan diferentes tipos de sonidos: cantos territoriales, llamadas de alarma, sonidos de cortejo, y comunicación entre padres y crías.",
          audioExample: "robin-song.mp3"
        },
        {
          title: "Patrones Comunes",
          content: "Aprende a identificar patrones como trinos, silbidos, gorjeos y llamadas repetitivas. Cada familia de aves tiene características distintivas.",
          audioExample: "pattern-examples.mp3"
        },
        {
          title: "Especies Locales",
          content: "Familiarízate con los sonidos de las especies más comunes en tu región.",
          audioExample: "local-birds.mp3"
        }
      ],
      interactive: {
        type: "audio-quiz",
        question: "Escucha los siguientes sonidos e identifica la especie correcta",
        samples: [
          { audio: "sample1.mp3", options: ["Petirrojo", "Mirlo", "Jilguero"], correct: 0 },
          { audio: "sample2.mp3", options: ["Gorrión", "Canario", "Verderón"], correct: 1 },
          { audio: "sample3.mp3", options: ["Urraca", "Cuervo", "Corneja"], correct: 2 }
        ]
      }
    }
  }
};

const Lesson = () => {
  const { lessonId } = useParams();
  const [currentSection, setCurrentSection] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [lessonCompleted, setLessonCompleted] = useState(false);

  const lesson = lessonsData[parseInt(lessonId || "3")];
  
  if (!lesson) {
    return <div>Lección no encontrada</div>;
  }

  const totalSections = lesson.content.sections.length + 1; // +1 for interactive section
  const progress = ((currentSection + 1) / totalSections) * 100;

  const handleQuizAnswer = (questionIndex: number, answer: number) => {
    const newAnswers = [...quizAnswers];
    newAnswers[questionIndex] = answer;
    setQuizAnswers(newAnswers);
  };

  const submitQuiz = () => {
    setShowResults(true);
    // Simulate lesson completion
    setTimeout(() => {
      setLessonCompleted(true);
    }, 2000);
  };

  const correctAnswers = quizAnswers.filter((answer, index) => 
    answer === lesson.content.interactive.samples[index].correct
  ).length;

  const nextSection = () => {
    if (currentSection < totalSections - 1) {
      setCurrentSection(currentSection + 1);
    }
  };

  const prevSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link to={`/learn/path/${lesson.pathId}`}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al Curso
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">{lesson.title}</h1>
            <p className="text-gray-600">{lesson.description}</p>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-500">{lesson.duration}</span>
          </div>
        </div>

        {/* Progress */}
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Progreso de la Lección</span>
              <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Sección {currentSection + 1} de {totalSections}</span>
              <span className="flex items-center gap-1">
                <Award className="h-3 w-3" />
                +{lesson.points} puntos
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Content */}
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8">
            {currentSection === 0 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold mb-4">Introducción</h2>
                <p className="text-lg text-gray-700 leading-relaxed">
                  {lesson.content.introduction}
                </p>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">💡 Consejo</h3>
                  <p className="text-blue-800">
                    Usa auriculares para una mejor experiencia de audio y practica en diferentes horarios del día cuando las aves son más activas.
                  </p>
                </div>
              </div>
            )}

            {currentSection > 0 && currentSection <= lesson.content.sections.length && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold mb-4">
                  {lesson.content.sections[currentSection - 1].title}
                </h2>
                <p className="text-lg text-gray-700 leading-relaxed">
                  {lesson.content.sections[currentSection - 1].content}
                </p>
                
                {/* Audio Player Simulation */}
                <div className="bg-purple-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-purple-900 mb-3">🎵 Ejemplo de Audio</h3>
                  <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm">
                    <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                      ▶ Reproducir
                    </Button>
                    <div className="flex-1 bg-gray-200 h-2 rounded-full">
                      <div className="bg-purple-600 h-2 rounded-full w-1/3"></div>
                    </div>
                    <span className="text-sm text-gray-500">0:45 / 2:30</span>
                  </div>
                  <p className="text-sm text-purple-700 mt-2">
                    Archivo: {lesson.content.sections[currentSection - 1].audioExample}
                  </p>
                </div>
              </div>
            )}

            {currentSection === totalSections - 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold mb-4">Ejercicio Práctico</h2>
                <p className="text-lg text-gray-700 mb-6">
                  {lesson.content.interactive.question}
                </p>

                {lesson.content.interactive.samples.map((sample, index) => (
                  <div key={index} className="bg-green-50 p-6 rounded-lg space-y-4">
                    <h3 className="font-semibold text-green-900">Audio {index + 1}</h3>
                    
                    {/* Audio Player */}
                    <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm">
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        ▶ Reproducir
                      </Button>
                      <div className="flex-1 bg-gray-200 h-2 rounded-full">
                        <div className="bg-green-600 h-2 rounded-full w-0"></div>
                      </div>
                      <span className="text-sm text-gray-500">{sample.audio}</span>
                    </div>

                    {/* Options */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {sample.options.map((option, optionIndex) => (
                        <Button
                          key={optionIndex}
                          variant={quizAnswers[index] === optionIndex ? "default" : "outline"}
                          className="h-12"
                          onClick={() => handleQuizAnswer(index, optionIndex)}
                          disabled={showResults}
                        >
                          {option}
                          {showResults && optionIndex === sample.correct && (
                            <CheckCircle className="h-4 w-4 ml-2 text-green-500" />
                          )}
                        </Button>
                      ))}
                    </div>

                    {showResults && (
                      <div className="text-sm">
                        {quizAnswers[index] === sample.correct ? (
                          <Badge className="bg-green-100 text-green-800">✓ Correcto</Badge>
                        ) : (
                          <Badge variant="destructive">✗ Incorrecto - La respuesta correcta es: {sample.options[sample.correct]}</Badge>
                        )}
                      </div>
                    )}
                  </div>
                ))}

                {quizAnswers.length === lesson.content.interactive.samples.length && !showResults && (
                  <Button onClick={submitQuiz} className="w-full">
                    Enviar Respuestas
                  </Button>
                )}

                {showResults && (
                  <div className="bg-blue-50 p-6 rounded-lg text-center">
                    <h3 className="text-xl font-semibold text-blue-900 mb-2">
                      Resultados: {correctAnswers}/{lesson.content.interactive.samples.length}
                    </h3>
                    <p className="text-blue-800 mb-4">
                      {correctAnswers >= 2 ? "¡Excelente trabajo!" : "¡Sigue practicando!"}
                    </p>
                    {lessonCompleted && (
                      <div className="flex items-center justify-center gap-2 text-green-600">
                        <CheckCircle className="h-5 w-5" />
                        <span className="font-semibold">Lección Completada - +{lesson.points} puntos</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={prevSection}
            disabled={currentSection === 0}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Anterior
          </Button>
          
          {currentSection < totalSections - 1 ? (
            <Button onClick={nextSection}>
              Siguiente
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : lessonCompleted ? (
            <Link to={`/learn/path/${lesson.pathId}`}>
              <Button>
                Volver al Curso
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          ) : (
            <Button disabled>
              Completa el ejercicio
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Lesson;