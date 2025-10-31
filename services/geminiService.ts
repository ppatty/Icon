import { GoogleGenAI, Modality } from "@google/genai";
import { IconStyle, IconShape, GeneratedIcon } from "../types";
import { v4 as uuidv4 } from 'uuid'; // Import uuid for generating unique IDs
import { ApiKeyError } from "../errors"; // Import custom error

// The `window.aistudio` object is assumed to be globally available and typed
// by the execution environment. Explicit declaration here caused a conflict.

// Helper to convert Blob to Base64 string
async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result.split(',')[1]); // Extract base64 part
      } else {
        reject(new Error("Failed to read blob as base64."));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export const ensureApiKeySelected = async (): Promise<boolean> => {
  // Check if window.aistudio exists and has the expected methods
  if (typeof window === 'undefined' || !window.aistudio || typeof window.aistudio.hasSelectedApiKey !== 'function' || typeof window.aistudio.openSelectKey !== 'function') {
    console.warn("window.aistudio not available or malformed. Assuming API key is set via environment.");
    return true; // Assume success in non-browser or dev environments
  }

  let hasKey = await window.aistudio.hasSelectedApiKey();
  if (!hasKey) {
    console.log("No API key selected. Opening selection dialog.");
    await window.aistudio.openSelectKey();
    // Assuming selection was successful after openSelectKey()
    return true;
  }
  return true;
};

export const generateIconImage = async (
  basePrompt: string,
  style: IconStyle,
  shape: IconShape,
  color: string,
): Promise<string[]> => {
  const fullPrompt = `Create a high-quality, professional, and visually appealing ${style} ${color} ${shape} app icon for "${basePrompt}". The icon should be isolated on a plain white or transparent background, with crisp edges, and suitable for an Android icon pack.`;

  try {
    // Re-initialize GoogleGenAI right before the API call to ensure the latest API key is used
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001', // High-quality image generation model
      prompt: fullPrompt,
      config: {
        numberOfImages: 1, // Generate one image per request
        outputMimeType: 'image/png', // PNG for transparency
        aspectRatio: '1:1', // Square aspect ratio for icons
      },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      return response.generatedImages.map(img => {
        const base64ImageBytes: string = img.image.imageBytes;
        return `data:image/png;base64,${base64ImageBytes}`;
      });
    } else {
      throw new Error("No images were generated.");
    }
  } catch (error: any) {
    if (error.message && error.message.includes("Requested entity was not found.")) {
      console.error("API Key error: Requested entity was not found. Prompting for key selection again.");
      // Safely access window.aistudio after checking its existence and type
      if (typeof window !== 'undefined' && window.aistudio && typeof window.aistudio.openSelectKey === 'function') {
        // We throw the error for App.tsx to handle re-prompting API key selection
        throw new ApiKeyError(`Failed to generate icon: API Key might be invalid or expired. Please re-select.`);
      }
      throw new Error(`Failed to generate icon: API Key might be invalid. Please re-select. ${error.message}`);
    }
    console.error("Error generating icon image:", error);
    throw new Error(`Failed to generate icon: ${error.message || 'Unknown error'}`);
  }
};

/**
 * Edits an existing icon image using a text prompt.
 * @param base64ImageData The raw base64 string of the image (without data URI prefix).
 * @param mimeType The MIME type of the image (e.g., 'image/png').
 * @param editingPrompt The text instruction for editing the image.
 * @returns A Promise resolving to the data URI of the edited image.
 */
export const editIconImage = async (
  base64ImageData: string,
  mimeType: string,
  editingPrompt: string,
): Promise<string> => {
  // Re-initialize GoogleGenAI for latest API key
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image', // General image generation and editing model
      contents: {
        parts: [
          {
            inlineData: {
              data: base64ImageData,
              mimeType: mimeType,
            },
          },
          {
            text: editingPrompt,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    const part = response.candidates?.[0]?.content?.parts?.[0];
    if (part?.inlineData) {
      const newBase64ImageBytes: string = part.inlineData.data;
      return `data:${part.inlineData.mimeType};base64,${newBase64ImageBytes}`;
    } else {
      throw new Error("No edited image received from the API.");
    }
  } catch (error: any) {
    if (error.message && error.message.includes("Requested entity was not found.")) {
      console.error("API Key error during image edit: Requested entity was not found. Prompting for key selection again.");
      if (typeof window !== 'undefined' && window.aistudio && typeof window.aistudio.openSelectKey === 'function') {
        // We throw the error for App.tsx to handle re-prompting API key selection
        throw new ApiKeyError(`Failed to edit icon: API Key might be invalid or expired. Please re-select.`);
      }
      throw new Error(`Failed to edit icon: API Key might be invalid. Please re-select. ${error.message}`);
    }
    console.error("Error editing icon image:", error);
    throw new Error(`Failed to edit icon: ${error.message || 'Unknown error'}`);
  }
};

const commonApps = [
  "Mail", "Calendar", "Phone", "Messages", "Camera", "Gallery", "Clock",
  "Settings", "Browser", "Music Player", "Calculator", "Notes", "Maps",
  "Files", "Contacts", "Weather", "Voice Recorder", "Torch", "Compass"
];

/**
 * Generates a full pack of icons for common apps based on a theme and styling.
 * @param themePrompt A general theme description for the icon pack.
 * @param style The desired icon style.
 * @param shape The desired icon shape.
 * @param color The primary color for the icons.
 * @returns A Promise resolving to an array of GeneratedIcon objects.
 */
export const generateIconPack = async (
  themePrompt: string,
  style: IconStyle,
  shape: IconShape,
  color: string,
): Promise<GeneratedIcon[]> => {
  const generatedIcons: GeneratedIcon[] = [];
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  for (const appName of commonApps) {
    const fullPrompt = `Create a ${style} ${color} ${shape} app icon for a "${appName}" application. The icon should be visually appealing, isolated on a plain white or transparent background, with crisp edges, and suitable for an Android icon pack. Incorporate the overall pack theme: "${themePrompt}".`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image', // User requested 'nano banana' for pack generation
        contents: {
          parts: [
            { text: fullPrompt },
          ],
        },
        config: {
          responseModalities: [Modality.IMAGE],
        },
      });

      const part = response.candidates?.[0]?.content?.parts?.[0];
      if (part?.inlineData) {
        const base64ImageBytes: string = part.inlineData.data;
        generatedIcons.push({
          id: uuidv4(),
          url: `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`,
          prompt: `Pack Icon: ${appName} - ${themePrompt}`,
        });
      } else {
        console.warn(`No image generated for ${appName} in the pack.`);
      }
    } catch (error: any) {
      if (error.message && error.message.includes("Requested entity was not found.")) {
        console.error("API Key error during pack generation: Requested entity was not found. Prompting for key selection again.");
        if (typeof window !== 'undefined' && window.aistudio && typeof window.aistudio.openSelectKey === 'function') {
          // We throw the error for App.tsx to handle re-prompting API key selection
          throw new ApiKeyError(`Failed to generate icon pack: API Key might be invalid or expired. Please re-select.`);
        }
        throw new Error(`Failed to generate icon pack: API Key issue. ${error.message}`);
      }
      console.error(`Error generating icon for ${appName} in pack:`, error);
      // Continue to next app even if one fails - though throwing ApiKeyError will stop the loop
    }
  }
  return generatedIcons;
};