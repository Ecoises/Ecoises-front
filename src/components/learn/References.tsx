import { useState } from 'react';
import { ChevronDown, ChevronUp, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Reference {
    citation: string;
}

interface ReferencesProps {
    references?: Reference[];
    className?: string;
}

export const References = ({ references, className = '' }: ReferencesProps) => {
    const [isExpanded, setIsExpanded] = useState(false);

    if (!references || references.length === 0) {
        return null;
    }

    return (
        <div className={cn("border-t pt-8 mt-12", className)}>
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center justify-between w-full text-left group"
            >
                <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-semibold text-foreground">
                        Referencias Bibliográficas
                    </h3>
                    <span className="text-sm text-muted-foreground">
                        ({references.length})
                    </span>
                </div>
                {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                ) : (
                    <ChevronDown className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                )}
            </button>

            {isExpanded && (
                <div className="mt-6 space-y-4 animate-fade-in">
                    <ol className="list-decimal list-inside space-y-3">
                        {references.map((ref, index) => (
                            <li
                                key={index}
                                className="text-sm text-muted-foreground leading-relaxed pl-2"
                            >
                                <span className="ml-2">{ref.citation}</span>
                            </li>
                        ))}
                    </ol>
                </div>
            )}
        </div>
    );
};
