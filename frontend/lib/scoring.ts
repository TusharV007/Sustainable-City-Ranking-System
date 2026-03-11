/**
 * Sustainability Scoring Logic
 * 
 * Weights based on Methodology:
 * - CO2 Emissions: 20% (Lower is better)
 * - Air Quality Index: 15% (Lower is better)
 * - Renewable Energy: 18% (Higher is better)
 * - Waste Recycling: 12% (Higher is better)
 * - Green Space: 10% (Higher is better)
 * - Public Transport: 10% (Higher is better)
 * - Water Quality: 8% (Higher is better)
 * - Energy Efficiency: 7% (Higher is better)
 */

export interface CityMetrics {
  co2Emissions: number; // tons/capita
  airQualityIndex: number; // AQI (0-500)
  renewableEnergy: number; // %
  wasteRecycling: number; // %
  greenSpace: number; // m2/capita
  publicTransport: number; // %
  waterQuality: number; // 0-100
  energyEfficiency: number; // 0-100
}

export const calculateSustainabilityScore = (metrics: CityMetrics): number => {
  // Normalize metrics to 0-100 scale
  
  // CO2: Assume 0 is best (100 pts), 15+ is worst (0 pts)
  const co2Score = Math.max(0, 100 - (metrics.co2Emissions * 6.67));
  
  // AQI: 0-50 is Good (100 pts), 300+ is Hazardous (0 pts)
  const aqiScore = Math.max(0, 100 - (metrics.airQualityIndex / 3));
  
  // Weights
  const weights = {
    co2: 0.20,
    aqi: 0.15,
    renewable: 0.18,
    recycling: 0.12,
    greenSpace: 0.10,
    transport: 0.10,
    water: 0.08,
    efficiency: 0.07,
  };

  const finalScore = (
    (co2Score * weights.co2) +
    (aqiScore * weights.aqi) +
    (metrics.renewableEnergy * weights.renewable) +
    (metrics.wasteRecycling * weights.recycling) +
    (Math.min(100, metrics.greenSpace * 2) * weights.greenSpace) + // 50m2 is "max score" for green space
    (metrics.publicTransport * weights.transport) +
    (metrics.waterQuality * weights.water) +
    (metrics.energyEfficiency * weights.efficiency)
  );

  return Math.round(finalScore);
};

export const getImpactLevel = (score: number): 'Low' | 'Medium' | 'High' => {
  if (score >= 80) return 'Low';
  if (score >= 60) return 'Medium';
  return 'High';
};
