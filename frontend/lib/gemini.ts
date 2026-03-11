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

export const fetchCityMetrics = async (
  cityName: string,
  country: string
): Promise<CityMetrics & { region: string }> => {
  if (!apiKey) {
    throw new Error("Gemini API key is not configured");
  }

  const model = genAI.getGenerativeModel({ 
    model: "gemini-2.0-flash",
    generationConfig: {
      temperature: 0.4,
    }
  });

  const prompt = `
    You are an expert urban environmental researcher. I need highly specific, accurate, and distinct sustainability estimates for the following location:
    
    Target City: ${cityName}
    Target Country: ${country}

    CRITICAL INSTRUCTION: Do NOT use generic placeholder values. Your estimates must reflect the true environmental profile of ${cityName}, taking into account its specific climate, infrastructure, economy, and population density. For example, a city with heavy industry should have high CO2 and AQI, while a Scandinavian city should have high renewables and low emissions. Provide highly realistic numbers based on real-world data for this specific location.

    Metrics required:
    1. co2Emissions (tons per capita) [Range 0-25.0]
    2. airQualityIndex (AQI) [Range 0-300, lower is better]
    3. renewableEnergy (% of total energy) [Range 0-100]
    4. wasteRecycling (% rate) [Range 0-100]
    5. greenSpace (m2 per capita) [Range 0-100]
    6. publicTransport (% of commuters) [Range 0-100]
    7. waterQuality (Index 0-100, higher is better)
    8. energyEfficiency (Index 0-100, higher is better)
    9. region (e.g., Europe, Asia, Americas, Africa, Oceania)

    Your response MUST be in raw JSON format with the following keys:
    {
      "co2Emissions": float,
      "airQualityIndex": int,
      "renewableEnergy": int,
      "wasteRecycling": int,
      "greenSpace": int,
      "publicTransport": int,
      "waterQuality": int,
      "energyEfficiency": int,
      "region": "..."
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const jsonStr = text.replace(/```json|```/g, "").trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Gemini Autofill Error:", error);
    // Generic regional fallbacks if research fails
    return {
      co2Emissions: 6.0,
      airQualityIndex: 50,
      renewableEnergy: 20,
      wasteRecycling: 30,
      greenSpace: 15,
      publicTransport: 30,
      waterQuality: 80,
      energyEfficiency: 70,
      region: "Global Average"
    };
  }
};
