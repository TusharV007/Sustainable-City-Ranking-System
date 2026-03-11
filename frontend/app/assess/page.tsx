"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { calculateSustainabilityScore, getImpactLevel, CityMetrics } from "@/lib/scoring";
import { analyzeCitySustainability, fetchCityMetrics } from "@/lib/gemini";
import { Sparkles, Loader2 } from "lucide-react";
import { 
  Building2, 
  Wind, 
  Zap, 
  Recycle, 
  Trees, 
  Bus, 
  Droplet, 
  Leaf,
  CheckCircle2,
  AlertCircle,
  Save
} from "lucide-react";

export default function AssessCityPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [researching, setResearching] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState<CityMetrics & { name: string; country: string; region: string }>({
    name: "",
    country: "",
    region: "",
    co2Emissions: 5.0,
    airQualityIndex: 40,
    renewableEnergy: 20,
    wasteRecycling: 30,
    greenSpace: 15,
    publicTransport: 25,
    waterQuality: 75,
    energyEfficiency: 60,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "name" || name === "country" || name === "region" ? value : parseFloat(value) || 0
    }));
  };

  const handleAutofill = async () => {
    if (!formData.name || !formData.country) {
      alert("Please enter city name and country first!");
      return;
    }

    setResearching(true);
    try {
      const results = await fetchCityMetrics(formData.name, formData.country);
      setFormData(prev => ({
        ...prev,
        ...results
      }));
    } catch (error) {
      console.error("Autofill error:", error);
      alert("AI Research failed. You can still fill the data manually.");
    } finally {
      setResearching(false);
    }
  };

  const getCoordinates = async (city: string, country: string): Promise<[number, number] | null> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&format=json&limit=1`,
        {
          headers: {
            'User-Agent': 'UrbEco-Sustainability-Platform'
          }
        }
      );
      const data = await response.json();
      if (data && data.length > 0) {
        return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
      }
      return null;
    } catch (error) {
      console.error("Geocoding failed:", error);
      return null;
    }
  };

  const currentScore = calculateSustainabilityScore(formData);
  const impactLevel = getImpactLevel(currentScore);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    try {
      // Step 1: Trigger AI Analysis
      setAnalyzing(true);
      let insights = null;
      try {
        insights = await analyzeCitySustainability(
          formData.name,
          formData.country,
          formData,
          currentScore,
          impactLevel
        );
      } catch (aiErr) {
        console.warn("AI Analysis failed, proceeding with manual data only", aiErr);
      }
      setAnalyzing(false);

      // Step 2: Fetch coordinates
      const coordinates = await getCoordinates(formData.name, formData.country);

      // Step 3: Save to Firestore
      await addDoc(collection(db, "assessments"), {
        ...formData,
        score: currentScore,
        impact: impactLevel,
        insights: insights,
        coordinates: coordinates, // Add coordinates here
        userId: user.uid,
        userEmail: user.email,
        createdAt: serverTimestamp(),
      });
      setSuccess(true);
      setTimeout(() => router.push("/rankings"), 2000);
    } catch (err) {
      console.error("Error saving assessment:", err);
      alert("Failed to save assessment. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <Card className="max-w-md border-0 shadow-xl text-center p-12 rounded-3xl">
          <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-6" />
          <h2 className="text-2xl font-black mb-4">Authentication Required</h2>
          <p className="text-zinc-500 mb-8 font-medium">Please sign in to access the city sustainability assessment tool.</p>
          <Button className="w-full bg-green-600" asChild>
            <Link href="/login">Sign In</Link>
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 py-12">
      <div className="max-w-4xl mx-auto px-4 px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-zinc-900 mb-2 font-black">UrbEco City Assessment</h1>
            <p className="text-zinc-500 text-lg font-medium">Enter environmental metrics to calculate the UrbEco sustainability index.</p>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-xl flex items-center gap-6 min-w-[200px] border border-zinc-100">
             <div className="text-center">
                <div className="text-4xl font-black text-green-700">{currentScore}</div>
                <div className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Projected Score</div>
             </div>
             <div className="h-10 w-px bg-zinc-100" />
             <div className="text-center">
                <div className={`text-lg font-black ${impactLevel === 'Low' ? 'text-green-600' : impactLevel === 'Medium' ? 'text-yellow-600' : 'text-red-600'}`}>
                  {impactLevel}
                </div>
                <div className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Impact Level</div>
             </div>
          </div>
        </div>

        {success ? (
          <Card className="border-0 shadow-2xl p-20 text-center rounded-3xl bg-green-600 text-white">
            <CheckCircle2 className="w-24 h-24 mx-auto mb-8 animate-bounce" />
            <h2 className="text-4xl font-black mb-4">Assessment Saved!</h2>
            <p className="text-green-100 text-xl">Redirecting you to the rankings page...</p>
          </Card>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="grid gap-8">
              {/* Basic Info */}
              <Card className="border-0 shadow-lg p-8 rounded-3xl">
                <CardHeader className="p-0 mb-8">
                  <div className="flex items-center gap-3">
                    <Building2 className="w-6 h-6 text-green-600" />
                    <CardTitle className="text-xl font-black">City Information</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-0 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">City Name</label>
                    <Input name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Zurich" required className="rounded-xl h-12" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Country</label>
                    <Input name="country" value={formData.country} onChange={handleChange} placeholder="e.g. Switzerland" required className="rounded-xl h-12" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Region</label>
                    <Input name="region" value={formData.region} onChange={handleChange} placeholder="e.g. Europe" required className="rounded-xl h-12" />
                  </div>
                  <div className="md:col-span-3 pt-4">
                    <Button 
                      type="button" 
                      onClick={handleAutofill} 
                      disabled={researching || !formData.name || !formData.country}
                      className="w-full h-14 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-white font-black flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-zinc-200"
                    >
                      {researching ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          AI Researching Urban Data...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5 text-yellow-400" />
                          Auto-fill with AI Research
                        </>
                      )}
                    </Button>
                    <p className="text-[10px] font-bold text-zinc-400 mt-3 text-center uppercase tracking-tighter">
                      Powered by Gemini 1.5 Pro • Fetches estimates based on global reports
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Environmental Metrics */}
              <Card className="border-0 shadow-lg p-8 rounded-3xl">
                <CardHeader className="p-0 mb-8">
                  <div className="flex items-center gap-3">
                    <Wind className="w-6 h-6 text-green-600" />
                    <CardTitle className="text-xl font-black">Environmental Metrics</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-0 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                  {/* CO2 */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="flex items-center gap-2 text-sm font-bold text-zinc-700">
                        <Wind className="w-4 h-4" /> CO₂ Emissions
                      </label>
                      <span className="text-sm font-black bg-zinc-100 px-2 py-1 rounded text-zinc-600">{formData.co2Emissions} t/cap</span>
                    </div>
                    <input type="range" name="co2Emissions" min="0" max="25" step="0.1" value={formData.co2Emissions} onChange={handleChange} className="w-full accent-green-600" />
                    <p className="text-[10px] font-bold text-zinc-400 uppercase">Weight: 20% | Target: Lower</p>
                  </div>

                  {/* AQI */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="flex items-center gap-2 text-sm font-bold text-zinc-700">
                        <Wind className="w-4 h-4" /> Air Quality (AQI)
                      </label>
                      <span className="text-sm font-black bg-zinc-100 px-2 py-1 rounded text-zinc-600">{formData.airQualityIndex} AQI</span>
                    </div>
                    <input type="range" name="airQualityIndex" min="0" max="300" value={formData.airQualityIndex} onChange={handleChange} className="w-full accent-green-600" />
                    <p className="text-[10px] font-bold text-zinc-400 uppercase">Weight: 15% | Target: 0-50</p>
                  </div>

                  {/* Renewable */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="flex items-center gap-2 text-sm font-bold text-zinc-700">
                        <Zap className="w-4 h-4" /> Renewable Energy
                      </label>
                      <span className="text-sm font-black bg-zinc-100 px-2 py-1 rounded text-zinc-600">{formData.renewableEnergy}%</span>
                    </div>
                    <input type="range" name="renewableEnergy" min="0" max="100" value={formData.renewableEnergy} onChange={handleChange} className="w-full accent-green-600" />
                    <p className="text-[10px] font-bold text-zinc-400 uppercase">Weight: 18% | Target: Higher</p>
                  </div>

                  {/* Recycling */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="flex items-center gap-2 text-sm font-bold text-zinc-700">
                        <Recycle className="w-4 h-4" /> Recycling Rate
                      </label>
                      <span className="text-sm font-black bg-zinc-100 px-2 py-1 rounded text-zinc-600">{formData.wasteRecycling}%</span>
                    </div>
                    <input type="range" name="wasteRecycling" min="0" max="100" value={formData.wasteRecycling} onChange={handleChange} className="w-full accent-green-600" />
                    <p className="text-[10px] font-bold text-zinc-400 uppercase">Weight: 12% | Target: Higher</p>
                  </div>

                  {/* Green Space */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="flex items-center gap-2 text-sm font-bold text-zinc-700">
                        <Trees className="w-4 h-4" /> Green Space
                      </label>
                      <span className="text-sm font-black bg-zinc-100 px-2 py-1 rounded text-zinc-600">{formData.greenSpace} m²/cap</span>
                    </div>
                    <input type="range" name="greenSpace" min="0" max="100" value={formData.greenSpace} onChange={handleChange} className="w-full accent-green-600" />
                    <p className="text-[10px] font-bold text-zinc-400 uppercase">Weight: 10% | Target: 9+</p>
                  </div>

                  {/* Public Transport */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="flex items-center gap-2 text-sm font-bold text-zinc-700">
                        <Bus className="w-4 h-4" /> Public Transport
                      </label>
                      <span className="text-sm font-black bg-zinc-100 px-2 py-1 rounded text-zinc-600">{formData.publicTransport}%</span>
                    </div>
                    <input type="range" name="publicTransport" min="0" max="100" value={formData.publicTransport} onChange={handleChange} className="w-full accent-green-600" />
                    <p className="text-[10px] font-bold text-zinc-400 uppercase">Weight: 10% | Target: Higher</p>
                  </div>

                  {/* Water Quality */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="flex items-center gap-2 text-sm font-bold text-zinc-700">
                        <Droplet className="w-4 h-4" /> Water Quality
                      </label>
                      <span className="text-sm font-black bg-zinc-100 px-2 py-1 rounded text-zinc-600">{formData.waterQuality}/100</span>
                    </div>
                    <input type="range" name="waterQuality" min="0" max="100" value={formData.waterQuality} onChange={handleChange} className="w-full accent-green-600" />
                    <p className="text-[10px] font-bold text-zinc-400 uppercase">Weight: 8% | Target: Higher</p>
                  </div>

                  {/* Efficiency */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="flex items-center gap-2 text-sm font-bold text-zinc-700">
                        <Leaf className="w-4 h-4" /> Energy Efficiency
                      </label>
                      <span className="text-sm font-black bg-zinc-100 px-2 py-1 rounded text-zinc-600">{formData.energyEfficiency}/100</span>
                    </div>
                    <input type="range" name="energyEfficiency" min="0" max="100" value={formData.energyEfficiency} onChange={handleChange} className="w-full accent-green-600" />
                    <p className="text-[10px] font-bold text-zinc-400 uppercase">Weight: 7% | Target: Higher</p>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" className="h-14 px-10 rounded-2xl font-black border-zinc-200" onClick={() => router.back()}>Cancel</Button>
                <Button type="submit" disabled={loading} className="h-14 px-10 rounded-2xl font-black bg-green-600 hover:bg-green-700 shadow-xl shadow-green-100 flex items-center gap-2">
                  <Save className="w-5 h-5" />
                  {loading ? (analyzing ? "AI Analyzing..." : "Saving...") : "Save Assessment"}
                </Button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
