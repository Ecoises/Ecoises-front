import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { 
  ArrowLeft, 
  Save,
  Eye,
  BookOpen,
  Layers,
  Settings,
  Upload,
  Image as ImageIcon
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import RichTextEditor from "@/components/educator/RichTextEditor";
import AudioConfigPanel, { AudioConfig } from "@/components/educator/AudioConfigPanel";
import ActivityBuilder, { Activity } from "@/components/educator/ActivityBuilder";

const LessonEditor = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Lesson metadata
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [isModular, setIsModular] = useState(false);

  // Content
  const [content, setContent] = useState("");
  const [activities, setActivities] = useState<Activity[]>([]);

  // Audio
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | undefined>();

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCoverImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateAudio = async (config: AudioConfig) => {
    if (!content.trim()) {
      toast({
        title: "Contenido requerido",
        description: "Escribe el contenido de la lección antes de generar el audio",
        variant: "destructive"
      });
      return;
    }

    setIsGeneratingAudio(true);
    
    try {
      // Simulated async audio generation
      // In production, this would call the ElevenLabs API
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock audio URL - replace with actual API response
      setAudioUrl("/audio/prueba_timestamps.mp3");
      
      toast({
        title: "Audio generado",
        description: "El audio y los timestamps se han generado correctamente",
      });
    } catch (error) {
      toast({
        title: "Error al generar audio",
        description: "Hubo un problema al generar el audio. Intenta nuevamente.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingAudio(false);
    }
  };

  const handleSave = () => {
    if (!title.trim()) {
      toast({
        title: "Título requerido",
        description: "Por favor ingresa un título para la lección",
        variant: "destructive"
      });
      return;
    }

    // Save lesson logic here
    toast({
      title: "Lección guardada",
      description: isModular 
        ? "Tu curso modular ha sido guardado correctamente"
        : "Tu lección ha sido guardada correctamente",
    });
    navigate("/learn");
  };

  const handlePreview = () => {
    toast({
      title: "Vista previa",
      description: "Abriendo vista previa de la lección...",
    });
  };

  return (
    <div className="max-w-6xl mx-auto animate-fade-in pb-8">
      {/* Header */}
      <div className="mb-6">
        <Link to="/learn" className="text-primary hover:text-primary/80 inline-flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" />
          Volver a Aprender
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Editor Area */}
        <div className="flex-1 space-y-6">
          {/* Title & Cover */}
          <Card className="p-6 border-border">
            <div className="space-y-4">
              {/* Cover Image */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Imagen de portada</label>
                <div className="border-2 border-dashed border-border rounded-xl overflow-hidden">
                  {coverImage ? (
                    <div className="relative">
                      <img 
                        src={coverImage} 
                        alt="Portada" 
                        className="w-full h-48 object-cover"
                      />
                      <Button
                        variant="secondary"
                        size="sm"
                        className="absolute bottom-2 right-2"
                        onClick={() => setCoverImage(null)}
                      >
                        Cambiar
                      </Button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center h-48 cursor-pointer hover:bg-muted/50 transition-colors">
                      <ImageIcon className="h-10 w-10 text-muted-foreground mb-2" />
                      <span className="text-sm text-muted-foreground">Haz clic para subir una imagen</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden"
                        onChange={handleCoverUpload}
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Título de la lección</label>
                <Input
                  placeholder="Ej: Introducción a las aves migratorias"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-lg font-semibold"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Descripción breve</label>
                <Textarea
                  placeholder="Una breve descripción de lo que aprenderán los estudiantes..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                />
              </div>

              {/* Content Type Toggle */}
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                <div className="flex items-center gap-3">
                  {isModular ? (
                    <Layers className="h-5 w-5 text-primary" />
                  ) : (
                    <BookOpen className="h-5 w-5 text-primary" />
                  )}
                  <div>
                    <p className="font-medium text-foreground">
                      {isModular ? "Curso Modular" : "Lección Simple"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {isModular 
                        ? "Incluye actividades gamificadas interactivas"
                        : "Contenido educativo sin actividades"
                      }
                    </p>
                  </div>
                </div>
                <Switch
                  checked={isModular}
                  onCheckedChange={setIsModular}
                />
              </div>
            </div>
          </Card>

          {/* Content Tabs */}
          <Tabs defaultValue="content" className="w-full">
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="content" className="gap-2">
                <BookOpen className="h-4 w-4" />
                Contenido
              </TabsTrigger>
              <TabsTrigger value="settings" className="gap-2">
                <Settings className="h-4 w-4" />
                Configuración
              </TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="mt-4 space-y-4">
              {/* Rich Text Editor */}
              <RichTextEditor
                content={content}
                onChange={setContent}
                placeholder="Escribe el contenido educativo de tu lección aquí..."
              />

              {/* Activities (only for modular courses) */}
              {isModular && (
                <ActivityBuilder
                  activities={activities}
                  onChange={setActivities}
                />
              )}
            </TabsContent>

            <TabsContent value="settings" className="mt-4">
              <Card className="p-6 border-border">
                <h3 className="font-semibold text-foreground mb-4">Ajustes de la lección</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">Publicar al guardar</p>
                      <p className="text-sm text-muted-foreground">La lección estará disponible inmediatamente</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">Requiere audio</p>
                      <p className="text-sm text-muted-foreground">Los estudiantes deben escuchar el audio</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">Mostrar transcripción</p>
                      <p className="text-sm text-muted-foreground">Muestra el texto sincronizado con el audio</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-80 space-y-4">
          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button 
              onClick={handleSave}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Save className="h-4 w-4 mr-2" />
              Guardar
            </Button>
            <Button 
              variant="outline"
              onClick={handlePreview}
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>

          {/* Audio Configuration */}
          <AudioConfigPanel
            onGenerate={handleGenerateAudio}
            isGenerating={isGeneratingAudio}
            audioUrl={audioUrl}
          />

          {/* Quick Stats */}
          <Card className="p-4 border-border bg-card">
            <h3 className="font-semibold text-foreground mb-3">Resumen</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tipo:</span>
                <span className="text-foreground">{isModular ? "Curso Modular" : "Lección Simple"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Actividades:</span>
                <span className="text-foreground">{activities.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Audio:</span>
                <span className={audioUrl ? "text-primary" : "text-muted-foreground"}>
                  {audioUrl ? "Generado" : "Pendiente"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Estado:</span>
                <span className="text-amber-500">Borrador</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LessonEditor;
