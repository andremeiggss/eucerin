import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

const MODEL_NAME = 'gemini-3-flash-preview';

export const analyzeSkinFromImage = async (base64Image: string): Promise<AnalysisResult> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key not found");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const cleanBase64 = base64Image.replace(/^data:image\/[a-z]+;base64,/, "");

  const prompt = `
    Actúa como un dermatólogo senior experto en Eucerin. Analiza la imagen del rostro con extrema atención al detalle.
    
    TU TAREA:
    1. ANALIZAR: Escanea Zona T, Mejillas y Mentón. Busca: Puntos negros, poros dilatados, brillo, granos o manchas.
    
    2. DIAGNOSTICAR (skinType): Sé específico. Ej: "Grasa con tendencia a manchas", "Mixta con poros obstruidos", "Con brotes activos".
    
    3. SELECCIONAR PRODUCTO (IMPORTANTE: Solo puedes elegir uno de estos 3):
       
       - OPCIÓN A: "DermoPure Triple Acción"
         -> CRITERIO: Úsalo si detectas MANCHAS oscuras, marcas post-inflamatorias o piel con brillo excesivo y marcas antiguas.
       
       - OPCIÓN B: "Dermopure Clinic"
         -> CRITERIO: Úsalo si detectas ACNÉ ACTIVO, pápulas rojas, inflamación visible o necesidad de renovación intensa de la piel.
       
       - OPCIÓN C: "Dermopure Correcting Clear"
         -> CRITERIO: Úsalo si el problema principal es TEXTURA irregular, puntos negros, poros dilatados o imperfecciones leves sin mucha inflamación.

    4. GENERAR CARACTERÍSTICAS:
       Lista 3 observaciones visuales muy específicas y localizadas.

    Devuelve JSON estrictamente:
    - skinType: Título corto del diagnóstico (String).
    - confidence: (Number 0-1).
    - characteristics: (Array Strings) Las 3 observaciones detalladas.
    - productName: (String) Debe ser EXACTAMENTE uno de los 3 nombres de arriba.
    - productBenefit: (String) Una frase potente conectando el producto con lo visto en la foto.
    - routine: (Array Strings) Rutina de 3 pasos personalizada incluyendo el producto recomendado.
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: cleanBase64
            }
          },
          {
            text: prompt
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            skinType: { type: Type.STRING },
            confidence: { type: Type.NUMBER },
            characteristics: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            productName: { type: Type.STRING },
            productBenefit: { type: Type.STRING },
            routine: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["skinType", "confidence", "characteristics", "productName", "productBenefit", "routine"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const cleanText = text.replace(/```json\s*|\s*```/g, "").trim();
    const result = JSON.parse(cleanText) as AnalysisResult;
    return result;

  } catch (error) {
    console.error("Error analyzing skin:", error);
    throw error;
  }
};