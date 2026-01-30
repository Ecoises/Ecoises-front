"use client"

import { useState, useEffect } from "react"
import { Reorder, motion, AnimatePresence } from "framer-motion"
import { Check, X, Shuffle, BookOpen, Trophy, GripVertical, AlertCircle, RefreshCw, Circle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface TaxonomyItem {
    id: string
    level: number
    label: string
    value: string
    italic?: boolean
}

interface TaxonomyGameProps {
    species: any
}

const TaxonomyGame = ({ species }: TaxonomyGameProps) => {
    const [mode, setMode] = useState<'study' | 'quiz'>('study')
    const [items, setItems] = useState<TaxonomyItem[]>([])
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null) // null = not checked, true = correct, false = incorrect
    const [feedback, setFeedback] = useState<string | null>(null)

    // Canonical correct order
    const correctOrder: TaxonomyItem[] = [
        { id: 'kingdom', level: 0, label: 'Reino', value: species.kingdom },
        { id: 'phylum', level: 1, label: 'Filo', value: species.phylum },
        { id: 'class', level: 2, label: 'Clase', value: species.class },
        { id: 'order', level: 3, label: 'Orden', value: species.order_name },
        { id: 'family', level: 4, label: 'Familia', value: species.family },
        { id: 'genus', level: 5, label: 'Género', value: species.genus, italic: true },
        { id: 'species', level: 6, label: 'Especie', value: species.scientific_name, italic: true }
    ].filter(i => i.value) // Filter out missing levels

    useEffect(() => {
        // Initialize items based on mode
        if (mode === 'study') {
            setItems(correctOrder)
            setIsCorrect(null)
            setFeedback(null)
        } else {
            shuffleItems()
        }
    }, [mode, species])

    const shuffleItems = () => {
        const shuffled = [...correctOrder].sort(() => Math.random() - 0.5)
        // Ensure it's not accidentally correct initially (rare but possible)
        if (JSON.stringify(shuffled) === JSON.stringify(correctOrder)) {
            // Simple swap to ensure disorder
            if (shuffled.length > 1) {
                [shuffled[0], shuffled[1]] = [shuffled[1], shuffled[0]];
            }
        }
        setItems(shuffled)
        setIsCorrect(null)
        setFeedback(null)
    }

    const checkOrder = () => {
        const isOrderCorrect = items.every((item, index) => item.id === correctOrder[index].id)

        if (isOrderCorrect) {
            setIsCorrect(true)
            setFeedback("¡Excelente! Has ordenado correctamente la clasificación taxonómica.")
        } else {
            setIsCorrect(false)
            // Generate educational feedback
            // Find the first mistake
            for (let i = 0; i < items.length - 1; i++) {
                const currentItem = items[i];
                const nextItem = items[i + 1];

                // Check if a lower level is above a higher level (e.g. Genus above Family)
                // Hierarchy: Kingdom (0) -> ... -> Species (6)
                // So level should generally increase.

                // Specific check: if we find something with a higher level number BEFORE something with a lower level number
                if (currentItem.level > nextItem.level) {
                    setFeedback(`Recuerda: ${nextItem.label} va antes de ${currentItem.label} en la jerarquía.`);
                    return;
                }
            }
            // Fallback generic message if the specific logic above doesn't catch the nuance (e.g. mixed up roughly correct blocks)
            setFeedback("El orden no es correcto. Recuerda que la clasificación va de lo general (Reino) a lo específico (Especie).")
        }
    }

    return (
        <div className="relative">
            {/* Header with Mode Toggle - Absolute positioned or flex header */}
            <div className="flex justify-end mb-2">
                {mode === 'study' ? (
                    <button
                        onClick={() => setMode('quiz')}
                        className="text-xs flex items-center gap-1.5 text-lime-600 hover:text-lime-700 hover:underline transition-all font-medium"
                    >
                        <Trophy className="h-3.5 w-3.5" />
                        ¿Te la sabes? ¡Ponte a prueba!
                    </button>
                ) : (
                    <button
                        onClick={() => setMode('study')}
                        className="text-xs flex items-center gap-1.5 text-forest-600 hover:text-forest-800 transition-all"
                    >
                        <BookOpen className="h-3.5 w-3.5" />
                        Volver a la vista normal
                    </button>
                )}
            </div>

            <AnimatePresence mode="wait">
                {mode === 'study' ? (
                    <motion.div
                        key="study"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="space-y-1">
                            {items.map((item, index) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    // Indentación simple usando padding-left
                                    className={cn(
                                        "flex items-center text-sm py-1 group",
                                        item.level > 0 && `pl-${item.level * 3}` // Less indentation
                                    )}
                                    style={{ paddingLeft: `${item.level * 12}px` }} // Fallback/Specific override if tailwind class fails or simple calc
                                >
                                    <Circle className="h-1.5 w-1.5 text-lime-600 fill-lime-600 flex-shrink-0 mr-2" />

                                    <div className="flex items-baseline gap-2">
                                        <span className="text-xs font-semibold text-forest-600 uppercase w-16 flex-shrink-0">
                                            {item.label}:
                                        </span>
                                        <span className={cn(
                                            "text-forest-900",
                                            item.italic && "italic"
                                        )}>
                                            {item.value}
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="quiz"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-3"
                    >
                        <div className="text-xs text-forest-600 mb-2 flex items-center gap-1.5">
                            <Shuffle className="h-3 w-3" />
                            Arrastra para ordenar
                        </div>

                        <Reorder.Group axis="y" values={items} onReorder={setItems} className="space-y-1.5">
                            {items.map((item) => (
                                <Reorder.Item key={item.id} value={item}>
                                    <div className={cn(
                                        "flex items-center gap-2 p-2 rounded-md border text-sm cursor-grab active:cursor-grabbing transition-all select-none bg-white",
                                        isCorrect === true ? "border-green-200 bg-green-50/30" :
                                            isCorrect === false ? "border-red-200 bg-red-50/30" :
                                                "border-slate-100 hover:border-lime-300 shadow-sm"
                                    )}>
                                        <GripVertical className="h-4 w-4 text-gray-300" />
                                        <div className="flex-1 flex items-center justify-between">
                                            <span className={cn(
                                                "text-forest-900",
                                                item.italic && "italic"
                                            )}>
                                                {item.value}
                                            </span>
                                            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-tight">
                                                {item.label}
                                            </span>
                                        </div>
                                    </div>
                                </Reorder.Item>
                            ))}
                        </Reorder.Group>

                        {/* Compact Validation Area */}
                        <div className="pt-2">
                            <AnimatePresence mode="wait">
                                {feedback && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className={cn(
                                            "text-xs p-2 rounded mb-2 flex items-start gap-2",
                                            isCorrect ? "bg-green-100 text-green-800" : "bg-red-50 text-red-800"
                                        )}
                                    >
                                        {isCorrect ? <Check className="h-3.5 w-3.5 mt-0.5" /> : <AlertCircle className="h-3.5 w-3.5 mt-0.5" />}
                                        <span>{feedback}</span>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="flex justify-end gap-2">
                                {isCorrect !== true && (
                                    <Button
                                        size="sm"
                                        onClick={checkOrder}
                                        className="bg-lime-600 hover:bg-lime-700 text-white h-8 text-xs px-3"
                                    >
                                        Comprobar
                                    </Button>
                                )}

                                {isCorrect !== null && (
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={shuffleItems}
                                        className="text-forest-600 hover:bg-lime-50 h-8 text-xs px-3"
                                    >
                                        <RefreshCw className={cn("h-3 w-3 mr-1.5", isCorrect && "text-lime-600")} />
                                        Reiniciar
                                    </Button>
                                )}
                            </div>
                        </div>

                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default TaxonomyGame
