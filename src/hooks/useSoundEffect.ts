import { useCallback } from 'react';

export const useSoundEffect = () => {
    const playCorrect = useCallback(() => {
        const audio = new Audio('/audio/correct_answer.mp3');
        audio.volume = 0.5;
        audio.play().catch(e => console.error("Error playing sound:", e));
    }, []);

    const playIncorrect = useCallback(() => {
        const audio = new Audio('/audio/incorrect_answer.mp3');
        audio.volume = 0.5;
        audio.play().catch(e => console.error("Error playing sound:", e));
    }, []);

    return { playCorrect, playIncorrect };
};
