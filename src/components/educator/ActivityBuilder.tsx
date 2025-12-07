import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  CheckSquare, 
  ToggleLeft, 
  GripVertical, 
  Link2,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export interface Activity {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'drag-drop' | 'matching';
  question: string;
  options?: string[];
  correctAnswer?: string | number | number[];
  pairs?: { left: string; right: string }[];
}

interface ActivityBuilderProps {
  activities: Activity[];
  onChange: (activities: Activity[]) => void;
}

const activityTypes = [
  { type: 'multiple-choice', label: 'Selección Múltiple', icon: CheckSquare },
  { type: 'true-false', label: 'Verdadero / Falso', icon: ToggleLeft },
  { type: 'drag-drop', label: 'Arrastrar y Soltar', icon: GripVertical },
  { type: 'matching', label: 'Emparejamiento', icon: Link2 },
];

const ActivityBuilder = ({ activities, onChange }: ActivityBuilderProps) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const addActivity = (type: Activity['type']) => {
    const newActivity: Activity = {
      id: `activity-${Date.now()}`,
      type,
      question: '',
      options: type === 'multiple-choice' ? ['', '', '', ''] : undefined,
      correctAnswer: type === 'true-false' ? 0 : undefined,
      pairs: type === 'matching' ? [{ left: '', right: '' }] : undefined,
    };
    onChange([...activities, newActivity]);
    setExpandedId(newActivity.id);
  };

  const updateActivity = (id: string, updates: Partial<Activity>) => {
    onChange(activities.map(a => a.id === id ? { ...a, ...updates } : a));
  };

  const removeActivity = (id: string) => {
    onChange(activities.filter(a => a.id !== id));
  };

  const renderActivityEditor = (activity: Activity) => {
    switch (activity.type) {
      case 'multiple-choice':
        return (
          <div className="space-y-3">
            <Textarea
              placeholder="Escribe la pregunta..."
              value={activity.question}
              onChange={(e) => updateActivity(activity.id, { question: e.target.value })}
              className="bg-background"
            />
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Opciones de respuesta</label>
              {activity.options?.map((option, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={`correct-${activity.id}`}
                    checked={activity.correctAnswer === index}
                    onChange={() => updateActivity(activity.id, { correctAnswer: index })}
                    className="h-4 w-4 text-primary"
                  />
                  <Input
                    placeholder={`Opción ${index + 1}`}
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...(activity.options || [])];
                      newOptions[index] = e.target.value;
                      updateActivity(activity.id, { options: newOptions });
                    }}
                    className="flex-1 bg-background"
                  />
                </div>
              ))}
              <p className="text-xs text-muted-foreground">Selecciona la respuesta correcta</p>
            </div>
          </div>
        );

      case 'true-false':
        return (
          <div className="space-y-3">
            <Textarea
              placeholder="Escribe la afirmación..."
              value={activity.question}
              onChange={(e) => updateActivity(activity.id, { question: e.target.value })}
              className="bg-background"
            />
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name={`tf-${activity.id}`}
                  checked={activity.correctAnswer === 1}
                  onChange={() => updateActivity(activity.id, { correctAnswer: 1 })}
                  className="h-4 w-4 text-primary"
                />
                <span className="text-foreground">Verdadero</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name={`tf-${activity.id}`}
                  checked={activity.correctAnswer === 0}
                  onChange={() => updateActivity(activity.id, { correctAnswer: 0 })}
                  className="h-4 w-4 text-primary"
                />
                <span className="text-foreground">Falso</span>
              </label>
            </div>
          </div>
        );

      case 'drag-drop':
        return (
          <div className="space-y-3">
            <Textarea
              placeholder="Describe la instrucción para arrastrar y soltar..."
              value={activity.question}
              onChange={(e) => updateActivity(activity.id, { question: e.target.value })}
              className="bg-background"
            />
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Elementos (en orden correcto)</label>
              {activity.options?.map((option, index) => (
                <div key={index} className="flex items-center gap-2">
                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={`Elemento ${index + 1}`}
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...(activity.options || [])];
                      newOptions[index] = e.target.value;
                      updateActivity(activity.id, { options: newOptions });
                    }}
                    className="flex-1 bg-background"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const newOptions = activity.options?.filter((_, i) => i !== index);
                      updateActivity(activity.id, { options: newOptions });
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => updateActivity(activity.id, { options: [...(activity.options || []), ''] })}
              >
                <Plus className="h-4 w-4 mr-1" /> Agregar elemento
              </Button>
            </div>
          </div>
        );

      case 'matching':
        return (
          <div className="space-y-3">
            <Textarea
              placeholder="Instrucciones para el emparejamiento..."
              value={activity.question}
              onChange={(e) => updateActivity(activity.id, { question: e.target.value })}
              className="bg-background"
            />
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Pares para emparejar</label>
              {activity.pairs?.map((pair, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    placeholder="Elemento izquierdo"
                    value={pair.left}
                    onChange={(e) => {
                      const newPairs = [...(activity.pairs || [])];
                      newPairs[index] = { ...pair, left: e.target.value };
                      updateActivity(activity.id, { pairs: newPairs });
                    }}
                    className="flex-1 bg-background"
                  />
                  <Link2 className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Elemento derecho"
                    value={pair.right}
                    onChange={(e) => {
                      const newPairs = [...(activity.pairs || [])];
                      newPairs[index] = { ...pair, right: e.target.value };
                      updateActivity(activity.id, { pairs: newPairs });
                    }}
                    className="flex-1 bg-background"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const newPairs = activity.pairs?.filter((_, i) => i !== index);
                      updateActivity(activity.id, { pairs: newPairs });
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => updateActivity(activity.id, { pairs: [...(activity.pairs || []), { left: '', right: '' }] })}
              >
                <Plus className="h-4 w-4 mr-1" /> Agregar par
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const getActivityIcon = (type: Activity['type']) => {
    const activityType = activityTypes.find(t => t.type === type);
    return activityType ? activityType.icon : CheckSquare;
  };

  const getActivityLabel = (type: Activity['type']) => {
    const activityType = activityTypes.find(t => t.type === type);
    return activityType ? activityType.label : type;
  };

  return (
    <Card className="p-4 border-border bg-card">
      <h3 className="font-semibold text-foreground mb-4">Actividades Gamificadas</h3>

      {/* Activity Types */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {activityTypes.map(({ type, label, icon: Icon }) => (
          <Button
            key={type}
            type="button"
            variant="outline"
            className="justify-start gap-2"
            onClick={() => addActivity(type as Activity['type'])}
          >
            <Icon className="h-4 w-4" />
            <span className="text-sm">{label}</span>
          </Button>
        ))}
      </div>

      {/* Activity List */}
      {activities.length > 0 && (
        <div className="space-y-3">
          {activities.map((activity, index) => {
            const Icon = getActivityIcon(activity.type);
            return (
              <Collapsible
                key={activity.id}
                open={expandedId === activity.id}
                onOpenChange={(open) => setExpandedId(open ? activity.id : null)}
              >
                <Card className="border-border overflow-hidden">
                  <CollapsibleTrigger className="w-full">
                    <div className="flex items-center justify-between p-3 hover:bg-muted/50">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-primary" />
                        <span className="font-medium text-foreground">
                          Actividad {index + 1}: {getActivityLabel(activity.type)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeActivity(activity.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                        {expandedId === activity.id ? (
                          <ChevronUp className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="p-3 pt-0 border-t border-border">
                      {renderActivityEditor(activity)}
                    </div>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            );
          })}
        </div>
      )}

      {activities.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-4">
          Agrega actividades interactivas para hacer tu lección más dinámica
        </p>
      )}
    </Card>
  );
};

export default ActivityBuilder;
