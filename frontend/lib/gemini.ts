import { GoogleGenerativeAI } from "@google/generative-ai";
import { CityMetrics } from "./scoring";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

export interface GeminiAnalysis {
  summary: string;
  recommendations: string[];
  verdict: string;
  timestamp: string;
}

export const analyzeCitySustainability = async (
  cityName: string,
  country: string,
  metrics: CityMetrics,
  score: number,
  impact: string
): Promise<GeminiAnalysis> => {
  if (!apiKey) {
    throw new Error("Gemini API key is not configured");
  }

  // Use the verified working model
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `
    You are a world-class urban sustainability expert. 
    Analyze the following sustainability data for ${cityName}, ${country} and provide expert insights.

    Data Overview:
    - Overall Sustainability Score: ${score}/100
    - Impact Classification: ${impact}
    
    Environmental Metrics:
    - CO2 Emissions: ${metrics.co2Emissions} tons/capita
    - Air Quality Index (AQI): ${metrics.airQualityIndex}
    - Renewable Energy: ${metrics.renewableEnergy}%
    - Waste Recycling Rate: ${metrics.wasteRecycling}%
    - Green Space: ${metrics.greenSpace} m2/capita
    - Public Transport Usage: ${metrics.publicTransport}%
    - Water Quality: ${metrics.waterQuality}/100
    - Energy Efficiency: ${metrics.energyEfficiency}/100

    Instructions:
    1. Provide a concise 2-3 sentence summary of the city's environmental performance.
    2. Provide exactly 3 prioritized, highly actionable recommendations for this specific city based on its weakest metrics.
    3. Provide a one-word qualitative verdict (e.g., "Leader", "Improving", "Lagging", "Stable", "Critical").

    Your response MUST be in raw JSON format with the following keys:
    {
      "summary": "...",
      "recommendations": ["rec1", "rec2", "rec3"],
      "verdict": "..."
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean JSON boundary if needed (Gemini sometimes adds markdown blocks)
    const jsonStr = text.replace(/```json|```/g, "").trim();
    const data = JSON.parse(jsonStr);

    return {
      ...data,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    // Fallback in case of failure
    return {
      summary: `Sustainability assessment for ${cityName} indicates a score of ${score}. Further analysis is required to provide specific qualitative insights.`,
      recommendations: [
        "Increase investment in renewable energy infrastructure.",
        "Implement stricter air quality regulations.",
        "Expand urban green spaces and public parks."
      ],
      verdict: impact,
      timestamp: new Date().toISOString()
    };
  }
};
