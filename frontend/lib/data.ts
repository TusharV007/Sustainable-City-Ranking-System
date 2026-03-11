export interface City {
  id: string;
  name: string;
  country: string;
  region: string;
  lat?: number;
  lng?: number;
  score: number;
  impact: 'Low' | 'Medium' | 'High';
  metrics: {
    co2Emissions: number; // tons per capita
    airQualityIndex: number; // 0-500
    renewableEnergy: number; // percentage
    wasteRecycling: number; // percentage
    greenSpace: number; // sq meters per capita
    publicTransport: number; // usage percentage
    waterQuality: number; // score 0-100
    energyEfficiency: number; // score 0-100
  };
  historicalData?: {
    year: number;
    score: number;
    co2Emissions: number;
    renewableEnergy: number;
  }[];
  recommendations?: string[];
  rank: number;
  isDynamic?: boolean;
}

// Mock data removed. Application now relies on Firestore data.
export const emptyCity: Partial<City> = {
  name: "",
  country: "",
  region: "",
  score: 0,
  metrics: {
    co2Emissions: 0,
    airQualityIndex: 0,
    renewableEnergy: 0,
    wasteRecycling: 0,
    greenSpace: 0,
    publicTransport: 0,
    waterQuality: 0,
    energyEfficiency: 0,
  }
};
