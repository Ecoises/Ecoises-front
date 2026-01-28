import { useState } from 'react';
import { ChevronDown, ChevronUp, BookOpen, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReferenceObj {
    citation: string;
    url?: string;
}

type Reference = string | ReferenceObj;

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
        <div className={cn("border-t border-gray-100 pt-8 mt-12", className)}>
            <div className="bg-gray-50/50 rounded-2xl p-4 border border-gray-100">
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="flex items-center justify-between w-full text-left group"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-lg shadow-sm text-forest-700">
                            <BookOpen className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-forest-900 group-hover:text-lime-700 transition-colors">
                                Referencias y Fuentes
                            </h3>
                            <p className="text-xs text-muted-foreground">
                                {references.length} {references.length === 1 ? 'fuente citada' : 'fuentes citadas'}
                            </p>
                        </div>
                    </div>
                    {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-gray-400 group-hover:text-forest-700 transition-colors" />
                    ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-forest-700 transition-colors" />
                    )}
                </button>

                {isExpanded && (
                    <div className="mt-6 pl-2 animate-fade-in border-t border-dashed border-gray-200 pt-4">
                        <ol className="list-decimal list-inside space-y-3">
                            {references.map((ref, index) => {
                                const citation = typeof ref === 'string' ? ref : ref.citation;
                                const url = typeof ref === 'object' && ref.url ? ref.url : null;

                                return (
                                    <li
                                        key={index}
                                        className="text-sm text-gray-600 leading-relaxed pl-2 marker:text-lime-600 marker:font-bold"
                                    >
                                        <span className="">
                                            {citation}
                                            {url && (
                                                <a href={url} target="_blank" rel="noopener noreferrer" className="ml-2 inline-flex items-center text-lime-600 hover:text-lime-700 hover:underline">
                                                    <ExternalLink className="w-3 h-3 mr-1" />
                                                    Ver fuente
                                                </a>
                                            )}
                                        </span>
                                    </li>
                                );
                            })}
                        </ol>
                    </div>
                )}
            </div>
        </div>
    );
};
