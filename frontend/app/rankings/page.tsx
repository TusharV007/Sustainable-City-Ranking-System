"use client";

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ImpactBadge } from '@/components/ImpactBadge';
import { db } from '@/lib/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { useCollection } from 'react-firebase-hooks/firestore';
import {
  Search,
  Filter,
  ArrowUpDown,
  TrendingUp,
  TrendingDown,
  Award,
  Globe,
  Loader2,
  PlusCircle,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function RankingsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [regionFilter, setRegionFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'score' | 'name'>('score');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const [assessmentsValue, loading] = useCollection(
    query(collection(db, "assessments"), orderBy("score", "desc"))
  );

  const cities = useMemo(() => {
    if (!assessmentsValue) return [];
    
    // Convert Firestore docs to City objects and calculate dynamic rank
    let processedCities = assessmentsValue.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as any[];

    // Sort by score first to establish base ranks
    processedCities.sort((a, b) => b.score - a.score);
    processedCities = processedCities.map((city, index) => ({
      ...city,
      rank: index + 1
    }));

    // Apply Filters
    let filtered = processedCities.filter((city) => {
      const matchesSearch =
        city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        city.country.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRegion = regionFilter === 'all' || city.region === regionFilter;
      return matchesSearch && matchesRegion;
    });

    // Apply Sorting
    filtered.sort((a, b) => {
      if (sortBy === 'score') {
        return sortOrder === 'desc' ? b.score - a.score : a.score - b.score;
      } else {
        return sortOrder === 'asc'
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      }
    });

    return filtered;
  }, [assessmentsValue, searchTerm, regionFilter, sortBy, sortOrder]);

  const regions = ['all', ...Array.from(new Set(cities.map((c) => c.region)))].filter(Boolean);

  const toggleSort = (key: 'score' | 'name') => {
    if (sortBy === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortOrder('desc');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-3 bg-green-100 text-green-700 px-5 py-2 rounded-2xl mb-6 border border-green-200 shadow-sm">
               <Award className="w-5 h-5" />
               <span className="text-xs font-black uppercase tracking-widest">Global Sustainability Index</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-zinc-900 leading-[0.9] tracking-tighter mb-4">City Rankings</h1>
            <p className="text-zinc-500 text-xl font-medium leading-relaxed">
              Real-time leaderboard of cities based on verified environmental assessments and sustainability metrics.
            </p>
          </div>
          <Button size="lg" className="bg-green-600 hover:bg-green-700 font-black px-10 h-16 rounded-[2rem] shadow-2xl shadow-green-100 group" asChild>
            <Link href="/assess" className="flex items-center gap-3">
              <PlusCircle className="w-6 h-6 group-hover:rotate-90 transition-transform duration-500" />
              Assess a City
            </Link>
          </Button>
        </div>

        {/* Global Stats Banner */}
        {!loading && cities.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
             <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-zinc-100">
                <div className="text-zinc-400 font-black uppercase tracking-widest text-[10px] mb-4">Total Records</div>
                <div className="text-5xl font-black text-zinc-900 leading-none">{cities.length}</div>
             </div>
             <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-zinc-100">
                <div className="text-zinc-400 font-black uppercase tracking-widest text-[10px] mb-4">Avg Sustain Score</div>
                <div className="text-5xl font-black text-green-600 leading-none">
                  {(cities.reduce((acc, c) => acc + c.score, 0) / cities.length).toFixed(1)}
                </div>
             </div>
             <div className="bg-zinc-900 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden group">
                <div className="absolute right-0 bottom-0 translate-x-1/4 translate-y-1/4 w-32 h-32 bg-green-600/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
                <div className="text-zinc-500 font-black uppercase tracking-widest text-[10px] mb-4">Index Status</div>
                <div className="text-4xl font-black text-white leading-none">Live Data</div>
             </div>
          </div>
        )}

        {/* Search and Filters */}
        <Card className="mb-12 border-0 shadow-2xl p-8 rounded-[3rem] bg-white sticky top-4 z-50">
          <CardContent className="p-0">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-5 relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5 group-focus-within:text-green-600 transition-colors" />
                <Input
                  placeholder="Search by city or country..."
                  className="pl-12 h-14 bg-zinc-50 border-0 rounded-2xl font-bold focus-visible:ring-2 focus-visible:ring-green-600 text-lg"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="md:col-span-3">
                <Select value={regionFilter} onValueChange={setRegionFilter}>
                  <SelectTrigger className="h-14 bg-zinc-50 border-0 rounded-2xl font-black text-zinc-600">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-green-600" />
                      <SelectValue placeholder="All Regions" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-0 shadow-3xl">
                    {regions.map((region) => (
                      <SelectItem key={region} value={region} className="capitalize rounded-xl font-bold py-3">
                        {region === 'all' ? 'All Regions' : region}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-4 flex items-center gap-3">
                <Button
                  variant="ghost"
                  className={`flex-1 h-14 rounded-2xl font-black gap-2 transition-all ${sortBy === 'score' ? 'bg-green-50 text-green-700' : 'text-zinc-400'}`}
                  onClick={() => toggleSort('score')}
                >
                  Score
                  {sortBy === 'score' && (sortOrder === 'desc' ? <TrendingDown className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />)}
                </Button>
                <Button
                  variant="ghost"
                  className={`flex-1 h-14 rounded-2xl font-black gap-2 transition-all ${sortBy === 'name' ? 'bg-green-50 text-green-700' : 'text-zinc-400'}`}
                  onClick={() => toggleSort('name')}
                >
                  A-Z
                  {sortBy === 'name' && (sortOrder === 'asc' ? <ArrowUpDown className="w-4 h-4" /> : <ArrowUpDown className="w-4 h-4 rotate-180" />)}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Table Content */}
        {loading ? (
          <div className="py-40 flex flex-col items-center justify-center gap-8">
             <div className="w-20 h-20 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
             <p className="text-xs font-black uppercase tracking-[0.5em] text-zinc-400 animate-pulse">Syncing with Global Database...</p>
          </div>
        ) : cities.length === 0 ? (
          <Card className="border-0 shadow-3xl p-32 text-center rounded-[4rem] bg-white group">
            <div className="w-24 h-24 bg-zinc-50 rounded-[2rem] flex items-center justify-center mx-auto mb-10 group-hover:scale-110 transition-transform duration-500">
               <Globe className="w-12 h-12 text-zinc-100" />
            </div>
            <h2 className="text-4xl font-black text-zinc-900 mb-4 tracking-tight">The list is empty</h2>
            <p className="text-zinc-500 text-xl font-medium max-w-sm mx-auto mb-12">
              No matching cities were found in our global sustainability database.
            </p>
            <Button size="lg" className="bg-green-600 hover:bg-green-700 font-black px-12 h-16 rounded-2xl" asChild>
               <Link href="/assess">Assess First City</Link>
            </Button>
          </Card>
        ) : (
          <div className="space-y-6">
            {cities.map((city) => (
              <Link key={city.id} href={`/city/${city.id}`}>
                <Card className="hover:shadow-3xl hover:translate-x-4 transition-all duration-500 cursor-pointer group border-0 shadow-xl overflow-hidden rounded-[2.5rem] bg-white">
                  <CardContent className="p-0">
                    <div className="flex items-center gap-10 p-10">
                      {/* Rank Column */}
                      <div className="flex-shrink-0 w-20 h-20 flex items-center justify-center bg-zinc-50 rounded-3xl group-hover:bg-green-600 transition-all shadow-inner border border-zinc-100">
                        {city.rank === 1 ? (
                          <Award className="w-10 h-10 text-yellow-500 group-hover:text-white transition-colors" />
                        ) : (
                          <span className="text-3xl font-black text-zinc-300 group-hover:text-white transition-colors">#{city.rank}</span>
                        )}
                      </div>

                      {/* City Info Column */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-4 mb-3">
                          <h3 className="text-3xl font-black text-zinc-900 group-hover:text-green-700 transition-colors tracking-tight">
                            {city.name}
                          </h3>
                          <ImpactBadge impact={city.impact} size="md" />
                        </div>
                        <div className="flex items-center gap-3 text-sm font-black text-zinc-400 uppercase tracking-[0.2em]">
                          <Globe className="w-5 h-5 text-green-600" />
                          <span>
                            {city.country} • {city.region}
                          </span>
                        </div>
                      </div>

                      {/* Metrics Preview - Desktop */}
                      <div className="hidden lg:flex items-center gap-16 px-16 border-l border-r border-zinc-100">
                        <div className="text-center group-hover:scale-110 transition-transform">
                          <div className="text-2xl font-black text-zinc-900 leading-none mb-2">
                             {city.renewableEnergy || city.metrics?.renewableEnergy || 0}%
                          </div>
                          <div className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Renewable</div>
                        </div>
                        <div className="text-center group-hover:scale-110 transition-transform">
                          <div className="text-2xl font-black text-zinc-900 leading-none mb-2">
                             {city.wasteRecycling || city.metrics?.wasteRecycling || 0}%
                          </div>
                          <div className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Recycling</div>
                        </div>
                      </div>

                      {/* Score Column */}
                      <div className="text-right min-w-[120px]">
                        <div className="text-5xl font-black text-green-700 leading-none tracking-tighter group-hover:scale-110 transition-transform">{city.score}</div>
                        <div className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400 mt-4">Sustainability Matrix</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
