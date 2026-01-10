import { useEffect, useRef } from 'react';

interface LessonContentProps {
    htmlContent: string;
    className?: string;
}

export const LessonContent = ({ htmlContent, className = '' }: LessonContentProps) => {
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!contentRef.current) return;

        const apiUrl = import.meta.env.VITE_APP_API_URL || 'http://localhost:8000';

        // Find all images in the content
        const images = contentRef.current.querySelectorAll('img');

        images.forEach((img) => {
            const alt = img.getAttribute('alt');
            let src = img.getAttribute('src');

            // Fix image URL if it's from backend storage
            if (src) {
                // If src starts with http://127.0.0.1:8000 or similar, replace with API URL
                if (src.includes('/storage/')) {
                    // Extract just the path after /storage/
                    const storagePath = src.substring(src.indexOf('/storage/'));
                    img.src = `${apiUrl}${storagePath}`;
                }
            }

            // Skip if no alt text or already wrapped in figure
            if (!alt || img.parentElement?.tagName === 'FIGURE') return;

            // Create figure and figcaption
            const figure = document.createElement('figure');
            const figcaption = document.createElement('figcaption');

            figcaption.innerHTML = alt;

            // Replace img with figure > img + figcaption
            img.parentNode?.insertBefore(figure, img);
            figure.appendChild(img);
            figure.appendChild(figcaption);
        });
    }, [htmlContent]);

    return (
        <div
            ref={contentRef}
            className={`lesson-content prose prose-sm sm:prose lg:prose-xl max-w-none dark:prose-invert [&>img]:mx-auto [&>img]:max-w-full [&>figure]:mx-auto [&>figure]:max-w-full ${className}`}
            dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
    );
};
