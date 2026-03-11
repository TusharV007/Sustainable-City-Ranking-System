"use client";

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ImpactBadge } from '@/components/ImpactBadge';
import { db } from '@/lib/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { useCollection } from 'react-firebase-hooks/firestore';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import {
  Check,
  X,
  TrendingUp,
  Plus,
  AlertCircle,
  Loader2,
  GitCompare,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function ComparePage() {
  const [assessmentsValue, loading] = useCollection(
    query(collection(db, "assessments"), orderBy("score", "desc"))
  );

  const cities = useMemo(() => {
    if (!assessmentsValue) return [];
    return assessmentsValue.docs.map((doc, index) => ({
      id: doc.id,
      ...doc.data(),
      rank: index + 1
    })) as any[];
  }, [assessmentsValue]);

  const [selectedCityIds, setSelectedCityIds] = useState<string[]>([]);

  // Auto-select top 2 if cities load and none are selected
  useMemo(() => {
    if (cities.length >= 2 && selectedCityIds.length === 0) {
      setSelectedCityIds([cities[0].id, cities[1].id]);
    }
  }, [cities]);

  const selectedCities = useMemo(() => {
    return selectedCityIds
      .map((id) => cities.find((c) => c.id === id))
      .filter((c): c is NonNullable<typeof c> => !!c);
  }, [selectedCityIds, cities]);

  const addCity = (cityId: string) => {
    if (selectedCityIds.length < 4 && !selectedCityIds.includes(cityId)) {
      setSelectedCityIds([...selectedCityIds, cityId]);
    }
  };

  const removeCity = (cityId: string) => {
    setSelectedCityIds(selectedCityIds.filter((id) => id !== cityId));
  };

  // Prepare comparison data for charts
  const metricsComparisonData = useMemo(() => [
    {
      metric: 'Overall Score',
      ...Object.fromEntries(selectedCities.map((city) => [city.name, city.score])),
    },
    {
      metric: 'Renewable %',
      ...Object.fromEntries(selectedCities.map((city) => [city.name, city.renewableEnergy || city.metrics?.renewableEnergy])),
    },
    {
      metric: 'Recycling %',
      ...Object.fromEntries(selectedCities.map((city) => [city.name, city.wasteRecycling || city.metrics?.wasteRecycling])),
    },
    {
      metric: 'Transport %',
      ...Object.fromEntries(selectedCities.map((city) => [city.name, city.publicTransport || city.metrics?.publicTransport])),
    },
    {
      metric: 'Water Qual',
      ...Object.fromEntries(selectedCities.map((city) => [city.name, city.waterQuality || city.metrics?.waterQuality])),
    },
    {
      metric: 'Efficiency',
      ...Object.fromEntries(selectedCities.map((city) => [city.name, city.energyEfficiency || city.metrics?.energyEfficiency])),
    },
  ], [selectedCities]);

  const colors = ['#16a34a', '#2563eb', '#f59e0b', '#dc2626'];

  const radarData = useMemo(() => [
    { metric: 'Renewable', ...Object.fromEntries(selectedCities.map((city) => [city.name, city.renewableEnergy || city.metrics?.renewableEnergy])) },
    { metric: 'Recycling', ...Object.fromEntries(selectedCities.map((city) => [city.name, city.wasteRecycling || city.metrics?.wasteRecycling])) },
    { metric: 'Transport', ...Object.fromEntries(selectedCities.map((city) => [city.name, city.publicTransport || city.metrics?.publicTransport])) },
    { metric: 'Water', ...Object.fromEntries(selectedCities.map((city) => [city.name, city.waterQuality || city.metrics?.waterQuality])) },
    { metric: 'Efficiency', ...Object.fromEntries(selectedCities.map((city) => [city.name, city.energyEfficiency || city.metrics?.energyEfficiency])) },
    { metric: 'Air Quality', ...Object.fromEntries(selectedCities.map((city) => [city.name, 100 - (city.airQualityIndex || city.metrics?.airQualityIndex || 0) / 5])) },
  ], [selectedCities]);

  if (loading) {
     return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50">
           <Loader2 className="w-12 h-12 text-green-600 animate-spin mb-6" />
           <p className="text-sm font-black uppercase tracking-[0.4em] text-zinc-400">Loading Comparative Matrix...</p>
        </div>
     );
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <div className="flex items-center gap-3 mb-6">
               <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
                  <GitCompare className="w-6 h-6 text-green-700" />
               </div>
               <span className="text-xs font-black uppercase tracking-[0.4em] text-zinc-400">Comparative Analysis</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-zinc-900 leading-none tracking-tighter">Compare Cities</h1>
            <p className="text-zinc-500 text-xl font-medium mt-4">
              Select up to 4 cities to visualize and analyze sustainability performance side by side.
            </p>
          </div>
        </div>

        {/* City Selection Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {[0, 1, 2, 3].map((index) => {
            const cityId = selectedCityIds[index];
            const city = cityId ? cities.find((c) => c.id === cityId) : null;

            return (
              <div key={index} className="h-full">
                {city ? (
                  <div className="bg-white border-2 border-green-600 rounded-[2.5rem] p-8 h-full relative group transition-all shadow-xl hover:shadow-2xl">
                    <button
                      onClick={() => removeCity(cityId)}
                      className="absolute -top-4 -right-4 w-10 h-10 bg-white border-2 border-zinc-100 rounded-full flex items-center justify-center text-zinc-300 hover:text-red-600 hover:border-red-600 transition-all shadow-xl z-10"
                    >
                      <X className="w-5 h-5" />
                    </button>
                    <div className="mb-6">
                      <h3 className="font-black text-zinc-900 text-2xl leading-[1.1] tracking-tight">{city.name}</h3>
                      <p className="text-xs font-black text-zinc-400 uppercase tracking-widest mt-2">{city.country}</p>
                    </div>
                    <div className="text-6xl font-black text-green-700 mb-6 tracking-tighter">{city.score}</div>
                    <ImpactBadge impact={city.impact} size="md" />
                  </div>
                ) : (
                  <Select onValueChange={addCity}>
                    <SelectTrigger className="h-full min-h-[220px] border-4 border-dashed border-zinc-100 bg-zinc-50/50 rounded-[2.5rem] flex flex-col items-center justify-center gap-6 hover:border-green-600 hover:bg-green-50/50 transition-all group">
                      <div className="w-14 h-14 bg-white rounded-3xl shadow-lg flex items-center justify-center group-hover:bg-green-600 transition-colors">
                        <Plus className="w-8 h-8 text-green-600 group-hover:text-white transition-colors" />
                      </div>
                      <div className="text-center font-black uppercase tracking-widest text-zinc-400 text-[10px] group-hover:text-green-700">
                        <SelectValue placeholder="Add Comparison" />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-0 shadow-3xl">
                      {cities
                        .filter((c) => !selectedCityIds.includes(c.id))
                        .map((city) => (
                          <SelectItem key={city.id} value={city.id} className="rounded-xl font-bold py-3 hover:bg-green-50">
                            {city.name} ({city.country})
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            );
          })}
        </div>

        {cities.length === 0 ? (
          <Card className="border-0 shadow-2xl p-24 text-center rounded-[4rem] bg-white">
            <AlertCircle className="w-20 h-20 text-zinc-100 mx-auto mb-10" />
            <h3 className="text-4xl font-black text-zinc-900 mb-4">No benchmark data</h3>
            <p className="text-zinc-500 font-medium text-xl max-w-md mx-auto mb-12">
              The database is currently empty. Add at least two cities via the assessment tool to enable comparisons.
            </p>
            <Button size="lg" className="bg-green-600 hover:bg-green-700 font-black px-12 h-16 rounded-2xl" asChild>
               <Link href="/assess">Assess First City</Link>
            </Button>
          </Card>
        ) : selectedCities.length < 2 ? (
          <Card className="border-0 shadow-2xl p-24 text-center rounded-[4rem] bg-zinc-900 text-white relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-green-600/10 to-transparent" />
             <div className="relative z-10">
              <div className="w-24 h-24 bg-white/5 rounded-[2rem] flex items-center justify-center mx-auto mb-10 border border-white/10">
                <GitCompare className="w-10 h-10 text-green-500" />
              </div>
              <h3 className="text-4xl font-black mb-4 tracking-tight">Select a Second City</h3>
              <p className="text-zinc-400 font-medium text-xl max-w-sm mx-auto">
                Compare {selectedCities[0]?.name} against another city to unlock advanced analytics.
              </p>
             </div>
          </Card>
        ) : (
          <div className="space-y-16">
            {/* Overall Comparison Table */}
            <Card className="border-0 shadow-3xl overflow-hidden rounded-[3.5rem] bg-white">
               <CardHeader className="p-10 bg-zinc-900 text-white flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-3xl font-black tracking-tight">Metric Matrix</CardTitle>
                  <p className="text-zinc-500 font-bold mt-2">Side-by-side performance indicators</p>
                </div>
                <div className="hidden sm:flex gap-4">
                   {selectedCities.map((_, i) => (
                      <div key={i} className="w-4 h-4 rounded-full" style={{ backgroundColor: colors[i] }} />
                   ))}
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-zinc-50/50">
                        <th className="py-8 px-10 text-xs font-black uppercase tracking-[0.3em] text-zinc-400">Indicator</th>
                        {selectedCities.map((city, i) => (
                          <th key={city.id} className="py-8 px-10 text-center min-w-[180px]">
                            <div className="font-black text-xl leading-none mb-2" style={{ color: colors[i] }}>{city.name}</div>
                            <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{city.country}</div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                      {[
                        { label: 'Sustainability Score', key: (c:any) => c.score, formatter: (v: any) => v, isHighBetter: true },
                        { label: 'CO₂ Emissions (t/cap)', key: (c:any) => c.co2Emissions || c.metrics?.co2Emissions, formatter: (v: any) => v, isHighBetter: false },
                        { label: 'Air Quality (AQI)', key: (c:any) => c.airQualityIndex || c.metrics?.airQualityIndex, formatter: (v: any) => v, isHighBetter: false },
                        { label: 'Renewable energy (%)', key: (c:any) => c.renewableEnergy || c.metrics?.renewableEnergy, formatter: (v: any) => `${v}%`, isHighBetter: true },
                        { label: 'Recycling Rate (%)', key: (c:any) => c.wasteRecycling || c.metrics?.wasteRecycling, formatter: (v: any) => `${v}%`, isHighBetter: true },
                        { label: 'Green Space (m²/cap)', key: (c:any) => c.greenSpace || c.metrics?.greenSpace, formatter: (v: any) => v, isHighBetter: true },
                        { label: 'Transport usage (%)', key: (c:any) => c.publicTransport || c.metrics?.publicTransport, formatter: (v: any) => `${v}%`, isHighBetter: true },
                      ].map((row) => (
                        <tr key={row.label} className="group hover:bg-zinc-50/50 transition-colors">
                          <td className="py-8 px-10 font-black text-zinc-600 text-lg">{row.label}</td>
                          {selectedCities.map((city) => {
                            const val = row.key(city) || 0;
                            const allVals = selectedCities.map(c => row.key(c) || 0);
                            const isBest = row.isHighBetter ? val === Math.max(...allVals) : val === Math.min(...allVals);

                            return (
                              <td key={city.id} className="py-8 px-10 text-center">
                                <div className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl text-xl font-black ${isBest ? 'bg-green-100 text-green-700 shadow-sm' : 'text-zinc-900'}`}>
                                  {row.formatter(val)}
                                  {isBest && <Check className="w-5 h-5 stroke-[4]" />}
                                </div>
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Visual Analytics - Radar */}
              <Card className="border-0 shadow-3xl p-12 rounded-[3.5rem] bg-white group">
                <CardHeader className="p-0 mb-12">
                  <div className="flex items-center gap-3 mb-4">
                     <TrendingUp className="w-6 h-6 text-green-600" />
                     <span className="text-xs font-black uppercase tracking-[0.4em] text-zinc-400">Radial Mapping</span>
                  </div>
                  <CardTitle className="text-4xl font-black tracking-tight">Environmental Fingerprint</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="h-[500px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={radarData}>
                        <PolarGrid stroke="#f1f5f9" strokeWidth={2} />
                        <PolarAngleAxis dataKey="metric" tick={{ fill: '#64748b', fontWeight: 800, fontSize: 13 }} />
                        <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                        {selectedCities.map((city, index) => (
                          <Radar
                            key={city.id}
                            name={city.name}
                            dataKey={city.name}
                            stroke={colors[index]}
                            fill={colors[index]}
                            fillOpacity={0.05}
                            strokeWidth={4}
                          />
                        ))}
                        <Tooltip contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)', fontWeight: 'bold' }} />
                        <Legend wrapperStyle={{ paddingTop: '40px', fontWeight: '800', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.1em' }} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Visual Analytics - Bar */}
              <Card className="border-0 shadow-3xl p-12 rounded-[3.5rem] bg-white">
                <CardHeader className="p-0 mb-12">
                  <div className="flex items-center gap-3 mb-4">
                     <div className="w-2 h-2 rounded-full bg-green-600" />
                     <span className="text-xs font-black uppercase tracking-[0.4em] text-zinc-400">Linear Distribution</span>
                  </div>
                  <CardTitle className="text-4xl font-black tracking-tight">Performance Delta</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="h-[500px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={metricsComparisonData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="metric" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontWeight: 800, fontSize: 12 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontWeight: 800 }} />
                        <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)', fontWeight: 'bold' }} />
                        <Legend wrapperStyle={{ paddingTop: '40px', fontWeight: '800', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.1em' }} />
                        {selectedCities.map((city, index) => (
                          <Bar key={city.id} dataKey={city.name} fill={colors[index]} radius={[8, 8, 0, 0]} />
                        ))}
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
