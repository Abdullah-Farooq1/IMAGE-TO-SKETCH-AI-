
import { GoogleGenAI, Modality } from "@google/genai";
import type { SketchOptions } from '../types';
import { ArtistStyle, BackgroundOption } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

function dataUrlToBlob(dataUrl: string): { blob: Blob, mimeType: string } {
    const parts = dataUrl.split(';base64,');
    const mimeType = parts[0].split(':')[1];
    const byteString = atob(parts[1]);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uint8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
        uint8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([arrayBuffer], { type: mimeType });
    return { blob, mimeType };
}

function blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            if (reader.result) {
                resolve((reader.result as string).split(',')[1]);
            } else {
                reject(new Error("Failed to read blob."));
            }
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

function constructPrompt(options: SketchOptions): string {
    let prompt = `Convert the provided image into a high-quality "${options.sketchStyle}". `;
    prompt += `The line thickness should be ${options.lineThickness.toLowerCase()}. `;
    prompt += `The sketch should appear as if it's on "${options.canvasType}". `;

    switch(options.backgroundOption) {
        case BackgroundOption.REMOVE:
            prompt += "The background of the main subject should be removed and made transparent. ";
            break;
        case BackgroundOption.WHITE:
            prompt += "The background of the main subject should be a plain white color. ";
            break;
        case BackgroundOption.SCENIC:
            prompt += "Replace the original background with a beautiful, scenic landscape that complements the subject. ";
            break;
        case BackgroundOption.KEEP:
        default:
            prompt += "Keep the original background, but render it in the same sketch style as the subject. ";
            break;
    }

    if (options.artistStyle !== ArtistStyle.NONE) {
        prompt += `The final sketch must be in the distinct artistic style of ${options.artistStyle}.`;
    }

    prompt += " Focus on clean lines and accurate details to create a professional and artistic result.";

    return prompt;
}

export async function generateSketch(
    imageDataUrl: string, 
    options: SketchOptions
): Promise<{ imageUrl: string | null; error?: string }> {
    try {
        const { mimeType } = dataUrlToBlob(imageDataUrl);
        const base64ImageData = imageDataUrl.split(',')[1];

        const textPart = { text: constructPrompt(options) };
        const imagePart = {
            inlineData: {
                data: base64ImageData,
                mimeType: mimeType,
            },
        };

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image-preview',
            contents: {
                parts: [imagePart, textPart],
            },
            config: {
                responseModalities: [Modality.IMAGE, Modality.TEXT],
            },
        });

        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                const base64ImageBytes: string = part.inlineData.data;
                const imageUrl = `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
                return { imageUrl };
            }
        }
        
        return { imageUrl: null, error: "The model did not return an image. It might have refused the request." };

    } catch (error) {
        console.error("Gemini API call failed:", error);
        if (error instanceof Error) {
            return { imageUrl: null, error: error.message };
        }
        return { imageUrl: null, error: "An unknown error occurred during sketch generation." };
    }
}
