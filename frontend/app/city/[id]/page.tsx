"use client";

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ImpactBadge } from '@/components/ImpactBadge';
import { MetricCard } from '@/components/MetricCard';
import { db } from '@/lib/firebase';
import { doc } from 'firebase/firestore';
import { useDocument } from 'react-firebase-hooks/firestore';
import {
  ArrowLeft,
  MapPin,
  Award,
  TrendingUp,
  Wind,
  Droplet,
  Leaf,
  Recycle,
  Trees,
  Bus,
  Zap,
  AlertCircle,
  Lightbulb,
  Loader2,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function CityDetailPage() {
  const params = useParams();
  const id = params.id as string;
  
  const [value, loading, error] = useDocument(doc(db, "assessments", id));

  const city = useMemo(() => {
    if (!value) return null;
    return { id: value.id, ...value.data() } as any;
  }, [value]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center p-4">
        <Loader2 className="w-12 h-12 text-green-600 animate-spin mb-4" />
        <p className="text-sm font-black uppercase tracking-widest text-zinc-400">Retrieving City Data...</p>
      </div>
    );
  }

  if (error || !city) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4">
        <Card className="max-w-md border-0 shadow-2xl rounded-3xl overflow-hidden">
          <CardContent className="p-12 text-center">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
               <AlertCircle className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-3xl font-black text-zinc-900 mb-2">City Not Found</h2>
            <p className="text-zinc-500 font-medium mb-8">
              The city record you are looking for might have been moved or doesn't exist.
            </p>
            <Button className="w-full h-14 rounded-2xl font-black bg-green-600" asChild>
              <Link href="/rankings">
                Back to Rankings
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Prepare radar chart data
  const radarData = [
    { metric: 'Renewable', value: city.renewableEnergy || city.metrics?.renewableEnergy || 0 },
    { metric: 'Recycling', value: city.wasteRecycling || city.metrics?.wasteRecycling || 0 },
    { metric: 'Transport', value: city.publicTransport || city.metrics?.publicTransport || 0 },
    { metric: 'Water', value: city.waterQuality || city.metrics?.waterQuality || 0 },
    { metric: 'Efficiency', value: city.energyEfficiency || city.metrics?.energyEfficiency || 0 },
    { 
      metric: 'Air Quality', 
      value: Math.max(0, 100 - ((city.airQualityIndex || city.metrics?.airQualityIndex || 0) / 5)) 
    },
  ];

  const getImpactExplanation = () => {
    if (city.impact === 'Low') {
      return 'This city demonstrates excellent environmental performance with low CO₂ emissions, high renewable energy adoption, and strong sustainability practices across all metrics.';
    } else if (city.impact === 'Medium') {
      return 'This city shows moderate environmental impact with room for improvement in key areas such as emissions reduction, renewable energy adoption, or waste management.';
    } else {
      return 'This city faces significant environmental challenges with high emissions, lower renewable energy usage, or poor air quality. Urgent action is recommended to improve sustainability.';
    }
  };

  const metrics = {
    co2: city.co2Emissions || city.metrics?.co2Emissions || 0,
    aqi: city.airQualityIndex || city.metrics?.airQualityIndex || 0,
    renewable: city.renewableEnergy || city.metrics?.renewableEnergy || 0,
    recycling: city.wasteRecycling || city.metrics?.wasteRecycling || 0,
    greenSpace: city.greenSpace || city.metrics?.greenSpace || 0,
    transport: city.publicTransport || city.metrics?.publicTransport || 0,
    water: city.waterQuality || city.metrics?.waterQuality || 0,
    efficiency: city.energyEfficiency || city.metrics?.energyEfficiency || 0,
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Button variant="ghost" className="mb-8 hover:bg-green-50 text-green-700 font-bold rounded-xl" asChild>
          <Link href="/rankings">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Rankings
          </Link>
        </Button>

        {/* City Header */}
        <div className="bg-gradient-to-br from-green-600 to-green-800 text-white rounded-[3rem] p-12 mb-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-12">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md border border-white/10">
                   <MapPin className="w-6 h-6" />
                </div>
                <span className="text-xl font-bold tracking-tight opacity-90">
                  {city.country} • {city.region}
                </span>
              </div>
              <h1 className="text-6xl md:text-8xl font-black mb-10 leading-[0.9] tracking-tighter">
                {city.name}
              </h1>
              <div className="flex flex-wrap items-center gap-6">
                <ImpactBadge impact={city.impact} size="lg" />
                {city.rank && (
                  <div className="flex items-center gap-3 bg-black/20 backdrop-blur-md px-8 py-4 rounded-[2rem] border border-white/10 shadow-lg">
                    <Award className="w-8 h-8 text-yellow-400" />
                    <span className="text-xl font-black">Global Index Ranking</span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white text-green-900 rounded-[2.5rem] p-12 text-center min-w-[280px] shadow-3xl transform hover:scale-105 transition-transform duration-500">
              <div className="text-9xl font-black mb-2 leading-none tracking-tighter">{city.score}</div>
              <div className="text-xs font-black uppercase tracking-[0.3em] opacity-40">Sustainability Score</div>
            </div>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-10 px-4">
             <div className="w-3 h-3 rounded-full bg-green-600" />
             <h2 className="text-4xl font-black text-zinc-900 tracking-tight">Environmental Snapshot</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <MetricCard
              title="CO₂ Emissions"
              value={metrics.co2}
              unit="t/cap"
              icon={Wind}
              progress={100 - metrics.co2 * 10}
              reverseProgress={true}
              description="Lower is better"
            />
            <MetricCard
              title="Air Quality"
              value={metrics.aqi}
              unit="AQI"
              icon={Wind}
              progress={100 - (metrics.aqi / 5)}
              reverseProgress={true}
              description="0-50 is good"
            />
            <MetricCard
              title="Renewable Energy"
              value={metrics.renewable}
              unit="%"
              icon={Zap}
              progress={metrics.renewable}
              description="% of total energy"
            />
            <MetricCard
              title="Waste Recycling"
              value={metrics.recycling}
              unit="%"
              icon={Recycle}
              progress={metrics.recycling}
              description="Recycling rate"
            />
            <MetricCard
              title="Green Space"
              value={metrics.greenSpace}
              unit="m²/capita"
              icon={Trees}
              progress={Math.min(metrics.greenSpace * 2, 100)}
              description="Urban nature"
            />
            <MetricCard
              title="Public Transport"
              value={metrics.transport}
              unit="%"
              icon={Bus}
              progress={metrics.transport}
              description="Usage rate"
            />
            <MetricCard
              title="Water Quality"
              value={metrics.water}
              unit="/100"
              icon={Droplet}
              progress={metrics.water}
              description="Quality index"
            />
            <MetricCard
              title="Energy Efficiency"
              value={metrics.efficiency}
              unit="/100"
              icon={Leaf}
              progress={metrics.efficiency}
              description="Efficiency index"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Performance Overview - Radar Chart */}
          <Card className="border-0 shadow-2xl p-10 rounded-[3rem] bg-white group overflow-hidden">
            <CardHeader className="p-0 mb-10">
              <CardTitle className="text-3xl font-black tracking-tight">Environmental Profile</CardTitle>
              <p className="text-zinc-500 font-medium text-lg mt-2">Multi-dimensional sustainability analysis</p>
            </CardHeader>
            <CardContent className="p-0 relative">
              <div className="h-[450px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#f1f5f9" strokeWidth={2} />
                    <PolarAngleAxis dataKey="metric" tick={{ fill: '#64748b', fontSize: 13, fontWeight: 800 }} />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar
                      name={city.name}
                      dataKey="value"
                      stroke="#16a34a"
                      fill="#16a34a"
                      fillOpacity={0.15}
                      strokeWidth={4}
                    />
                    <Tooltip contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)', fontWeight: 'bold' }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Analysis Card */}
          <Card className="border-0 shadow-2xl p-10 rounded-[3rem] bg-zinc-900 text-white flex flex-col justify-between relative overflow-hidden">
            <div className="absolute right-0 bottom-0 translate-x-1/4 translate-y-1/4 w-96 h-96 bg-green-600/10 rounded-full blur-[100px]" />
            <CardHeader className="p-0 mb-10 relative z-10">
              <div className="flex items-center justify-between mb-6">
                 <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-500/20 rounded-2xl flex items-center justify-center border border-green-500/30">
                       <TrendingUp className="w-6 h-6 text-green-500" />
                    </div>
                    <span className="text-xs font-black uppercase tracking-[0.4em] text-green-500">Expert Context</span>
                 </div>
                 {city.insights && (
                   <div className="flex items-center gap-2 bg-green-500/10 text-green-500 px-4 py-2 rounded-2xl border border-green-500/20">
                      <Sparkles className="w-4 h-4" />
                      <span className="text-[10px] font-black uppercase tracking-widest">AI Analysis</span>
                   </div>
                 )}
              </div>
              <CardTitle className="text-4xl font-black leading-tight">
                {city.insights ? `${city.insights.verdict} Verdict` : "Insight Summary"}
              </CardTitle>
              <p className="text-zinc-500 font-bold mt-4 text-xl">
                 Why {city.name} is classified as <span className={`underline decoration-4 underline-offset-8 ${city.impact === 'Low' ? 'text-green-500 decoration-green-900' : city.impact === 'Medium' ? 'text-yellow-500 decoration-yellow-900' : 'text-red-500 decoration-red-900'}`}>{city.impact} Impact</span>
              </p>
            </CardHeader>
            <CardContent className="p-0 relative z-10 flex-1">
              <p className="text-zinc-400 text-2xl font-medium leading-[1.6] mb-12">
                {city.insights?.summary || getImpactExplanation()}
              </p>
              
              {city.insights?.recommendations ? (
                <div className="space-y-6">
                  <div className="flex items-center gap-4 mb-6">
                     <Lightbulb className="w-8 h-8 text-yellow-400" />
                     <h4 className="font-black text-2xl">Expert Recommendations</h4>
                  </div>
                  {city.insights.recommendations.map((rec: string, index: number) => (
                    <div key={index} className="flex gap-4 p-6 bg-white/5 rounded-3xl border border-white/10 group hover:bg-white/10 transition-colors">
                       <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 font-black text-sm">
                         {index + 1}
                       </div>
                       <p className="text-zinc-300 font-medium text-lg leading-relaxed">{rec}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-12 p-8 bg-white/5 rounded-3xl border border-white/10">
                  <div className="flex items-center gap-4 mb-4">
                     <Lightbulb className="w-6 h-6 text-yellow-400" />
                     <h4 className="font-black text-lg">Key Data Point</h4>
                  </div>
                  <p className="text-zinc-400 font-medium">
                    {city.name}'s current score of <span className="text-white font-black">{city.score}</span> reflects recent environmental disclosures. Submit a comparison to see how it pairs against topological peers.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="mt-20 flex flex-wrap gap-8 justify-center">
          <Button size="lg" variant="outline" className="h-16 px-12 rounded-[2rem] font-black border-zinc-200 text-xl shadow-xl hover:bg-white" asChild>
            <Link href="/compare">
              Compare Cities
            </Link>
          </Button>
          <Button size="lg" className="h-16 px-12 rounded-[2rem] font-black bg-green-600 hover:bg-green-700 text-xl shadow-2xl shadow-green-200" asChild>
            <Link href="/rankings">
              Browse Global Index
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
