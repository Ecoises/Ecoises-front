import { motion } from "framer-motion";

interface CourseProgressProps {
    progress: number; // 0-100
    className?: string;
}

export const CourseProgress = ({ progress, className = "" }: CourseProgressProps) => {
    // Determine color based on progress
    const getProgressColor = () => {
        if (progress < 33) return "from-red-500 to-orange-500";
        if (progress < 66) return "from-yellow-500 to-amber-500";
        return "from-green-500 to-emerald-500";
    };

    return (
        <div className={`space-y-2 ${className}`}>
            {/* Progress Bar */}
            <div className="relative h-3 bg-muted rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`h-full bg-gradient-to-r ${getProgressColor()} rounded-full`}
                />
            </div>

            {/* Progress Text */}
            <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progreso</span>
                <motion.span
                    key={progress}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="font-semibold text-foreground"
                >
                    {Math.round(progress)}%
                </motion.span>
            </div>
        </div>
    );
};
