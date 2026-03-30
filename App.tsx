
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Phone, 
  ChevronLeft, 
  Volume2, 
  Stethoscope, 
  MapPin, 
  Users, 
  Bandage, 
  Activity, 
  Camera, 
  Mic, 
  LogOut, 
  Trash2, 
  Edit2, 
  ArrowUp, 
  ArrowDown, 
  X,
  AlertTriangle,
  Lightbulb,
  Shield,
  Download,
  History,
  Mail
} from 'lucide-react';
import { UserProfile, UserRole, Language, EmergencyGuide, InteractiveStep, HealthFacility, EmergencyContact, UsageLog } from './types';
import { EMERGENCY_GUIDES, HEALTH_DIRECTORY, MOCK_BROADCASTS } from './constants';
import Layout from './components/Layout';
import SOSButton from './components/SOSButton';
import AuthScreen from './views/AuthScreen';
import { GeminiService } from './services/geminiService';
import PrivacyPolicy from './components/PrivacyPolicy';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState('home');
  const [selectedGuide, setSelectedGuide] = useState<EmergencyGuide | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [symptomText, setSymptomText] = useState('');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [checkerResult, setCheckerResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [allRegisteredUsers, setAllRegisteredUsers] = useState<UserProfile[]>([]);

  useEffect(() => {
    const syncUsers = () => {
      const savedAll = localStorage.getItem('all_registered_users');
      if (savedAll) {
        try {
          setAllRegisteredUsers(JSON.parse(savedAll));
        } catch (e) {
          console.error("Failed to parse registered users", e);
        }
      }
    };

    syncUsers();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'all_registered_users') {
        syncUsers();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const logAction = (action: string) => {
    if (!currentUser) return;
    const newLog: UsageLog = {
      id: Math.random().toString(36).substr(2, 9),
      action,
      timestamp: new Date().toISOString()
    };
    const updatedLogs = [newLog, ...(currentUser.usageLogs || [])].slice(0, 50); // Keep last 50
    updateProfile({ usageLogs: updatedLogs });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTipIndex((prevIndex) => (prevIndex + 1) % MOCK_BROADCASTS.length);
    }, 60000); // 1 minute
    return () => clearInterval(interval);
  }, []);

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
  
  // Profile & Directory State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editData, setEditData] = useState<Partial<UserProfile>>({});
  const [directoryCategory, setDirectoryCategory] = useState('All');
  const [directorySearch, setDirectorySearch] = useState('');
  const [selectedPatientProfile, setSelectedPatientProfile] = useState<UserProfile | null>(null);
  const [selectedHelper, setSelectedHelper] = useState<any>(null);
  
  // Custom Guides State
  const [customGuides, setCustomGuides] = useState<EmergencyGuide[]>([]);
  const [isEditingGuide, setIsEditingGuide] = useState(false);
  const [guideToEdit, setGuideToEdit] = useState<EmergencyGuide | null>(null);
  const [guideSearch, setGuideSearch] = useState('');
  const [guideCategory, setGuideCategory] = useState('All');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const guideMediaInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('user_profile');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (!parsed.sosContacts) parsed.sosContacts = [];
        setCurrentUser(parsed);
      } catch (e) {
        console.error("Failed to load user profile", e);
      }
    }
    const savedGuides = localStorage.getItem('custom_emergency_guides');
    if (savedGuides) {
      try {
        setCustomGuides(JSON.parse(savedGuides));
      } catch (e) {
        console.error("Failed to load custom guides", e);
      }
    }
  }, []);

  const allGuides = useMemo(() => {
    const merged = [...EMERGENCY_GUIDES];
    customGuides.forEach(cg => {
      const idx = merged.findIndex(g => g.id === cg.id);
      if (idx !== -1) {
        merged[idx] = cg;
      } else {
        merged.push(cg);
      }
    });
    return merged;
  }, [customGuides]);

  const filteredGuides = useMemo(() => {
    let filtered = allGuides.filter(g => g.title.toLowerCase().includes(guideSearch.toLowerCase()));
    if (guideCategory !== 'All') {
      filtered = filtered.filter(g => g.category === guideCategory);
    }
    return filtered;
  }, [allGuides, guideSearch, guideCategory]);

  const guideCategories = useMemo(() => {
    const cats = new Set(allGuides.map(g => g.category));
    return ['All', ...Array.from(cats)];
  }, [allGuides]);

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updates };
    if (!updated.sosContacts) updated.sosContacts = [];
    setCurrentUser(updated);
    localStorage.setItem('user_profile', JSON.stringify(updated));
    
    const allUsers = JSON.parse(localStorage.getItem('all_registered_users') || '[]');
    const index = allUsers.findIndex((u: UserProfile) => u.id === currentUser.id);
    if (index !== -1) {
      allUsers[index] = updated;
    } else {
      allUsers.push(updated);
    }
    localStorage.setItem('all_registered_users', JSON.stringify(allUsers));
    setAllRegisteredUsers(allUsers);
  };

  const handleSaveProfile = () => {
    updateProfile(editData);
    setIsEditingProfile(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setEditData(prev => ({ ...prev, profilePicture: base64 }));
      };
      reader.readAsDataURL(file);
    }
  };

  const dynamicDirectoryItems = useMemo(() => {
    if (!currentUser) return HEALTH_DIRECTORY;

    if (currentUser.role === UserRole.PATIENT) {
      const helpers: HealthFacility[] = allRegisteredUsers
        .filter((u: UserProfile) => {
          // Ensure we show users who explicitly opted in
          const isVisible = u.showInHelp === true || (u as any).showInHelp === 'true';
          const isNotMe = u.id !== currentUser.id;
          const isHelper = u.role === UserRole.ORGANIZATION || u.role === UserRole.CAREGIVER;
          return isVisible && isNotMe && isHelper;
        })
        .map((u: UserProfile) => ({
          id: u.id,
          name: u.role === UserRole.ORGANIZATION ? (u.organizationName || u.fullName || 'Unnamed Organization') : u.fullName,
          type: u.role === UserRole.ORGANIZATION ? (u.firmType === 'Others' ? (u.otherFirmType || 'Organization') : (u.firmType || 'Health Facility')) : 'Volunteer Provider',
          distance: 'Community Helper',
          phone: u.phone,
          address: u.address,
          profilePicture: u.profilePicture
        }));
      return [...HEALTH_DIRECTORY, ...helpers];
    } else {
      // Organizations and Caregivers see Patients who opted in
      return allRegisteredUsers.filter((u: UserProfile) => {
        const isVisible = u.showInHelp === true || (u as any).showInHelp === 'true';
        const isNotMe = u.id !== currentUser.id;
        const isPatient = u.role === UserRole.PATIENT;
        return isVisible && isNotMe && isPatient;
      });
    }
  }, [currentUser, allRegisteredUsers]);

  const filteredDirectory = useMemo(() => {
    const searchStr = directorySearch.toLowerCase();
    const items = dynamicDirectoryItems.filter(item => {
      const name = (item as any).fullName || (item as any).name || (item as any).organizationName || "";
      return name.toLowerCase().includes(searchStr);
    });

    if (currentUser?.role !== UserRole.PATIENT) return items;
    
    if (directoryCategory === 'All') return items;
    return items.filter((item: any) => {
      const type = item.type?.toLowerCase() || "";
      const cat = directoryCategory.toLowerCase();
      if (cat === 'volunteers') return type === 'volunteer' || type === 'caregiver' || type === 'provider';
      return type.includes(cat.slice(0, -1)) || type.includes(cat);
    });
  }, [dynamicDirectoryItems, directoryCategory, directorySearch, currentUser]);

  const speakGuide = async (guide: EmergencyGuide, step: InteractiveStep) => {
    try { 
      let text = `${guide.title}. Step: ${step.text}`;
      if (step.actionRequired) text += `. Action required: ${step.actionRequired}`;
      await GeminiService.speakText(text); 
    } catch (e) {}
  };

  const checkSymptoms = async () => {
    if (!symptomText.trim() && !capturedImage) return alert("Please describe symptoms or provide an image.");
    setLoading(true);
    logAction(`Used Symptom Checker: ${symptomText.slice(0, 20)}...`);
    try {
      const result = await GeminiService.checkSymptoms(symptomText, capturedImage || undefined);
      setCheckerResult(result);
    } catch (e) { alert("Analysis failed."); } finally { setLoading(false); }
  };

  const startVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice input is not supported in your browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setSymptomText(prev => prev ? prev + " " + transcript : transcript);
    };

    recognition.start();
  };

  const handleSymptomImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCapturedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('user_profile');
    setActiveTab('home');
  };

  const handleDeleteAccount = () => {
    localStorage.removeItem('user_profile');
    localStorage.removeItem('custom_emergency_guides');
    // Also remove from all_registered_users if exists
    const allUsers = JSON.parse(localStorage.getItem('all_registered_users') || '[]');
    const updatedUsers = allUsers.filter((u: UserProfile) => u.id !== currentUser?.id);
    localStorage.setItem('all_registered_users', JSON.stringify(updatedUsers));
    
    setCurrentUser(null);
    setActiveTab('home');
    alert("Your account and all associated data have been permanently deleted.");
  };

  const saveCustomGuide = (guide: EmergencyGuide) => {
    const updated = [...customGuides];
    const idx = updated.findIndex(g => g.id === guide.id);
    if (idx !== -1) {
      updated[idx] = guide;
    } else {
      updated.push(guide);
    }
    setCustomGuides(updated);
    localStorage.setItem('custom_emergency_guides', JSON.stringify(updated));
    setIsEditingGuide(false);
    setGuideToEdit(null);
  };

  const deleteCustomGuide = (id: string) => {
    if (!window.confirm("Are you sure you want to delete this guide?")) return;
    const updated = customGuides.filter(g => g.id !== id);
    setCustomGuides(updated);
    localStorage.setItem('custom_emergency_guides', JSON.stringify(updated));
    if (selectedGuide?.id === id) setSelectedGuide(null);
  };

  if (!currentUser) return <AuthScreen onLogin={(user) => {
    setCurrentUser(user);
    const all = JSON.parse(localStorage.getItem('all_registered_users') || '[]');
    setAllRegisteredUsers(all);
    // Log login
    const newLog: UsageLog = { id: Math.random().toString(36).substr(2, 9), action: 'Logged In', timestamp: new Date().toISOString() };
    const updated = { ...user, usageLogs: [newLog, ...(user.usageLogs || [])].slice(0, 50) };
    setCurrentUser(updated);
    localStorage.setItem('user_profile', JSON.stringify(updated));
  }} />;

  return (
    <Layout 
      title={activeTab === 'guides' && selectedGuide ? selectedGuide.title : activeTab === 'contacts' ? 'My Contacts' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} 
      activeTab={activeTab} 
      setActiveTab={(tab) => { 
        setActiveTab(tab); 
        logAction(`Navigated to ${tab}`);
        setSelectedGuide(null); 
        setIsEditingProfile(false); 
        setSelectedPatientProfile(null);
        setSelectedHelper(null);
      }}
      onBack={selectedGuide ? () => setSelectedGuide(null) : isEditingProfile ? () => setIsEditingProfile(false) : selectedPatientProfile ? () => setSelectedPatientProfile(null) : selectedHelper ? () => setSelectedHelper(null) : undefined}
    >
      {!isOnline && (
        <div className="mb-4 p-3 bg-orange-100 border border-orange-200 rounded-2xl flex items-center gap-3 animate-fadeIn">
          <span className="text-xl">📡</span>
          <div>
            <p className="text-xs font-black text-orange-900 uppercase tracking-widest">Offline Mode</p>
            <p className="text-[10px] text-orange-700 font-medium">You are currently offline. First aid guides are still available.</p>
          </div>
        </div>
      )}
      {activeTab === 'home' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-black text-gray-800">Hi, {currentUser.fullName.split(' ')[0]}</h2>
              <p className="text-gray-400 text-sm font-medium">Safe & Smart Help</p>
            </div>
            <button onClick={() => setActiveTab('profile')} className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center text-white text-xl font-black shadow-lg overflow-hidden border-2 border-white">
              {currentUser.profilePicture ? <img src={currentUser.profilePicture} className="w-full h-full object-cover" /> : currentUser.fullName.charAt(0)}
            </button>
          </div>

          <div className="relative h-48 rounded-[40px] overflow-hidden shadow-xl">
            <img 
              src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800" 
              className="w-full h-full object-cover" 
              alt="Healthcare Hero"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-red-600/80 to-transparent flex flex-col justify-center p-8">
              <h3 className="text-white text-xl font-black leading-tight mb-2">Always Ready<br/>To Help You</h3>
              <p className="text-white/80 text-[10px] font-bold uppercase tracking-widest">Community Support Network</p>
            </div>
          </div>

          <SOSButton user={currentUser} onUpdateContacts={(contacts) => updateProfile({ sosContacts: contacts })} />
          <div className="grid grid-cols-2 gap-4">
            <QuickAction icon={<Bandage size={32} />} label="First Aid" bg="bg-blue-50" color="text-blue-900" onClick={() => setActiveTab('guides')} />
            <QuickAction icon={<Stethoscope size={32} />} label="AI Symptoms" bg="bg-purple-50" color="text-purple-900" onClick={() => setActiveTab('checker')} />
            <QuickAction icon={<MapPin size={32} />} label="Find Help" bg="bg-green-50" color="text-green-900" onClick={() => setActiveTab('directory')} />
            <QuickAction icon={<Users size={32} />} label="My Contacts" bg="bg-orange-50" color="text-orange-900" onClick={() => setActiveTab('contacts')} />
          </div>
          <section className="bg-white p-6 rounded-[32px] border-2 border-gray-50">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb size={16} className="text-yellow-500" />
              <h3 className="font-black text-sm uppercase tracking-widest text-gray-400">Healthy Tip</h3>
            </div>
            {MOCK_BROADCASTS.length > 0 && (
              <div className="p-4 bg-yellow-50 rounded-2xl border border-yellow-100 animate-fadeIn" key={currentTipIndex}>
                <p className="font-bold text-gray-800 text-xs">{MOCK_BROADCASTS[currentTipIndex].title}</p>
                <p className="text-[10px] text-gray-500 mt-1">{MOCK_BROADCASTS[currentTipIndex].content}</p>
              </div>
            )}
          </section>
        </div>
      )}

      {activeTab === 'directory' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="relative">
            <input 
              type="text" 
              placeholder={currentUser.role === UserRole.PATIENT ? "Search Health Facilities..." : "Search Community Patients..."}
              value={directorySearch}
              onChange={(e) => setDirectorySearch(e.target.value)}
              className="w-full p-4 bg-gray-50 rounded-2xl border-none text-sm font-medium focus:ring-2 focus:ring-red-100 outline-none pl-12"
            />
            <Search className="absolute left-4 top-4 opacity-30" size={20} />
          </div>

          {currentUser.role === UserRole.PATIENT && (
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide px-1">
              {['All', 'Clinic', 'Hospital', 'Pharmacy', 'Volunteers'].map(cat => (
                <button 
                  key={cat} 
                  onClick={() => setDirectoryCategory(cat)}
                  className={`px-6 py-2 rounded-full text-[10px] font-black transition-all border ${directoryCategory === cat ? 'bg-red-600 text-white border-red-700' : 'bg-white text-gray-400 border-gray-100'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          <div className="space-y-3">
            {selectedPatientProfile ? (
              <div className="animate-slideUp space-y-6">
                <div className="bg-red-50 p-6 rounded-[32px] border border-red-100 flex flex-col items-center">
                  <div className="w-24 h-24 bg-red-600 rounded-full mb-4 flex items-center justify-center text-white text-4xl font-black overflow-hidden border-4 border-white shadow-xl">
                    {selectedPatientProfile.profilePicture ? <img src={selectedPatientProfile.profilePicture} className="w-full h-full object-cover" /> : selectedPatientProfile.fullName.charAt(0)}
                  </div>
                  <h3 className="text-xl font-black text-red-900">{selectedPatientProfile.fullName}</h3>
                  <p className="text-[10px] font-black text-red-600 uppercase tracking-[2px]">{selectedPatientProfile.gender} • Age {selectedPatientProfile.age}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <MedicalMetric icon="🩸" label="Blood Group" value={selectedPatientProfile.bloodGroup || 'Not set'} />
                  <MedicalMetric icon="🧬" label="Genotype" value={selectedPatientProfile.genotype || 'Not set'} />
                </div>

                <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm space-y-4">
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Health Challenges</p>
                    <p className="text-sm font-medium text-gray-700">{selectedPatientProfile.healthChallenges || 'None reported'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Address</p>
                    <p className="text-sm font-medium text-gray-700">{selectedPatientProfile.address}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button onClick={() => window.open(`tel:${selectedPatientProfile.phone}`)} className="w-full py-5 bg-red-600 text-white rounded-2xl font-black shadow-lg flex items-center justify-center gap-2">
                    <Phone size={20} />
                    CALL PATIENT NOW
                  </button>
                </div>
              </div>
            ) : selectedHelper ? (
              <div className="animate-slideUp space-y-6">
                <div className="bg-blue-50 p-6 rounded-[40px] border border-blue-100 flex flex-col items-center">
                  <div className="w-24 h-24 bg-blue-600 rounded-full mb-4 flex items-center justify-center text-white text-4xl font-black overflow-hidden border-4 border-white shadow-xl">
                    {selectedHelper.profilePicture ? <img src={selectedHelper.profilePicture} className="w-full h-full object-cover" /> : (selectedHelper.name ? selectedHelper.name.charAt(0) : '🏥')}
                  </div>
                  <h3 className="text-xl font-black text-blue-900">{selectedHelper.name || selectedHelper.fullName}</h3>
                  <p className="text-[10px] font-black text-blue-600 uppercase tracking-[2px]">{selectedHelper.type}</p>
                </div>

                <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm space-y-6">
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Location Address</p>
                    <p className="text-sm font-medium text-gray-700 leading-relaxed">{selectedHelper.address || 'Address not provided'}</p>
                  </div>
                  
                  <div className="flex flex-col gap-3">
                    <button 
                      onClick={() => {
                        const query = encodeURIComponent(selectedHelper.address || selectedHelper.name);
                        window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
                        logAction(`Got Directions to: ${selectedHelper.name}`);
                      }}
                      className="w-full py-5 bg-blue-600 text-white rounded-3xl font-black shadow-lg flex items-center justify-center gap-3 active:scale-95 transition-all"
                    >
                      <MapPin size={20} />
                      GET DIRECTIONS
                    </button>
                    
                    <a 
                      href={`tel:${selectedHelper.phone}`}
                      onClick={() => logAction(`Called Helper: ${selectedHelper.name}`)}
                      className="w-full py-5 bg-red-600 text-white rounded-3xl font-black shadow-lg flex items-center justify-center gap-3 active:scale-95 transition-all"
                    >
                      <Phone size={20} />
                      CALL NOW
                    </a>
                  </div>
                </div>

                <button 
                  onClick={() => setSelectedHelper(null)}
                  className="w-full py-4 bg-gray-100 text-gray-500 rounded-3xl font-black text-[10px] uppercase tracking-widest"
                >
                  Back to Directory
                </button>
              </div>
            ) : filteredDirectory.map((item: any, i) => (
              <div key={i} className="bg-white p-5 rounded-[32px] border border-gray-50 shadow-sm flex items-center gap-4 active:scale-[0.98] transition-all" onClick={() => currentUser.role !== UserRole.PATIENT ? setSelectedPatientProfile(item) : setSelectedHelper(item)}>
                <div className="w-14 h-14 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center text-2xl overflow-hidden font-black">
                  {item.profilePicture ? <img src={item.profilePicture} className="w-full h-full object-cover" /> : (item.role === UserRole.PATIENT ? item.fullName.charAt(0) : '🏥')}
                </div>
                <div className="flex-1">
                  <h4 className="font-black text-gray-800 text-sm">{item.fullName || item.name || item.organizationName}</h4>
                  <p className="text-[9px] font-bold text-red-600 uppercase tracking-widest">{item.type || (item.role === UserRole.PATIENT ? `Patient • ${item.bloodGroup || 'N/A'}` : 'Responder')}</p>
                </div>
                {currentUser.role === UserRole.PATIENT && item.phone && (
                  <a 
                    href={`tel:${item.phone}`} 
                    onClick={(e) => {
                      e.stopPropagation();
                      logAction(`Contacted Help: ${item.fullName || item.name || item.organizationName}`);
                    }}
                    className="p-3 bg-red-50 text-red-600 rounded-full shadow-sm active:scale-90 transition-all"
                  >📞</a>
                )}
              </div>
            ))}
            {(!filteredDirectory || filteredDirectory.length === 0) && (
              <div className="text-center py-20 opacity-30 font-black italic">No records found</div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'guides' && (
        <div className="animate-fadeIn">
          {isEditingGuide && guideToEdit ? (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-[32px] border-2 border-gray-50 shadow-sm space-y-4">
                <h3 className="text-xl font-black text-gray-800">Edit Guide: {guideToEdit.title}</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Guide Title</label>
                    <input 
                      type="text" 
                      value={guideToEdit.title} 
                      onChange={(e) => setGuideToEdit({...guideToEdit, title: e.target.value})}
                      className="w-full p-4 bg-gray-50 rounded-2xl border-none text-sm font-medium mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Steps</label>
                    <div className="space-y-4 mt-2">
                      {guideToEdit.steps.map((step, sIdx) => (
                        <div key={sIdx} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-3">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-black text-red-600 uppercase">Step {sIdx + 1}</span>
                              <div className="flex gap-1">
                                <button 
                                  disabled={sIdx === 0}
                                  onClick={() => {
                                    const newSteps = [...guideToEdit.steps];
                                    [newSteps[sIdx], newSteps[sIdx - 1]] = [newSteps[sIdx - 1], newSteps[sIdx]];
                                    setGuideToEdit({...guideToEdit, steps: newSteps});
                                  }}
                                  className="w-5 h-5 bg-white rounded flex items-center justify-center text-[10px] disabled:opacity-30"
                                >↑</button>
                                <button 
                                  disabled={sIdx === guideToEdit.steps.length - 1}
                                  onClick={() => {
                                    const newSteps = [...guideToEdit.steps];
                                    [newSteps[sIdx], newSteps[sIdx + 1]] = [newSteps[sIdx + 1], newSteps[sIdx]];
                                    setGuideToEdit({...guideToEdit, steps: newSteps});
                                  }}
                                  className="w-5 h-5 bg-white rounded flex items-center justify-center text-[10px] disabled:opacity-30"
                                >↓</button>
                              </div>
                            </div>
                            <button 
                              onClick={() => {
                                const newSteps = [...guideToEdit.steps];
                                newSteps.splice(sIdx, 1);
                                setGuideToEdit({...guideToEdit, steps: newSteps});
                              }}
                              className="text-red-600 text-[10px] font-black"
                            >REMOVE</button>
                          </div>
                          <div className="space-y-2">
                            <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Instruction</label>
                            <textarea 
                              value={step.text} 
                              onChange={(e) => {
                                const newSteps = [...guideToEdit.steps];
                                newSteps[sIdx].text = e.target.value;
                                setGuideToEdit({...guideToEdit, steps: newSteps});
                              }}
                              placeholder="Step instruction..."
                              className="w-full p-3 bg-white rounded-xl border-none text-xs resize-none"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Feedback / Encouragement</label>
                            <input 
                              type="text"
                              value={step.feedback || ''} 
                              onChange={(e) => {
                                const newSteps = [...guideToEdit.steps];
                                newSteps[sIdx].feedback = e.target.value;
                                setGuideToEdit({...guideToEdit, steps: newSteps});
                              }}
                              placeholder="e.g. Keep going, you are doing great!"
                              className="w-full p-3 bg-white rounded-xl border-none text-xs"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Action Required (Optional)</label>
                            <input 
                              type="text"
                              value={step.actionRequired || ''} 
                              onChange={(e) => {
                                const newSteps = [...guideToEdit.steps];
                                newSteps[sIdx].actionRequired = e.target.value;
                                setGuideToEdit({...guideToEdit, steps: newSteps});
                              }}
                              placeholder="e.g. Press firmly on the wound"
                              className="w-full p-3 bg-white rounded-xl border-none text-xs"
                            />
                          </div>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => {
                                const input = document.createElement('input');
                                input.type = 'file';
                                input.accept = 'image/*,video/*';
                                input.onchange = (e) => {
                                  const file = (e.target as HTMLInputElement).files?.[0];
                                  if (file) {
                                    if (file.size > 2 * 1024 * 1024) {
                                      alert("File is too large (max 2MB for local storage). Consider using smaller files or videos.");
                                      return;
                                    }
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                      const newSteps = [...guideToEdit.steps];
                                      newSteps[sIdx].mediaUrl = reader.result as string;
                                      newSteps[sIdx].mediaType = file.type.startsWith('video') ? 'video' : 'image';
                                      setGuideToEdit({...guideToEdit, steps: newSteps});
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                };
                                input.click();
                              }}
                              className="flex-1 py-2 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-black uppercase"
                            >
                              {step.mediaUrl ? 'Change Media' : 'Upload Media'}
                            </button>
                            {step.mediaUrl && (
                              <button 
                                onClick={() => {
                                  const newSteps = [...guideToEdit.steps];
                                  delete newSteps[sIdx].mediaUrl;
                                  delete newSteps[sIdx].mediaType;
                                  setGuideToEdit({...guideToEdit, steps: newSteps});
                                }}
                                className="px-3 py-2 bg-red-50 text-red-600 rounded-xl text-[10px] font-black uppercase"
                              >🗑️</button>
                            )}
                          </div>
                          {step.mediaUrl && (
                            <div className="rounded-xl overflow-hidden border border-gray-200">
                              {step.mediaType === 'video' ? (
                                <video src={step.mediaUrl} className="w-full h-32 object-cover" controls />
                              ) : (
                                <img src={step.mediaUrl} className="w-full h-32 object-cover" />
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                      <button 
                        onClick={() => setGuideToEdit({...guideToEdit, steps: [...guideToEdit.steps, { text: '', feedback: 'Keep going, you are doing great!' }]})}
                        className="w-full py-3 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400 text-[10px] font-black uppercase"
                      >+ Add Step</button>
                    </div>
                  </div>
                </div>
                <div className="flex gap-4 pt-4">
                  <button onClick={() => { setIsEditingGuide(false); setGuideToEdit(null); }} className="flex-1 py-4 bg-gray-100 text-gray-400 rounded-2xl font-black uppercase text-[10px]">Cancel</button>
                  <button 
                    onClick={() => {
                      setSelectedGuide(guideToEdit);
                      setCurrentStepIndex(0);
                      setIsEditingGuide(false);
                    }}
                    className="flex-1 py-4 bg-blue-50 text-blue-600 rounded-2xl font-black uppercase text-[10px]"
                  >Preview</button>
                  <button onClick={() => saveCustomGuide(guideToEdit)} className="flex-[2] py-4 bg-red-600 text-white rounded-2xl font-black shadow-lg uppercase text-[10px]">Save Changes</button>
                </div>
              </div>
            </div>
          ) : !selectedGuide ? (
            <div className="space-y-6">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search Guides..." 
                  value={guideSearch}
                  onChange={(e) => setGuideSearch(e.target.value)}
                  className="w-full p-4 bg-gray-50 rounded-2xl border-none text-sm font-medium focus:ring-2 focus:ring-red-100 outline-none"
                />
                {guideSearch ? (
                  <button onClick={() => setGuideSearch('')} className="absolute right-10 top-4 opacity-30">✕</button>
                ) : null}
                <span className="absolute right-4 top-4 opacity-30">🔍</span>
              </div>

              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide px-1">
                {guideCategories.map(cat => (
                  <button 
                    key={cat} 
                    onClick={() => setGuideCategory(cat)}
                    className={`px-6 py-2 rounded-full text-[10px] font-black transition-all border whitespace-nowrap ${guideCategory === cat ? 'bg-red-600 text-white border-red-700' : 'bg-white text-gray-400 border-gray-100'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4">
                {filteredGuides.map(guide => (
                  <div key={guide.id} className="relative group">
                    <button onClick={() => { 
                      setSelectedGuide(guide); 
                      setCurrentStepIndex(0); 
                      speakGuide(guide, guide.steps[0]); 
                      logAction(`Viewed Guide: ${guide.title}`);
                    }} className="w-full bg-white p-6 rounded-[32px] border-2 border-gray-50 shadow-sm flex flex-col items-center active:scale-95 transition-all">
                      <span className="text-4xl mb-3">{guide.icon}</span>
                      <span className="font-bold text-gray-800 text-[10px] text-center uppercase tracking-widest">{guide.title}</span>
                    </button>
                    {currentUser.role === UserRole.ORGANIZATION && (
                      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={(e) => { e.stopPropagation(); setGuideToEdit(JSON.parse(JSON.stringify(guide))); setIsEditingGuide(true); }}
                          className="p-2 bg-white/80 backdrop-blur rounded-full shadow-sm"
                        >✏️</button>
                        {customGuides.some(cg => cg.id === guide.id) && (
                          <button 
                            onClick={(e) => { e.stopPropagation(); deleteCustomGuide(guide.id); }}
                            className="p-2 bg-white/80 backdrop-blur rounded-full shadow-sm text-red-600"
                          >🗑️</button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {currentUser.role === UserRole.ORGANIZATION && (
                <button 
                  onClick={() => {
                    const newId = 'custom-' + Math.random().toString(36).substr(2, 9);
                    setGuideToEdit({
                      id: newId,
                      title: 'New Guide',
                      icon: '🩹',
                      image: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&q=80&w=400',
                      steps: [{ text: 'First step...', feedback: 'Good start!' }],
                      furtherHelp: '',
                      whenToCallSOS: ''
                    });
                    setIsEditingGuide(true);
                  }}
                  className="w-full py-5 bg-blue-600 text-white rounded-[32px] font-black shadow-xl uppercase tracking-widest text-xs"
                >+ Create New Guide</button>
              )}
            </div>
          ) : (
            <div className="space-y-6 animate-fadeIn">
              <div className="relative overflow-hidden rounded-[40px] shadow-2xl bg-gray-100 border-4 border-white">
                {selectedGuide.steps[currentStepIndex].mediaUrl ? (
                  selectedGuide.steps[currentStepIndex].mediaType === 'video' ? (
                    <video src={selectedGuide.steps[currentStepIndex].mediaUrl} className="w-full h-72 object-cover" controls autoPlay muted loop />
                  ) : (
                    <img src={selectedGuide.steps[currentStepIndex].mediaUrl} className="w-full h-72 object-cover" alt="Step Illustration" />
                  )
                ) : (
                  <img src={selectedGuide.image} className="w-full h-72 object-cover" alt="Guide Image" />
                )}
                <div className="absolute top-4 left-4 bg-red-600 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">Step {currentStepIndex + 1} of {selectedGuide.steps.length}</div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6 pt-12">
                  <p className="text-white text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Visual Guide</p>
                </div>
              </div>
              
              <div className="px-2 space-y-4">
                <h2 className="text-2xl font-black text-gray-900 leading-tight tracking-tight">{selectedGuide.steps[currentStepIndex].text}</h2>
                
                <div className="p-5 bg-green-50 rounded-[32px] border-2 border-green-100 flex gap-4 items-start">
                  <span className="text-2xl">💡</span>
                  <p className="text-xs font-bold text-green-800 leading-relaxed">{selectedGuide.steps[currentStepIndex].feedback}</p>
                </div>

                {selectedGuide.steps[currentStepIndex].critical && (
                  <div className="p-5 bg-red-50 rounded-[32px] border-2 border-red-100 flex gap-4 items-start animate-pulse">
                    <span className="text-2xl">⚠️</span>
                    <p className="text-xs font-black text-red-800 uppercase tracking-wider">Critical Action Required</p>
                  </div>
                )}
              </div>

              <div className="flex gap-4 pt-4">
                <button onClick={() => speakGuide(selectedGuide, selectedGuide.steps[currentStepIndex])} className="flex-1 py-5 bg-gray-100 text-gray-800 rounded-[32px] font-black text-[10px] uppercase tracking-widest hover:bg-gray-200 transition-all flex items-center justify-center gap-2">
                  <Volume2 size={16} />
                  Listen
                </button>
                <button 
                  onClick={() => currentStepIndex < selectedGuide.steps.length - 1 ? setCurrentStepIndex(currentStepIndex+1) : setSelectedGuide(null)} 
                  className="flex-[2] py-5 bg-red-600 text-white rounded-[32px] font-black shadow-xl hover:bg-red-700 active:scale-95 transition-all uppercase tracking-widest"
                >
                  {currentStepIndex < selectedGuide.steps.length - 1 ? 'Next Step' : 'Finish Guide'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'checker' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100 flex gap-3 items-start">
            <AlertTriangle size={18} className="text-orange-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-[10px] font-black text-orange-800 uppercase tracking-widest">Medical Disclaimer</p>
              <p className="text-[10px] text-orange-700 font-medium leading-relaxed">This AI tool provides information for educational purposes only. It is NOT a substitute for professional medical advice, diagnosis, or treatment. In an emergency, call 112 immediately.</p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[40px] border-2 border-gray-50 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-black text-gray-800">Symptom Analysis</h3>
              <div className="flex gap-2">
                <button 
                  onClick={startVoiceInput} 
                  className={`p-3 rounded-2xl transition-all ${isListening ? 'bg-red-600 text-white animate-pulse' : 'bg-gray-100 text-gray-600'}`}
                  title="Voice Input"
                >
                  <Mic size={20} />
                </button>
                <button 
                  onClick={() => document.getElementById('symptom-image-input')?.click()} 
                  className="p-3 bg-gray-100 text-gray-600 rounded-2xl transition-all"
                  title="Visual Input"
                >
                  <Camera size={20} />
                </button>
                <input 
                  id="symptom-image-input" 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleSymptomImage} 
                />
              </div>
            </div>
            
            <div className="relative">
              <textarea 
                value={symptomText} 
                onChange={(e) => setSymptomText(e.target.value)} 
                placeholder="Tell AI how you feel..." 
                className="w-full h-32 p-5 bg-gray-50 rounded-3xl border-0 text-sm resize-none focus:ring-2 focus:ring-red-100 outline-none" 
              />
              {capturedImage && (
                <div className="absolute bottom-4 right-4 w-16 h-16 rounded-xl overflow-hidden border-2 border-white shadow-md">
                  <img src={capturedImage} className="w-full h-full object-cover" />
                  <button 
                    onClick={() => setCapturedImage(null)} 
                    className="absolute top-0 right-0 bg-red-600 text-white text-[8px] p-1 rounded-bl-lg"
                  >✕</button>
                </div>
              )}
            </div>

            <button onClick={checkSymptoms} disabled={loading} className="w-full py-5 bg-red-600 text-white rounded-2xl font-black shadow-lg active:scale-95 transition-all disabled:opacity-50">
              {loading ? 'ANALYZING...' : 'GET ADVICE'}
            </button>
          </div>
          {checkerResult && (
            <div className="bg-white p-8 rounded-[40px] shadow-xl animate-slideUp border border-gray-50">
              <div className="flex justify-between items-center mb-4">
                <span className="px-3 py-1 bg-red-50 text-red-600 text-[10px] font-black rounded-full uppercase">Severity: {checkerResult.severity}</span>
              </div>
              <p className="text-gray-600 text-sm font-medium mb-6">"{checkerResult.advice}"</p>
              <div className="space-y-3">
                {checkerResult.steps.map((s: string, i: number) => (
                  <div key={i} className="flex gap-3 text-xs text-gray-700 bg-gray-50 p-4 rounded-2xl font-bold">
                    <span className="text-red-600">{i+1}.</span>
                    <span>{s}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'contacts' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-white p-8 rounded-[40px] border-2 border-gray-50 shadow-sm space-y-6">
            <h3 className="text-xl font-black text-gray-800">Emergency Contacts</h3>
            <p className="text-xs text-gray-400 font-medium">Add family members or organizations to your emergency network.</p>
            
            <div className="space-y-4">
              {(currentUser.sosContacts || []).map(contact => (
                <div key={contact.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <div>
                    <p className="font-black text-gray-800 text-sm">{contact.name}</p>
                    <p className="text-[9px] font-bold text-red-600 uppercase tracking-widest">{contact.type} • {contact.phone}</p>
                  </div>
                  <button 
                    onClick={() => {
                      const updated = currentUser.sosContacts.filter(c => c.id !== contact.id);
                      updateProfile({ sosContacts: updated });
                    }}
                    className="p-2 text-red-600"
                  >🗑️</button>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-gray-100 space-y-4">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Add New Contact</p>
              <form onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const name = (form.elements.namedItem('name') as HTMLInputElement).value;
                const phone = (form.elements.namedItem('phone') as HTMLInputElement).value;
                const type = (form.elements.namedItem('type') as HTMLSelectElement).value as any;
                
                if (name && phone) {
                  const newContact: EmergencyContact = {
                    id: Math.random().toString(36).substr(2, 9),
                    name,
                    phone,
                    type
                  };
                  updateProfile({ sosContacts: [...(currentUser.sosContacts || []), newContact] });
                  form.reset();
                }
              }} className="space-y-3">
                <input name="name" placeholder="Contact Name" className="w-full p-4 bg-gray-50 rounded-2xl border-none text-sm" required />
                <input name="phone" placeholder="Phone Number" className="w-full p-4 bg-gray-50 rounded-2xl border-none text-sm" required />
                <select name="type" className="w-full p-4 bg-gray-50 rounded-2xl border-none text-sm appearance-none" required>
                  <option value="Family">Family</option>
                  <option value="Org">Organization</option>
                </select>
                <button type="submit" className="w-full py-4 bg-red-600 text-white rounded-2xl font-black shadow-lg uppercase text-[10px]">Add Contact</button>
              </form>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'profile' && (
        <div className="space-y-6 animate-fadeIn">
          {!isEditingProfile ? (
            <>
              <div className="text-center p-10 bg-gray-50 rounded-[48px]">
                <div className="w-24 h-24 bg-red-600 text-white text-5xl font-black flex items-center justify-center rounded-full mx-auto mb-6 shadow-2xl border-4 border-white overflow-hidden">
                  {currentUser.profilePicture ? <img src={currentUser.profilePicture} className="w-full h-full object-cover" /> : currentUser.fullName.charAt(0)}
                </div>
                <h2 className="text-2xl font-black text-gray-800">{currentUser.fullName}</h2>
                <p className="text-red-600 text-[10px] font-black uppercase tracking-widest mt-2">{currentUser.role}</p>
                <button onClick={() => { setEditData(currentUser); setIsEditingProfile(true); }} className="mt-6 px-8 py-2.5 bg-white text-gray-800 rounded-full text-[10px] font-black uppercase shadow-sm border border-gray-100">EDIT PROFILE</button>
              </div>
              <div className="bg-white p-8 rounded-[40px] border-2 border-gray-50 space-y-6 shadow-sm">
                <InfoRow icon={<Phone size={16} />} label="Phone" value={currentUser.phone} />
                <InfoRow icon={<Activity size={16} />} label="Medical" value={`${currentUser.bloodGroup || 'N/A'} • ${currentUser.genotype || 'N/A'}`} />
                <InfoRow icon={<Users size={16} />} label="Emergency Network" value={`${(currentUser.sosContacts || []).length} configured`} />
              </div>
              <div className="space-y-3">
                <button 
                  onClick={() => setActiveTab('privacy')}
                  className="w-full py-4 bg-gray-50 text-gray-600 rounded-3xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 border border-gray-100"
                >
                  <Shield size={14} />
                  Privacy & Data Policy
                </button>
                <button 
                  onClick={() => setActiveTab('setup')}
                  className="w-full py-4 bg-blue-50 text-blue-600 rounded-3xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 border border-blue-100"
                >
                  <Download size={14} />
                  Local Setup Guide
                </button>
                <button onClick={handleLogout} className="w-full py-5 bg-red-50 text-red-600 rounded-3xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 border border-red-100">
                  <LogOut size={16} />
                  Sign Out
                </button>
              </div>

              <div className="bg-white p-8 rounded-[40px] border-2 border-gray-50 space-y-4 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <History className="text-gray-400" size={20} />
                  <h3 className="text-lg font-black text-gray-800">Usage Log</h3>
                </div>
                <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Actions: {currentUser.usageLogs?.length || 0}</p>
                  {(currentUser.usageLogs || []).length === 0 ? (
                    <p className="text-xs text-gray-400 italic">No activity logged yet.</p>
                  ) : (
                    currentUser.usageLogs?.map(log => (
                      <div key={log.id} className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                        <p className="text-xs font-bold text-gray-700">{log.action}</p>
                        <p className="text-[9px] text-gray-400 mt-1">{new Date(log.timestamp).toLocaleString()}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="bg-blue-600 p-8 rounded-[40px] text-white shadow-xl space-y-4">
                <div className="flex items-center gap-3">
                  <Mail size={20} />
                  <h3 className="font-black">Contact Administrator</h3>
                </div>
                <p className="text-xs opacity-90 leading-relaxed font-medium">
                  Need help or have suggestions? Contact our administrator directly for support.
                </p>
                <a 
                  href="mailto:peterpraise243@gmail.com"
                  className="block w-full py-4 bg-white text-blue-600 rounded-2xl font-black text-center text-xs uppercase tracking-widest shadow-lg active:scale-95 transition-all"
                >
                  Email Admin
                </a>
              </div>
            </>
          ) : (
            <div className="space-y-6">
              <div className="text-center relative">
                <div onClick={() => fileInputRef.current?.click()} className="w-28 h-28 bg-gray-100 rounded-full mx-auto cursor-pointer border-4 border-white shadow-xl overflow-hidden flex items-center justify-center group relative">
                  {editData.profilePicture ? <img src={editData.profilePicture} className="w-full h-full object-cover" /> : <Camera className="text-gray-300" size={32} />}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Edit2 className="text-white" size={20} />
                  </div>
                </div>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
              </div>
              <div className="bg-white p-8 rounded-[40px] border-2 border-gray-100 space-y-5">
                <EditInput label="Name" value={editData.fullName || ''} onChange={(val) => setEditData({...editData, fullName: val})} />
                <EditInput label="Phone" value={editData.phone || ''} onChange={(val) => setEditData({...editData, phone: val})} />
                <EditInput label="Challenges" value={editData.healthChallenges || ''} onChange={(val) => setEditData({...editData, healthChallenges: val})} placeholder="e.g. Asthma, Allergies" />
              </div>
              <div className="flex gap-4">
                <button onClick={() => setIsEditingProfile(false)} className="flex-1 py-5 bg-gray-100 text-gray-500 rounded-3xl font-black uppercase text-xs">Cancel</button>
                <button onClick={handleSaveProfile} className="flex-1 py-5 bg-red-600 text-white rounded-3xl font-black uppercase text-xs shadow-lg">Save</button>
              </div>
            </div>
          )}
        </div>
      )}
      {activeTab === 'privacy' && (
        <PrivacyPolicy 
          onBack={() => setActiveTab('profile')} 
          onDeleteAccount={handleDeleteAccount} 
        />
      )}
      {activeTab === 'setup' && (
        <div className="space-y-6 animate-fadeIn pb-20">
          <div className="bg-white p-8 rounded-[40px] border-2 border-gray-50 shadow-sm space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <Download className="text-blue-600" size={24} />
              <h2 className="text-2xl font-black text-gray-800">Local Setup Guide</h2>
            </div>
            
            <p className="text-sm text-gray-600 leading-relaxed">
              Follow these steps to run RuralHealth Connect directly on your computer.
            </p>

            <div className="space-y-6">
              <div className="space-y-2">
                <h4 className="font-black text-sm text-gray-800 uppercase tracking-widest">1. Download Code</h4>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Click the ⚙️ <strong>Settings</strong> icon in the top-right of AI Studio, select <strong>Export</strong>, and choose <strong>Download as ZIP</strong>.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-black text-sm text-gray-800 uppercase tracking-widest">2. Install Node.js</h4>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Download and install Node.js from <a href="https://nodejs.org" target="_blank" className="text-blue-600 underline">nodejs.org</a>.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-black text-sm text-gray-800 uppercase tracking-widest">3. Run Commands</h4>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-2xl font-mono text-[10px] space-y-1">
                  <p>npm install</p>
                  <p>npm run dev</p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-black text-sm text-gray-800 uppercase tracking-widest">4. Set API Key</h4>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Create a <code>.env</code> file in the project folder and add your key:
                </p>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-2xl font-mono text-[10px]">
                  <p>GEMINI_API_KEY=your_key_here</p>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setActiveTab('profile')}
              className="w-full py-5 bg-gray-100 text-gray-600 rounded-[32px] font-black text-xs uppercase tracking-widest"
            >
              Back to Profile
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
};

const QuickAction: React.FC<{ icon: React.ReactNode; label: string; bg: string; color: string; onClick: () => void }> = ({ icon, label, bg, color, onClick }) => (
  <button onClick={onClick} className={`${bg} p-8 rounded-[40px] flex flex-col items-center shadow-sm active:scale-95 transition-all`}>
    <div className="mb-3">{icon}</div>
    <span className={`font-black uppercase text-[9px] tracking-widest ${color}`}>{label}</span>
  </button>
);

const InfoRow: React.FC<{ icon?: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
  <div className="flex items-center gap-4">
    {icon && <div className="text-red-600 opacity-40">{icon}</div>}
    <div className="flex flex-col">
      <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest mb-1">{label}</span>
      <span className="text-sm font-bold text-gray-700">{value}</span>
    </div>
  </div>
);

const EditInput: React.FC<{ label: string; value: string | undefined; onChange: (v: string) => void; placeholder?: string }> = ({ label, value, onChange, placeholder }) => (
  <div className="space-y-1">
    <label className="text-[8px] font-black text-red-600 uppercase tracking-widest ml-1">{label}</label>
    <input type="text" value={value || ''} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full p-4 bg-gray-50 rounded-2xl border-none outline-none text-sm font-medium" />
  </div>
);

const MedicalMetric: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
  <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
    <div className="mb-2 text-red-600">{icon}</div>
    <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">{label}</span>
    <span className="text-sm font-black text-gray-800 mt-1">{value}</span>
  </div>
);

export default App;
