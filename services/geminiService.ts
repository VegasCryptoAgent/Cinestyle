
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { StoryboardScene, VideoReference, GroundingSource } from "../types";

/**
 * Stage 1: Style Research with Grounding
 */
export const researchStyles = async (references: VideoReference[]): Promise<{ text: string; sources: GroundingSource[] }> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const urlRefs = references.filter(r => r.type === 'url').map(r => r.value).join(", ");
  
  if (!urlRefs) return { text: "No external URLs provided. Analysis based on visual data.", sources: [] };

  const prompt = `
    Research the visual styles, cinematography, and directorial signatures associated with these video references: ${urlRefs}.
    Focus on technical aspects like lens choice, lighting temperature (Kelvin), color grading (LUTs), and camera movement (e.g. tracking, handheld).
    Provide a condensed technical summary.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: { parts: [{ text: prompt }] },
    config: {
      tools: [{ googleSearch: {} }]
    }
  });

  const text = response.text || "Research complete.";
  
  // Extracting URLs from groundingChunks as per mandatory API rules
  const sources: GroundingSource[] = [];
  const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
  if (chunks) {
    chunks.forEach((chunk: any) => {
      if (chunk.web) {
        sources.push({
          title: chunk.web.title || "Reference Source",
          uri: chunk.web.uri
        });
      }
    });
  }

  return { text, sources };
};

/**
 * Stage 2: Storyboard Generation
 */
export const generateStoryboardJSON = async (
  references: VideoReference[], 
  script: string, 
  researchedStyle: string,
  userStyle?: string
): Promise<{ analysis: string; storyboard: StoryboardScene[] }> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const fileParts = references
    .filter(ref => ref.type === 'file' && ref.value.includes('base64,'))
    .map(ref => ({
      inlineData: {
        data: ref.value.split(',')[1],
        mimeType: ref.mimeType || 'video/mp4'
      }
    }));

  const prompt = `
    DIRECTOR'S BRIEF:
    Script: "${script}"
    Reference Style: "${researchedStyle}"
    ${userStyle ? `Additional Style Overlays: "${userStyle}"` : ''}

    Generate a 6-scene structured storyboard JSON matching this visual DNA.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: {
      parts: [...fileParts, { text: prompt }]
    },
    config: {
      thinkingConfig: { thinkingBudget: 15000 },
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          analysis: { type: Type.STRING },
          storyboard: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                sceneNumber: { type: Type.NUMBER },
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                cameraMovement: { type: Type.STRING },
                lightingStyle: { type: Type.STRING },
                visualPrompt: { type: Type.STRING }
              },
              required: ["sceneNumber", "title", "description", "cameraMovement", "lightingStyle", "visualPrompt"]
            }
          }
        },
        required: ["analysis", "storyboard"]
      }
    }
  });

  const result = JSON.parse(response.text || '{}');
  return {
    analysis: result.analysis || researchedStyle,
    storyboard: result.storyboard || []
  };
};

/**
 * Stage 3: Image Synthesis
 */
export const generateSceneImage = async (visualPrompt: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: {
      parts: [{ text: `CINEMATIC FILM FRAME: ${visualPrompt}. 35mm film photography, 16:9, highly detailed, photorealistic, cinematic lighting.` }]
    },
    config: {
      imageConfig: {
        aspectRatio: "16:9",
        imageSize: "1K"
      }
    }
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }

  throw new Error("Frame synthesis failed.");
};
