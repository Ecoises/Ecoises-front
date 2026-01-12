import { useState } from "react";
import { CheckCircle2, GripVertical, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Activity } from "@/api/services/educationalContentService";
import { cn } from "@/lib/utils";

interface DragDropProps {
    activity: Activity;
    onComplete: (correct: boolean, points: number, badge?: string) => void;
    isCompleted?: boolean;
}

import { useSoundEffect } from "@/hooks/useSoundEffect";

export const DragDrop = ({ activity, onComplete, isCompleted = false }: DragDropProps) => {
    const { playCorrect, playIncorrect } = useSoundEffect();
    // Normalize data structure handles both {Key: Value} object and [{id, element, target}] array
    const normalizedPairs = (() => {
        if (activity.items && !Array.isArray(activity.items) && typeof activity.items === 'object') {
            // Handle { "GET": "Lectura", ... }
            return Object.entries(activity.items).map(([key, value], index) => ({
                id: `item-${index}`,
                element: key,
                target: String(value)
            }));
        }
        if (Array.isArray(activity.pairs)) {
            // Handle existing array format, ensure IDs
            return activity.pairs.map((p, index) => ({
                id: p.id ? String(p.id) : `item-${index}`,
                element: p.element || p.term, // Fallback for term
                target: p.target || p.match   // Fallback for match
            }));
        }
        return [];
    })();

    const [items, setItems] = useState(() =>
        [...normalizedPairs].sort(() => Math.random() - 0.5)
    );
    const [targets] = useState(() =>
        [...normalizedPairs].sort(() => Math.random() - 0.5).map(p => ({ id: p.id, target: p.target }))
    );
    const [placements, setPlacements] = useState<Record<string, string>>({});
    const [showResult, setShowResult] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [draggedItem, setDraggedItem] = useState<string | null>(null);

    const handleDragStart = (e: React.DragEvent, itemId: string) => {
        if (isCompleted) return;
        e.dataTransfer.setData("text/plain", itemId);
        setDraggedItem(itemId);
    };

    const handleDragEnd = () => {
        setDraggedItem(null);
    };

    const handleDragOver = (e: React.DragEvent) => {
        if (isCompleted) return;
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent, targetId: string) => {
        if (isCompleted) return;
        e.preventDefault();
        const itemId = e.dataTransfer.getData("text/plain");

        setPlacements(prev => {
            const newPlacements = { ...prev };
            // Remove item from previous target
            Object.keys(newPlacements).forEach(key => {
                if (newPlacements[key] === itemId) {
                    delete newPlacements[key];
                }
            });
            // Place in new target
            newPlacements[targetId] = itemId;
            return newPlacements;
        });
        setDraggedItem(null);
    };

    const handleSubmit = () => {
        // Check if all placements are correct
        let allCorrect = true;
        normalizedPairs.forEach(pair => {
            const placedItemId = placements[pair.id];
            if (placedItemId !== pair.id) {
                allCorrect = false;
            }
        });

        setIsCorrect(allCorrect);
        setShowResult(true);

        if (allCorrect) {
            playCorrect();
            setTimeout(() => onComplete(true, activity.max_points, activity.badge), 800);
        } else {
            playIncorrect();
        }
    };

    const handleRetry = () => {
        setPlacements({});
        setShowResult(false);
        setIsCorrect(false);
    };

    const getItemById = (id: string) => items.find(p => p.id === id);

    const allPlaced = Object.keys(placements).length === (normalizedPairs.length || 0);

    return (
        <div className="glass-card p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-100 rounded-xl">
                        <GripVertical className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                        <span className="text-xs text-muted-foreground uppercase tracking-wide">Arrastrar y Soltar</span>
                        <h4 className="font-display font-semibold text-foreground mt-1">{activity.instruction}</h4>
                    </div>
                </div>
                {isCompleted && (
                    <div className="flex items-center gap-2 text-success text-sm font-medium bg-success/10 px-3 py-1.5 rounded-full">
                        <CheckCircle2 className="w-4 h-4" />
                        Completada
                    </div>
                )}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Items to drag */}
                <div className="space-y-3">
                    <p className="text-sm text-muted-foreground font-medium">Elementos:</p>
                    <div className="space-y-2">
                        {items.map((pair) => {
                            const isPlaced = Object.values(placements).includes(pair.id);
                            return (
                                <div
                                    key={pair.id}
                                    draggable={!showResult && !isPlaced && !isCompleted}
                                    onDragStart={(e) => handleDragStart(e, pair.id)}
                                    onDragEnd={handleDragEnd}
                                    className={cn(
                                        "p-3 rounded-xl border-2 transition-all duration-300 flex items-center gap-2",
                                        !showResult && !isPlaced && !isCompleted && "border-border/50 bg-secondary/50 cursor-grab active:cursor-grabbing hover:border-blue-300",
                                        !showResult && !isPlaced && isCompleted && "border-border/50 bg-secondary/20 cursor-default opacity-50",
                                        !showResult && isPlaced && "border-blue-200 bg-blue-50 opacity-50",
                                        showResult && "cursor-default",
                                        draggedItem === pair.id && "opacity-50 scale-95"
                                    )}
                                >
                                    <GripVertical className="w-4 h-4 text-muted-foreground" />
                                    <span className="text-foreground">{pair.element}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Targets */}
                <div className="space-y-3">
                    <p className="text-sm text-muted-foreground font-medium">Destinos:</p>
                    <div className="space-y-2">
                        {targets.map((target) => {
                            const placedItemId = placements[target.id];
                            const placedItem = placedItemId ? getItemById(placedItemId) : null;
                            const isCorrectPlacement = showResult && placedItemId === target.id;
                            const isWrongPlacement = showResult && placedItemId && placedItemId !== target.id;

                            return (
                                <div
                                    key={target.id}
                                    onDragOver={handleDragOver}
                                    onDrop={(e) => handleDrop(e, target.id)}
                                    className={cn(
                                        "p-3 rounded-xl border-2 border-dashed min-h-[52px] transition-all duration-300",
                                        !showResult && !placedItem && "border-border/50 bg-background/50",
                                        !showResult && placedItem && "border-blue-300 bg-blue-50",
                                        isCorrectPlacement && "border-green-500 bg-green-50",
                                        isWrongPlacement && "border-red-500 bg-red-50",
                                        isCompleted && "opacity-80"
                                    )}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">{target.target}</span>
                                        {placedItem && (
                                            <span className={cn(
                                                "text-sm font-medium flex items-center gap-2",
                                                isCorrectPlacement && "text-green-600",
                                                isWrongPlacement && "text-red-600",
                                                !showResult && "text-blue-600"
                                            )}>
                                                <ArrowRight className="w-4 h-4" />
                                                {placedItem.element}
                                                {isCorrectPlacement && <CheckCircle2 className="w-4 h-4" />}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {showResult && (
                <div className={cn(
                    "p-4 rounded-xl",
                    isCorrect ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
                )}>
                    <p className={cn(
                        "text-sm",
                        isCorrect ? "text-green-700" : "text-red-700"
                    )}>
                        {isCorrect ? "¡Correcto! Has emparejado todos los elementos." : "Algunas ubicaciones no son correctas. ¡Inténtalo de nuevo!"}
                    </p>
                </div>
            )}

            <div className="flex justify-end gap-3">
                {showResult && !isCorrect && (
                    <Button variant="outline" onClick={handleRetry}>
                        Intentar de nuevo
                    </Button>
                )}
                {!showResult && !isCompleted && (
                    <Button
                        variant="default"
                        onClick={handleSubmit}
                        disabled={!allPlaced}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        Comprobar respuesta
                    </Button>
                )}
            </div>
        </div>
    );
};
