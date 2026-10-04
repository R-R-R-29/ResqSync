import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { TriageFormModal } from './components/TriageFormModal';
import { ConflictBanner } from './components/ConflictBanner';
import { ConflictModal } from './components/ConflictModal';
import { DemoToolbar } from './components/DemoToolbar';
import { useTriage } from './hooks/useTriage';
import { useNetworkStatus } from './hooks/useNetworkStatus';
import { WifiOff, Radio, ShieldOff } from 'lucide-react';

export function App() {
  const {
    records,
    loading,
    addTriage,
    updateTriage,
    deleteTriage,
    seedDemoData,
    refresh,
  } = useTriage();

  const {
    isOnline,
    isSimulatedOffline,
    setSimulatedOffline,
    pendingCount,
    conflictCount,
    conflicts,
    dismissConflict,
  } = useNetworkStatus();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeConflict, setActiveConflict] = useState(null);

  // Trigger simulated conflict from Device-Tablet-02
  const handleSimulateConflict = async () => {
    try {
      // 1. Try server endpoint
      const res = await fetch('/api/demo/conflict', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        if (data.conflict) {
          setActiveConflict(data.conflict);
          return;
        }
      }
    } catch {
      /* Fallback to local conflict synthesis */
    }

    // Fallback: Pick existing or sample record and synthesize immediate conflict
    const sampleTarget = records[0] || {
      id: 'REC-MARCUS-01',
      victimName: 'Marcus Ramirez',
      triageLevel: 'delayed',
      location: 'Sector 4 - Stairwell B, East Tower',
      statusNotes: 'Local Responder: Conscious, stable breathing, splint applied to left femur.',
      version: 1,
    };

    const conflictObj = {
      serverRecord: {
        id: sampleTarget.id,
        victimName: sampleTarget.victimName || 'Marcus Ramirez',
        triageLevel: 'immediate', // Remote override
        location: 'Sector 4 - Intensive Care Transit Unit',
        statusNotes: 'OVERRIDE BY Device-Tablet-02: Vital signs deteriorating rapidly. SpO2 84%, tension pneumothorax detected.',
        responderId: 'Dr. Morales (Tablet-02)',
        deviceId: 'Device-Tablet-02',
        version: (sampleTarget.version ?? 1) + 2,
        updatedAt: new Date().toISOString(),
      },
      clientPayload: {
        ...sampleTarget,
        triageLevel: 'delayed',
        statusNotes: sampleTarget.statusNotes || 'Local Responder: Conscious, stable breathing, splint applied to left femur.',
        version: sampleTarget.version ?? 1,
        deviceId: 'Device-Phone-01',
      },
    };

    setActiveConflict(conflictObj);
  };

  const handleConflictResolved = (resolvedRecord) => {
    setActiveConflict(null);
    refresh();
  };

  return (
    <div className="min-h-screen bg-resq-dark text-slate-100 flex flex-col font-sans selection:bg-resq-immediate selection:text-white pb-20">
      
      {/* ── 1. GLOBAL EMERGENCY RESPONDER NAVBAR ── */}
      <Navbar
        onOpenNewTriage={() => setIsModalOpen(true)}
        onSeedData={seedDemoData}
      />

      {/* ── 2. REAL-TIME DISCONNECTION / FIELD ALERT STRIPS ── */}
      {!isOnline && (
        <div className="bg-amber-950/90 border-b border-amber-800 text-amber-200 px-4 py-2 text-xs font-bold flex items-center justify-between shadow-warning-glow">
          <div className="flex items-center space-x-2">
            <WifiOff className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>Field Disconnected: Zero-network mode active. All patient intake and triage edits are saved to IndexedDB outbox.</span>
          </div>
          {pendingCount > 0 && (
            <span className="bg-amber-900/80 border border-amber-700 px-2.5 py-0.5 rounded text-[11px] font-mono">
              {pendingCount} Queued in Outbox
            </span>
          )}
        </div>
      )}

      {isSimulatedOffline && (
        <div className="bg-slate-900/90 border-b border-slate-700 text-slate-300 px-4 py-1.5 text-xs font-semibold flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldOff className="w-3.5 h-3.5 text-amber-400" />
            <span>Drill Simulation: Network paused by field commander. Test offline-first mutations.</span>
          </div>
          <button
            onClick={() => setSimulatedOffline(false)}
            className="text-[11px] underline text-amber-400 hover:text-amber-300 font-bold transition"
          >
            Resume Live Sync
          </button>
        </div>
      )}

      {/* ── 3. MAIN INCIDENT COMMAND DASHBOARD ── */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Conflict Resolution Banners (triggers 3-way modal on click) */}
        {conflicts.length > 0 && (
          <div className="space-y-2">
            <div className="p-3 bg-red-950/80 border border-red-600 rounded-xl text-xs text-red-200 flex items-center justify-between shadow-emergency-glow">
              <span className="font-bold">
                ⚠️ {conflicts.length} Unresolved Multi-Device Conflict(s) Detected!
              </span>
              <button
                onClick={() => setActiveConflict(conflicts[0])}
                className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white font-extrabold rounded-lg transition"
              >
                Resolve in 3-Way Modal
              </button>
            </div>
            <ConflictBanner
              conflicts={conflicts}
              onDismiss={(idx) => {
                setActiveConflict(conflicts[idx]);
                dismissConflict(idx);
              }}
            />
          </div>
        )}

        {/* Tactical Mission Header */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg backdrop-blur">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <Radio className="w-4 h-4 text-resq-immediate animate-pulse" />
                <span className="text-xs uppercase font-mono tracking-widest text-slate-400">
                  INCIDENT COMMAND: SECTOR 4 QUAKE RESPONSE
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
                Triage Coordination & Field Logistics
              </h1>
              <p className="text-sm text-slate-400 mt-1 max-w-2xl">
                High-contrast triage assessment with zero-latency local caching. Changes automatically synchronize across command hubs when connected.
              </p>
            </div>

            <div className="flex items-center space-x-2.5">
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-resq-immediate hover:bg-red-600 text-white font-extrabold text-sm shadow-emergency-glow transition active:scale-95"
              >
                + Modal Intake
              </button>
              <button
                onClick={seedDemoData}
                className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 transition"
                title="Inject sample drill records"
              >
                Seed Victims
              </button>
            </div>
          </div>
        </div>

        {/* Unified Incident Dashboard: QuickAddForm + Filter Tabs + Live Search + TriageCard Grid */}
        <Dashboard
          records={records}
          loading={loading}
          onAddTriage={addTriage}
          onUpdateTriage={updateTriage}
          onDeleteTriage={deleteTriage}
          isOnline={isOnline}
          pendingCount={pendingCount}
        />

      </main>

      {/* ── 4. BACKUP RAPID INTAKE MODAL ── */}
      <TriageFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={addTriage}
      />

      {/* ── 5. 3-WAY MULTI-DEVICE CONFLICT MODAL ── */}
      <ConflictModal
        isOpen={!!activeConflict}
        conflict={activeConflict}
        onClose={() => setActiveConflict(null)}
        onResolved={handleConflictResolved}
      />

      {/* ── 6. HACKATHON DEMO SANDBOX TOOLBAR (STICKY BOTTOM) ── */}
      <DemoToolbar
        isSimulatedOffline={isSimulatedOffline}
        setSimulatedOffline={setSimulatedOffline}
        onTriggerConflict={handleSimulateConflict}
        onResetData={refresh}
        pendingCount={pendingCount}
        conflictCount={conflictCount || (activeConflict ? 1 : 0)}
      />

      {/* ── 7. DISASTER RESPONSE FOOTER ── */}
      <footer className="border-t border-slate-800/90 bg-slate-950/90 py-4 text-xs text-slate-500 font-mono text-center mb-8">
        <p>ResqSync • Tactical Disaster Triage System • Offline-First PWA • IndexedDB + SQLite</p>
      </footer>
    </div>
  );
}

export default App;
