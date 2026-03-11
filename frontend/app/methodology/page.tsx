"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  BookOpen,
  Database,
  LineChart,
  CheckCircle2,
  Wind,
  Zap,
  Recycle,
  Trees,
  Bus,
  Droplet,
  Leaf,
  AlertCircle,
  Lightbulb,
} from 'lucide-react';

export default function MethodologyPage() {
  const metrics = [
    {
      name: 'CO₂ Emissions',
      icon: Wind,
      weight: 20,
      description: 'Annual carbon dioxide emissions per capita in tons',
      calculation: 'Lower emissions = higher score. Normalized on a scale of 0-100',
      impact: 'Primary indicator of climate impact',
    },
    {
      name: 'Air Quality Index',
      icon: Wind,
      weight: 15,
      description: 'EPA Air Quality Index measuring major air pollutants',
      calculation: 'Lower AQI = better score. Good (0-50) scores highest',
      impact: 'Direct impact on public health and environmental quality',
    },
    {
      name: 'Renewable Energy',
      icon: Zap,
      weight: 18,
      description: 'Percentage of total energy from renewable sources',
      calculation: 'Direct percentage contribution to overall score',
      impact: 'Key indicator of sustainable energy transition',
    },
    {
      name: 'Waste Recycling Rate',
      icon: Recycle,
      weight: 12,
      description: 'Percentage of municipal waste that is recycled',
      calculation: 'Higher recycling rate = higher score',
      impact: 'Measures circular economy implementation',
    },
    {
      name: 'Green Space',
      icon: Trees,
      weight: 10,
      description: 'Square meters of green space per capita',
      calculation: 'Normalized based on WHO recommendations (9 m²/capita minimum)',
      impact: 'Affects air quality, mental health, and urban biodiversity',
    },
    {
      name: 'Public Transport Usage',
      icon: Bus,
      weight: 10,
      description: 'Percentage of population using public transportation',
      calculation: 'Higher usage = higher score, reduces private vehicle emissions',
      impact: 'Indicates sustainable mobility infrastructure',
    },
    {
      name: 'Water Quality',
      icon: Droplet,
      weight: 8,
      description: 'Water quality index based on chemical and biological parameters',
      calculation: 'Score from 0-100, higher is better',
      impact: 'Essential for ecosystem and human health',
    },
    {
      name: 'Energy Efficiency',
      icon: Leaf,
      weight: 7,
      description: 'Overall energy efficiency in buildings and infrastructure',
      calculation: 'Composite score of building standards and efficiency programs',
      impact: 'Reduces overall energy demand and emissions',
    },
  ];

  const impactClassification = [
    {
      level: 'Low Impact',
      range: '80-100',
      color: 'bg-green-100 text-green-800 border-green-300',
      description:
        'Cities demonstrating excellent environmental performance with comprehensive sustainability programs and low emissions.',
    },
    {
      level: 'Medium Impact',
      range: '60-79',
      color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      description:
        'Cities with moderate environmental impact showing good progress but requiring improvements in specific areas.',
    },
    {
      level: 'High Impact',
      range: '0-59',
      color: 'bg-red-100 text-red-800 border-red-300',
      description:
        'Cities facing significant environmental challenges requiring urgent action and comprehensive sustainability initiatives.',
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-black text-zinc-900 mb-2">Methodology & Data Sources</h1>
          <p className="text-zinc-600 text-lg">
            Understanding how we rank cities and generate sustainability recommendations
          </p>
        </div>

        {/* Overview */}
        <Card className="mb-8 border-0 shadow-lg p-6">
          <CardHeader className="p-0 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-green-700" />
              </div>
              <CardTitle className="text-2xl font-black">Ranking Algorithm Overview</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0 space-y-6">
            <p className="text-zinc-700 leading-relaxed text-lg">
              UrbEco uses a comprehensive, data-driven approach to
              evaluate environmental performance across multiple dimensions. Each city receives a
              sustainability score from 0-100 based on eight key environmental metrics.
            </p>
            <div className="bg-green-50 border-2 border-green-100 rounded-2xl p-6">
              <h3 className="font-bold text-green-900 mb-2 flex items-center gap-2 text-lg">
                <CheckCircle2 className="w-6 h-6" />
                Scoring System
              </h3>
              <p className="text-green-800 font-medium">
                Final Score = Σ (Metric Score × Weight) where weights are assigned based on global
                climate priorities and environmental impact research. Cities are then ranked
                globally and classified into Low, Medium, or High environmental impact categories.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Metrics Breakdown */}
        <Card className="mb-8 border-0 shadow-lg p-6">
          <CardHeader className="p-0 mb-8">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <LineChart className="w-6 h-6 text-green-700" />
              </div>
              <CardTitle className="text-2xl font-black">Environmental Metrics & Weights</CardTitle>
            </div>
            <p className="text-zinc-500 font-medium mt-2">
              Total weight: 100% distributed across eight sustainability indicators
            </p>
          </CardHeader>
          <CardContent className="p-0">
            <div className="grid gap-4">
              {metrics.map((metric, index) => {
                const Icon = metric.icon;
                return (
                  <div
                    key={index}
                    className="group border-2 border-zinc-100 rounded-2xl p-6 hover:border-green-200 hover:bg-green-50/30 transition-all shadow-sm"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-zinc-100 flex items-center justify-center group-hover:bg-green-100 group-hover:border-green-200 transition-colors">
                          <Icon className="w-6 h-6 text-zinc-600 group-hover:text-green-700" />
                        </div>
                        <div>
                          <h3 className="font-bold text-zinc-900 text-lg">{metric.name}</h3>
                          <p className="text-zinc-500 font-medium">{metric.description}</p>
                        </div>
                      </div>
                      <Badge className="bg-green-600 text-white font-bold h-7 px-3">{metric.weight}%</Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-16">
                      <div>
                        <div className="text-[10px] font-black uppercase tracking-wider text-zinc-400 mb-1">Calculation</div>
                        <p className="text-zinc-600 font-medium">{metric.calculation}</p>
                      </div>
                      <div>
                        <div className="text-[10px] font-black uppercase tracking-wider text-zinc-400 mb-1">
                          Environmental Impact
                        </div>
                        <p className="text-zinc-600 font-medium">{metric.impact}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Impact Classification */}
        <Card className="mb-8 border-0 shadow-lg p-6">
          <CardHeader className="p-0 mb-8 text-center">
            <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-black">Impact Classification System</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="grid gap-4">
              {impactClassification.map((classification, index) => (
                <div
                  key={index}
                  className={`border-2 ${classification.color} rounded-2xl p-6 shadow-sm`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-black text-xl">{classification.level}</h3>
                    <Badge variant="outline" className={`${classification.color} font-black border-2`}>
                      Score: {classification.range}
                    </Badge>
                  </div>
                  <p className="text-zinc-800 font-medium leading-relaxed">{classification.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Data Sources */}
        <Card className="mb-8 border-0 shadow-lg p-6">
          <CardHeader className="p-0 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Database className="w-6 h-6 text-green-700" />
              </div>
              <CardTitle className="text-2xl font-black">Data Sources & Collection</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0 space-y-6">
            <p className="text-zinc-700 font-medium text-lg">
              This platform uses simulated data for demonstration purposes. In a production
              environment, data would be collected from the following authoritative sources:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-zinc-50 rounded-2xl p-6 border border-zinc-100">
                <h3 className="font-black text-zinc-900 mb-4 flex items-center gap-2">Government Sources</h3>
                <ul className="text-zinc-600 font-medium space-y-2">
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-green-600 rounded-full" /> EPA Air Quality Database</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-green-600 rounded-full" /> National emissions inventories</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-green-600 rounded-full" /> Municipal waste management reports</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-green-600 rounded-full" /> Urban planning departments</li>
                </ul>
              </div>
              <div className="bg-zinc-50 rounded-2xl p-6 border border-zinc-100">
                <h3 className="font-black text-zinc-900 mb-4 flex items-center gap-2">International Organizations</h3>
                <ul className="text-zinc-600 font-medium space-y-2">
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-green-600 rounded-full" /> World Bank Open Data</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-green-600 rounded-full" /> UN Environment Programme</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-green-600 rounded-full" /> International Energy Agency</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-green-600 rounded-full" /> WHO Air Quality Database</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recommendation Generation */}
        <Card className="mb-8 border-0 shadow-lg p-10 bg-zinc-900 text-white">
          <CardHeader className="p-0 mb-10">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-green-600 rounded-2xl flex items-center justify-center">
                <Lightbulb className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-3xl font-black">Recommendation Intelligence</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0 space-y-10">
            <p className="text-zinc-400 font-semibold text-xl leading-relaxed">
              Actionable recommendations are generated through a sophisticated analytical process:
            </p>
            <div className="grid gap-8">
               {[
                 { step: 1, title: 'Gap Analysis', desc: 'Identify areas where the city underperforms compared to top performers and global benchmarks.' },
                 { step: 2, title: 'Best Practice Matching', desc: 'Match the city\'s context with proven successful interventions from similar cities.' },
                 { step: 3, title: 'Priority Scoring', desc: 'Rank recommendations based on potential impact, feasibility, and alignment with climate goals.' },
                 { step: 4, title: 'Specific Action Items', desc: 'Generate concrete, implementable recommendations tailored to the city\'s unique characteristics.' }
               ].map((item) => (
                <div key={item.step} className="flex gap-6 group">
                  <div className="flex-shrink-0 w-12 h-12 bg-zinc-800 text-green-500 rounded-2xl flex items-center justify-center font-black text-xl group-hover:bg-green-600 group-hover:text-white transition-all">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="font-black text-white text-xl mb-2">{item.title}</h3>
                    <p className="text-zinc-400 font-medium text-lg leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
               ))}
            </div>
          </CardContent>
        </Card>

        {/* Transparency Statement */}
        <Card className="border-0 shadow-lg p-8 bg-zinc-50 border-t-8 border-green-600">
          <CardHeader className="p-0 mb-6">
            <CardTitle className="text-2xl font-black">Transparency & Continuous Improvement</CardTitle>
          </CardHeader>
          <CardContent className="p-0 space-y-6">
            <p className="text-zinc-700 font-medium text-lg leading-relaxed">
              We are committed to transparency and scientific rigor in our methodology. Our ranking
              system is continuously reviewed and updated based on:
            </p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                'Latest climate science research and IPCC recommendations',
                'Feedback from urban planners and environmental experts',
                'Emerging best practices in sustainable development',
                'Data quality improvements and new measurement tech'
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 bg-white p-4 rounded-xl border border-zinc-100 shadow-sm font-bold text-zinc-900 hover:border-green-200 transition-colors">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
