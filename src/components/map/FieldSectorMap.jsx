import React, { useState } from 'react';
import {
  Compass,
  MapPin,
  Layers,
  Crosshair,
} from 'lucide-react';

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
      coords: { x: '22%', y: '28%' },
      tag: 'ZONE-A',
      color: 'bg-coral',
    },
    {
      id: 'sector-4b',
      name: 'Sector 4B — East Wing Stairwells',
      type: 'SECONDARY TRAUMA',
      hazard: 'Smoke inhalation & fires',
      coords: { x: '68%', y: '32%' },
      tag: 'ZONE-B',
      color: 'bg-[#E5A33D]',
    },
    {
      id: 'assembly-alpha',
      name: 'Safe Assembly Point Alpha',
      type: 'EXTRACTION ZONE',
      hazard: 'Secure perimeter',
      coords: { x: '35%', y: '72%' },
      tag: 'SAFE-ALPHA',
      color: 'bg-[#4F9D69]',
    },
    {
      id: 'field-hospital',
      name: 'Field Medical Tent 01',
      type: 'TRIAGE HUB',
      hazard: 'Ambulance dispatch active',
      coords: { x: '78%', y: '68%' },
      tag: 'MED-TENT',
      color: 'bg-[#5C83B6]',
    },
  ];

  return (
    <div className={`space-y-4 ${className}`}>
      
      {/* ── Header ── */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-outline shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-coral uppercase tracking-wider block mb-1">
            Geospatial Emergency Grid
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-ink tracking-tight flex items-center gap-2">
            <Compass className="w-5 h-5 text-coral" aria-hidden="true" />
            <span>Field Sector Map & Safe Zones</span>
          </h2>
          <p className="text-xs sm:text-sm text-ink-secondary mt-0.5">
            Casualty distribution and emergency evacuation corridors in Sector 4.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-semibold px-3.5 py-1.5 rounded-full bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0] self-start sm:self-auto">
          <span className="w-2 h-2 rounded-full bg-[#4F9D69] animate-pulse" />
          <span>Local Vector Grid Active</span>
        </div>
      </div>

      {/* ── Interactive Canvas Map ── */}
      <div className="relative w-full h-[380px] sm:h-[440px] bg-[#1E232A] rounded-3xl border border-outline shadow-soft overflow-hidden select-none">
        
        {/* Radar / Grid overlay pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Concentric rings from incident epicenter */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[380px] sm:h-[380px] rounded-full border border-coral/20 pointer-events-none" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[180px] h-[180px] rounded-full border border-coral/30 pointer-events-none" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-coral animate-ping pointer-events-none" />

        {/* Compass Cardinal Points */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 text-[10px] font-mono font-bold text-white/50">N</div>
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[10px] font-mono font-bold text-white/50">S</div>
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-mono font-bold text-white/50">W</div>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono font-bold text-white/50">E</div>

        {/* Interactive Sector Zones (Pill Pins) */}
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
                className={`px-3 py-2 rounded-2xl border backdrop-blur-md transition-all shadow-md ${
                  isSelected
                    ? 'bg-white text-ink border-coral ring-2 ring-coral scale-105'
                    : 'bg-white/90 hover:bg-white text-ink border-white/40'
                }`}
              >
                <div className="flex items-center space-x-1.5">
                  <span className={`w-2.5 h-2.5 rounded-full ${sector.color}`} />
                  <span className="text-xs font-black font-mono">{sector.tag}</span>
                </div>
                <p className="text-[10px] text-ink-secondary font-medium truncate max-w-[120px] mt-0.5">
                  {sector.name}
                </p>
              </div>
            </div>
          );
        })}

        {/* Selected Zone Popover Card */}
        {selectedZone && (
          <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 bg-white border border-outline rounded-3xl p-4 shadow-soft-md z-20 animate-in fade-in">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold text-coral uppercase tracking-wider block">
                  {selectedZone.type}
                </span>
                <h4 className="text-sm font-bold text-ink mt-0.5">{selectedZone.name}</h4>
                <p className="text-xs text-ink-secondary mt-1">{selectedZone.hazard}</p>
              </div>
              <button
                onClick={() => setSelectedZone(null)}
                className="text-ink-muted hover:text-ink text-xs p-1 rounded-full hover:bg-surface-secondary"
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
            className="p-4 bg-white rounded-2xl border border-outline shadow-soft cursor-pointer hover:border-coral transition"
          >
            <div className="flex items-center space-x-1.5 mb-1">
              <span className={`w-2 h-2 rounded-full ${s.color}`} />
              <span className="text-xs font-bold text-ink">{s.tag}</span>
            </div>
            <p className="text-[11px] text-ink-secondary line-clamp-1">{s.name}</p>
          </div>
        ))}
      </div>

    </div>
  );
}

export default FieldSectorMap;
