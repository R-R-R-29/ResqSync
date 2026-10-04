import React, { useState } from 'react';
import {
  MapPin,
  Compass,
  Layers,
  AlertCircle,
  Clock,
  CheckCircle2,
  Activity,
  Shield,
  Navigation,
  Crosshair,
} from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';

export function FieldSectorMap({
  records = [],
  emergencyMode = false,
  className = '',
}) {
  const [selectedZone, setSelectedZone] = useState(null);

  // Group records by sector / location keyword
  const SECTORS = [
    {
      id: 'sector-4a',
      name: 'Sector 4A — Subway Concourse',
      type: 'COLLAPSED ZONE',
      hazard: 'High structural instability',
      coords: { x: '18%', y: '25%' },
      tag: 'ZONE-A',
      color: 'bg-red-500',
    },
    {
      id: 'sector-4b',
      name: 'Sector 4B — East Wing Stairwells',
      type: 'SECONDARY TRAUMA',
      hazard: 'Smoke inhalation & fires',
      coords: { x: '65%', y: '30%' },
      tag: 'ZONE-B',
      color: 'bg-amber-500',
    },
    {
      id: 'assembly-alpha',
      name: 'Safe Assembly Point Alpha',
      type: 'EXTRACTION ZONE',
      hazard: 'Secure perimeter',
      coords: { x: '35%', y: '75%' },
      tag: 'SAFE-ALPHA',
      color: 'bg-emerald-500',
    },
    {
      id: 'field-hospital',
      name: 'Field Medical Tent 01',
      type: 'TRIAGE HUB',
      hazard: 'Ambulance dispatch active',
      coords: { x: '78%', y: '70%' },
      tag: 'MED-TENT',
      color: 'bg-blue-500',
    },
  ];

  return (
    <div className={`space-y-4 ${className}`}>
      
      {/* ── Header ── */}
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Compass className="w-5 h-5 text-aid-primary" aria-hidden="true" />
            <span>Tactical Field Sector Grid (Offline GPS Cache)</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Geospatial casualty distribution and emergency extraction points in Sector 4.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono text-slate-500">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Local Vector Grid Active</span>
        </div>
      </div>

      {/* ── Interactive Tactical Canvas Map ── */}
      <div className="relative w-full h-[380px] sm:h-[440px] bg-slate-900 rounded-3xl border border-slate-800 shadow-lg overflow-hidden select-none">
        
        {/* Radar / Grid overlay pattern */}
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage:
              'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Concentric rings from incident epicenter */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[380px] sm:h-[380px] rounded-full border border-red-500/20 pointer-events-none" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[180px] h-[180px] rounded-full border border-red-500/30 pointer-events-none" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-red-600 animate-ping pointer-events-none" />

        {/* Compass Cardinal Points */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 text-[10px] font-mono font-black text-slate-500">N</div>
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[10px] font-mono font-black text-slate-500">S</div>
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-mono font-black text-slate-500">W</div>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono font-black text-slate-500">E</div>

        {/* Interactive Sector Zones */}
        {SECTORS.map((sector) => {
          const isSelected = selectedZone?.id === sector.id;

          return (
            <div
              key={sector.id}
              style={{ left: sector.coords.x, top: sector.coords.y }}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 transition-transform active:scale-95"
              onClick={() => setSelectedZone(sector)}
            >
              <div
                className={`p-2.5 rounded-2xl border backdrop-blur-md transition-all ${
                  isSelected
                    ? 'bg-slate-900 border-aid-primary ring-2 ring-aid-primary shadow-emergency-glow scale-105'
                    : 'bg-slate-900/80 border-slate-700 hover:border-slate-500'
                }`}
              >
                <div className="flex items-center space-x-1.5">
                  <span className={`w-2.5 h-2.5 rounded-full ${sector.color}`} />
                  <span className="text-xs font-black text-white font-mono">{sector.tag}</span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium truncate max-w-[130px] mt-0.5">
                  {sector.name}
                </p>
              </div>
            </div>
          );
        })}

        {/* Selected Zone Popover Card */}
        {selectedZone && (
          <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 bg-slate-950/95 border border-slate-700 rounded-2xl p-4 shadow-2xl backdrop-blur-md z-20 animate-in fade-in">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono font-black text-aid-border uppercase">
                  {selectedZone.type}
                </span>
                <h4 className="text-sm font-black text-white">{selectedZone.name}</h4>
                <p className="text-xs text-slate-400 mt-0.5">{selectedZone.hazard}</p>
              </div>
              <button
                onClick={() => setSelectedZone(null)}
                className="text-slate-400 hover:text-white text-xs p-1"
              >
                ✕
              </button>
            </div>
          </div>
        )}

      </div>

      {/* ── Summary Distribution Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {SECTORS.map((s) => (
          <div
            key={s.id}
            onClick={() => setSelectedZone(s)}
            className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm cursor-pointer hover:border-aid-primary transition"
          >
            <div className="flex items-center space-x-1.5 mb-1">
              <span className={`w-2 h-2 rounded-full ${s.color}`} />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{s.tag}</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">{s.name}</p>
          </div>
        ))}
      </div>

    </div>
  );
}

export default FieldSectorMap;
