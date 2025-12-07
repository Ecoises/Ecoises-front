import { ElevenLabsClient } from "elevenlabs";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

const API_KEY = process.env.ELEVENLABS_API_KEY;
const VOICE_ID = "V6isiXLBuRuM7uwHOVBA"; // User requested voice

if (!API_KEY) {
    console.error("ERROR: ELEVENLABS_API_KEY is not set in .env file.");
    process.exit(1);
}

const client = new ElevenLabsClient({
    apiKey: API_KEY,
});

async function generateAudioWithTimestamps(
    text: string,
    outputFilename: string,
    voiceId: string = VOICE_ID
) {
    const outputDir = path.join(process.cwd(), "public", "audio");

    // Ensure output directory exists
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const audioPath = path.join(outputDir, `${outputFilename}.mp3`);
    const jsonPath = path.join(outputDir, `${outputFilename}.json`);

    console.log(`Generating audio (with timestamps) for: "${text.substring(0, 20)}..."`);

    try {
        // @ts-ignore - The method exists in recent versions but types might be lagging or strict
        const response = await client.textToSpeech.convertWithTimestamps(voiceId, {
            text: text,
            model_id: "eleven_multilingual_v2",
        });

        // Response is expected to be { audio_base64: string, alignment: ... }
        const audioBuffer = Buffer.from(response.audio_base64, "base64");
        fs.writeFileSync(audioPath, audioBuffer);
        console.log(`Audio saved to: ${audioPath}`);

        // Process alignment to get word-level timestamps
        const alignment = response.alignment;
        const words: any[] = [];
        let currentWord = "";

        // Safety check for alignment data
        if (alignment && alignment.characters && alignment.character_start_times_seconds && alignment.character_end_times_seconds) {
            let startTime = alignment.character_start_times_seconds[0];

            for (let i = 0; i < alignment.characters.length; i++) {
                const char = alignment.characters[i];

                if (char === " " || i === alignment.characters.length - 1) {
                    if (i === alignment.characters.length - 1 && char !== " ") {
                        currentWord += char;
                    }

                    if (currentWord.trim().length > 0) {
                        words.push({
                            word: currentWord,
                            start: startTime,
                            end: alignment.character_end_times_seconds[i],
                        });
                    }
                    currentWord = "";
                    if (i < alignment.characters.length - 1) {
                        startTime = alignment.character_start_times_seconds[i + 1];
                    }
                } else {
                    currentWord += char;
                }
            }
        }

        fs.writeFileSync(jsonPath, JSON.stringify({ original_text: text, alignment: response.alignment, words: words }, null, 2));
        console.log(`Timestamps saved to: ${jsonPath}`);

    } catch (error) {
        console.error("Error generating audio:", error);
    }
}

// Example usage
const textToSpeak = "Las serpientes prestan diferentes beneficios al ser humano, como controladoras de plagas o en la industria farmacéutica y cosmética que utilizan su veneno para crear tratamientos para enfermedades como epilepsia, demencia senil, degeneración muscular, entre otros. De ahí la importancia de reconocer su valor, su importancia en los ecosistemas y aprender a conservarlas.";
generateAudioWithTimestamps(textToSpeak, "prueba_timestamps1");
