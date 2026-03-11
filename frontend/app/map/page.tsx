"use client";

import { useEffect, useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { db } from "@/lib/firebase";
import { collection, query, orderBy } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import { Loader2, Globe, MapPin, Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ImpactBadge } from "@/components/ImpactBadge";
import Link from "next/link";
import "leaflet/dist/leaflet.css";

// Dynamic import for Leaflet because it needs window object
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false });

// Minimal fallback coordinates for major hubs
const CITY_COORDINATES: Record<string, [number, number]> = {
  "Tokyo": [35.6762, 139.6503],
  "London": [51.5074, -0.1278],
  "New York": [40.7128, -74.0060],
  "Paris": [48.8566, 2.3522],
};

function MapComponent({ cities }: { cities: any[] }) {
  const [L, setL] = useState<any>(null);

  useEffect(() => {
    // Import leaflet for L object inside useEffect (browser-only)
    import("leaflet").then((leaflet) => {
      setL(leaflet);
    });
  }, []);

  if (!L) return null;

  // Custom icon based on impact level
  const getIcon = (impact: string) => {
    const color = impact === "Low" ? "#16a34a" : impact === "Medium" ? "#eab308" : "#dc2626";
    return L.divIcon({
      className: "custom-marker",
      html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);"></div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    });
  };

  return (
    <MapContainer center={[20, 0]} zoom={2} style={{ height: "100%", width: "100%" }} scrollWheelZoom={true}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {cities.map((city) => {
        const coords = city.coordinates || CITY_COORDINATES[city.name] || [0, 0];
        if (coords[0] === 0 && coords[1] === 0) return null;

        return (
          <Marker key={city.id} position={coords} icon={getIcon(city.impact)}>
            <Popup className="premium-popup">
              <div className="p-2 min-w-[200px]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-black text-zinc-900 text-lg">{city.name}</h3>
                  <div className="text-xl font-black text-green-700">{city.score}</div>
                </div>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <ImpactBadge impact={city.impact} size="sm" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{city.country}</span>
                  </div>
                  <Link 
                    href={`/city/${city.id}`}
                    className="mt-2 w-full py-2 px-4 bg-zinc-900 text-white rounded-xl text-center text-xs font-black uppercase tracking-widest hover:bg-zinc-800 transition-colors"
                  >
                    View Insights
                  </Link>
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}

export default function MapPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [assessmentsValue, loading] = useCollection(
    query(collection(db, "assessments"), orderBy("score", "desc"))
  );

  const cities = useMemo(() => {
    if (!assessmentsValue) return [];
    return assessmentsValue.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as any[];
  }, [assessmentsValue]);

  const filteredCities = useMemo(() => {
    return cities.filter(city => 
      city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      city.country.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [cities, searchTerm]);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-zinc-50 flex flex-col items-center justify-center p-4">
        <Loader2 className="w-12 h-12 text-green-600 animate-spin mb-4" />
        <p className="text-sm font-black uppercase tracking-[0.3em] text-zinc-400">Loading Map View...</p>
      </div>
    );
  }

  return (
    <div className="relative h-[calc(100vh-80px)] w-full bg-zinc-200 overflow-hidden">
      {/* Search Overlay */}
      <div className="absolute top-8 left-8 z-[1000] w-full max-w-sm px-4">
        <Card className="p-2 shadow-2xl rounded-[1.5rem] border-0 bg-white/90 backdrop-blur-md">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <Input 
              placeholder="Search cities on map..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-12 rounded-2xl border-0 bg-transparent font-medium shadow-none focus-visible:ring-0"
            />
          </div>
        </Card>
      </div>

      {/* Global Context Overlay */}
      <div className="absolute bottom-8 right-8 z-[1000] px-4">
        <Card className="p-6 shadow-2xl rounded-[1.5rem] border-0 bg-zinc-900 text-white min-w-[240px]">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="w-5 h-5 text-green-500" />
            <h2 className="font-black text-sm uppercase tracking-widest">Global Index</h2>
          </div>
          <div className="space-y-3">
             <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-500">Live Assessments</span>
                <span className="font-black text-green-500">{cities.length}</span>
             </div>
             <div className="flex items-center gap-4 pt-2">
                <div className="flex items-center gap-1.5">
                   <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                   <span className="text-[10px] font-black uppercase tracking-tighter opacity-60">High</span>
                </div>
                <div className="flex items-center gap-1.5">
                   <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                   <span className="text-[10px] font-black uppercase tracking-tighter opacity-60">Med</span>
                </div>
                <div className="flex items-center gap-1.5">
                   <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                   <span className="text-[10px] font-black uppercase tracking-tighter opacity-60">Low</span>
                </div>
             </div>
          </div>
        </Card>
      </div>

      <MapComponent cities={filteredCities} />

      <style jsx global>{`
        .leaflet-container {
          background: #f4f4f5 !important;
        }
        .premium-popup .leaflet-popup-content-wrapper {
          border-radius: 1.5rem;
          padding: 0;
          overflow: hidden;
          box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.15);
        }
        .premium-popup .leaflet-popup-content {
          margin: 0;
        }
        .premium-popup .leaflet-popup-tip {
          background: white;
        }
      `}</style>
    </div>
  );
}
