import { useState } from "react";
import { CheckCircle2, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Activity } from "@/api/services/educationalContentService";
import { cn } from "@/lib/utils";

interface MatchingProps {
    activity: Activity;
    onComplete: (correct: boolean, points: number, badge?: string) => void;
    isCompleted?: boolean;
}

export const Matching = ({ activity, onComplete, isCompleted = false }: MatchingProps) => {
    const [selectedTerm, setSelectedTerm] = useState<string | null>(null);
    const [connections, setConnections] = useState<Record<string, string>>({});
    const [showResult, setShowResult] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);

    const [shuffledTerms] = useState(() =>
        [...(activity.pairs || [])].sort(() => Math.random() - 0.5)
    );
    const [shuffledMatches] = useState(() =>
        [...(activity.pairs || [])].sort(() => Math.random() - 0.5)
    );

    const handleTermClick = (termId: string) => {
        if (showResult || isCompleted) return;

        // If already connected, disconnect
        if (connections[termId]) {
            setConnections(prev => {
                const newConnections = { ...prev };
                delete newConnections[termId];
                return newConnections;
            });
            return;
        }

        setSelectedTerm(termId);
    };

    const handleMatchClick = (matchId: string) => {
        if (showResult || !selectedTerm || isCompleted) return;

        // Check if this match is already used
        const existingTerm = Object.keys(connections).find(t => connections[t] === matchId);
        if (existingTerm) {
            setConnections(prev => {
                const newConnections = { ...prev };
                delete newConnections[existingTerm];
                return newConnections;
            });
        }

        setConnections(prev => ({
            ...prev,
            [selectedTerm]: matchId
        }));
        setSelectedTerm(null);
    };

    const handleSubmit = () => {
        let allCorrect = true;
        activity.pairs?.forEach(pair => {
            if (connections[pair.id] !== pair.id) {
                allCorrect = false;
            }
        });

        setIsCorrect(allCorrect);
        setShowResult(true);

        if (allCorrect) {
            setTimeout(() => onComplete(true, activity.max_points, activity.badge), 1500);
        }
    };

    const handleRetry = () => {
        setConnections({});
        setSelectedTerm(null);
        setShowResult(false);
        setIsCorrect(false);
    };

    const allConnected = Object.keys(connections).length === (activity.pairs?.length || 0);

    const getConnectionColor = (termId: string) => {
        const colors = [
            "bg-blue-500 text-white",
            "bg-green-500 text-white",
            "bg-purple-500 text-white",
            "bg-orange-500 text-white",
            "bg-pink-500 text-white"
        ];
        const index = Object.keys(connections).indexOf(termId);
        return index >= 0 ? colors[index % colors.length] : "";
    };

    return (
        <div className="glass-card p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-start gap-3">
                    <div className="p-2 bg-purple-100 rounded-xl">
                        <Link2 className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                        <span className="text-xs text-muted-foreground uppercase tracking-wide">Emparejamiento</span>
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
                {/* Terms */}
                <div className="space-y-3">
                    <p className="text-sm text-muted-foreground font-medium">Términos:</p>
                    <div className="space-y-2">
                        {shuffledTerms.map((pair) => {
                            const isConnected = !!connections[pair.id];
                            const isSelected = selectedTerm === pair.id;
                            const isCorrectMatch = showResult && connections[pair.id] === pair.id;
                            const isWrongMatch = showResult && connections[pair.id] && connections[pair.id] !== pair.id;

                            return (
                                <button
                                    key={pair.id}
                                    onClick={() => handleTermClick(pair.id)}
                                    disabled={showResult || isCompleted}
                                    className={cn(
                                        "w-full text-left p-3 rounded-xl border-2 transition-all duration-300 flex items-center justify-between",
                                        !showResult && !isConnected && !isSelected && !isCompleted && "border-border/50 hover:border-purple-300",
                                        !showResult && !isConnected && isCompleted && "border-border/50 opacity-50 cursor-default",
                                        !showResult && isSelected && "border-purple-500 bg-purple-50",
                                        !showResult && isConnected && "border-purple-200",
                                        isCorrectMatch && "border-green-500 bg-green-50",
                                        isWrongMatch && "border-red-500 bg-red-50",
                                        (showResult || isCompleted) && "cursor-default"
                                    )}
                                >
                                    <span className={cn(
                                        "text-foreground",
                                        isCorrectMatch && "text-green-700 font-medium"
                                    )}>
                                        {pair.term}
                                    </span>
                                    {isConnected && (
                                        <span className={cn(
                                            "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
                                            !showResult && getConnectionColor(pair.id),
                                            isCorrectMatch && "bg-green-500 text-white",
                                            isWrongMatch && "bg-red-500 text-white"
                                        )}>
                                            {isCorrectMatch ? <CheckCircle2 className="w-4 h-4" /> : Object.keys(connections).indexOf(pair.id) + 1}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Matches */}
                <div className="space-y-3">
                    <p className="text-sm text-muted-foreground font-medium">Definiciones:</p>
                    <div className="space-y-2">
                        {shuffledMatches.map((pair) => {
                            const connectedTermId = Object.keys(connections).find(t => connections[t] === pair.id);
                            const isConnected = !!connectedTermId;
                            const isCorrectMatch = showResult && connectedTermId === pair.id;
                            const isWrongMatch = showResult && connectedTermId && connectedTermId !== pair.id;

                            return (
                                <button
                                    key={pair.id}
                                    onClick={() => handleMatchClick(pair.id)}
                                    disabled={showResult || !selectedTerm || isCompleted}
                                    className={cn(
                                        "w-full text-left p-3 rounded-xl border-2 transition-all duration-300 flex items-center gap-3",
                                        !showResult && !isConnected && selectedTerm && !isCompleted && "border-border/50 hover:border-purple-300 cursor-pointer",
                                        !showResult && !isConnected && (!selectedTerm || isCompleted) && "border-border/50 cursor-default",
                                        !showResult && isConnected && "border-purple-200",
                                        isCorrectMatch && "border-green-500 bg-green-50",
                                        isWrongMatch && "border-red-500 bg-red-50",
                                        (showResult || isCompleted) && "cursor-default"
                                    )}
                                >
                                    {isConnected && connectedTermId && (
                                        <span className={cn(
                                            "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0",
                                            !showResult && getConnectionColor(connectedTermId),
                                            isCorrectMatch && "bg-green-500 text-white",
                                            isWrongMatch && "bg-red-500 text-white"
                                        )}>
                                            {isCorrectMatch ? <CheckCircle2 className="w-4 h-4" /> : Object.keys(connections).indexOf(connectedTermId) + 1}
                                        </span>
                                    )}
                                    <span className={cn(
                                        "text-foreground text-sm",
                                        isCorrectMatch && "text-green-700 font-medium"
                                    )}>
                                        {pair.match}
                                    </span>
                                </button>
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
                        {isCorrect ? "¡Correcto! Todas las conexiones son acertadas." : "Algunas conexiones no son correctas. ¡Inténtalo de nuevo!"}
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
                        disabled={!allConnected}
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                    >
                        Comprobar respuesta
                    </Button>
                )}
            </div>
        </div>
    );
};
