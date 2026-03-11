"use client";

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ImpactBadge } from '@/components/ImpactBadge';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { useCollection } from 'react-firebase-hooks/firestore';
import {
  ArrowRight,
  TrendingUp,
  Globe,
  Award,
  Leaf,
  MapPin,
  LeafyGreen,
  PlusCircle,
  Loader2,
  Users,
  User as UserIcon,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function Home() {
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<'global' | 'personal'>('global');
  const [assessmentsValue, loading] = useCollection(
    query(collection(db, "assessments"), orderBy("score", "desc"))
  );

  const allCities = useMemo(() => {
    if (!assessmentsValue) return [];
    return assessmentsValue.docs.map((doc, index) => ({
      id: doc.id,
      ...doc.data(),
      rank: index + 1
    })) as any[];
  }, [assessmentsValue]);

  const cities = useMemo(() => {
    if (viewMode === 'global') return allCities;
    return allCities.filter(city => city.userId === user?.uid);
  }, [allCities, viewMode, user]);

  const globalStats = useMemo(() => {
    if (cities.length === 0) return {
      totalCities: 0,
      averageScore: 0,
      lowImpactCities: 0,
      mediumImpactCities: 0,
      highImpactCities: 0,
      topCity: null
    };

    return {
      totalCities: cities.length,
      averageScore: Number((cities.reduce((sum, city) => sum + city.score, 0) / cities.length).toFixed(1)),
      lowImpactCities: cities.filter((c) => c.impact === 'Low').length,
      mediumImpactCities: cities.filter((c) => c.impact === 'Medium').length,
      highImpactCities: cities.filter((c) => c.impact === 'High').length,
      topCity: cities[0]
    };
  }, [cities]);

  const topCities = cities.slice(0, 5);

  return (
    <div className="min-h-screen bg-zinc-50 font-sans">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-600 to-green-800 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl mb-8 border border-white/20">
              <Globe className="w-4 h-4 text-green-300" />
              <span className="text-sm font-black uppercase tracking-widest">UrbEco Platform</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-8 leading-[1] tracking-tighter">
              UrbEco: Building a Sustainable Future
            </h1>
            <p className="text-xl text-green-50/80 mb-12 leading-relaxed max-w-2xl font-medium">
              UrbEco provides comprehensive environmental impact rankings for cities worldwide. Data-driven insights
              to help urban planners and citizens make informed decisions for a greener tomorrow.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="bg-white text-green-700 hover:bg-green-50 font-black h-16 px-10 rounded-2xl shadow-xl shadow-green-900/20" asChild>
                <Link href="/rankings">
                  Explore Rankings
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/20 bg-white/5 text-white hover:bg-white/10 font-black h-16 px-10 rounded-2xl backdrop-blur-sm"
                asChild
              >
                <Link href="/assess">
                  Submit Assessment
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Global & Personal Statistics */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
        <div className="flex justify-center mb-8">
          <div className="bg-zinc-900/10 backdrop-blur-md p-1.5 rounded-2xl flex gap-1 border border-zinc-200 shadow-xl">
             <Button 
                variant={viewMode === 'global' ? 'default' : 'ghost'} 
                className={`h-12 px-8 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${viewMode === 'global' ? 'bg-green-600 shadow-lg shadow-green-900/20' : 'text-zinc-500 hover:bg-white/50'}`}
                onClick={() => setViewMode('global')}
             >
                <Users className="w-4 h-4 mr-2" />
                Global Index
             </Button>
             <Button 
                variant={viewMode === 'personal' ? 'default' : 'ghost'} 
                className={`h-12 px-8 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${viewMode === 'personal' ? 'bg-green-600 shadow-lg shadow-green-900/20' : 'text-zinc-500 hover:bg-white/50'}`}
                onClick={() => setViewMode('personal')}
             >
                <UserIcon className="w-4 h-4 mr-2" />
                My Assessments
             </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="shadow-2xl border-0 rounded-3xl overflow-hidden group hover:scale-[1.02] transition-transform">
            <CardHeader className="pb-2 bg-zinc-50/50">
              <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
                {viewMode === 'global' ? 'Global Cities' : 'My Cities'}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex items-baseline gap-3">
                <span className="text-5xl font-black text-zinc-900 leading-none">{globalStats.totalCities}</span>
                <Globe className="w-6 h-6 text-green-600 animate-pulse" />
              </div>
              <p className="text-xs font-bold text-zinc-500 mt-4">Verified records in {viewMode === 'global' ? 'database' : 'portfolio'}</p>
            </CardContent>
          </Card>

          <Card className="shadow-2xl border-0 rounded-3xl overflow-hidden group hover:scale-[1.02] transition-transform">
            <CardHeader className="pb-2 bg-zinc-50/50">
              <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
                {viewMode === 'global' ? 'Global Avg' : 'My Avg Score'}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex items-baseline gap-3">
                <span className="text-5xl font-black text-zinc-900 leading-none">{globalStats.averageScore}</span>
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-xs font-bold text-zinc-500 mt-4">Sustainability rating</p>
            </CardContent>
          </Card>

          <Card className="shadow-2xl border-0 rounded-3xl overflow-hidden group hover:scale-[1.02] transition-transform">
            <CardHeader className="pb-2 bg-zinc-50/50">
              <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Low Impact</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex items-baseline gap-3">
                <span className="text-5xl font-black text-green-700 leading-none">
                  {globalStats.lowImpactCities}
                </span>
                <LeafyGreen className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-xs font-bold text-zinc-500 mt-4">Leading performers</p>
            </CardContent>
          </Card>

          <Card className="shadow-2xl border-0 rounded-3xl overflow-hidden group hover:scale-[1.02] transition-transform">
            <CardHeader className="pb-2 bg-zinc-50/50">
              <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
                {viewMode === 'global' ? 'Top Global' : 'My Top City'}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              {globalStats.topCity ? (
                <>
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-black text-zinc-900 leading-none truncate max-w-[150px]">{globalStats.topCity.name}</span>
                    <Award className="w-6 h-6 text-yellow-500" />
                  </div>
                  <p className="text-xs font-bold text-zinc-500 mt-4">Score: {globalStats.topCity.score}</p>
                </>
              ) : (
                <div className="text-zinc-400 font-bold py-2 italic text-sm">No data yet</div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Top Cities Leaderboard */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="text-4xl font-black text-zinc-900 tracking-tight">
              {viewMode === 'global' ? 'Top Sustainable Cities' : 'My Sustainability Portfolio'}
            </h2>
            <p className="text-zinc-500 mt-3 text-xl font-medium">
              {viewMode === 'global' ? 'Leading the way in environmental responsibility' : 'A detailed overview of your city assessments'}
            </p>
          </div>
          <Button variant="outline" className="font-black h-12 px-6 rounded-xl border-zinc-200" asChild>
            <Link href="/rankings">
              View All Cities
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-6">
             <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
             <p className="text-sm font-black uppercase tracking-[0.3em] text-zinc-400">Analyzing Global Data...</p>
          </div>
        ) : cities.length === 0 ? (
          <Card className="border-0 shadow-lg p-20 text-center rounded-[3rem]">
            <Globe className="w-20 h-20 text-zinc-100 mx-auto mb-8" />
            <h3 className="text-3xl font-black text-zinc-900 mb-4">
              {viewMode === 'global' ? 'No Global Data' : 'You Haven\'t Assessed Any Cities'}
            </h3>
            <p className="text-zinc-500 text-lg mb-10 max-w-md mx-auto">
              {viewMode === 'global' 
                ? 'Be the first to contribute to the global index by assessing a city\'s sustainability.'
                : 'Start building your sustainability portfolio by submitting your first city assessment.'
              }
            </p>
            <Button size="lg" className="bg-green-600 hover:bg-green-700 font-black px-12 h-16 rounded-2xl shadow-xl shadow-green-100" asChild>
              <Link href="/assess" className="flex items-center gap-2">
                <PlusCircle className="w-5 h-5" />
                {viewMode === 'global' ? 'Start Global Contribution' : 'Assess Your First City'}
              </Link>
            </Button>
          </Card>
        ) : (
          <div className="grid gap-6">
            {topCities.map((city, index) => (
              <Link key={city.id} href={`/rankings`}>
                <Card className="hover:shadow-2xl hover:scale-[1.01] transition-all cursor-pointer group border-0 shadow-xl overflow-hidden rounded-3xl">
                  <CardContent className="p-0">
                    <div className="flex items-center gap-8 p-8">
                      {/* Rank */}
                      <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center bg-zinc-50 rounded-2xl group-hover:bg-green-600 transition-all shadow-inner">
                        {index === 0 ? (
                          <Award className="w-10 h-10 text-yellow-500 group-hover:text-white transition-colors" />
                        ) : (
                          <span className="text-2xl font-black text-zinc-300 group-hover:text-white transition-colors">#{index + 1}</span>
                        )}
                      </div>

                      {/* City Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-4 mb-2">
                          <h3 className="text-2xl font-black text-zinc-900 group-hover:text-green-700 transition-colors">
                            {city.name}
                          </h3>
                          <ImpactBadge impact={city.impact} size="md" />
                        </div>
                        <div className="flex items-center gap-2 text-sm font-bold text-zinc-400 uppercase tracking-widest">
                          <MapPin className="w-4 h-4 text-green-600" />
                          <span>
                            {city.country} • {city.region}
                          </span>
                        </div>
                      </div>

                      {/* Score */}
                      <div className="text-right hidden sm:block px-10 border-l border-zinc-100">
                        <div className="text-4xl font-black text-green-700 underline decoration-green-100 decoration-4 underline-offset-8">{city.score}</div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mt-4">Sustain-Index</div>
                      </div>

                      <div className="flex-shrink-0 p-3 bg-zinc-50 rounded-2xl group-hover:bg-green-600 group-hover:text-white transition-all shadow-sm">
                        <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Impact Distribution */}
      {!loading && cities.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
          <Card className="border-0 shadow-2xl p-12 rounded-[3.5rem] bg-zinc-900 text-white relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-green-500/10 to-transparent" />
            <CardHeader className="p-0 mb-12 relative z-10">
              <div className="flex items-center gap-3 mb-4">
                 <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                 <span className="text-[10px] font-black uppercase tracking-[0.4em] text-green-500">
                    {viewMode === 'global' ? 'Global Insights' : 'My Personal Insights'}
                 </span>
              </div>
              <CardTitle className="text-4xl font-black">Impact Distribution</CardTitle>
              <p className="text-zinc-400 font-medium mt-3 text-lg">
                Environmental classification across live data points
              </p>
            </CardHeader>
            <CardContent className="p-0 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="group p-10 bg-white/5 rounded-[2.5rem] border border-white/10 hover:bg-green-600/20 hover:border-green-500/30 transition-all cursor-default relative overflow-hidden">
                  <Leaf className="absolute -right-8 -bottom-8 w-40 h-40 text-white/5 rotate-12 transition-transform group-hover:scale-110" />
                  <div className="text-6xl font-black text-white mb-4 leading-none">
                    {globalStats.lowImpactCities}
                  </div>
                  <div className="text-xl font-black text-green-400 mb-2">Low Impact</div>
                  <p className="text-sm font-bold text-zinc-500">
                    Cities demonstrating superior environmental practices and low carbon footprints.
                  </p>
                </div>

                <div className="group p-10 bg-white/5 rounded-[2.5rem] border border-white/10 hover:bg-yellow-600/20 hover:border-yellow-500/30 transition-all cursor-default relative overflow-hidden">
                  <Globe className="absolute -right-8 -bottom-8 w-40 h-40 text-white/5 -rotate-12 transition-transform group-hover:scale-110" />
                  <div className="text-6xl font-black text-white mb-4 leading-none">
                    {globalStats.mediumImpactCities}
                  </div>
                  <div className="text-xl font-black text-yellow-400 mb-2">Medium Impact</div>
                  <p className="text-sm font-bold text-zinc-500">
                    Cities with moderate environmental indicators and specific areas of concern.
                  </p>
                </div>

                <div className="group p-10 bg-white/5 rounded-[2.5rem] border border-white/10 hover:bg-red-600/20 hover:border-red-500/30 transition-all cursor-default relative overflow-hidden">
                  <TrendingUp className="absolute -right-8 -bottom-8 w-40 h-40 text-white/5 rotate-45 transition-transform group-hover:scale-110" />
                  <div className="text-6xl font-black text-white mb-4 leading-none">
                    {globalStats.highImpactCities}
                  </div>
                  <div className="text-xl font-black text-red-400 mb-2">High Impact</div>
                  <p className="text-sm font-bold text-zinc-500">
                    Areas requiring urgent intervention to improve ecological and social sustainability.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      {/* CTA Section */}
      <section className="bg-zinc-50 py-32 border-t border-zinc-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-5xl font-black text-zinc-900 mb-8 leading-tight tracking-tight">
              Join the Movement for Greener Cities
            </h2>
            <p className="text-2xl text-zinc-500 font-medium leading-relaxed mb-12">
              Our data grows with community contributions. Assess your city today and help build a more transparent global index.
            </p>
            <div className="flex flex-wrap gap-6 justify-center">
              <Button size="lg" className="bg-green-600 hover:bg-green-700 font-black px-12 h-16 rounded-2xl text-lg shadow-2xl shadow-green-200" asChild>
                <Link href="/assess">
                  Assess Your City
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-zinc-200 hover:bg-white font-black px-12 h-16 rounded-2xl text-lg shadow-xl shadow-zinc-200/50" asChild>
                <Link href="/rankings">
                  View Full Rankings
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
