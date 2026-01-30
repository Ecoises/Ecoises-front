import { useRef, useEffect, useState } from "react";
import { Play, Pause, SkipBack, SkipForward, X, Gauge } from "lucide-react";
import { cn } from "@/lib/utils";

interface AudioPlayerProps {
    audioUrl: string;
    isOpen: boolean;
    onClose: () => void;
}

export const AudioPlayer = ({ audioUrl, isOpen, onClose }: AudioPlayerProps) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const previousAudioUrl = useRef<string>("");
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [playbackRate, setPlaybackRate] = useState(1);
    const [showSpeedMenu, setShowSpeedMenu] = useState(false);

    const speedOptions = [0.5, 0.75, 1, 1.25, 1.5, 2];

    // Get full URL for audio
    const getAudioUrl = () => {
        if (!audioUrl) return "";
        if (audioUrl.startsWith('http')) return audioUrl;
        // Si ya incluye /storage/, no lo agregues de nuevo
        if (audioUrl.startsWith('/storage/') || audioUrl.startsWith('storage/')) {
            const cleanPath = audioUrl.startsWith('/') ? audioUrl : `/${audioUrl}`;
            return `${import.meta.env.VITE_APP_API_URL || 'http://localhost:8000'}${cleanPath}`;
        }
        return `${import.meta.env.VITE_APP_API_URL || 'http://localhost:8000'}/storage/${audioUrl}`;
    };

    // Reset when audio URL actually changes
    useEffect(() => {
        const currentUrl = getAudioUrl();
        
        // Only reload if the URL actually changed
        if (audioRef.current && currentUrl !== previousAudioUrl.current && currentUrl !== "") {
            previousAudioUrl.current = currentUrl;
            audioRef.current.load();
            setIsPlaying(false);
            setCurrentTime(0);
            setDuration(0);
        }
    }, [audioUrl]);

    // Update current time and duration
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const updateTime = () => setCurrentTime(audio.currentTime);
        const updateDuration = () => {
            if (isFinite(audio.duration)) {
                setDuration(audio.duration);
            }
        };
        const handleEnded = () => setIsPlaying(false);
        const handleError = () => {
            console.error("Error al cargar audio:", audio.error);
            setIsPlaying(false);
        };

        audio.addEventListener("timeupdate", updateTime);
        audio.addEventListener("loadedmetadata", updateDuration);
        audio.addEventListener("durationchange", updateDuration);
        audio.addEventListener("ended", handleEnded);
        audio.addEventListener("error", handleError);

        return () => {
            audio.removeEventListener("timeupdate", updateTime);
            audio.removeEventListener("loadedmetadata", updateDuration);
            audio.removeEventListener("durationchange", updateDuration);
            audio.removeEventListener("ended", handleEnded);
            audio.removeEventListener("error", handleError);
        };
    }, []);

    // Auto-play when opened
    useEffect(() => {
        if (isOpen && audioRef.current) {
            // Pequeño delay para evitar conflicto con el estado
            const timer = setTimeout(() => {
                if (audioRef.current) {
                    audioRef.current.play()
                        .then(() => setIsPlaying(true))
                        .catch((error) => {
                            console.error("Error al auto-reproducir:", error);
                        });
                }
            }, 100);

            return () => clearTimeout(timer);
        } else if (!isOpen && audioRef.current) {
            audioRef.current.pause();
            setIsPlaying(false);
        }
    }, [isOpen]);

    // Close speed menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (showSpeedMenu) {
                setShowSpeedMenu(false);
            }
        };

        if (showSpeedMenu) {
            document.addEventListener('click', handleClickOutside);
            return () => document.removeEventListener('click', handleClickOutside);
        }
    }, [showSpeedMenu]);

    const togglePlayPause = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            audioRef.current.play()
                .then(() => setIsPlaying(true))
                .catch((error) => {
                    console.error("Error al reproducir:", error);
                    setIsPlaying(false);
                });
        }
    };

    const handleSkip = (seconds: number) => {
        if (!audioRef.current) return;

        const currentAudioTime = audioRef.current.currentTime;
        const audioDuration = audioRef.current.duration;

        console.log('Skip:', {
            seconds,
            currentTime: currentAudioTime,
            duration: audioDuration
        });

        // Verificar que la duración es válida
        if (!isFinite(audioDuration)) {
            console.log('Duration is not finite, skipping');
            return;
        }

        // Calcular nuevo tiempo sin reiniciar
        const newTime = Math.max(0, Math.min(audioDuration, currentAudioTime + seconds));
        console.log('Setting new time:', newTime);
        audioRef.current.currentTime = newTime;
    };

    const changeSpeed = (speed: number) => {
        if (!audioRef.current) return;
        audioRef.current.playbackRate = speed;
        setPlaybackRate(speed);
        setShowSpeedMenu(false);
    };

    const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!audioRef.current || !duration) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percentage = x / rect.width;
        audioRef.current.currentTime = percentage * duration;
    };

    const formatTime = (time: number) => {
        if (!isFinite(time)) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    };

    const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

    const handleClose = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            setIsPlaying(false);
        }
        onClose();
    };

    return (
        <>
            <audio ref={audioRef} preload="metadata">
                <source src={getAudioUrl()} type="audio/mpeg" />
                <source src={getAudioUrl()} type="audio/ogg" />
                <source src={getAudioUrl()} type="audio/wav" />
            </audio>

            <div
                className={cn(
                    "fixed left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ease-out",
                    "bottom-28 md:bottom-6",
                    isOpen
                        ? "opacity-100 translate-y-0 scale-100"
                        : "opacity-0 translate-y-4 scale-95 pointer-events-none"
                )}
            >
                <div className="bg-card/95 backdrop-blur-2xl border border-border/50 rounded-full shadow-lg px-2 py-1.5 flex items-center gap-1">
                    <button
                        onClick={handleClose}
                        className="p-1.5 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-secondary/50"
                    >
                        <X className="w-3.5 h-3.5" />
                    </button>
                    {/* <button
                        onClick={() => handleSkip(-15)}
                        className="p-1.5 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-secondary/50"
                    >
                        <SkipBack className="w-4 h-4" />
                    </button> */}
                    <button
                        onClick={togglePlayPause}
                        className="p-1.5 text-lime-600 hover:text-lime-700 transition-colors"
                    >
                        {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                    </button>
                    {/* <button
                        onClick={() => handleSkip(15)}
                        className="p-1.5 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-secondary/50"
                    >
                        <SkipForward className="w-4 h-4" />
                    </button> */}
                    <span className="text-xs text-muted-foreground w-8 text-center tabular-nums">
                        {formatTime(currentTime)}
                    </span>
                    <div
                        onClick={handleProgressClick}
                        className="relative w-32 md:w-48 h-6 flex items-center cursor-pointer group"
                    >
                        <div className="absolute inset-x-0 h-1 bg-secondary rounded-full transition-all duration-200 group-hover:h-2">
                            <div
                                className="absolute inset-y-0 left-0 bg-lime-500 rounded-full transition-all duration-200"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                    <span className="text-xs text-muted-foreground w-8 text-center tabular-nums">
                        {formatTime(duration)}
                    </span>

                    {/* Speed Control */}
                    <div className="relative">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowSpeedMenu(!showSpeedMenu);
                            }}
                            className="p-1.5 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-secondary/50 flex items-center gap-0.5"
                            title="Velocidad de reproducción"
                        >
                            <Gauge className="w-3.5 h-3.5" />
                            <span className="text-[10px] font-medium">{playbackRate}x</span>
                        </button>

                        {showSpeedMenu && (
                            <div
                                onClick={(e) => e.stopPropagation()}
                                className="absolute bottom-full right-0 mb-2 bg-card border border-border rounded-lg shadow-xl overflow-hidden min-w-[70px] z-50"
                            >
                                {speedOptions.map((speed) => (
                                    <button
                                        key={speed}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            changeSpeed(speed);
                                        }}
                                        className={cn(
                                            "w-full px-3 py-1.5 text-xs text-left hover:bg-secondary/50 transition-colors",
                                            playbackRate === speed && "bg-lime-100 text-lime-700 font-semibold"
                                        )}
                                    >
                                        {speed}x
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};