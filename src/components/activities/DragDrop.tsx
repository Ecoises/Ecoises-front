import { useState, useRef } from "react";
import { CheckCircle2, GripVertical, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Activity, ActivityAnswers, ActivityAttemptResponse } from "@/api/services/educationalContentService";
import { cn } from "@/lib/utils";
import { useSoundEffect } from "@/hooks/useSoundEffect";

interface DragDropProps {
    activity: Activity;
    onSubmit: (answers: ActivityAnswers) => Promise<ActivityAttemptResponse>;
    isCompleted?: boolean;
}

interface CategoryState {
    id: string;
    name: string;
}

interface ItemState {
    id: string;
    label: string;
    categoryName: string | null; // which bucket the user dropped it into (null = unplaced)
}

export const DragDrop = ({ activity, onSubmit, isCompleted = false }: DragDropProps) => {
    const { playCorrect, playIncorrect } = useSoundEffect();

    // Build categories & shuffled item list from activity data
    const { categories, allItems } = (() => {
        const cats: CategoryState[] = [];
        const items: ItemState[] = [];

        (activity.categories ?? []).forEach((cat) => cats.push({ id: cat.id, name: cat.name }));
        (activity.items ?? []).forEach((item) => items.push({
            id: item.id,
            label: item.label,
            categoryName: null,
        }));

        // Shuffle items
        const shuffled = [...items].sort(() => Math.random() - 0.5);
        return { categories: cats, allItems: shuffled };
    })();

    const [items, setItems] = useState<ItemState[]>(allItems);
    const [draggedId, setDraggedId] = useState<string | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const dragOverCategory = useRef<string | null>(null);

    // ─── Drag handlers ───────────────────────────────────────────
    const handleDragStart = (e: React.DragEvent, id: string) => {
        if (isCompleted || showResult) return;
        e.dataTransfer.setData("text/plain", id);
        setDraggedId(id);
    };

    const handleDragEnd = () => setDraggedId(null);

    const handleDragOver = (e: React.DragEvent, catName: string) => {
        if (isCompleted || showResult) return;
        e.preventDefault();
        dragOverCategory.current = catName;
    };

    const handleDropOnCategory = (e: React.DragEvent, catName: string) => {
        if (isCompleted || showResult) return;
        e.preventDefault();
        const id = e.dataTransfer.getData("text/plain");
        setItems(prev =>
            prev.map(it => it.id === id ? { ...it, categoryName: catName } : it)
        );
        setDraggedId(null);
    };

    // Drop back to the pool (un-place an item)
    const handleDropOnPool = (e: React.DragEvent) => {
        if (isCompleted || showResult) return;
        e.preventDefault();
        const id = e.dataTransfer.getData("text/plain");
        setItems(prev =>
            prev.map(it => it.id === id ? { ...it, categoryName: null } : it)
        );
        setDraggedId(null);
    };

    // Click to remove from category back to pool
    const returnToPool = (id: string) => {
        if (isCompleted || showResult) return;
        setItems(prev => prev.map(it => it.id === id ? { ...it, categoryName: null } : it));
    };

    // ─── Submit ───────────────────────────────────────────────────
    const handleSubmit = async () => {
        setIsSubmitting(true);
        setError(null);
        try {
            const placements = Object.fromEntries(items.map(item => [item.id, item.categoryName]));
            const result = await onSubmit({ placements });
            setIsCorrect(result.is_correct);
            setShowResult(true);
            result.is_correct ? playCorrect() : playIncorrect();
        } catch {
            setError("No fue posible comprobar la clasificación. Inténtalo nuevamente.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRetry = () => {
        setItems(prev => prev.map(it => ({ ...it, categoryName: null })));
        setShowResult(false);
        setIsCorrect(false);
        setError(null);
    };

    const unplacedItems = items.filter(it => it.categoryName === null);
    const allPlaced = unplacedItems.length === 0;

    const getItemCorrectness = (item: ItemState) => {
        if (!showResult || item.categoryName === null) return null;
        return isCorrect;
    };

    return (
        <div className="glass-card p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-start gap-3">
                    <div className="p-2 bg-indigo-100 rounded-xl">
                        <Layers className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                        <span className="text-xs text-muted-foreground uppercase tracking-wide">Clasificar elementos</span>
                        <h4 className="font-display font-semibold text-foreground mt-1">{activity.title}</h4>
                        <p className="text-sm text-muted-foreground mt-0.5">Arrastra cada palabra a la categoría que le corresponde</p>
                    </div>
                </div>
                {isCompleted && (
                    <div className="flex items-center gap-2 text-success text-sm font-medium bg-success/10 px-3 py-1.5 rounded-full">
                        <CheckCircle2 className="w-4 h-4" />
                        Completada
                    </div>
                )}
            </div>

            {/* Pool of unplaced items */}
            <div
                className={cn(
                    "min-h-[60px] p-3 rounded-xl border-2 border-dashed transition-all duration-200",
                    draggedId ? "border-indigo-300 bg-indigo-50/50" : "border-border/40 bg-muted/30"
                )}
                onDragOver={(e) => { e.preventDefault(); }}
                onDrop={handleDropOnPool}
            >
                <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                    Elementos disponibles ({unplacedItems.length})
                </p>
                <div className="flex flex-wrap gap-2 min-h-[32px]">
                    {unplacedItems.map(item => (
                        <div
                            key={item.id}
                            draggable={!isCompleted && !showResult}
                            onDragStart={(e) => handleDragStart(e, item.id)}
                            onDragEnd={handleDragEnd}
                            className={cn(
                                "px-3 py-1.5 rounded-lg border-2 text-sm font-medium select-none transition-all duration-200",
                                "flex items-center gap-1.5",
                                !isCompleted && !showResult
                                    ? "border-indigo-200 bg-white cursor-grab active:cursor-grabbing hover:border-indigo-400 hover:shadow-sm"
                                    : "border-border/50 bg-white/50 cursor-default opacity-60",
                                draggedId === item.id && "opacity-40 scale-95"
                            )}
                        >
                            <GripVertical className="w-3 h-3 text-muted-foreground" />
                            {item.label}
                        </div>
                    ))}
                    {unplacedItems.length === 0 && (
                        <span className="text-xs text-muted-foreground italic">Todos los elementos han sido clasificados</span>
                    )}
                </div>
            </div>

            {/* Categories grid */}
            <div className={cn(
                "grid gap-4",
                categories.length === 2 ? "md:grid-cols-2" :
                categories.length === 3 ? "md:grid-cols-3" :
                categories.length >= 4 ? "md:grid-cols-2 lg:grid-cols-4" : "grid-cols-1"
            )}>
                {categories.map((cat) => {
                    const placedHere = items.filter(it => it.categoryName === cat.id);
                    const isDragTarget = draggedId !== null;

                    return (
                        <div
                            key={cat.id}
                            onDragOver={(e) => handleDragOver(e, cat.id)}
                            onDrop={(e) => handleDropOnCategory(e, cat.id)}
                            className={cn(
                                "rounded-xl border-2 transition-all duration-200 overflow-hidden",
                                !showResult && isDragTarget
                                    ? "border-indigo-400 bg-indigo-50 shadow-md scale-[1.01]"
                                    : !showResult
                                    ? "border-border/50 bg-background/80"
                                    : isCorrect
                                    ? "border-green-400 bg-green-50"
                                    : "border-border/50 bg-background/80"
                            )}
                        >
                            {/* Category header */}
                            <div className={cn(
                                "px-4 py-2.5 font-semibold text-sm border-b",
                                !showResult
                                    ? "bg-indigo-600 text-white border-indigo-700"
                                    : isCorrect
                                    ? "bg-green-600 text-white border-green-700"
                                    : "bg-indigo-600 text-white border-indigo-700"
                            )}>
                                {cat.name}
                            </div>

                            {/* Dropped items */}
                            <div className="p-3 flex flex-wrap gap-2 min-h-[80px]">
                                {placedHere.length === 0 && (
                                    <span className="text-xs text-muted-foreground italic self-center w-full text-center">
                                        Suelta aquí
                                    </span>
                                )}
                                {placedHere.map(item => {
                                    const ok = getItemCorrectness(item);
                                    return (
                                        <button
                                            key={item.id}
                                            draggable={!isCompleted && !showResult}
                                            onDragStart={(e) => handleDragStart(e, item.id)}
                                            onDragEnd={handleDragEnd}
                                            onClick={() => returnToPool(item.id)}
                                            title={!showResult ? "Clic para devolver" : undefined}
                                            className={cn(
                                                "px-3 py-1.5 rounded-lg border-2 text-sm font-medium select-none transition-all duration-200",
                                                "flex items-center gap-1.5",
                                                !showResult
                                                    ? "border-indigo-300 bg-indigo-50 cursor-grab hover:border-red-300 hover:bg-red-50 active:cursor-grabbing"
                                                    : ok === true
                                                    ? "border-green-500 bg-green-100 text-green-800 cursor-default"
                                                    : ok === false
                                                    ? "border-red-400 bg-red-100 text-red-800 cursor-default"
                                                    : "border-border bg-white cursor-default"
                                            )}
                                        >
                                            {!showResult && <GripVertical className="w-3 h-3 text-muted-foreground" />}
                                            {item.label}
                                            {showResult && ok === true && <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />}
                                            {showResult && ok === false && <span className="text-red-500 font-bold text-xs">✗</span>}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Result feedback */}
            {showResult && (
                <div className={cn(
                    "p-4 rounded-xl border",
                    isCorrect ? "bg-green-50 border-green-200" : "bg-amber-50 border-amber-200"
                )}>
                    <p className={cn("text-sm font-medium", isCorrect ? "text-green-700" : "text-amber-700")}>
                        {isCorrect
                            ? "¡Excelente! Has clasificado todos los elementos correctamente."
                            : "Algunas clasificaciones no son correctas. Los elementos en rojo están en la categoría equivocada. ¡Inténtalo de nuevo!"}
                    </p>
                </div>
            )}

            {error && <p className="text-sm text-destructive">{error}</p>}

            {/* Actions */}
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
                        disabled={!allPlaced || isSubmitting}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white"
                    >
                        {!allPlaced
                            ? `Faltan ${unplacedItems.length} elemento${unplacedItems.length !== 1 ? "s" : ""}`
                            : "Comprobar clasificación"}
                    </Button>
                )}
            </div>
        </div>
    );
};
