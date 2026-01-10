import { useEffect, useState } from "react";
import { Trophy, Star, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface RewardModalProps {
    isOpen: boolean;
    onClose: () => void;
    points: number;
    badge?: string;
    totalPoints: number;
}

export const RewardModal = ({ isOpen, onClose, points, badge, totalPoints }: RewardModalProps) => {
    const [showContent, setShowContent] = useState(false);
    const [showPoints, setShowPoints] = useState(false);
    const [showBadge, setShowBadge] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setShowContent(true);
            setShowPoints(true);
            setShowBadge(true); // Always show badge animation if badge exists or not, simplified logic
        } else {
            setShowContent(false);
            setShowPoints(false);
            setShowBadge(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-background/80 backdrop-blur-md"
                onClick={onClose}
            />

            {/* Confetti-like particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute animate-float"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 2}s`,
                            animationDuration: `${3 + Math.random() * 2}s`
                        }}
                    >
                        <Sparkles
                            className="w-4 h-4 text-yellow-500 opacity-60"
                            style={{ transform: `rotate(${Math.random() * 360}deg)` }}
                        />
                    </div>
                ))}
            </div>

            {/* Modal */}
            <div className={cn(
                "relative z-10 bg-white border border-yellow-200 p-8 max-w-md w-full mx-4 text-center transition-all duration-500 shadow-xl rounded-3xl",
                showContent ? "scale-100 opacity-100" : "scale-90 opacity-0"
            )}>
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Trophy Icon */}
                <div className="relative w-24 h-24 mx-auto mb-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full blur-xl opacity-50 animate-pulse" />
                    <div className="relative w-full h-full bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full flex items-center justify-center border-4 border-yellow-100 shadow-inner">
                        <Trophy className="w-12 h-12 text-white" />
                    </div>
                </div>

                {/* Title */}
                <h2 className="font-display text-3xl font-bold text-foreground mb-2">
                    ¡Felicitaciones!
                </h2>
                <p className="text-muted-foreground mb-8">
                    Has completado la actividad correctamente
                </p>

                {/* Points */}
                <div className={cn(
                    "transition-all duration-500 mb-6",
                    showPoints ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                )}>
                    <div className="inline-flex items-center gap-3 px-6 py-3 bg-green-50 rounded-2xl border border-green-200">
                        <Star className="w-6 h-6 text-green-500 fill-green-500" />
                        <div className="text-left">
                            <span className="text-3xl font-bold text-green-700">+{points}</span>
                            <p className="text-xs text-green-600">puntos ganados</p>
                        </div>
                    </div>
                </div>

                {/* Badge */}
                {badge && (
                    <div className={cn(
                        "transition-all duration-500 mb-8",
                        showBadge ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                    )}>
                        <div className="inline-flex flex-col items-center gap-2 px-6 py-4 bg-purple-50 rounded-2xl border border-purple-200">
                            <span className="text-5xl">{badge}</span>
                            <p className="text-sm text-purple-600 font-medium">¡Nueva insignia!</p>
                        </div>
                    </div>
                )}

                {/* Total Points */}
                <div className="pt-4 border-t border-border/50 mb-6">
                    <p className="text-sm text-muted-foreground">
                        Puntos totales del curso: <span className="font-bold text-foreground">{totalPoints}</span>
                    </p>
                </div>

                <Button size="lg" onClick={onClose} className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded-xl shadow-lg shadow-yellow-200">
                    ¡Continuar!
                </Button>
            </div>
        </div>
    );
};
