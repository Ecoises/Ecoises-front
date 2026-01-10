import { useState } from "react";
import { CheckCircle2, XCircle, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Activity } from "@/api/services/educationalContentService";
import { cn } from "@/lib/utils";

interface QuizMultipleProps {
    activity: Activity;
    onComplete: (correct: boolean, points: number, badge?: string) => void;
}

export const QuizMultiple = ({ activity, onComplete }: QuizMultipleProps) => {
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);

    const handleOptionSelect = (optionId: string) => {
        if (showResult) return; // Already answered

        setSelectedOption(optionId);
        const option = activity.options?.find(o => o.id === optionId);
        const correct = option?.isCorrect ?? false;
        setIsCorrect(correct);
        setShowResult(true);

        if (correct) {
            setTimeout(() => onComplete(true, activity.max_points, activity.badge), 1500);
        } else {
            // Still call onComplete but with false, so it's recorded
            setTimeout(() => onComplete(false, 0), 1500);
        }
    };

    const handleRetry = () => {
        setSelectedOption(null);
        setShowResult(false);
        setIsCorrect(false);
    };

    const selectedFeedback = activity.options?.find(o => o.id === selectedOption)?.feedback;

    return (
        <div className="glass-card p-6 space-y-6">
            <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/20 rounded-xl">
                    <HelpCircle className="w-5 h-5 text-primary" />
                </div>
                <div>
                    <span className="text-xs text-muted-foreground uppercase tracking-wide">Selección Múltiple</span>
                    <h4 className="font-display font-semibold text-foreground mt-1">{activity.title}</h4>
                </div>
            </div>

            <div className="space-y-3">
                {activity.options?.map((option) => (
                    <button
                        key={option.id}
                        onClick={() => handleOptionSelect(option.id)}
                        disabled={showResult}
                        className={cn(
                            "w-full text-left p-4 rounded-xl border-2 transition-all duration-300",
                            !showResult && selectedOption === option.id && "border-accent bg-accent/10",
                            !showResult && selectedOption !== option.id && "border-border/50 hover:border-accent/50 hover:bg-secondary/50",
                            showResult && option.isCorrect && "border-primary bg-primary/20",
                            showResult && !option.isCorrect && selectedOption === option.id && "border-destructive bg-destructive/10",
                            showResult && selectedOption !== option.id && "opacity-50",
                            showResult && "cursor-default"
                        )}
                    >
                        <div className="flex items-center justify-between">
                            <span className={cn(
                                "font-medium",
                                showResult && option.isCorrect && "text-primary"
                            )}>
                                {option.text}
                            </span>
                            {showResult && option.isCorrect && <CheckCircle2 className="w-5 h-5 text-primary" />}
                            {showResult && !option.isCorrect && selectedOption === option.id && <XCircle className="w-5 h-5 text-destructive" />}
                        </div>
                    </button>
                ))}
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
