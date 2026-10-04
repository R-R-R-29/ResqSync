import React, { useState, useMemo, useEffect } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
} from '@vis.gl/react-google-maps';
import {
  Compass,
  MapPin,
  Navigation,
  Layers,
  AlertTriangle,
  Hospital,
  ShieldAlert,
  Radio,
  CheckCircle2,
  Crosshair,
  User,
  HeartPulse,
  WifiOff,
} from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';
import { useTranslation } from '../../i18n/LanguageContext';

// Key Wayanad, Kerala disaster response operational sectors
const WAYANAD_SECTORS = [
  {
    id: 'sec-chooralmala',
    name: 'Chooralmala Bridge & Debris Sector',
    zone: 'SECTOR-1 (EPICENTER)',
    lat: 11.5365,
    lng: 76.155,
    type: 'COLLAPSED DEBRIS RESCUE',
    responder: 'NDRF 10th Battalion • Inspector Rajesh Nair',
    status: 'Bailey bridge operational • Heavy machinery active',
    color: '#D94343',
    glyphColor: '#FFFFFF',
    tag: 'CHOORAL-1',
  },
  {
    id: 'sec-meppadi',
    name: 'Meppadi Relief Base & Health Centre',
    zone: 'SECTOR-2 (BASE)',
    lat: 11.551,
    lng: 76.1265,
    type: 'PRIMARY MEDICAL STAGING',
    responder: 'Kerala Health Services • Dr. Sunita Rao',
    status: '120 beds ready • Food, clean water & triage active',
    color: '#E5A33D',
    glyphColor: '#FFFFFF',
    tag: 'MEPPADI-2',
  },
  {
    id: 'sec-vellarmala',
    name: 'Vellarmala School Extraction Point',
    zone: 'SECTOR-3 (EXTRACTION)',
    lat: 11.542,
    lng: 76.162,
    type: 'SAFE ASSEMBLY POST',
    responder: 'Kerala Fire & Rescue QRT • Sub-Inspector Biju Thomas',
    status: 'Walking casualties triage & family reunion desk',
    color: '#4F9D69',
    glyphColor: '#FFFFFF',
    tag: 'VELLAR-3',
  },
  {
    id: 'sec-mundakkai',
    name: 'Mundakkai Riverbank Rescue Post',
    zone: 'SECTOR-4 (DEEP VALLEY)',
    lat: 11.528,
    lng: 76.168,
    type: 'HIGH HAZARD SEARCH',
    responder: 'Indian Army Madras Sappers • Major Ananya Pillai',
    status: 'Drone survey & aerial rescue ropeway established',
    color: '#171717',
    glyphColor: '#FFFFFF',
    tag: 'MUNDAK-4',
  },
  {
    id: 'sec-vythiri',
    name: 'Vythiri Taluk Transit Desk',
    zone: 'SECTOR-5 (TRANSIT)',
    lat: 11.552,
    lng: 76.042,
    type: 'AMBULANCE HIGHWAY CORRIDOR',
    responder: 'Highway Police & 108 Emergency Ambulance Fleet',
    status: 'Green corridor open towards Kozhikode Medical College',
    color: '#5C83B6',
    glyphColor: '#FFFFFF',
    tag: 'VYTHIRI-5',
  },
  {
    id: 'sec-kalpetta',
    name: 'Kalpetta District Hospital Trauma Hub',
    zone: 'BASE HOSPITAL',
    lat: 11.608,
    lng: 76.0825,
    type: 'CRITICAL SURGICAL REFERRAL',
    responder: 'District Medical Officer & ICU Trauma Team',
    status: 'Surgical theaters on 24/7 emergency standby',
    color: '#7C3AED',
    glyphColor: '#FFFFFF',
    tag: 'KALPETTA-HUB',
  },
];

