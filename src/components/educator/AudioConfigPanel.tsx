import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Volume2, Loader2, Play, CheckCircle2 } from 'lucide-react';

interface AudioConfigPanelProps {
  onGenerate: (config: AudioConfig) => Promise<void>;
  isGenerating: boolean;
  audioUrl?: string;
}

export interface AudioConfig {
  voice: string;
  emotion: string;
  model: string;
}

const voices = [
  { id: 'Aria', name: 'Aria', description: 'Voz femenina clara y profesional' },
  { id: 'Roger', name: 'Roger', description: 'Voz masculina cálida y educativa' },
  { id: 'Sarah', name: 'Sarah', description: 'Voz femenina amigable y expresiva' },
  { id: 'Charlie', name: 'Charlie', description: 'Voz masculina dinámica y juvenil' },
  { id: 'Laura', name: 'Laura', description: 'Voz femenina suave y tranquila' },
];

const emotions = [
  { id: 'neutral', name: 'Neutral' },
  { id: 'happy', name: 'Alegre' },
  { id: 'calm', name: 'Calmado' },
  { id: 'serious', name: 'Serio' },
  { id: 'excited', name: 'Entusiasta' },
];

const models = [
  { id: 'eleven_multilingual_v2', name: 'Multilingüe v2', description: 'Mayor calidad, 29 idiomas' },
  { id: 'eleven_turbo_v2_5', name: 'Turbo v2.5', description: 'Baja latencia, 32 idiomas' },
];

const AudioConfigPanel = ({ onGenerate, isGenerating, audioUrl }: AudioConfigPanelProps) => {
  const [config, setConfig] = useState<AudioConfig>({
    voice: 'Aria',
    emotion: 'neutral',
    model: 'eleven_multilingual_v2',
  });

  const handleGenerate = () => {
    onGenerate(config);
  };

  return (
    <Card className="p-4 border-border bg-card">
      <div className="flex items-center gap-2 mb-4">
        <Volume2 className="h-5 w-5 text-primary" />
        <h3 className="font-semibold text-foreground">Configuración de Audio</h3>
      </div>

      <div className="space-y-4">
        {/* Voice Selection */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Voz del narrador</label>
          <Select 
            value={config.voice} 
            onValueChange={(value) => setConfig(prev => ({ ...prev, voice: value }))}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecciona una voz" />
            </SelectTrigger>
            <SelectContent>
              {voices.map((voice) => (
                <SelectItem key={voice.id} value={voice.id}>
                  <div>
                    <span className="font-medium">{voice.name}</span>
                    <span className="text-muted-foreground text-xs ml-2">{voice.description}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Emotion Selection */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Estilo / Emoción</label>
          <Select 
            value={config.emotion} 
            onValueChange={(value) => setConfig(prev => ({ ...prev, emotion: value }))}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecciona un estilo" />
            </SelectTrigger>
            <SelectContent>
              {emotions.map((emotion) => (
                <SelectItem key={emotion.id} value={emotion.id}>
                  {emotion.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Model Selection */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Modelo de voz</label>
          <Select 
            value={config.model} 
            onValueChange={(value) => setConfig(prev => ({ ...prev, model: value }))}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecciona un modelo" />
            </SelectTrigger>
            <SelectContent>
              {models.map((model) => (
                <SelectItem key={model.id} value={model.id}>
                  <div>
                    <span className="font-medium">{model.name}</span>
                    <span className="text-muted-foreground text-xs ml-2">{model.description}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Audio Status */}
        {audioUrl && (
          <div className="flex items-center gap-2 p-3 bg-primary/10 rounded-lg">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            <span className="text-sm text-foreground">Audio generado correctamente</span>
            <audio src={audioUrl} controls className="ml-auto h-8" />
          </div>
        )}

        {/* Generate Button */}
        <Button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Generando audio...
            </>
          ) : (
            <>
              <Play className="h-4 w-4 mr-2" />
              Generar Audio
            </>
          )}
        </Button>

        {isGenerating && (
          <p className="text-xs text-muted-foreground text-center">
            Esto puede tomar unos segundos. El audio y los timestamps se guardarán automáticamente.
          </p>
        )}
      </div>
    </Card>
  );
};

export default AudioConfigPanel;
