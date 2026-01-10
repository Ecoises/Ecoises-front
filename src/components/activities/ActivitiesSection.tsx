import { useState } from "react";
import { Activity } from "@/api/services/educationalContentService";
import { QuizMultiple } from "./QuizMultiple";
import { QuizTrueFalse } from "./QuizTrueFalse";
import { DragDrop } from "./DragDrop";
import { Matching } from "./Matching";
import { RewardModal } from "./RewardModal";
import { Gamepad2, ChevronRight, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActivitiesSectionProps {
    activities: Activity[];
    lessonTitle: string;
}

export const ActivitiesSection = ({ activities, lessonTitle }: ActivitiesSectionProps) => {
    const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
    const [completedActivities, setCompletedActivities] = useState<Set<number>>(new Set());
    const [totalPoints, setTotalPoints] = useState(0);
    const [earnedBadges, setEarnedBadges] = useState<string[]>([]);
    const [showReward, setShowReward] = useState(false);
    const [lastReward, setLastReward] = useState({ points: 0, badge: "" });

    const handleActivityComplete = async (index: number, correct: boolean, points: number, badge?: string) => {
        // Record attempt in backend (silent fail is ok, or handle error)
        try {
            const activityId = activities[index].id;
            await import("@/api/services/educationalContentService").then(m => m.attemptActivity(activityId, correct, points));
        } catch (e) {
            console.error("Failed to record activity attempt", e);
        }

        if (correct) {
            setCompletedActivities(prev => new Set([...prev, index]));
            setTotalPoints(prev => prev + points);
            if (badge) {
                setEarnedBadges(prev => [...prev, badge]);
            }
            setLastReward({ points, badge: badge || "" });
            setShowReward(true);
        }
    };

    const handleRewardClose = () => {
        setShowReward(false);
        // Move to next activity if available
        if (currentActivityIndex < activities.length - 1) {
            setCurrentActivityIndex(prev => prev + 1);
        }
    };

    const renderActivity = (activity: Activity, index: number) => {
        switch (activity.activity_type) {
            case "quiz_multiple":
                return (
                    <QuizMultiple
                        activity={activity}
                        onComplete={(correct, points, badge) => handleActivityComplete(index, correct, points, badge)}
                    />
                );
            case "quiz_true_false":
                return (
                    <QuizTrueFalse
                        activity={activity}
                        onComplete={(correct, points, badge) => handleActivityComplete(index, correct, points, badge)}
                    />
                );
            case "drag_drop":
                return (
                    <DragDrop
                        activity={activity}
                        onComplete={(correct, points, badge) => handleActivityComplete(index, correct, points, badge)}
                    />
                );
            case "matching":
                return (
                    <Matching
                        activity={activity}
                        onComplete={(correct, points, badge) => handleActivityComplete(index, correct, points, badge)}
                    />
                );
            default:
                return <div key={index} className="p-4 bg-muted rounded">Actividad no soportada: {activity.activity_type}</div>;
        }
    };

    const currentActivity = activities[currentActivityIndex];

    if (!currentActivity) return null;

    return (
        <section className="mt-16 pt-8 border-t border-border/50">
            {/* Section Header */}
            <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-gradient-to-br from-green-300 to-green-100 rounded-2xl">
                    <Gamepad2 className="w-6 h-6 text-green-700" />
                </div>
                <div>
                    <h3 className="font-display text-2xl font-bold text-foreground">
                        Actividades de la Lección
                    </h3>
                    <p className="text-muted-foreground">
                        Pon a prueba lo que has aprendido en: {lessonTitle}
                    </p>
                </div>
            </div>

            {/* Progress & Stats */}
            <div className="glass-card p-4 mb-6 bg-white/50 border border-white/20 rounded-xl">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    {/* Activity Progress */}
                    <div className="flex items-center gap-3">
                        {activities.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => (completedActivities.has(index) || index <= completedActivities.size) && setCurrentActivityIndex(index)}
                                disabled={!(completedActivities.has(index) || index <= completedActivities.size)}
                                className={cn(
                                    "w-10 h-10 rounded-xl flex items-center justify-center font-medium transition-all duration-300",
                                    completedActivities.has(index) && "bg-green-100 text-green-700",
                                    currentActivityIndex === index && !completedActivities.has(index) && "bg-blue-100 text-blue-700 border-2 border-blue-200",
                                    currentActivityIndex !== index && !completedActivities.has(index) && "bg-gray-100 text-gray-400"
                                )}
                            >
                                {completedActivities.has(index) ? (
                                    <CheckCircle2 className="w-5 h-5" />
                                ) : (
                                    index + 1
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4">
                        {earnedBadges.length > 0 && (
                            <div className="flex items-center gap-1 px-3 py-1.5 bg-purple-50 rounded-full">
                                {earnedBadges.map((badge, i) => (
                                    <span key={i} className="text-xl">{badge}</span>
                                ))}
                            </div>
                        )}
                        <div className="px-4 py-2 bg-green-50 rounded-full">
                            <span className="text-sm font-medium text-green-700">{totalPoints} pts</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Current Activity */}
            <div className="animate-fade-in" key={currentActivityIndex}>
                {renderActivity(currentActivity, currentActivityIndex)}
            </div>

            {/* Navigation hint */}
            {completedActivities.has(currentActivityIndex) && currentActivityIndex < activities.length - 1 && (
                <div className="mt-4 text-center">
                    <button
                        onClick={() => setCurrentActivityIndex(prev => prev + 1)}
                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
                    >
                        <span>Siguiente actividad</span>
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* Completion Message */}
            {completedActivities.size === activities.length && (
                <div className="mt-8 glass-card p-6 border-green-200 bg-green-50 text-center animate-fade-in rounded-xl">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                        <CheckCircle2 className="w-8 h-8 text-green-600" />
                    </div>
                    <h4 className="font-display text-xl font-bold text-foreground mb-2">
                        ¡Lección Completada!
                    </h4>
                    <p className="text-muted-foreground mb-4">
                        Has completado todas las actividades de esta lección
                    </p>
                    <div className="flex items-center justify-center gap-6">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-green-600">{totalPoints}</p>
                            <p className="text-xs text-muted-foreground">Puntos totales</p>
                        </div>
                        {earnedBadges.length > 0 && (
                            <div className="text-center">
                                <div className="flex justify-center gap-1 text-2xl">
                                    {earnedBadges.map((badge, i) => (
                                        <span key={i}>{badge}</span>
                                    ))}
                                </div>
                                <p className="text-xs text-muted-foreground">Insignias ganadas</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Reward Modal */}
            <RewardModal
                isOpen={showReward}
                onClose={handleRewardClose}
                points={lastReward.points}
                badge={lastReward.badge}
                totalPoints={totalPoints}
            />
        </section>
    );
};