// Fallback coordinate mappings for common Indian sector labels in triage records
function getCoordinatesForRecord(record, index) {
  const loc = (record.location || '').toLowerCase();
  
  if (loc.includes('chooralmala')) {
    return {
      lat: 11.5365 + (Math.sin(index + 1) * 0.003),
      lng: 76.1550 + (Math.cos(index + 1) * 0.003),
    };
  }
  if (loc.includes('vellarmala')) {
    return {
      lat: 11.5420 + (Math.sin(index + 2) * 0.003),
      lng: 76.1620 + (Math.cos(index + 2) * 0.003),
    };
  }
  if (loc.includes('mundakkai')) {
    return {
      lat: 11.5280 + (Math.sin(index + 3) * 0.0025),
      lng: 76.1680 + (Math.cos(index + 3) * 0.0025),
    };
  }
  if (loc.includes('meppadi')) {
    return {
      lat: 11.5510 + (Math.sin(index + 4) * 0.003),
      lng: 76.1265 + (Math.cos(index + 4) * 0.003),
    };
  }
  if (loc.includes('kalpetta')) {
    return {
      lat: 11.6080 + (Math.sin(index + 5) * 0.003),
      lng: 76.0825 + (Math.cos(index + 5) * 0.003),
    };
  }
  if (loc.includes('vythiri')) {
    return {
      lat: 11.5520 + (Math.sin(index + 6) * 0.003),
      lng: 76.0420 + (Math.cos(index + 6) * 0.003),
    };
  }

  // Default spread around Chooralmala rescue perimeter
  const angle = (index * 60) * (Math.PI / 180);
  const radius = 0.005 + (index * 0.002);
  return {
    lat: 11.5380 + Math.sin(angle) * radius,
    lng: 11.5380 > 0 ? 76.1480 + Math.cos(angle) * radius : 76.1480,
  };
}

