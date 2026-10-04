import React, { useState, useEffect } from 'react';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { BottomNav } from './components/layout/BottomNav';
import { OfflineBanner } from './components/common/OfflineBanner';
import { DashboardView } from './components/dashboard/DashboardView';
import { CasualtiesView } from './components/records/CasualtiesView';
import { FieldSectorMap } from './components/map/FieldSectorMap';
import { ConflictsPageView } from './components/conflict/ConflictsPageView';
import { ConflictResolverModal } from './components/conflict/ConflictResolverModal';
import { SettingsView } from './components/settings/SettingsView';
import { DemoToolbar } from './components/DemoToolbar';
import { TriageFormModal } from './components/TriageFormModal';
import { useTriage } from './hooks/useTriage';
import { useNetworkStatus } from './hooks/useNetworkStatus';
import { useTranslation } from './i18n/LanguageContext';

export function App() {
  const {
    records,
    loading,
    counts,
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
    syncState,
    pendingCount,
    conflictCount,
    conflicts,
    dismissConflict,
  } = useNetworkStatus();

  // Navigation: 'dashboard' | 'records' | 'map' | 'conflicts' | 'settings'
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [emergencyMode, setEmergencyMode] = useState(false);
  const { language: activeLanguage, setLanguage: setActiveLanguage } = useTranslation();

  // Modals
  const [isIntakeModalOpen, setIsIntakeModalOpen] = useState(false);
  const [activeConflictModal, setActiveConflictModal] = useState(null);
  const [quotaExceeded, setQuotaExceeded] = useState(false);

  useEffect(() => {
    const handleQuotaExceeded = () => setQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', handleQuotaExceeded);
    return () => window.removeEventListener('gmp-quota-exceeded', handleQuotaExceeded);
  }, []);

  // Sync Emergency Mode class with document body for global sizing (UX4G standard)
  useEffect(() => {
    if (emergencyMode) {
      document.body.classList.add('emergency-mode-active');
    } else {
      document.body.classList.remove('emergency-mode-active');
    }
  }, [emergencyMode]);

  // Seed initial demo records on very first load if store is empty
  useEffect(() => {
    if (!loading && records.length === 0) {
      seedDemoData();
    }
  }, [loading, records.length, seedDemoData]);

  // Handle Dual-Device Conflict Simulation
  const handleSimulateConflict = async () => {
    try {
      const res = await fetch('/api/demo/conflict', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        if (data.conflict) {
          setActiveConflictModal(data.conflict);
          return;
        }
      }
    } catch {
      /* fallback to local synthesis */
    }

    const target = records[0] || {
      id: 'REC-WY-204',
      victimName: 'Aarav Sharma',
      triageLevel: 'delayed',
      location: 'Meppadi Junction • Relief Post 1',
      statusNotes: 'Inspector Rajesh Nair (NDRF QRT): Conscious, bleeding stabilized, compound fracture splinted.',
      version: 1,
    };

    const simulated = {
      serverRecord: {
        id: target.id,
        victimName: target.victimName || 'Aarav Sharma',
        triageLevel: 'immediate', // Remote override
        location: 'Chooralmala Transit Ambulance • En route to Kalpetta',
        statusNotes: 'Dr. Sunita Rao (Ambulance 04): SpO2 dipped to 84%, respiratory distress worsening. Upgrading to RED (Immediate) for emergency trauma admission.',
        responderId: 'Dr. Sunita Rao (Ambulance 04)',
        deviceId: 'Tablet-Unit-04',
        version: (target.version ?? 1) + 2,
        updatedAt: new Date().toISOString(),
      },
      clientPayload: {
        ...target,
        triageLevel: 'delayed',
        statusNotes: target.statusNotes || 'Inspector Rajesh Nair (NDRF QRT): Conscious, left leg splinted, vitals steady.',
        responderId: 'Inspector Rajesh Nair (NDRF QRT)',
        deviceId: 'Handset-Field-01',
        version: target.version ?? 1,
      },
    };

    setActiveConflictModal(simulated);
  };

  const handleConflictResolved = () => {
    setActiveConflictModal(null);
    refresh();
  };

  return (
    <div className="min-h-screen bg-[#F8F7F5] text-ink flex flex-col font-sans transition-colors pb-24 md:pb-20">
      
      {/* ── 0. Google Maps Platform Quota Notice ── */}
      {quotaExceeded && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm">
          <span>
            Google Maps Platform quota reached. If you are the app owner, visit{' '}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold text-amber-950 hover:text-amber-800"
            >
              maps developer site
            </a>{' '}
            for instructions to update your account.
          </span>
        </div>
      )}

      {/* ── 1. Top High-Contrast Offline / Connectivity Status Bar (UX4G Standard) ── */}
      <OfflineBanner
        isOnline={isOnline}
        isSimulatedOffline={isSimulatedOffline}
        setSimulatedOffline={setSimulatedOffline}
        syncState={syncState}
        pendingCount={pendingCount}
        conflictCount={conflictCount || (conflicts.length > 0 ? conflicts.length : 0)}
        onResolveConflict={() => {
          if (conflicts.length > 0) {
            setActiveConflictModal(conflicts[0]);
          } else {
            setActiveTab('conflicts');
          }
        }}
      />

      {/* ── 2. AidConnect Brand Header (Emergency Mode + Language Switcher) ── */}
      <Header
        emergencyMode={emergencyMode}
        setEmergencyMode={setEmergencyMode}
        activeLanguage={activeLanguage}
        setLanguage={setActiveLanguage}
        onOpenIntake={() => setIsIntakeModalOpen(true)}
        pendingCount={pendingCount}
        conflictCount={conflictCount}
      />

      {/* ── 3. Main Operational View Layout (Desktop Sidebar + Content Area) ── */}
      <div className="flex-1 flex w-full max-w-7xl mx-auto">
        
        {/* Desktop Collapsible Tactical Sidebar (>= 768px) */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          isOnline={isOnline}
          pendingCount={pendingCount}
          conflictCount={conflictCount || conflicts.length}
          recordsCount={records.length}
          isCollapsed={isSidebarCollapsed}
          setIsCollapsed={setIsSidebarCollapsed}
          emergencyMode={emergencyMode}
        />

        {/* Dynamic Page Views */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <DashboardView
              records={records}
              counts={counts}
              pendingCount={pendingCount}
              conflictCount={conflictCount || conflicts.length}
              isOnline={isOnline}
              emergencyMode={emergencyMode}
              setEmergencyMode={setEmergencyMode}
              onAddTriage={addTriage}
              onUpdateTriage={updateTriage}
              onDeleteTriage={deleteTriage}
              onNavigateToRecords={() => setActiveTab('records')}
              onNavigateToConflicts={() => setActiveTab('conflicts')}
            />
          )}

          {activeTab === 'records' && (
            <CasualtiesView
              records={records}
              counts={counts}
              loading={loading}
              onAddTriage={addTriage}
              onUpdateTriage={updateTriage}
              onDeleteTriage={deleteTriage}
              emergencyMode={emergencyMode}
              onOpenIntakeModal={() => setIsIntakeModalOpen(true)}
            />
          )}

          {activeTab === 'map' && (
            <FieldSectorMap
              records={records}
              emergencyMode={emergencyMode}
            />
          )}

          {activeTab === 'conflicts' && (
            <ConflictsPageView
              conflicts={conflicts.length > 0 ? conflicts : activeConflictModal ? [activeConflictModal] : []}
              onSelectConflict={(c) => setActiveConflictModal(c)}
              onInjectConflict={handleSimulateConflict}
              emergencyMode={emergencyMode}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView
              activeLanguage={activeLanguage}
              setLanguage={setActiveLanguage}
              emergencyMode={emergencyMode}
              setEmergencyMode={setEmergencyMode}
              pendingCount={pendingCount}
              recordsCount={records.length}
              isOnline={isOnline}
              onResetData={refresh}
            />
          )}
        </main>
      </div>

      {/* ── 4. Mobile Fixed Bottom Navigation Bar (< 768px, AidConnect Standard) ── */}
      <BottomNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        conflictCount={conflictCount || conflicts.length}
        unsyncedCount={pendingCount}
        emergencyMode={emergencyMode}
      />

      {/* ── 5. Human-Readable 3-Way Conflict Resolver Modal (No Technical JSON Diffs) ── */}
      <ConflictResolverModal
        isOpen={!!activeConflictModal}
        conflict={activeConflictModal}
        onClose={() => setActiveConflictModal(null)}
        onResolved={handleConflictResolved}
        emergencyMode={emergencyMode}
      />

      {/* ── 6. Rapid Casualty Intake Modal (Supplemental) ── */}
      <TriageFormModal
        isOpen={isIntakeModalOpen}
        onClose={() => setIsIntakeModalOpen(false)}
        onSubmit={addTriage}
      />

      {/* ── 7. Hackathon Demo Controls (Sticky Bottom Drawer for Judges) ── */}
      <DemoToolbar
        isSimulatedOffline={isSimulatedOffline}
        setSimulatedOffline={setSimulatedOffline}
        onTriggerConflict={handleSimulateConflict}
        onResetData={refresh}
        pendingCount={pendingCount}
        conflictCount={conflictCount || (conflicts.length > 0 ? conflicts.length : 0)}
      />

    </div>
  );
}

export default App;
