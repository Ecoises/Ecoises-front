import { useState } from "react";
import { CheckCircle2, XCircle, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Activity } from "@/api/services/educationalContentService";
import { cn } from "@/lib/utils";

interface QuizMultipleProps {
    activity: Activity;
    onComplete: (correct: boolean, points: number, badge?: string) => void;
    isCompleted?: boolean;
}

import { useSoundEffect } from "@/hooks/useSoundEffect";

export const QuizMultiple = ({ activity, onComplete, isCompleted = false }: QuizMultipleProps) => {
    const { playCorrect, playIncorrect } = useSoundEffect();
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);

    const handleOptionSelect = (index: number) => {
        if (showResult || isCompleted) return; // Already answered or completed

        setSelectedIndex(index);
        const option = activity.options?.[index];
        const correct = option?.isCorrect ?? option?.is_correct ?? false;
        setIsCorrect(correct);
        setShowResult(true);

        if (correct) {
            playCorrect();
            setTimeout(() => onComplete(true, activity.max_points, activity.badge), 800);
        } else {
            playIncorrect();
            // Still call onComplete but with false, so it's recorded
            setTimeout(() => onComplete(false, 0), 1500);
        }
    };

    const handleRetry = () => {
        setSelectedIndex(null);
        setShowResult(false);
        setIsCorrect(false);
    };

    // Safe access to selected option's feedback
    const selectedFeedback = selectedIndex !== null ? activity.options?.[selectedIndex]?.feedback : null;

    return (
        <div className="glass-card p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary/20 rounded-xl">
                        <HelpCircle className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <span className="text-xs text-muted-foreground uppercase tracking-wide">Selección Múltiple</span>
                        <h4 className="font-display font-semibold text-foreground mt-1">{activity.title}</h4>
                    </div>
                </div>
                {isCompleted && (
                    <div className="flex items-center gap-2 text-success text-sm font-medium bg-success/10 px-3 py-1.5 rounded-full">
                        <CheckCircle2 className="w-4 h-4" />
                        Completada
                    </div>
                )}
            </div>

            <div className="space-y-3">
                {activity.options?.map((option, index) => {
                    // Check both camelCase (frontend mock) and snake_case (backend)
                    const isOptCorrect = option.isCorrect ?? option.is_correct ?? false;
                    const isSelected = selectedIndex === index;

                    return (
                        <button
                            key={index}
                            onClick={() => handleOptionSelect(index)}
                            disabled={showResult || isCompleted}
                            className={cn(
                                "w-full text-left p-4 rounded-xl border-2 transition-all duration-300",
                                !showResult && isSelected && "border-accent bg-accent/10",
                                !showResult && !isSelected && !isCompleted && "border-border/50 hover:border-accent/50 hover:bg-secondary/50",
                                (showResult || isCompleted) && isOptCorrect && "border-primary bg-primary/20",
                                showResult && !isOptCorrect && isSelected && "border-destructive bg-destructive/10",
                                (showResult || isCompleted) && !isSelected && !isOptCorrect && "opacity-50",
                                (showResult || isCompleted) && "cursor-default"
                            )}
                        >
                            <div className="flex items-center justify-between">
                                <span className={cn(
                                    "font-medium",
                                    (showResult || isCompleted) && isOptCorrect && "text-primary"
                                )}>
                                    {option.text}
                                </span>
                                {(showResult || isCompleted) && isOptCorrect && <CheckCircle2 className="w-5 h-5 text-primary" />}
                                {showResult && !isOptCorrect && isSelected && <XCircle className="w-5 h-5 text-destructive" />}
                            </div>
                        </button>
                    );
                })}
            </div>

            {showResult && selectedFeedback && (
                <div className={cn(
                    "p-4 rounded-xl animate-fade-in",
                    isCorrect ? "bg-primary/10 border border-primary/20" : "bg-destructive/10 border border-destructive/20"
                )}>
                    <p className={cn(
                        "text-sm",
                        isCorrect ? "text-primary" : "text-destructive"
                    )}>
                        {selectedFeedback}
                    </p>
                </div>
            )}

            {showResult && !isCorrect && (
                <div className="flex justify-center">
                    <Button variant="outline" onClick={handleRetry}>
                        Intentar de nuevo
                    </Button>
                </div>
            )}
        </div>
    );
};
