import { useState } from "react";
import { CheckCircle2, XCircle, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Activity } from "@/api/services/educationalContentService";
import { cn } from "@/lib/utils";

interface QuizTrueFalseProps {
    activity: Activity;
    onComplete: (correct: boolean, points: number, badge?: string) => void;
    isCompleted?: boolean;
}

import { useSoundEffect } from "@/hooks/useSoundEffect";

export const QuizTrueFalse = ({ activity, onComplete, isCompleted = false }: QuizTrueFalseProps) => {
    const { playCorrect, playIncorrect } = useSoundEffect();
    const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [dragX, setDragX] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);

    const handleAnswer = (answer: boolean) => {
        if (showResult || isCompleted) return;
        setSelectedAnswer(answer);

        // Backend might send "true"/"false" strings or booleans
        // Fix: prioritize correct_answer over is_true
        const correctAnswer = activity.correct_answer !== undefined
            ? (activity.correct_answer === true || activity.correct_answer === "true")
            : (activity.is_true === true || activity.is_true === "true");

        const correct = answer === correctAnswer;

        setIsCorrect(correct);
        setShowResult(true);

        if (correct) {
            playCorrect();
            setTimeout(() => onComplete(true, activity.max_points, activity.badge), 800);
        } else {
            playIncorrect();
        }
    };

    const handleRetry = () => {
        setSelectedAnswer(null);
        setShowResult(false);
        setIsCorrect(false);
        setDragX(0);
    };

    // Touch/Mouse drag handlers
    const handleDragStart = (clientX: number) => {
        if (showResult || isCompleted) return;
        setIsDragging(true);
        setStartX(clientX);
    };

    const handleDragMove = (clientX: number) => {
        if (!isDragging || showResult || isCompleted) return;
        const delta = clientX - startX;
        setDragX(Math.max(-150, Math.min(150, delta)));
    };

    const handleDragEnd = () => {
        if (!isDragging || showResult || isCompleted) return;
        setIsDragging(false);

        if (dragX > 80) {
            // Swiped right = Verdadero
            handleAnswer(true);
        } else if (dragX < -80) {
            // Swiped left = Falso
            handleAnswer(false);
        } else {
            setDragX(0);
        }
    };

    // Calculate visual effects based on drag
    const rotation = dragX / 10;
    const showVerdadero = dragX > 30;
    const showFalso = dragX < -30;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-start gap-3">
                    <div className="p-2 bg-yellow-100 rounded-xl">
                        <HelpCircle className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div>
                        <span className="text-xs text-muted-foreground uppercase tracking-wide">Verdadero o Falso</span>
                        <p className="text-sm text-muted-foreground mt-1">Desliza la tarjeta o usa los botones</p>
                    </div>
                </div>
                {isCompleted && (
                    <div className="flex items-center gap-2 text-success text-sm font-medium bg-success/10 px-3 py-1.5 rounded-full">
                        <CheckCircle2 className="w-4 h-4" />
                        Completada
                    </div>
                )}
            </div>

            {/* Swipeable Card Container */}
            <div className="relative flex items-center justify-center min-h-[280px]">
                {/* Background indicators */}
                <div
                    className={cn(
                        "absolute left-4 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200",
                        showFalso ? "bg-red-100 scale-110" : "bg-red-50"
                    )}
                >
                    <span className={cn(
                        "text-2xl font-bold transition-colors",
                        showFalso ? "text-red-500" : "text-red-200"
                    )}>F</span>
                </div>
                <div
                    className={cn(
                        "absolute right-4 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200",
                        showVerdadero ? "bg-green-100 scale-110" : "bg-green-50"
                    )}
                >
                    <span className={cn(
                        "text-2xl font-bold transition-colors",
                        showVerdadero ? "text-green-500" : "text-green-200"
                    )}>V</span>
                </div>

                {/* Swipeable Card */}
                <div
                    className={cn(
                        "glass-card p-6 w-full max-w-md cursor-grab active:cursor-grabbing select-none transition-shadow duration-200 bg-white border shadow-sm rounded-xl",
                        isDragging && "shadow-2xl",
                        showResult && isCorrect && "border-green-500 bg-green-50",
                        showResult && !isCorrect && "border-red-500 bg-red-50",
                        isCompleted && "opacity-80 cursor-default"
                    )}
                    style={{
                        transform: showResult
                            ? `translateX(${isCorrect === ((activity.correct_answer !== undefined ? (activity.correct_answer === true || activity.correct_answer === "true") : (activity.is_true === true || activity.is_true === "true")) === true) ? ((activity.correct_answer !== undefined ? (activity.correct_answer === true || activity.correct_answer === "true") : (activity.is_true === true || activity.is_true === "true")) ? 50 : -50) : 0}px)`
                            : `translateX(${dragX}px) rotate(${rotation}deg)`,
                        transition: isDragging ? 'none' : 'transform 0.3s ease-out'
                    }}
                    onMouseDown={(e) => handleDragStart(e.clientX)}
                    onMouseMove={(e) => handleDragMove(e.clientX)}
                    onMouseUp={handleDragEnd}
                    onMouseLeave={() => isDragging && handleDragEnd()}
                    onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
                    onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
                    onTouchEnd={handleDragEnd}
                >
                    {/* Swipe indicators on card */}
                    <div
                        className={cn(
                            "absolute top-4 right-4 px-3 py-1 rounded-lg border-2 font-bold text-sm transition-opacity",
                            "border-green-500 text-green-500",
                            showVerdadero && !showResult ? "opacity-100" : "opacity-0"
                        )}
                    >
                        VERDADERO
                    </div>
                    <div
                        className={cn(
                            "absolute top-4 left-4 px-3 py-1 rounded-lg border-2 font-bold text-sm transition-opacity",
                            "border-red-500 text-red-500",
                            showFalso && !showResult ? "opacity-100" : "opacity-0"
                        )}
                    >
                        FALSO
                    </div>

                    {/* Card content */}
                    <div className="py-8 px-4 text-center">
                        <h4 className="font-display text-xl font-semibold text-foreground leading-relaxed">
                            {activity.title}
                        </h4>
                    </div>

                    {/* Result indicator */}
                    {showResult && (
                        <div className={cn(
                            "absolute inset-0 flex items-center justify-center bg-background/80 rounded-2xl animate-fade-in"
                        )}>
                            <div className="text-center">
                                {isCorrect ? (
                                    <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-2" />
                                ) : (
                                    <XCircle className="w-16 h-16 text-red-500 mx-auto mb-2" />
                                )}
                                <p className={cn(
                                    "font-bold text-lg",
                                    isCorrect ? "text-green-500" : "text-red-500"
                                )}>
                                    {isCorrect ? "¡Correcto!" : "Incorrecto"}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* V/F Buttons */}
            <div className="flex justify-center gap-6">
                <button
                    onClick={() => handleAnswer(false)}
                    disabled={showResult || isCompleted}
                    className={cn(
                        "w-16 h-16 rounded-full border-4 flex items-center justify-center font-bold text-2xl transition-all duration-300",
                        !showResult && !isCompleted && "border-red-200 text-red-500 hover:border-red-500 hover:bg-red-50 hover:scale-110",
                        showResult && selectedAnswer === false && !isCorrect && "border-red-500 bg-red-100 text-red-500",
                        showResult && selectedAnswer === false && isCorrect && "border-green-500 bg-green-100 text-green-500",
                        (showResult || isCompleted) && selectedAnswer !== false && "border-muted text-muted-foreground opacity-50",
                        showResult && (activity.correct_answer !== undefined ? (activity.correct_answer === "false" || activity.correct_answer === false) : (activity.is_true === "false" || activity.is_true === false)) && selectedAnswer !== false && "border-green-500 text-green-500 opacity-50"
                    )}
                >
                    F
                </button>
                <button
                    onClick={() => handleAnswer(true)}
                    disabled={showResult || isCompleted}
                    className={cn(
                        "w-16 h-16 rounded-full border-4 flex items-center justify-center font-bold text-2xl transition-all duration-300",
                        !showResult && !isCompleted && "border-green-200 text-green-500 hover:border-green-500 hover:bg-green-50 hover:scale-110",
                        showResult && selectedAnswer === true && isCorrect && "border-green-500 bg-green-100 text-green-500",
                        showResult && selectedAnswer === true && !isCorrect && "border-red-500 bg-red-100 text-red-500",
                        (showResult || isCompleted) && selectedAnswer !== true && "border-muted text-muted-foreground opacity-50",
                        showResult && (activity.correct_answer !== undefined ? (activity.correct_answer === "true" || activity.correct_answer === true) : (activity.is_true === "true" || activity.is_true === true)) && selectedAnswer !== true && "border-green-500 text-green-500 opacity-50"
                    )}
                >
                    V
                </button>
            </div>

            {/* Feedback */}
            {showResult && (
                <div className={cn(
                    "p-4 rounded-xl animate-fade-in",
                    isCorrect ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
                )}>
                    <p className={cn(
                        "text-sm",
                        isCorrect ? "text-green-700" : "text-red-700"
                    )}>
                        {isCorrect
                            ? (activity.feedback_correct || activity.true_false_feedback || "¡Correcto!")
                            : (activity.feedback_incorrect || activity.true_false_feedback || "Incorrecto")}
                    </p>
                </div>
            )}

            {/* Retry button */}
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
