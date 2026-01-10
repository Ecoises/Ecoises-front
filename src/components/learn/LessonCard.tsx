import { motion } from "framer-motion";
import { CheckCircle2, Lock, PlayCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface LessonCardProps {
    lesson: {
        id: number;
        title: string;
        estimated_duration: number;
        activities?: any[];
    };
    index: number;
    isCompleted: boolean;
    isLocked: boolean;
    isCurrent: boolean;
    onClick: () => void;
}

export const LessonCard = ({
    lesson,
    index,
    isCompleted,
    isLocked,
    isCurrent,
    onClick
}: LessonCardProps) => {
    const activityCount = lesson.activities?.length || 0;

    return (
        <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={!isLocked ? { scale: 1.02 } : {}}
            whileTap={!isLocked ? { scale: 0.98 } : {}}
            onClick={!isLocked ? onClick : undefined}
            disabled={isLocked}
            className={cn(
                "w-full text-left p-4 rounded-xl border-2 transition-all duration-300",
                "flex items-center gap-4",
                isCompleted && "border-green-200 bg-green-50/50 dark:bg-green-900/10",
                isCurrent && !isCompleted && "border-primary bg-primary/5",
                !isCompleted && !isCurrent && !isLocked && "border-border hover:border-primary/50 hover:bg-muted/50",
                isLocked && "opacity-50 cursor-not-allowed"
            )}
        >
            {/* Status Icon */}
            <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0",
                isCompleted && "bg-green-100 text-green-700 dark:bg-green-900/30",
                isCurrent && !isCompleted && "bg-primary/20 text-primary",
                !isCompleted && !isCurrent && !isLocked && "bg-muted text-muted-foreground",
                isLocked && "bg-muted text-muted-foreground"
            )}>
                {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5" />
                ) : isLocked ? (
                    <Lock className="w-5 h-5" />
                ) : isCurrent ? (
                    <PlayCircle className="w-5 h-5" />
                ) : (
                    index + 1
                )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <h4 className={cn(
                    "font-semibold text-foreground truncate",
                    isLocked && "text-muted-foreground"
                )}>
                    {lesson.title}
                </h4>
                <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{lesson.estimated_duration} min</span>
                    </div>
                    {activityCount > 0 && (
                        <div className="flex items-center gap-1">
                            <span>•</span>
                            <span>{activityCount} {activityCount === 1 ? 'actividad' : 'actividades'}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Completion Badge */}
            {isCompleted && (
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full dark:bg-green-900/30"
                >
                    Completada
                </motion.div>
            )}
        </motion.button>
    );
};