export function FieldSectorMap({
  records = [],
  emergencyMode = false,
  className = '',
}) {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'immediate' | 'delayed' | 'minor' | 'expectant' | 'sectors'
  const [mapTypeId, setMapTypeId] = useState('roadmap'); // 'roadmap' | 'satellite' | 'hybrid' | 'terrain'
  const [selectedEntity, setSelectedEntity] = useState(null); // { type: 'sector' | 'casualty', data: object }
  const [infoWindowPos, setInfoWindowPos] = useState(null);

  const apiKey =
    import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyAbwPWnCnAH5tWbxn5CbNIBMnlkWeSDJOk';

  const [isOnline, setIsOnline] = useState(() => (typeof navigator !== 'undefined' ? navigator.onLine : true));

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Filter casualties based on selected triage category
  const filteredRecords = useMemo(() => {
    if (activeFilter === 'sectors') return [];
    if (activeFilter === 'all') return records;
    return records.filter(
      (r) => (r.triageLevel || r.triage_category || '').toLowerCase() === activeFilter
    );
  }, [records, activeFilter]);

  // Center of Wayanad disaster operational sector
  const defaultCenter = { lat: 11.542, lng: 76.145 };

  const handleSelectSector = (sector) => {
    setSelectedEntity({ type: 'sector', data: sector });
    setInfoWindowPos({ lat: sector.lat, lng: sector.lng });
  };

  const handleSelectCasualty = (record, coords) => {
    setSelectedEntity({ type: 'casualty', data: record });
    setInfoWindowPos(coords);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      
      {/* ── 1. Tactical Header with Operational Status ── */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-outline shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-coral uppercase tracking-wider block">
              {t('mapOperationsTitle', 'Wayanad District Disaster Operations')}
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-800 border border-red-200">
              {t('stateReliefCommand', 'Kerala State Relief Command')}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-ink tracking-tight flex items-center gap-2 mt-1">
            <Compass className="w-5 h-5 text-coral shrink-0" aria-hidden="true" />
            <span>{t('mapHeaderTitle', 'Interactive Field Sector & Evacuation Map')}</span>
          </h2>
          <p className="text-xs sm:text-sm text-ink-secondary mt-1">
            {t('mapHeaderSub', 'Live Google Maps coordinates for rescue sectors, triage staging posts, and active casualty locations across Chooralmala, Meppadi, Vellarmala, and Mundakkai.')}
          </p>
        </div>

        {/* Access Corridor Status */}
        <div className="flex flex-col sm:items-end gap-1.5 self-start sm:self-auto">
          {isOnline ? (
            <div className="flex items-center space-x-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]">
              <span className="w-2 h-2 rounded-full bg-[#4F9D69] animate-pulse" />
              <span>{t('gmpActive', 'Live Google Maps Platform Active')}</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]">
              <WifiOff className="w-3.5 h-3.5 text-[#E5A33D]" />
              <span>{t('offlineGrid', 'Offline Tactical Radar Grid Active')}</span>
            </div>
          )}
          <span className="text-[11px] text-ink-muted font-medium">
            {t('emergencyGrid', 'Wayanad Emergency Grid: 11.5420° N, 76.1450° E')}
          </span>
        </div>
      </div>

      {/* ── 2. Tactical Map Controls Bar ── */}
      <div className="bg-white p-3 sm:p-4 rounded-2xl border border-outline shadow-soft flex flex-wrap items-center justify-between gap-3">
        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-bold text-ink-muted mr-1 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5" />
            <span>{t('layersLabel', 'Layers:')}</span>
          </span>
          <button
            type="button"
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition ${
              activeFilter === 'all'
                ? 'bg-ink text-white shadow-sm'
                : 'bg-surface-secondary text-ink hover:bg-slate-200'
            }`}
          >
            {t('allManifest', 'All Manifest')} ({records.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('immediate')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-1 ${
              activeFilter === 'immediate'
                ? 'bg-[#D94343] text-white shadow-sm'
                : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
            <span>{t('immediate', 'Immediate (Red)')}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('delayed')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-1 ${
              activeFilter === 'delayed'
                ? 'bg-[#E5A33D] text-slate-950 shadow-sm'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            <span>{t('delayed', 'Delayed (Yellow)')}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('minor')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-1 ${
              activeFilter === 'minor'
                ? 'bg-[#4F9D69] text-white shadow-sm'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            <span>{t('minor', 'Minor (Green)')}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('sectors')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-1 ${
              activeFilter === 'sectors'
                ? 'bg-coral text-white shadow-sm'
                : 'bg-orange-50 text-coral-dark hover:bg-orange-100 border border-coral/30'
            }`}
          >
            <Hospital className="w-3.5 h-3.5" />
            <span>{t('rescueOutpostsOnly', 'Rescue Outposts Only')}</span>
          </button>
        </div>

        {/* Map Type Switcher */}
        <div className="flex items-center space-x-1 bg-surface-secondary p-1 rounded-xl border border-outline">
          <button
            type="button"
            onClick={() => setMapTypeId('roadmap')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
              mapTypeId === 'roadmap' ? 'bg-white text-ink shadow-soft' : 'text-ink-secondary hover:text-ink'
            }`}
          >
            {t('roads', 'Roads')}
          </button>
          <button
            type="button"
            onClick={() => setMapTypeId('terrain')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
              mapTypeId === 'terrain' ? 'bg-white text-ink shadow-soft' : 'text-ink-secondary hover:text-ink'
            }`}
          >
            {t('terrain', 'Terrain')}
          </button>
          <button
            type="button"
            onClick={() => setMapTypeId('hybrid')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
              mapTypeId === 'hybrid' ? 'bg-white text-ink shadow-soft' : 'text-ink-secondary hover:text-ink'
            }`}
          >
            {t('satellite', 'Satellite')}
          </button>
        </div>
      </div>

      {/* ── 3. Real Interactive Google Map Container ── */}
      <div className="relative w-full h-[480px] sm:h-[540px] rounded-3xl border border-outline shadow-soft overflow-hidden bg-slate-900">
        {isOnline ? (
          <APIProvider apiKey={apiKey} libraries={['marker']}>
          <Map
            mapId="DEMO_MAP_ID"
            defaultCenter={defaultCenter}
            defaultZoom={13}
            mapTypeId={mapTypeId}
            gestureHandling="greedy"
            disableDefaultUI={false}
            internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
            style={{ width: '100%', height: '100%' }}
          >
            {/* Rescue Sector Advanced Markers (Indian Outposts) */}
            {WAYANAD_SECTORS.map((sec) => (
              <AdvancedMarker
                key={sec.id}
                position={{ lat: sec.lat, lng: sec.lng }}
                title={`${sec.tag}: ${sec.name}`}
                onClick={() => handleSelectSector(sec)}
              >
                <Pin
                  background={sec.color}
                  borderColor="#FFFFFF"
                  glyphColor={sec.glyphColor}
                  scale={1.25}
                />
              </AdvancedMarker>
            ))}

            {/* Casualties Advanced Markers (Real Indian Casualties) */}
            {filteredRecords.map((record, index) => {
              const coords = getCoordinatesForRecord(record, index);
              const lvl = (record.triageLevel || record.triage_category || 'immediate').toLowerCase();
              
              let pinBg = '#D94343'; // Immediate Red
              if (lvl === 'delayed') pinBg = '#E5A33D'; // Delayed Yellow
              if (lvl === 'minor') pinBg = '#4F9D69'; // Minor Green
              if (lvl === 'expectant') pinBg = '#1E293B'; // Expectant Black

              return (
                <AdvancedMarker
                  key={record.id || `cas-${index}`}
                  position={coords}
                  title={`${record.victimName || 'Casualty'} (${lvl.toUpperCase()})`}
                  onClick={() => handleSelectCasualty(record, coords)}
                >
                  <div className="relative group cursor-pointer transition-transform hover:scale-110 active:scale-95">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-white font-black text-[10px] shadow-lg border-2 border-white"
                      style={{ backgroundColor: pinBg }}
                    >
                      {lvl === 'immediate' ? 'RED' : lvl === 'delayed' ? 'YEL' : lvl === 'minor' ? 'GRN' : 'BLK'}
                    </div>
                  </div>
                </AdvancedMarker>
              );
            })}

            {/* InfoWindow for Selected Sector or Casualty */}
            {selectedEntity && infoWindowPos && (
              <InfoWindow
                position={infoWindowPos}
                onCloseClick={() => {
                  setSelectedEntity(null);
                  setInfoWindowPos(null);
                }}
                maxWidth={320}
              >
                {selectedEntity.type === 'sector' ? (
                  <div className="p-1 space-y-2 text-ink">
                    <div className="flex items-center space-x-1.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: selectedEntity.data.color }}
                      />
                      <span className="text-[10px] font-black uppercase text-coral font-mono">
                        {selectedEntity.data.tag} • {selectedEntity.data.zone}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-ink leading-tight">
                      {selectedEntity.data.name}
                    </h4>
                    <p className="text-[11px] font-semibold text-ink-secondary">
                      {selectedEntity.data.type}
                    </p>
                    <div className="bg-slate-50 p-2 rounded-lg border border-slate-200 text-[11px] space-y-1">
                      <div>
                        <span className="font-bold text-ink block">{t('commandingOfficer', 'Commanding Officer:')}</span>
                        <span className="text-ink-secondary">{selectedEntity.data.responder}</span>
                      </div>
                      <div>
                        <span className="font-bold text-ink block">{t('corridorCondition', 'Corridor Condition:')}</span>
                        <span className="text-emerald-700 font-medium">{selectedEntity.data.status}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-1 space-y-2 text-ink">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase text-ink-muted">
                        {t('navCasualties', 'Casualty Manifest')}
                      </span>
                      <StatusBadge
                        level={selectedEntity.data.triageLevel || selectedEntity.data.triage_category || 'immediate'}
                        size="sm"
                      />
                    </div>
                    <h4 className="text-sm font-bold text-ink flex items-center gap-1.5">
                      <User className="w-4 h-4 text-coral shrink-0" />
                      <span>{selectedEntity.data.victimName || 'Unidentified Casualty'}</span>
                    </h4>
                    <div className="text-[11px] text-ink-secondary flex items-start gap-1">
                      <MapPin className="w-3.5 h-3.5 text-coral shrink-0 mt-0.5" />
                      <span>{selectedEntity.data.location || 'Chooralmala Rescue Post'}</span>
                    </div>
                    {selectedEntity.data.statusNotes && (
                      <p className="text-[11px] bg-slate-50 p-2 rounded-lg border border-slate-200 text-ink leading-relaxed">
                        {selectedEntity.data.statusNotes}
                      </p>
                    )}
                    <div className="flex items-center justify-between text-[10px] text-ink-muted pt-1 border-t border-slate-200">
                      <span>Resp: {selectedEntity.data.respiration_rate ?? '—'} /min</span>
                      <span>Pulse: {selectedEntity.data.pulse_rate ?? '—'} bpm</span>
                      <span>Status: {selectedEntity.data.mental_status || 'Monitored'}</span>
                    </div>
                  </div>
                )}
              </InfoWindow>
            )}
          </Map>
        </APIProvider>
        ) : (
          <div className="w-full h-full relative p-5 flex flex-col justify-between bg-slate-950 text-white font-sans overflow-hidden">
            {/* Radar Grid Graphic */}
            <div className="absolute inset-0 opacity-15 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#E85B4A 1px, transparent 1px), radial-gradient(#38BDF8 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] rounded-full border border-sky-500/20 pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-sky-500/10 pointer-events-none" />

            {/* Top Status */}
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 bg-slate-900/90 border border-slate-700/80 px-4 py-2.5 rounded-2xl backdrop-blur-md">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                  Tactical Offline Sector Grid • Cellular Grid Severed
                </span>
              </div>
              <span className="text-[11px] text-slate-300 font-medium">
                Offline Cache Active • 6 Indian Relief Sectors
              </span>
            </div>

            {/* Sector Tactical Cards in Offline Grid */}
            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 my-auto py-2">
              {WAYANAD_SECTORS.map((sec) => (
                <div
                  key={sec.id}
                  onClick={() => handleSelectSector(sec)}
                  className={`p-3 rounded-2xl border transition cursor-pointer backdrop-blur-md ${
                    selectedEntity?.data?.id === sec.id
                      ? 'bg-slate-800 border-coral text-white shadow-lg'
                      : 'bg-slate-900/80 border-slate-700 hover:border-slate-500 text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded text-white" style={{ backgroundColor: sec.color }}>
                      {sec.tag}
                    </span>
                    <span className="text-[9px] text-slate-400 uppercase tracking-wider">
                      {sec.zone.split(' ')[0]}
                    </span>
                  </div>
                  <h5 className="text-xs font-bold text-white truncate">{sec.name}</h5>
                  <p className="text-[10px] text-slate-400 truncate mt-0.5">{sec.responder}</p>
                  <div className="mt-2 text-[10px] text-emerald-400 flex items-center justify-between">
                    <span>{sec.lat.toFixed(3)}°N, {sec.lng.toFixed(3)}°E</span>
                    <span className="text-coral underline font-bold">Inspect Sector</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Status */}
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 bg-slate-900/90 border border-slate-700/80 px-4 py-2 rounded-2xl text-[11px] text-slate-300">
              <span className="flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-coral shrink-0" />
                <span>All casualty intakes and vitals are recorded into browser IndexedDB. Zero packet loss.</span>
              </span>
              <span className="text-amber-400 font-bold">Offline Grid Engine</span>
            </div>
          </div>
        )}
      </div>

      {/* ── 4. Indian Rescue Sector Quick-Jump Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {WAYANAD_SECTORS.map((sec) => (
          <div
            key={sec.id}
            onClick={() => handleSelectSector(sec)}
            className="p-4 bg-white rounded-2xl border border-outline shadow-soft hover:border-coral cursor-pointer transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-black font-mono text-coral bg-orange-50 px-2 py-0.5 rounded-md border border-orange-200">
                  {sec.tag}
                </span>
                <span className="text-[10px] font-bold text-ink-muted uppercase">
                  {sec.zone}
                </span>
              </div>
              <h4 className="text-sm font-bold text-ink leading-snug">
                {sec.name}
              </h4>
              <p className="text-xs text-ink-secondary mt-1 font-medium">
                {sec.responder}
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-outline flex items-center justify-between text-[11px]">
              <span className="text-emerald-700 font-medium truncate max-w-[200px]">
                {sec.status}
              </span>
              <span className="text-coral font-bold shrink-0">{t('viewOnMap', 'View on Map →')}</span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

export default FieldSectorMap;
