"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  Sparkles, 
  Globe, 
  ShieldCheck, 
  Zap, 
  BarChart3,
  Trees,
  CheckCircle2
} from "lucide-react";
import { motion } from "framer-motion";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-50 overflow-hidden">
      {/* Premium Hero Section */}
      <section className="relative pt-32 pb-40 px-4">
        {/* Animated background blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-green-200/40 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-200/30 rounded-full blur-[100px] translate-y-1/4 -translate-x-1/4" />
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-2xl mb-8 border border-green-200 shadow-sm">
              <Sparkles className="w-4 h-4" />
              <span className="text-xs font-black uppercase tracking-widest">Next-Gen Urban Sustainability</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-7xl md:text-9xl font-black text-zinc-900 mb-8 leading-[0.85] tracking-tighter"
          >
            UrbEco: The <span className="text-green-600 italic">Future</span> of Cities.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl text-zinc-500 font-medium max-w-3xl mx-auto mb-12 leading-relaxed"
          >
            Global environmental impact rankings powered by AI. Join a community of urban 
            planners and citizens building a data-driven, greener tomorrow.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-6"
          >
            <Button size="lg" className="h-16 px-12 rounded-2xl font-black bg-green-600 hover:bg-green-700 text-xl shadow-2xl shadow-green-200" asChild>
              <Link href="/signup">
                Get Started Free
                <ArrowRight className="w-6 h-6 ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="h-16 px-12 rounded-2xl font-black border-zinc-200 text-xl hover:bg-white shadow-xl shadow-zinc-100" asChild>
              <Link href="/methodology">
                Learn Methodology
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-32 px-4 bg-white border-y border-zinc-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                icon: Zap,
                title: "AI Analysis",
                desc: "Powered by Gemini 2.0 Flash to provide expert-level qualitative insights for every town and city.",
                color: "bg-blue-50 text-blue-600"
              },
              {
                icon: Globe,
                title: "Live Rankings",
                desc: "Real-time global leaderboard driven by verified community assessments and environmental sensors.",
                color: "bg-green-50 text-green-600"
              },
              {
                icon: ShieldCheck,
                title: "Expert Verdicts",
                desc: "Go beyond numbers with qualitative verdicts that help you understand the 'Why' behind every score.",
                color: "bg-emerald-50 text-emerald-600"
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="p-10 rounded-[2.5rem] bg-zinc-50 border border-zinc-100 hover:scale-[1.02] transition-all"
              >
                <div className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center mb-8 shadow-sm`}>
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black text-zinc-900 mb-4">{feature.title}</h3>
                <p className="text-zinc-500 font-medium text-lg leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-32 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-black text-zinc-900 mb-16 tracking-tight">Trusted by Urban Pioneers</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 items-center opacity-40 grayscale">
             {/* Mock Partner Logos */}
             <div className="flex flex-col items-center gap-2">
                <Trees className="w-12 h-12" />
                <span className="font-black text-xs uppercase tracking-widest">EcoLabs</span>
             </div>
             <div className="flex flex-col items-center gap-2">
                <BarChart3 className="w-12 h-12" />
                <span className="font-black text-xs uppercase tracking-widest">DataStream</span>
             </div>
             <div className="flex flex-col items-center gap-2">
                <Globe className="w-12 h-12" />
                <span className="font-black text-xs uppercase tracking-widest">GreenNet</span>
             </div>
             <div className="flex flex-col items-center gap-2">
                <CheckCircle2 className="w-12 h-12" />
                <span className="font-black text-xs uppercase tracking-widest">CityMetric</span>
             </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="pb-32 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-zinc-900 rounded-[4rem] p-16 md:p-32 text-center text-white relative overflow-hidden">
             <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-green-600/20 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2" />
             <h2 className="text-5xl md:text-7xl font-black mb-8 leading-tight tracking-tighter relative z-10">
               Ready to track <br /> your city's progress?
             </h2>
             <Button size="lg" className="h-20 px-16 rounded-3xl font-black bg-green-600 hover:bg-green-700 text-2xl shadow-3xl shadow-green-900/40 relative z-10" asChild>
                <Link href="/signup">
                  Join UrbEco Now
                </Link>
             </Button>
          </div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="py-12 border-t border-zinc-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
             </div>
             <span className="text-xl font-black text-zinc-900 tracking-tighter">UrbEco</span>
          </div>
          <p className="text-zinc-400 font-bold text-sm">© 2026 UrbEco Index. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
