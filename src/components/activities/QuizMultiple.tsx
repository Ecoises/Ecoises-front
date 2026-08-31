import { useState } from "react";
import { CheckCircle2, XCircle, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Activity, ActivityAnswers, ActivityAttemptResponse } from "@/api/services/educationalContentService";
import { cn } from "@/lib/utils";

interface QuizMultipleProps {
    activity: Activity;
    onSubmit: (answers: ActivityAnswers) => Promise<ActivityAttemptResponse>;
    isCompleted?: boolean;
}

import { useSoundEffect } from "@/hooks/useSoundEffect";

export const QuizMultiple = ({ activity, onSubmit, isCompleted = false }: QuizMultipleProps) => {
    const { playCorrect, playIncorrect } = useSoundEffect();
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [feedback, setFeedback] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleOptionSelect = async (index: number) => {
        if (showResult || isCompleted || isSubmitting) return;

        setSelectedIndex(index);
        const option = activity.options?.[index];
        if (!option) return;

        setIsSubmitting(true);
        setError(null);
        try {
            const result = await onSubmit({ option_id: option.id });
            setIsCorrect(result.is_correct);
            setFeedback(result.feedback ?? null);
            setShowResult(true);
            result.is_correct ? playCorrect() : playIncorrect();
        } catch {
            setError("No fue posible comprobar la respuesta. Inténtalo nuevamente.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRetry = () => {
        setSelectedIndex(null);
        setShowResult(false);
        setIsCorrect(false);
        setFeedback(null);
        setError(null);
    };

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
                    const isSelected = selectedIndex === index;

                    return (
                        <button
                            key={index}
                            onClick={() => handleOptionSelect(index)}
                            disabled={showResult || isCompleted || isSubmitting}
                            className={cn(
                                "w-full text-left p-4 rounded-xl border-2 transition-all duration-300",
                                !showResult && isSelected && "border-accent bg-accent/10",
                                !showResult && !isSelected && !isCompleted && "border-border/50 hover:border-accent/50 hover:bg-secondary/50",
                                showResult && isSelected && isCorrect && "border-primary bg-primary/20",
                                showResult && isSelected && !isCorrect && "border-destructive bg-destructive/10",
                                showResult && !isSelected && "opacity-50",
                                (showResult || isCompleted) && "cursor-default"
                            )}
                        >
                            <div className="flex items-center justify-between">
                                <span className={cn(
                                    "font-medium",
                                    showResult && isSelected && isCorrect && "text-primary"
                                )}>
                                    {option.text}
                                </span>
                                {showResult && isSelected && isCorrect && <CheckCircle2 className="w-5 h-5 text-primary" />}
                                {showResult && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-destructive" />}
                            </div>
                        </button>
                    );
                })}
            </div>

            {showResult && feedback && (
                <div className={cn(
                    "p-4 rounded-xl animate-fade-in",
                    isCorrect ? "bg-primary/10 border border-primary/20" : "bg-destructive/10 border border-destructive/20"
                )}>
                    <p className={cn(
                        "text-sm",
                        isCorrect ? "text-primary" : "text-destructive"
                    )}>
                        {feedback}
                    </p>
                </div>
            )}

            {error && <p className="text-sm text-destructive">{error}</p>}

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
