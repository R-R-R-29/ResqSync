/**
 * ResqSync Indic Multi-Script Disaster Coordination Translations
 * Primary Operational Context: Wayanad, Kerala NDRF Relief Operations
 * Supported Languages:
 *   - en: English (Standard Command)
 *   - ml: മലയാളം (Malayalam - Local State First Responders & District Command)
 *   - hi: हिन्दी (Hindi - NDRF & Armed Forces Primary Tongue)
 *   - ta: தமிழ் (Tamil - Regional Response Units & Inter-State Teams)
 *   - bn: বাংলা (Bengali - Migrant Worker Relief & Medical Staff)
 *   - mr: मराठी (Marathi - Western Command Support Units)
 */

export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', native: 'English', flag: '🇮🇳' },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം', flag: '🌴' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்', flag: '🏛️' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা', flag: '🌾' },
  { code: 'mr', name: 'Marathi', native: 'मराठी', flag: '🚩' },
];

export const translations = {
  en: {
    // Brand & Header
    brandName: 'ResqSync',
    sectorDesk: 'NDRF Sector Desk',
    headerSub: 'Offline Field Triage & Casualty Coordinator • Wayanad',
    emergencyMode: 'Emergency Mode',
    emergencyModeOn: 'ON (56px)',
    emergencyModeOff: 'OFF',
    rapidIntake: 'Rapid Intake',
    baseLinked: 'Base Station Linked',
    offlineMode: 'Offline Mode Active',
    
    // Navigation
    navHome: 'Home',
    navCasualties: 'Casualties',
    navMap: 'Map / Field',
    navConflicts: 'Conflicts',
    navSettings: 'Settings',
    
    // Dashboard Metrics
    metricCriticalTitle: 'Critical casualties',
    metricCriticalSub: 'Immediate medical priority',
    metricEvacTitle: 'Waiting for evacuation',
    metricEvacSub: 'Ambulance & transport',
    metricOfflineTitle: 'Saved offline on device',
    metricOfflineSub: 'Awaiting network sync',
    metricConflictTitle: 'Conflicts requiring review',
    metricConflictSubNone: 'All field edits reconciled',
    metricConflictSubActive: 'Concurrent edits detected',
    
    // Emergency Card
    logbookTitle: 'Field Officer Logbook',
    logbookSub: 'Offline triage desk. Records save to this handset and auto-upload when cellular or base Wi-Fi connects.',
    startTriageDesk: 'START Triage Desk',
    heroCardTitle: 'Immediate Casualty Registration & Tagging',
    heroCardDesc: 'Tag arriving casualties with standard color codes right on the field. Records are preserved on this device even without network and sync to Kalpetta hospital as soon as connected.',
    gloveMode: 'Glove Mode',
    gloveModeSub: '56px touch buttons',
    urgentHeading: 'Priority Critical Casualties • Wayanad Sector',
    viewAllManifest: 'View All Manifest',
    
    // Triage Categories
    immediate: 'RED • Immediate',
    immediateSub: 'Critical / Life-Threatening',
    delayed: 'YELLOW • Delayed',
    delayedSub: 'Serious / Non-Life-Threatening',
    minor: 'GREEN • Minor',
    minorSub: 'Walking Wounded / Minimal',
    expectant: 'BLACK • Expectant',
    expectantSub: 'Deceased / Non-Survivable',
    
    // Quick Add Form
    casualtyRegistration: 'Casualty Registration',
    casualtyRegSub: 'Offline-first intake. Records are immediately persisted to local IndexedDB.',
    directSync: 'Direct Sync',
    offlineQueue: 'Offline Queue',
    victimIdLabel: 'Victim Identifier / Name',
    autoId: 'Auto ID',
    locationLabel: 'Location (Sector / Camp / Post)',
    medicalNotesLabel: 'Medical Observations & Trauma Notes',
    commitRecord: 'Commit Casualty Record',
    saving: 'Saving Record...',
    victimNamePlaceholder: 'e.g. Rajeshwar Sen or Tag KL-WY-104',
    locationPlaceholder: 'e.g. Chooralmala Market Junction • Near Bridge',
    medicalNotesPlaceholder: 'e.g. Blunt chest trauma, conscious, pressure dressing applied at 14:20...',
    successToast: 'registered successfully',
    
    // Map View
    mapHeaderTitle: 'Interactive Field Sector & Evacuation Map',
    mapHeaderSub: 'Live Google Maps coordinates for rescue sectors, triage staging posts, and active casualty locations across Chooralmala, Meppadi, Vellarmala, and Mundakkai.',
    mapOperationsTitle: 'Wayanad District Disaster Operations',
    stateReliefCommand: 'Kerala State Relief Command',
    gmpActive: 'Live Google Maps Platform Active',
    emergencyGrid: 'Wayanad Emergency Grid: 11.5420° N, 76.1450° E',
    layersLabel: 'Layers:',
    allManifest: 'All Manifest',
    rescueOutpostsOnly: 'Rescue Outposts Only',
    roads: 'Roads',
    terrain: 'Terrain',
    satellite: 'Satellite',
    viewOnMap: 'View on Map →',
    commandingOfficer: 'Commanding Officer:',
    corridorCondition: 'Corridor Condition:',
    
    // Casualties View
    manifestTitle: 'Field Casualty Manifest',
    manifestSub: 'Complete register of treated, staged, and transferred disaster victims.',
    searchPlaceholder: 'Search by victim name, tag number, or triage sector...',
    allTriageLevels: 'All Triage Levels',
    exportManifest: 'Export Manifest (CSV)',
    noCasualtiesFound: 'No casualties found matching this filter.',
    
    // Conflict Resolver
    conflictTitle: 'Concurrent Field Updates Detected',
    conflictSub: 'Two response units updated the same casualty while offline.',
    keepFieldUnit: 'Keep Field Unit',
    keepAmbulanceUnit: 'Keep Ambulance Unit',
    reviewAndMerge: 'Review & Merge',
    saveMergedNotes: 'Save Merged Notes',
    conflictWarning: 'Critical Downgrade Safety Warning: Confirm clinical assessment before downgrading RED status.',
    authoritativeTriage: 'Authoritative Triage Status:',
    combinedNotes: 'Combined Field Notes:',
    
    // Offline Status Bar
    connectedBase: 'Connected to Base Station • Live records up to date',
    offlineStatusText: 'Offline Mode Active • Edits saved safely on this device',
    syncedNow: 'Syncing outbox with command server...',
    resolveConflictsBtn: 'Resolve Conflicts',
    simOfflineBtn: 'Simulate Offline',
    goOnlineBtn: 'Go Live',
    
    // Settings
    settingsTitle: 'Field Terminal Settings',
    settingsSub: 'Configure local storage, offline sync behavior, and regional Indic language display.',
    appLanguage: 'Application Language',
    selectLanguageDesc: 'Select primary language for triage labels, map sector notes, and tactical manifests.',
    deviceStorage: 'Device Storage & Offline Outbox',
    deviceStorageDesc: 'All casualty entries are preserved locally on this device in IndexedDB.',
    purgeLocalData: 'Reset Local Database',
    purgeWarning: 'Resets local browser cache and reloads default Wayanad disaster manifest.',
    
    // Helpline & SOS
    emergencyHelpline: 'Emergency Helpline',
    sosNumber: '1078 / 112 SOS',
  },

  ml: {
    // Brand & Header
    brandName: 'റസ്ക്യൂ സിങ്ക്',
    sectorDesk: 'എൻ.ഡി.ആർ.എഫ് സെക്ടർ ഡെസ്ക്',
    headerSub: 'ഓഫ്‌ലൈൻ ട്രയാജ് & ദുരന്ത നിവാരണ ഏകോപനം • വയനാട്',
    emergencyMode: 'അടിയന്തര മോഡ്',
    emergencyModeOn: 'ഓൺ (56px)',
    emergencyModeOff: 'ഓഫ്',
    rapidIntake: 'ത്വരിത രജിസ്ട്രേഷൻ',
    baseLinked: 'കമാൻഡ് സ്റ്റേഷനുമായി ബന്ധിപ്പിച്ചു',
    offlineMode: 'ഓഫ്‌ലൈൻ മോഡ് സജീവം',
    
    // Navigation
    navHome: 'പ്രധാനം',
    navCasualties: 'പരിക്കേറ്റവർ',
    navMap: 'ഭൂപടം / ഫീൽഡ്',
    navConflicts: 'പൊരുത്തക്കേടുകൾ',
    navSettings: 'ക്രമീകരണങ്ങൾ',
    
    // Dashboard Metrics
    metricCriticalTitle: 'ഗുരുതരമായ പരിക്കേറ്റവർ',
    metricCriticalSub: 'ഉടനടി അടിയന്തര ചികിത്സ ആവശ്യം',
    metricEvacTitle: 'ആശുപത്രി മാറ്റത്തിന് കാത്തിരിക്കുന്നവർ',
    metricEvacSub: 'ആംബുലൻസ് & രക്ഷാപ്രവർത്തനം',
    metricOfflineTitle: 'ഫോണിൽ സൂക്ഷിച്ചവ',
    metricOfflineSub: 'നെറ്റ്‌വർക്ക് സിങ്കിനായി കാത്തിരിക്കുന്നു',
    metricConflictTitle: 'പരിശോധിക്കേണ്ട വിവരങ്ങൾ',
    metricConflictSubNone: 'എല്ലാ ഫീൽഡ് വിവരങ്ങളും പൊരുത്തപ്പെട്ടു',
    metricConflictSubActive: 'ഒരേസമയം വന്ന മാറ്റങ്ങൾ കണ്ടെത്തി',
    
    // Emergency Card
    logbookTitle: 'ഫീൽഡ് ഓഫീസർ ലോഗ്ബുക്ക്',
    logbookSub: 'ഓഫ്‌ലൈൻ ട്രയാജ് ഡെസ്ക്. റേഞ്ച് ഇല്ലാത്തപ്പോഴും വിവരങ്ങൾ ഫോണിൽ സുരക്ഷിതമായി സൂക്ഷിക്കുന്നു.',
    startTriageDesk: 'സ്റ്റാർട്ട് (START) ട്രയാജ് ഡെസ്ക്',
    heroCardTitle: 'പരിക്കേറ്റവരുടെ ത്വരിത രജിസ്ട്രേഷനും ടാഗിംഗും',
    heroCardDesc: 'ദുരന്ത സ്ഥലത്ത് എത്തുന്ന പരിക്കേറ്റവരെ ഉടനടി കളർ കോഡ് ഉപയോഗിച്ച് തരംതിരിക്കുക. കൽപറ്റ ആശുപത്രിയിലേക്ക് കണക്റ്റ് ആകുമ്പോൾ വിവരങ്ങൾ തനിയെ സിങ്ക് ആകും.',
    gloveMode: 'ഗ്ലൗസ് മോഡ്',
    gloveModeSub: '56px വലിയ ടച്ച് ബട്ടണുകൾ',
    urgentHeading: 'ഗുരുതരമായ പരിക്കേറ്റവർ • വയനാട് സെക്ടർ',
    viewAllManifest: 'മുഴുവൻ പട്ടികയും കാണുക',
    
    // Triage Categories
    immediate: 'ചുവപ്പ് • ഉടനടി (റെഡ്)',
    immediateSub: 'അതീവ ഗുരുതരം / ജീവൻ രക്ഷാ മുൻഗണന',
    delayed: 'മഞ്ഞ • വൈകിക്കാവുന്നത് (യെല്ലോ)',
    delayedSub: 'ഗുരുതരം / ജീവന് ഉടനടി ഭീഷണിയില്ല',
    minor: 'പച്ച • നിസാരം (ഗ്രീൻ)',
    minorSub: 'നടക്കാൻ കഴിയുന്നവർ / ചെറിയ മുറിവുകൾ',
    expectant: 'കറുപ്പ് • മരണം/രക്ഷ അസാധ്യം (ബ്ലാക്ക്)',
    expectantSub: 'ശ്വാസമില്ലാത്തവർ / മരണം സംഭവിച്ചവർ',
    
    // Quick Add Form
    casualtyRegistration: 'പരിക്കേറ്റവരുടെ വിവരങ്ങൾ ചേർക്കുക',
    casualtyRegSub: 'ഓഫ്‌ലൈൻ രജിസ്ട്രേഷൻ. ഇന്റർനെറ്റ് ഇല്ലെങ്കിലും ഉടൻ ഫോണിൽ രേഖപ്പെടുത്തും.',
    directSync: 'തത്സമയ സിങ്ക്',
    offlineQueue: 'ഓഫ്‌ലൈൻ ക്യൂ',
    victimIdLabel: 'ആളുടെ പേര് / തിരിച്ചറിയൽ ടാഗ്',
    autoId: 'ഓട്ടോ ഐഡി',
    locationLabel: 'സ്ഥലം (സെക്ടർ / ക്യാമ്പ് / പോസ്റ്റ്)',
    medicalNotesLabel: 'ചികിത്സാ വിവരങ്ങളും പരിക്കുകളും',
    commitRecord: 'വിവരങ്ങൾ രേഖപ്പെടുത്തുക',
    saving: 'രേഖപ്പെടുത്തുന്നു...',
    victimNamePlaceholder: 'ഉദാ: രാജേഷ് കുമാർ അല്ലെങ്കിൽ ടാഗ് KL-WY-104',
    locationPlaceholder: 'ഉദാ: ചൂരൽമല മാർക്കറ്റ് ജംഗ്ഷൻ • പാലത്തിനടുത്ത്',
    medicalNotesPlaceholder: 'ഉദാ: നെഞ്ചിൽ ആഘാതം, ശ്വാസതടസ്സം, പ്രഷർ ഡ്രസ്സിംഗ് നൽകി...',
    successToast: 'വിജയകരമായി രേഖപ്പെടുത്തി',
    
    // Map View
    mapHeaderTitle: 'തത്സമയ ഫീൽഡ് സെക്ടർ ഭൂപടവും ഒഴിപ്പിക്കൽ വഴികളും',
    mapHeaderSub: 'ചൂരൽമല, മേപ്പാടി, വെള്ളരിമല, മുണ്ടക്കൈ മേഖലകളിലെ തത്സമയ ഗൂഗിൾ മാപ്പ് ലൊക്കേഷനുകളും ആംബുലൻസ് റൂട്ടുകളും.',
    mapOperationsTitle: 'വയനാട് ജില്ലാ ദുരന്ത നിവാരണ കൺട്രോൾ റൂം',
    stateReliefCommand: 'കേരള സംസ്ഥാന ദുരന്ത നിവാരണ അതോറിറ്റി',
    gmpActive: 'തത്സമയ ഗൂഗിൾ മാപ്‌സ് സജീവം',
    emergencyGrid: 'വയനാട് എമർജൻസി ഗ്രിഡ്: 11.5420° N, 76.1450° E',
    layersLabel: 'ലെയറുകൾ:',
    allManifest: 'എല്ലാ ആളുകളും',
    rescueOutpostsOnly: 'ക്യാമ്പുകൾ മാത്രം',
    roads: 'റോഡുകൾ',
    terrain: 'ഭൂപ്രകൃതി',
    satellite: 'ഉപഗ്രഹം',
    viewOnMap: 'ഭൂപടത്തിൽ കാണുക →',
    commandingOfficer: 'ചുമതലയുള്ള ഉദ്യോഗസ്ഥൻ:',
    corridorCondition: 'പാതയുടെ സ്ഥിതി:',
    
    // Casualties View
    manifestTitle: 'പരിക്കേറ്റവരുടെ ഔദ്യോഗിക പട്ടിക',
    manifestSub: 'ചികിത്സ നൽകിയവരും ആശുപത്രിയിലേക്ക് മാറ്റിയവരുമായ ദുരന്തബാധിതരുടെ പൂർണ്ണ വിവരങ്ങൾ.',
    searchPlaceholder: 'പേര്, ടാഗ് നമ്പർ, അല്ലെങ്കിൽ സ്ഥലം നൽകി തിരയുക...',
    allTriageLevels: 'എല്ലാ വിഭാഗങ്ങളും',
    exportManifest: 'പട്ടിക ഡൗൺലോഡ് ചെയ്യുക (CSV)',
    noCasualtiesFound: 'ഈ ഫിൽറ്ററിൽ ആരെയും കണ്ടെത്തിയില്ല.',
    
    // Conflict Resolver
    conflictTitle: 'ഫീൽഡ് വിവരങ്ങളിൽ പൊരുത്തക്കേട് കണ്ടെത്തി',
    conflictSub: 'ഓഫ്‌ലൈൻ ആയിരുന്നപ്പോൾ രണ്ട് റെസ്ക്യൂ ടീമുകൾ ഒരേ ആളുടെ വിവരങ്ങൾ മാറ്റി.',
    keepFieldUnit: 'ഫീൽഡ് യൂണിറ്റ് മാറ്റം നിലനിർത്തുക',
    keepAmbulanceUnit: 'ആംബുലൻസ് മാറ്റം നിലനിർത്തുക',
    reviewAndMerge: 'പരിശോധിച്ച് സംയോജിപ്പിക്കുക',
    saveMergedNotes: 'യോജിപ്പിച്ച വിവരങ്ങൾ സംരക്ഷിക്കുക',
    conflictWarning: 'സുരക്ഷാ മുന്നറിയിപ്പ്: റെഡ് വിഭാഗത്തിൽ നിന്ന് മാറ്റുന്നതിന് മുമ്പ് കൃത്യമായി പരിശോധിക്കുക.',
    authoritativeTriage: 'അന്തിമ ട്രയാജ് വിഭാഗം:',
    combinedNotes: 'സംയോജിത ഫീൽഡ് വിവരങ്ങൾ:',
    
    // Offline Status Bar
    connectedBase: 'കൺട്രോൾ റൂമുമായി ബന്ധിപ്പിച്ചു • തത്സമയം അപ്ഡേറ്റ് ആണ്',
    offlineStatusText: 'ഓഫ്‌ലൈൻ മോഡ് • വിവരങ്ങൾ ഫോണിൽ സുരക്ഷിതമാണ്',
    syncedNow: 'സെർവറിലേക്ക് വിവരങ്ങൾ മാറ്റുന്നു...',
    resolveConflictsBtn: 'പൊരുത്തക്കേടുകൾ തീർക്കുക',
    simOfflineBtn: 'ഓഫ്‌ലൈൻ പരീക്ഷിക്കുക',
    goOnlineBtn: 'ഓൺലൈൻ ആക്കുക',
    
    // Settings
    settingsTitle: 'ഫീൽഡ് ടെർമിനൽ ക്രമീകരണങ്ങൾ',
    settingsSub: 'ഓഫ്‌ലൈൻ സംഭരണവും ഭാഷാ ക്രമീകരണങ്ങളും ക്രമീകരിക്കുക.',
    appLanguage: 'ആപ്ലിക്കേഷൻ ഭാഷ',
    selectLanguageDesc: 'ട്രയാജ് രേഖപ്പെടുത്തുന്നതിനും ഭൂപട വിവരങ്ങൾക്കുമായി പ്രാദേശിക ഭാഷ തിരഞ്ഞെടുക്കുക.',
    deviceStorage: 'ഫോൺ സ്റ്റോറേജ് & ഓഫ്‌ലൈൻ ഔട്ട്ബോക്സ്',
    deviceStorageDesc: 'എല്ലാ വിവരങ്ങളും IndexedDB വഴി ഈ ഫോണിൽ സുരക്ഷിതമായി സൂക്ഷിക്കുന്നു.',
    purgeLocalData: 'ഡാറ്റ റീസെറ്റ് ചെയ്യുക',
    purgeWarning: 'ഫോണിലെ താൽക്കാലിക വിവരങ്ങൾ മായ്ച്ച് വയനാട് ഡിഫോൾട്ട് വിവരങ്ങൾ നൽകും.',
    
    // Helpline & SOS
    emergencyHelpline: 'അടിയന്തര ഹെൽപ്പ്‌ലൈൻ',
    sosNumber: '1078 / 112 എമർജൻസി',
  },

  hi: {
    // Brand & Header
    brandName: 'रेस्क्यू सिंक',
    sectorDesk: 'एनडीआरएफ सेक्टर डेस्क',
    headerSub: 'ऑफलाइन फील्ड ट्राइएज और हताहत समन्वयक • वायनाड',
    emergencyMode: 'आपातकालीन मोड',
    emergencyModeOn: 'चालू (56px)',
    emergencyModeOff: 'बंद',
    rapidIntake: 'त्वरित पंजीकरण',
    baseLinked: 'बेस स्टेशन से जुड़ा हुआ',
    offlineMode: 'ऑफलाइन मोड सक्रिय',
    
    // Navigation
    navHome: 'होम',
    navCasualties: 'हताहत',
    navMap: 'मानचित्र / फील्ड',
    navConflicts: 'विवाद',
    navSettings: 'सेटिंग्स',
    
    // Dashboard Metrics
    metricCriticalTitle: 'गंभीर हताहत',
    metricCriticalSub: 'तत्काल चिकित्सा प्राथमिकता',
    metricEvacTitle: 'निकासी की प्रतीक्षा में',
    metricEvacSub: 'एम्बुलेंस और परिवहन',
    metricOfflineTitle: 'डिवाइस पर ऑफलाइन सहेजा',
    metricOfflineSub: 'नेटवर्क सिंक की प्रतीक्षा',
    metricConflictTitle: 'समीक्षा आवश्यक विवाद',
    metricConflictSubNone: 'सभी फील्ड संपादन समन्वित',
    metricConflictSubActive: 'समवर्ती संपादन का पता चला',
    
    // Emergency Card
    logbookTitle: 'फील्ड ऑफिसर लॉगबुक',
    logbookSub: 'ऑफलाइन ट्राइएज डेस्क। नेटवर्क न होने पर भी डेटा सुरक्षित रहता है और कनेक्ट होते ही अपलोड हो जाता है।',
    startTriageDesk: 'स्टार्ट (START) ट्राइएज डेस्क',
    heroCardTitle: 'तत्काल हताहत पंजीकरण और टैगिंग',
    heroCardDesc: 'घटनास्थल पर पहुंचे पीड़ितों को मानक रंग कोड के साथ टैग करें। कल्पेट्टा अस्पताल से जुड़ते ही रिकॉर्ड स्वतः सिंक हो जाएंगे।',
    gloveMode: 'दस्ताने मोड',
    gloveModeSub: '56px बड़े टच बटन',
    urgentHeading: 'प्राथमिकता गंभीर हताहत • वायनाड सेक्टर',
    viewAllManifest: 'पूरी सूची देखें',
    
    // Triage Categories
    immediate: 'लाल • तत्काल (रेड)',
    immediateSub: 'गंभीर / जीवन के लिए खतरा',
    delayed: 'पीला • विलंबित (येलो)',
    delayedSub: 'गंभीर / जीवन को तत्काल खतरा नहीं',
    minor: 'हरा • सामान्य (ग्रीन)',
    minorSub: 'चलने-फिरने में सक्षम / मामूली चोट',
    expectant: 'काला • अप्रत्याशित/मृत (ब्लैक)',
    expectantSub: 'सांस नहीं ले रहे / मृत घोषित',
    
    // Quick Add Form
    casualtyRegistration: 'हताहत पंजीकरण',
    casualtyRegSub: 'ऑफलाइन-प्रथम इनटेक। रिकॉर्ड तुरंत स्थानीय डेटाबेस में सहेजे जाते हैं।',
    directSync: 'सीधा सिंक',
    offlineQueue: 'ऑफलाइन कतार',
    victimIdLabel: 'पीड़ित की पहचान / नाम',
    autoId: 'ऑटो आईडी',
    locationLabel: 'स्थान (सेक्टर / कैंप / पोस्ट)',
    medicalNotesLabel: 'चिकित्सीय अवलोकन और चोट विवरण',
    commitRecord: 'हताहत रिकॉर्ड दर्ज करें',
    saving: 'सहेज रहे हैं...',
    victimNamePlaceholder: 'उदा. राजेश्वर सेन या टैग KL-WY-104',
    locationPlaceholder: 'उदा. चूरलमला मार्केट जंक्शन • पुल के पास',
    medicalNotesPlaceholder: 'उदा. सीने में चोट, सांस लेने में तकलीफ, प्राथमिक पट्टी बांधी गई...',
    successToast: 'सफलतापूर्वक दर्ज किया गया',
    
    // Map View
    mapHeaderTitle: 'इंटरैक्टिव फील्ड सेक्टर और निकासी मानचित्र',
    mapHeaderSub: 'चूरलमला, मेप्पाडी, वेल्लारमला और मुंडक्कई में राहत शिविरों और हताहतों का लाइव गूगल मैप।',
    mapOperationsTitle: 'वायनाड जिला आपदा राहत अभियान',
    stateReliefCommand: 'केरल राज्य आपदा राहत कमान',
    gmpActive: 'लाइव गूगल मैप्स प्लेटफॉर्म सक्रिय',
    emergencyGrid: 'वायनाड आपातकालीन ग्रिड: 11.5420° N, 76.1450° E',
    layersLabel: 'परतें:',
    allManifest: 'सभी हताहत',
    rescueOutpostsOnly: 'केवल बचाव चौकियां',
    roads: 'सड़कें',
    terrain: 'भूभाग',
    satellite: 'उपग्रह',
    viewOnMap: 'मानचित्र पर देखें →',
    commandingOfficer: 'प्रभारी अधिकारी:',
    corridorCondition: 'मार्ग की स्थिति:',
    
    // Casualties View
    manifestTitle: 'फील्ड हताहत रजिस्टर',
    manifestSub: 'उपचारित, राहत शिविर और अस्पताल भेजे गए पीड़ितों का आधिकारिक रजिस्टर।',
    searchPlaceholder: 'पीड़ित का नाम, टैग या स्थान खोजें...',
    allTriageLevels: 'सभी स्तर',
    exportManifest: 'सूची डाउनलोड करें (CSV)',
    noCasualtiesFound: 'कोई परिणाम नहीं मिला।',
    
    // Conflict Resolver
    conflictTitle: 'समवर्ती फील्ड अपडेट का पता चला',
    conflictSub: 'ऑफलाइन रहते हुए दो अलग-अलग टीमों ने एक ही रिकॉर्ड में बदलाव किए।',
    keepFieldUnit: 'फील्ड यूनिट का डेटा रखें',
    keepAmbulanceUnit: 'एम्बुलेंस यूनिट का डेटा रखें',
    reviewAndMerge: 'समीक्षा करें और मिलाएं',
    saveMergedNotes: 'संयुक्त नोट्स सहेजें',
    conflictWarning: 'सुरक्षा चेतावनी: रेड (तत्काल) स्थिति कम करने से पहले पुनः पुष्टि करें।',
    authoritativeTriage: 'अंतिम ट्राइएज स्थिति:',
    combinedNotes: 'संयुक्त फील्ड नोट्स:',
    
    // Offline Status Bar
    connectedBase: 'बेस स्टेशन से जुड़े • रिकॉर्ड अपडेट हैं',
    offlineStatusText: 'ऑफलाइन मोड सक्रिय • डेटा डिवाइस पर सुरक्षित है',
    syncedNow: 'कमांड सर्वर के साथ सिंक हो रहा है...',
    resolveConflictsBtn: 'विवाद सुलझाएं',
    simOfflineBtn: 'ऑफलाइन अनुकरण',
    goOnlineBtn: 'ऑनलाइन जाएं',
    
    // Settings
    settingsTitle: 'फील्ड टर्मिनल सेटिंग्स',
    settingsSub: 'स्थानीय मेमोरी, सिंक व्यवहार और भारतीय भाषा प्रदर्शन कॉन्फ़िगर करें।',
    appLanguage: 'ऐप्लिकेशन की भाषा',
    selectLanguageDesc: 'ट्राइएज लेबल और मानचित्र प्रदर्शन के लिए प्राथमिक भाषा चुनें।',
    deviceStorage: 'डिवाइस स्टोरेज और ऑफलाइन आउटबॉक्स',
    deviceStorageDesc: 'सभी डेटा इस डिवाइस पर IndexedDB में सुरक्षित रहता है।',
    purgeLocalData: 'डेटा रीसेट करें',
    purgeWarning: 'स्थानीय डेटा हटाकर डिफ़ॉल्ट वायनाड राहत डेटा लोड करेगा।',
    
    // Helpline & SOS
    emergencyHelpline: 'आपातकालीन हेल्पलाइन',
    sosNumber: '1078 / 112 एसओएस',
  },

  ta: {
    // Brand & Header
    brandName: 'ரெஸ்க்யூ சின்க்',
    sectorDesk: 'என்டிஆர்எஃப் துறை மேசை',
    headerSub: 'ஆஃப்லைன் கள ட்ரையേജ് & பேரிடர் ஒருங்கிணைப்பாளர் • வயநாடு',
    emergencyMode: 'அவசர நிலை முறை',
    emergencyModeOn: 'ஆன் (56px)',
    emergencyModeOff: 'ஆஃப்',
    rapidIntake: 'விரைவு பதிவு',
    baseLinked: 'கட்டுப்பாட்டு மையம் இணைக்கப்பட்டது',
    offlineMode: 'ஆஃப்லைன் பயன்முறை செயலில் உள்ளது',
    
    // Navigation
    navHome: 'முகப்பு',
    navCasualties: 'பாதிக்கப்பட்டோர்',
    navMap: 'வரைபடம் / களம்',
    navConflicts: 'முரண்பாடுகள்',
    navSettings: 'அமைப்புகள்',
    
    // Dashboard Metrics
    metricCriticalTitle: 'தீவிர காயமடைந்தோர்',
    metricCriticalSub: 'உடனடி மருத்துவ முன்னுரிமை',
    metricEvacTitle: 'வெளியேற்றத்திற்கு காத்திருப்போர்',
    metricEvacSub: 'ஆம்புலன்ஸ் & போக்குவரத்து',
    metricOfflineTitle: 'சாதனத்தில் ஆஃப்லைனில் சேமிக்கப்பட்டது',
    metricOfflineSub: 'நெட்வொர்க் ஒத்திசைவு நிலுவையில்',
    metricConflictTitle: 'மறுஆய்வு தேவைப்படும் முரண்பாடுகள்',
    metricConflictSubNone: 'அனைத்து மாற்றங்களும் சரிபார்க்கப்பட்டன',
    metricConflictSubActive: 'ஒரே நேரத்தில் செய்யப்பட்ட மாற்றங்கள்',
    
    // Emergency Card
    logbookTitle: 'கள அதிகாரி குறிப்பேடு',
    logbookSub: 'ஆஃப்லைன் ட்ரையേജ് மேசை. நெட்வொர்க் இல்லாவிட்டாலும் சாதனத்தில் பாதுகாப்பாக சேமிக்கப்படும்.',
    startTriageDesk: 'ஸ்டார்ட் (START) ட்ரையേജ് மேசை',
    heroCardTitle: 'பாதிக்கப்பட்டோரின் உடனடி பதிவு மற்றும் வகைப்படுத்தல்',
    heroCardDesc: 'பாதிக்கப்பட்டோரை உடனடியாக வண்ண குறியீடுகளுடன் பதிவு செய்யுங்கள். நெட்வொர்க் கிடைத்தவுடன் மருத்துவமனைக்கு தானாகவே பகிரப்படும்.',
    gloveMode: 'கையுறைகள் முறை',
    gloveModeSub: '56px பெரிய தொடு பொத்தான்கள்',
    urgentHeading: 'தீவிர முன்னுரிமைப் பதிவுகள் • வயநாடு பகுதி',
    viewAllManifest: 'முழு பட்டியலைக் காண்க',
    
    // Triage Categories
    immediate: 'சிவப்பு • உடனடி (ரெட்)',
    immediateSub: 'மிகவும் ஆபத்தான நிலை / உடனடி உயிர் காப்பு',
    delayed: 'மஞ்சள் • தாமதமானது (எல்லோ)',
    delayedSub: 'தீவிரமானது / உடனடி ஆபத்து இல்லை',
    minor: 'பச்சை • சிறியது (கிரீன்)',
    minorSub: 'நடப்போர் / சிறிய காயங்கள்',
    expectant: 'கருப்பு • இறப்பு/நம்பிக்கையற்ற நிலை (பிளாக்)',
    expectantSub: 'சுவாசமற்ற நிலை / இறப்பு',
    
    // Quick Add Form
    casualtyRegistration: 'பாதிக்கப்பட்டோர் பதிவு',
    casualtyRegSub: 'ஆஃப்லைன் முதன்மை பதிவு. சாதனத்தின் உள்ளூர் நினைவகத்தில் உடனடியாகப் பதிவு செய்யப்படும்.',
    directSync: 'நேரடி ஒத்திசைவு',
    offlineQueue: 'ஆஃப்லைன் வரிசை',
    victimIdLabel: 'பெயர் / அடையாளக் குறி',
    autoId: 'தானியங்கி ஐடி',
    locationLabel: 'இடம் (பகுதி / முகாம் / நிலையம்)',
    medicalNotesLabel: 'மருத்துவக் குறிப்புகள் மற்றும் காயங்கள்',
    commitRecord: 'பதிவை உறுதிப்படுத்துக',
    saving: 'சேமிக்கிறது...',
    victimNamePlaceholder: 'எ.கா: சுந்தரமூர்த்தி அல்லது டேக் KL-WY-104',
    locationPlaceholder: 'எ.கா: சூரல்மலா பாலம் அருகே • முகாம் 1',
    medicalNotesPlaceholder: 'எ.கா: மார்பு காயம், மயக்க நிலை, கட்டு போடப்பட்டது...',
    successToast: 'வெற்றிகரமாக பதிவு செய்யப்பட்டது',
    
    // Map View
    mapHeaderTitle: 'நேரலை கள வரைபடம் & மீட்பு வழிகள்',
    mapHeaderSub: 'சூரல்மலா, மேப்பாடி, வெள்ளரிமலா மீட்பு முகாம்கள் மற்றும் பாதிக்கப்பட்டோரின் நேரடி கூகுள் மேப் வரைபடம்.',
    mapOperationsTitle: 'வயநாடு பேரிடர் மீட்புப் பணிகள்',
    stateReliefCommand: 'கேரள அரசு பேரிடர் மேலாண்மை',
    gmpActive: 'லைவ் கூகுள் மேப்ஸ் தளம் செயலில் உள்ளது',
    emergencyGrid: 'வயநாடு அவசர ஒருங்கிணைப்பு: 11.5420° N, 76.1450° E',
    layersLabel: 'அடுக்குகள்:',
    allManifest: 'அனைத்து பதிவுகள்',
    rescueOutpostsOnly: 'மீட்பு முகாம்கள் மட்டும்',
    roads: 'சாலைகள்',
    terrain: 'நிலப்பரப்பு',
    satellite: 'செயற்கைக்கோள்',
    viewOnMap: 'வரைபடத்தில் காண்க →',
    commandingOfficer: 'பொறுப்பு அதிகாரி:',
    corridorCondition: 'சாலை நிலை:',
    
    // Casualties View
    manifestTitle: 'களப் பதிவேடு',
    manifestSub: 'சிகிச்சை பெற்றோர் மற்றும் மாற்றப்பட்டோரின் முழு விவரங்கள்.',
    searchPlaceholder: 'பெயர், எண் அல்லது இடம் கொண்டு தேடுக...',
    allTriageLevels: 'அனைத்து நிலைகளும்',
    exportManifest: 'பட்டியல் பதிவிறக்கம் (CSV)',
    noCasualtiesFound: 'பதிவுகள் எதுவும் இல்லை.',
    
    // Conflict Resolver
    conflictTitle: 'முரண்பாடான தகவல்கள் கண்டறியப்பட்டன',
    conflictSub: 'ஆஃப்லைனில் இருந்தபோது இரண்டு வெவ்வேறு குழுக்கள் தகவல்களை மாற்றியுள்ளன.',
    keepFieldUnit: 'களக் குழு பதிவை வைத்திருக்கவும்',
    keepAmbulanceUnit: 'ஆம்புலன்ஸ் பதிவை வைத்திருக்கவும்',
    reviewAndMerge: 'சரிபார்த்து இணைக்கவும்',
    saveMergedNotes: 'இணைக்கப்பட்ட குறிப்புகளை சேமிக்க',
    conflictWarning: 'பாதுகாப்பு எச்சரிக்கை: சிவப்பு முன்னுரிமையை மாற்றுவதற்கு முன் மருத்துவரால் உறுதிசெய்யவும்.',
    authoritativeTriage: 'இறுதி ட்ரையേജ് நிலை:',
    combinedNotes: 'இணைக்கப்பட்ட களக் குறிப்புகள்:',
    
    // Offline Status Bar
    connectedBase: 'இணைக்கப்பட்டது • நேரலை தகவல்கள் புதுப்பிக்கப்பட்டன',
    offlineStatusText: 'ஆஃப்லைன் முறை • சாதனத்தில் பாதுகாப்பாக உள்ளது',
    syncedNow: 'சேவையகத்துடன் ஒத்திசைக்கிறது...',
    resolveConflictsBtn: 'முரண்பாட்டை சரிசெய்',
    simOfflineBtn: 'ஆஃப்லைன் உருவகப்படுத்து',
    goOnlineBtn: 'ஆன்லைனுக்குச் செல்',
    
    // Settings
    settingsTitle: 'கள முனைய அமைப்புகள்',
    settingsSub: 'உள்ளூர் சேமிப்பகம் மற்றும் மொழிகளை மாற்றியமைக்கவும்.',
    appLanguage: 'பயன்பாட்டு மொழி',
    selectLanguageDesc: 'ட்ரையേജ് மற்றும் வரைபடக் குறிப்புகளுக்கான முதன்மை மொழியைத் தேர்ந்தெடுக்கவும்.',
    deviceStorage: 'சாதன சேமிப்பகம் & ஆஃப்லைன் அவுட்பாக்ஸ்',
    deviceStorageDesc: 'அனைத்து தகவல்களும் சாதனத்தில் பாதுகாப்பாக சேமிக்கப்படுகின்றன.',
    purgeLocalData: 'தரவை மீட்டமைக்க',
    purgeWarning: 'சாதன தற்காலிகத் தரவை நீக்கி வயநாடு மாதிரியை ஏற்றும்.',
    
    // Helpline & SOS
    emergencyHelpline: 'அவசர உதவி எண்',
    sosNumber: '1078 / 112 உதவி',
  },

  bn: {
    // Brand & Header
    brandName: 'রেস্কিউ সিঙ্ক',
    sectorDesk: 'এনডিআরএফ সেক্টর ডেস্ক',
    headerSub: 'অফলাইন ফিল্ড ট্রায়াজ ও দুর্যোগ সমন্বয়ক • ওয়েনাড়',
    emergencyMode: 'জরুরি মোড',
    emergencyModeOn: 'চালু (56px)',
    emergencyModeOff: 'বন্ধ',
    rapidIntake: 'দ্রুত অন্তর্ভুক্তি',
    baseLinked: 'বেস স্টেশনের সাথে সংযুক্ত',
    offlineMode: 'অফলাইন মোড সক্রিয়',
    
    // Navigation
    navHome: 'মূলপাতা',
    navCasualties: 'আহত ব্যক্তি',
    navMap: 'মানচিত্র / ক্ষেত্র',
    navConflicts: 'দ্বন্দ্বসমূহ',
    navSettings: 'সেটিংস',
    
    // Dashboard Metrics
    metricCriticalTitle: 'গুরুতর আহত',
    metricCriticalSub: 'অবিলম্বে চিকিৎসা অগ্রাধিকার',
    metricEvacTitle: 'স্থানান্তরের অপেক্ষায়',
    metricEvacSub: 'অ্যাম্বুলেন্স ও পরিবহন',
    metricOfflineTitle: 'ডিভাইসে অফলাইনে সংরক্ষিত',
    metricOfflineSub: 'নেটওয়ার্ক সিঙ্কের অপেক্ষায়',
    metricConflictTitle: 'পর্যালোচনা প্রয়োজন এমন দ্বন্দ্ব',
    metricConflictSubNone: 'সব ক্ষেত্র তথ্য সমন্বিত',
    metricConflictSubActive: 'একযোগে সম্পাদিত তথ্য সনাক্ত',
    
    // Emergency Card
    logbookTitle: 'ফিল্ড অফিসার লগবুক',
    logbookSub: 'অফলাইন ট্রায়াজ ডেস্ক। নেটওয়ার্ক না থাকলেও ডিভাইসে সংরক্ষিত থাকে এবং সংযোগ পেলে সিঙ্ক হয়।',
    startTriageDesk: 'স্টার্ট (START) ট্রায়াজ ডেস্ক',
    heroCardTitle: 'জরুরি আহতদের নিবন্ধন ও ট্যাগিং',
    heroCardDesc: 'ঘটনাস্থলে আগত আহতদের মানসম্মত কালার কোড দিয়ে ট্যাগ করুন। নেটওয়ার্ক পাওয়ার সাথে সাথে হাসপাতাল ডেটাবেসে সিঙ্ক হবে।',
    gloveMode: 'দস্তানা মোড',
    gloveModeSub: '56px বড় টাচ বোতাম',
    urgentHeading: 'অগ্রাধিকার গুরুতর আহত • ওয়েনাড় সেক্টর',
    viewAllManifest: 'সম্পূর্ণ তালিকা দেখুন',
    
    // Triage Categories
    immediate: 'লাল • অবিলম্বে (রেড)',
    immediateSub: 'সংকটাপন্ন / প্রাণঘাতী অবস্থা',
    delayed: 'হলুদ • বিলম্বিত (ইয়েলো)',
    delayedSub: 'গুরুতর / তাৎক্ষণিক প্রাণ সংশয় নেই',
    minor: 'সবুজ • সামান্য (গ্রিন)',
    minorSub: 'হাঁটতে সক্ষম / সামান্য আহত',
    expectant: 'কালো • আশাহীন/মৃত (ব্ল্যাক)',
    expectantSub: 'শ্বাসহীন / মৃত ঘোষিত',
    
    // Quick Add Form
    casualtyRegistration: 'আহতদের তথ্য নিবন্ধন',
    casualtyRegSub: 'অফলাইন-প্রথম নিবন্ধন। ডিভাইসের লোকাল মেমরিতে তাৎক্ষণিকভাবে সংরক্ষিত হয়।',
    directSync: 'সরাসরি সিঙ্ক',
    offlineQueue: 'অফলাইন সারি',
    victimIdLabel: 'আহত ব্যক্তির নাম / শনাক্তকারী',
    autoId: 'অটো আইডি',
    locationLabel: 'স্থান (সেক্টর / ক্যাম্প / পোস্ট)',
    medicalNotesLabel: 'চিকিৎসা পর্যবেক্ষণ ও আঘাতের বিবরণ',
    commitRecord: 'তথ্য সংরক্ষণ করুন',
    saving: 'সংরক্ষণ হচ্ছে...',
    victimNamePlaceholder: 'যেমন: রাজেশ্বর সেন বা ট্যাগ KL-WY-104',
    locationPlaceholder: 'যেমন: চুরলমালা বাজার জংশন • সেতুর কাছে',
    medicalNotesPlaceholder: 'যেমন: বুকে আঘাত, শ্বাসকষ্ট, প্রাথমিক ড্রেসিং করা হয়েছে...',
    successToast: 'সফলভাবে নিবন্ধিত হয়েছে',
    
    // Map View
    mapHeaderTitle: 'লাইভ ফিল্ড সেক্টর মানচিত্র ও স্থানান্তর পথ',
    mapHeaderSub: 'চুরলমালা, মেপ্পাডি, ভেল্লারমালা ও মুন্ডাক্কাই অঞ্চলে উদ্ধারকারী ক্যাম্প ও আহতদের লাইভ গুগল ম্যাপ।',
    mapOperationsTitle: 'ওয়েনাড় জেলা দুর্যোগ ব্যবস্থাপনা',
    stateReliefCommand: 'কেরালা রাজ্য দুর্যোগ কমান',
    gmpActive: 'লাইভ গুগল ম্যাপস প্ল্যাটফর্ম সক্রিয়',
    emergencyGrid: 'ওয়েনাড় জরুরি গ্রিড: 11.5420° N, 76.1450° E',
    layersLabel: 'স্তর:',
    allManifest: 'সব তালিকা',
    rescueOutpostsOnly: 'শুধুমাত্র উদ্ধার কেন্দ্র',
    roads: 'রাস্তা',
    terrain: 'ভূপ্রকৃতি',
    satellite: 'উপগ্রহ',
    viewOnMap: 'মানচিত্রে দেখুন →',
    commandingOfficer: 'দায়িত্বপ্রাপ্ত কর্মকর্তা:',
    corridorCondition: 'পথের অবস্থা:',
    
    // Casualties View
    manifestTitle: 'ফিল্ড আহতদের রেজিস্টার',
    manifestSub: 'চিকিৎসাপ্রাপ্ত এবং স্থানান্তরিত আহতদের সম্পূর্ণ তালিকা।',
    searchPlaceholder: 'নাম, ট্যাগ বা স্থান দিয়ে অনুসন্ধান করুন...',
    allTriageLevels: 'সকল স্তর',
    exportManifest: 'তালিকা ডাউনলোড (CSV)',
    noCasualtiesFound: 'কোনো ফলাফল পাওয়া যায়নি।',
    
    // Conflict Resolver
    conflictTitle: 'তথ্যে অসঙ্গতি সনাক্ত হয়েছে',
    conflictSub: 'অফলাইনে থাকা অবস্থায় দুটি ভিন্ন দল একই রেকর্ডে পরিবর্তন করেছে।',
    keepFieldUnit: 'ফিল্ড দলের তথ্য রাখুন',
    keepAmbulanceUnit: 'অ্যাম্বুলেন্স দলের তথ্য রাখুন',
    reviewAndMerge: 'পর্যালোচনা ও সংযুক্ত করুন',
    saveMergedNotes: 'সংযুক্ত তথ্য সংরক্ষণ করুন',
    conflictWarning: 'নিরাপত্তা সতর্কতা: লাল (জরুরি) স্তর পরিবর্তন করার আগে যাচাই করুন।',
    authoritativeTriage: 'চূড়ান্ত ট্রায়াজ স্তর:',
    combinedNotes: 'সংযুক্ত ফিল্ড নোট:',
    
    // Offline Status Bar
    connectedBase: 'বেস স্টেশনে যুক্ত • ডেটা আপডেট আছে',
    offlineStatusText: 'অফলাইন মোড • ডেটা ডিভাইসে সংরক্ষিত আছে',
    syncedNow: 'সার্ভারের সাথে সিঙ্ক হচ্ছে...',
    resolveConflictsBtn: 'দ্বন্দ্ব সমাধান করুন',
    simOfflineBtn: 'অফলাইন পরীক্ষা',
    goOnlineBtn: 'অনলাইনে যান',
    
    // Settings
    settingsTitle: 'ফিল্ড টার্মিনাল সেটিংস',
    settingsSub: 'লোকাল স্টোরেজ ও ভারতীয় ভাষা কনফিগার করুন।',
    appLanguage: 'অ্যাপ্লিকেশন ভাষা',
    selectLanguageDesc: 'ট্রায়াজ এবং মানচিত্রের জন্য আঞ্চলিক ভাষা বেছে নিন।',
    deviceStorage: 'ডিভাইস স্টোরেজ ও অফলাইন আউটবক্স',
    deviceStorageDesc: 'সব তথ্য ডিভাইসের IndexedDB-তে সুরক্ষিত থাকে।',
    purgeLocalData: 'ডেটা রিসেট করুন',
    purgeWarning: 'স্থানীয় ক্যাশ মুছে ডিফল্ট ওয়েনাড় ডেটা লোড করবে।',
    
    // Helpline & SOS
    emergencyHelpline: 'জরুরি হেল্পলাইন',
    sosNumber: '1078 / 112 এসওএস',
  },

  mr: {
    // Brand & Header
    brandName: 'रेस्क्यू सिंक',
    sectorDesk: 'एनडीआरएफ सेक्टर डेस्क',
    headerSub: 'ऑफलाइन फील्ड ट्रायज आणि आपत्ती समन्वयक • वायनाड',
    emergencyMode: 'आपत्कालीन मोड',
    emergencyModeOn: 'सुरू (56px)',
    emergencyModeOff: 'बंद',
    rapidIntake: 'त्वरित नोंदणी',
    baseLinked: 'बेस स्टेशनशी जोडलेले',
    offlineMode: 'ऑफलाइन मोड सक्रिय',
    
    // Navigation
    navHome: 'मुख्यपृष्ठ',
    navCasualties: 'हताहत',
    navMap: 'नकाशा / कार्यक्षेत्र',
    navConflicts: 'विवाद',
    navSettings: 'सेटिंग्ज',
    
    // Dashboard Metrics
    metricCriticalTitle: 'गंभीर हताहत',
    metricCriticalSub: 'त्वरित वैद्यकीय प्राधान्य',
    metricEvacTitle: 'स्थलांतराची प्रतीक्षा',
    metricEvacSub: 'रुग्णवाहिका व वाहतूक',
    metricOfflineTitle: 'डिव्हाइसवर ऑफलाइन जतन',
    metricOfflineSub: 'नेटवर्क सिंकची प्रतीक्षा',
    metricConflictTitle: 'पुनरावलोकन आवश्यक असलेले विवाद',
    metricConflictSubNone: 'सर्व नोंदी समक्रमित',
    metricConflictSubActive: 'समवर्ती बदल आढळले',
    
    // Emergency Card
    logbookTitle: 'फील्ड ऑफिसर नोंदवही',
    logbookSub: 'ऑफलाइन ट्रायज डेस्क. नेटवर्क नसतानाही माहिती सुरक्षित राहते आणि नेटवर्क आल्यावर अपलोड होते.',
    startTriageDesk: 'स्टार्ट (START) ट्रायज डेस्क',
    heroCardTitle: 'त्वरित हताहत नोंदणी आणि टॅगिंग',
    heroCardDesc: 'घटनास्थळी पोहोचलेल्या जखमींना मानक रंग संकेतानुसार टॅग करा. रुग्णालय नेटवर्क उपलब्ध होताच माहिती सिंक होईल.',
    gloveMode: 'ग्लोव्ह्ज मोड',
    gloveModeSub: '56px मोठी टच बटणे',
    urgentHeading: 'प्राधान्य गंभीर हताहत • वायनाड विभाग',
    viewAllManifest: 'संपूर्ण यादी पहा',
    
    // Triage Categories
    immediate: 'लाल • त्वरित (रेड)',
    immediateSub: 'अतिगंभीर / जीवितास धोका',
    delayed: 'पिवळा • विलंबित (येलो)',
    delayedSub: 'गंभीर / जीवितास तत्काळ धोका नाही',
    minor: 'हिरवा • किरकोळ (ग्रीन)',
    minorSub: 'चालणारे जखमी / किरकोळ जखमा',
    expectant: 'काळा • गंभीर/मृत (ब्लॅक)',
    expectantSub: 'श्वास नसलेले / मृत घोषित',
    
    // Quick Add Form
    casualtyRegistration: 'हताहत नोंदणी',
    casualtyRegSub: 'ऑफलाइन-प्रथम नोंदणी. माहिती तत्काळ स्थानिक डेटाबेसमध्ये जतन होते.',
    directSync: 'थेट सिंक',
    offlineQueue: 'ऑफलाइन रांग',
    victimIdLabel: 'बाधित व्यक्तीचे नाव / ओळख',
    autoId: 'ऑटो आयडी',
    locationLabel: 'स्थान (विभाग / छावणी / पोस्ट)',
    medicalNotesLabel: 'वैद्यकीय निरीक्षणे आणि दुखापतीच्या नोंदी',
    commitRecord: 'नोंद जतन करा',
    saving: 'जतन करत आहे...',
    victimNamePlaceholder: 'उदा. राजेश्वर सेन किंवा टॅग KL-WY-104',
    locationPlaceholder: 'उदा. चूरलमला बाजार चौक • पुलाजवळ',
    medicalNotesPlaceholder: 'उदा. छातीवर आघात, धाप लागणे, मलमपट्टी केली...',
    successToast: 'यशस्वीरीत्या नोंदवले गेले',
    
    // Map View
    mapHeaderTitle: 'थेट कार्यक्षेत्र नकाशा आणि स्थलांतर मार्ग',
    mapHeaderSub: 'चूरलमला, मेप्पाडी, वेल्लारमला आणि मुंडक्कई भागातील मदत शिबिरे आणि जखमींचा लाइव्ह गुगल नकाशा.',
    mapOperationsTitle: 'वायनाड जिल्हा आपत्ती निवारण कार्य',
    stateReliefCommand: 'केरळ राज्य आपत्ती निवारण कमांड',
    gmpActive: 'लाइव्ह गुगल मॅप्स प्लॅटफॉर्म सक्रिय',
    emergencyGrid: 'वायनाड आपत्कालीन ग्रीड: 11.5420° N, 76.1450° E',
    layersLabel: 'स्तर:',
    allManifest: 'सर्व यादी',
    rescueOutpostsOnly: 'फक्त बचाव केंद्रे',
    roads: 'रस्ते',
    terrain: 'भूप्रदेश',
    satellite: 'उपग्रह',
    viewOnMap: 'नकाशावर पहा →',
    commandingOfficer: 'प्रभारी अधिकारी:',
    corridorCondition: 'मार्गाची स्थिती:',
    
    // Casualties View
    manifestTitle: 'फील्ड हताहत यादी',
    manifestSub: 'उपचार घेतलेल्या आणि हलवलेल्या सर्व व्यक्तींची अधिकृत यादी.',
    searchPlaceholder: 'नाव, टॅग किंवा स्थान शोधा...',
    allTriageLevels: 'सर्व स्तर',
    exportManifest: 'यादी डाउनलोड करा (CSV)',
    noCasualtiesFound: 'कोणतीही नोंद सापडली नाही.',
    
    // Conflict Resolver
    conflictTitle: 'माहितीमध्ये विसंगती आढळली',
    conflictSub: 'ऑफलाइन असताना दोन वेगवेगळ्या पथकांनी एकाच नोंदीत बदल केले.',
    keepFieldUnit: 'फील्ड पथकाची नोंद ठेवा',
    keepAmbulanceUnit: 'रुग्णवाहिका पथकाची नोंद ठेवा',
    reviewAndMerge: 'तपासा आणि एकत्र करा',
    saveMergedNotes: 'एकत्रित नोंदी जतन करा',
    conflictWarning: 'सुरक्षा इशारा: लाल (त्वरित) दर्जा बदलण्यापूर्वी काळजीपूर्वक तपासा.',
    authoritativeTriage: 'अंतिम ट्रायज दर्जा:',
    combinedNotes: 'एकत्रित फील्ड नोंदी:',
    
    // Offline Status Bar
    connectedBase: 'बेस स्टेशनशी जोडलेले • माहिती अद्ययावत आहे',
    offlineStatusText: 'ऑफलाइन मोड • माहिती डिव्हाइसवर सुरक्षित आहे',
    syncedNow: 'सर्व्हरशी समक्रमित होत आहे...',
    resolveConflictsBtn: 'विवाद सोडवा',
    simOfflineBtn: 'ऑफलाइन अनुकरण',
    goOnlineBtn: 'ऑनलाइन व्हा',
    
    // Settings
    settingsTitle: 'फील्ड टर्मिनल सेटिंग्ज',
    settingsSub: 'स्थानिक स्टोरेज आणि भारतीय भाषा पर्याय सेट करा.',
    appLanguage: 'अ‍ॅप्लिकेशन भाषा',
    selectLanguageDesc: 'ट्रायज लेबल्स आणि नकाशासाठी प्रादेशिक भाषा निवडा.',
    deviceStorage: 'डिव्हाइस स्टोरेज आणि ऑफलाइन आउटबॉक्स',
    deviceStorageDesc: 'सर्व माहिती डिव्हाइसच्या IndexedDB मध्ये सुरक्षित राहते.',
    purgeLocalData: 'डेटा रीसेट करा',
    purgeWarning: 'स्थानिक कॅश साफ करून डीफॉल्ट वायनाड मदत डेटा लोड करेल.',
    
    // Helpline & SOS
    emergencyHelpline: 'आपत्कालीन हेल्पलाइन',
    sosNumber: '1078 / 112 एसओएस',
  },
};
