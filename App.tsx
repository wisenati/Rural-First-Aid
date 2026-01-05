
import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, UserRole, Language, EmergencyGuide, InteractiveStep } from './types';
import { EMERGENCY_GUIDES, HEALTH_DIRECTORY, MOCK_BROADCASTS } from './constants';
import Layout from './components/Layout';
import SOSButton from './components/SOSButton';
import AuthScreen from './views/AuthScreen';
import { GeminiService } from './services/geminiService';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState('home');
  const [selectedGuide, setSelectedGuide] = useState<EmergencyGuide | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [symptomText, setSymptomText] = useState('');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [checkerResult, setCheckerResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('user_profile');
    if (saved) setCurrentUser(JSON.parse(saved));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user_profile');
    setCurrentUser(null);
  };

  const startVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in your browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = currentUser?.preferredLanguage || 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setSymptomText(prev => prev + (prev ? ' ' : '') + transcript);
    };

    recognition.start();
  };

  const openCamera = async () => {
    setShowCamera(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      alert("Could not access camera.");
      setShowCamera(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      context?.drawImage(videoRef.current, 0, 0);
      const dataUrl = canvasRef.current.toDataURL('image/jpeg');
      setCapturedImage(dataUrl);
      closeCamera();
    }
  };

  const closeCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
    }
    setShowCamera(false);
  };

  const checkSymptoms = async () => {
    if (!symptomText && !capturedImage) return;
    setLoading(true);
    try {
      const result = await GeminiService.checkSymptoms(symptomText || "Analyzing image provided.", capturedImage || undefined);
      setCheckerResult(result);
    } catch (e) {
      alert("Error analyzing input. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const speakGuide = (guide: EmergencyGuide, step?: InteractiveStep) => {
    const text = step ? step.text : `${guide.title}. Instructions follow.`;
    GeminiService.speakText(text);
  };

  const handleNextStep = () => {
    if (selectedGuide && currentStepIndex < selectedGuide.steps.length - 1) {
      setShowFeedback(true);
      setTimeout(() => {
        setCurrentStepIndex(currentStepIndex + 1);
        setShowFeedback(false);
        speakGuide(selectedGuide, selectedGuide.steps[currentStepIndex + 1]);
      }, 1500);
    } else {
      setCurrentStepIndex(selectedGuide?.steps.length || 0);
    }
  };

  if (!currentUser) {
    return <AuthScreen onLogin={(user) => {
      setCurrentUser(user);
      localStorage.setItem('user_profile', JSON.stringify(user));
    }} />;
  }

  return (
    <Layout 
      title={activeTab === 'guides' && selectedGuide ? selectedGuide.title : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} 
      activeTab={activeTab} 
      setActiveTab={(tab) => {
        setActiveTab(tab);
        setSelectedGuide(null);
        setCurrentStepIndex(0);
      }}
      onBack={selectedGuide ? () => {
        if (currentStepIndex > 0) {
          setCurrentStepIndex(currentStepIndex - 1);
        } else {
          setSelectedGuide(null);
        }
      } : undefined}
    >
      {/* Home View */}
      {activeTab === 'home' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Hello, {currentUser.fullName.split(' ')[0]} 👋</h2>
              <p className="text-gray-500">How can we help today?</p>
            </div>
            <button onClick={() => setActiveTab('profile')} className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600 text-xl font-bold">
              {currentUser.fullName.charAt(0)}
            </button>
          </div>

          <SOSButton />

          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => setActiveTab('guides')} className="bg-blue-50 p-6 rounded-3xl border border-blue-100 flex flex-col items-center hover:shadow-md transition-all">
              <span className="text-3xl mb-2">🩹</span>
              <span className="font-bold text-blue-900">First Aid</span>
            </button>
            <button onClick={() => setActiveTab('directory')} className="bg-green-50 p-6 rounded-3xl border border-green-100 flex flex-col items-center hover:shadow-md transition-all">
              <span className="text-3xl mb-2">🏥</span>
              <span className="font-bold text-green-900">Find Clinic</span>
            </button>
          </div>

          <section>
            <h3 className="font-bold text-lg mb-3 flex items-center">
              <span className="mr-2">📢</span> Community Alerts
            </h3>
            <div className="space-y-3">
              {MOCK_BROADCASTS.map(alert => (
                <div key={alert.id} className={`p-4 rounded-2xl border ${alert.priority === 'high' ? 'bg-orange-50 border-orange-200' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-bold text-sm uppercase text-gray-700">{alert.title}</h4>
                    <span className="text-[10px] text-gray-400">{alert.date}</span>
                  </div>
                  <p className="text-gray-600 text-sm">{alert.content}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* First Aid Guides View */}
      {activeTab === 'guides' && (
        <div className="animate-fadeIn">
          {!selectedGuide ? (
            <div className="grid grid-cols-2 gap-4">
              {EMERGENCY_GUIDES.map(guide => (
                <button 
                  key={guide.id}
                  onClick={() => {
                    setSelectedGuide(guide);
                    setCurrentStepIndex(0);
                    speakGuide(guide, guide.steps[0]);
                  }}
                  className="bg-white p-6 rounded-3xl border-2 border-gray-100 shadow-sm flex flex-col items-center hover:border-red-200 transition-all active:scale-95"
                >
                  <span className="text-4xl mb-3">{guide.icon}</span>
                  <span className="font-bold text-gray-800 text-center">{guide.title}</span>
                </button>
              ))}
            </div>
          ) : currentStepIndex < selectedGuide.steps.length ? (
            <div className="space-y-6">
              <div className="relative overflow-hidden rounded-3xl">
                <img src={selectedGuide.image} className="w-full h-48 object-cover shadow-md" alt={selectedGuide.title} />
                <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase">
                  Step {currentStepIndex + 1} of {selectedGuide.steps.length}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 leading-tight">
                  {selectedGuide.steps[currentStepIndex].text}
                </h2>
                <button 
                  onClick={() => speakGuide(selectedGuide, selectedGuide.steps[currentStepIndex])}
                  className="p-3 bg-red-100 text-red-600 rounded-full hover:bg-red-200"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.983 5.983 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.983 3.983 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>

              {showFeedback ? (
                <div className="bg-green-50 p-6 rounded-2xl border-2 border-green-200 text-center animate-bounce">
                  <span className="text-3xl mb-2 block">✅</span>
                  <p className="text-green-800 font-bold">{selectedGuide.steps[currentStepIndex].feedback}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedGuide.steps[currentStepIndex].critical && (
                    <div className="bg-red-50 p-4 rounded-2xl border border-red-200 flex gap-3 items-center">
                      <span className="text-xl">⚠️</span>
                      <p className="text-red-700 text-sm font-bold">CRITICAL STEP: Follow instructions carefully.</p>
                    </div>
                  )}
                  
                  <button 
                    onClick={handleNextStep}
                    className="w-full py-6 bg-red-600 text-white rounded-3xl font-black text-xl shadow-xl active:scale-95 transition-all uppercase tracking-widest"
                  >
                    I Have Done This
                  </button>
                  <button 
                    onClick={() => setActiveTab('directory')}
                    className="w-full py-4 bg-gray-100 text-gray-600 rounded-3xl font-bold flex items-center justify-center gap-2"
                  >
                    <span>📍</span> Find Nearby Hospital
                  </button>
                </div>
              )}
              
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-red-600 h-full transition-all duration-500" 
                  style={{ width: `${((currentStepIndex + 1) / selectedGuide.steps.length) * 100}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-6 animate-slideUp">
              <div className="bg-blue-50 p-8 rounded-[40px] text-center border-2 border-blue-100">
                <span className="text-6xl mb-6 block">🏁</span>
                <h2 className="text-3xl font-black text-blue-900 mb-4 uppercase">Steps Completed!</h2>
                <p className="text-blue-800 font-medium mb-8 leading-relaxed">
                  {selectedGuide.furtherHelp}
                </p>
                
                <div className="bg-white p-6 rounded-3xl text-left border border-blue-200 mb-8">
                  <h4 className="font-bold text-red-600 text-sm uppercase mb-2">When to use SOS:</h4>
                  <p className="text-gray-600 text-sm italic">{selectedGuide.whenToCallSOS}</p>
                </div>

                <div className="flex flex-col gap-3">
                  <button 
                    onClick={() => {
                      setSelectedGuide(null);
                      setCurrentStepIndex(0);
                    }} 
                    className="w-full py-4 bg-blue-900 text-white rounded-2xl font-bold uppercase"
                  >
                    Back to Guides
                  </button>
                  <button 
                    onClick={() => setActiveTab('home')} 
                    className="w-full py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold uppercase"
                  >
                    Return Home
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Symptom Checker */}
      {activeTab === 'checker' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-purple-50 p-6 rounded-3xl border border-purple-100 relative overflow-hidden">
            <h3 className="text-xl font-bold text-purple-900 mb-2">Smart Assistant</h3>
            <p className="text-purple-700 text-sm mb-4 italic opacity-80">Use voice or camera for faster help</p>
            
            <div className="relative group">
              <textarea 
                value={symptomText}
                onChange={(e) => setSymptomText(e.target.value)}
                placeholder="Describe how you feel..."
                className="w-full h-32 p-4 pr-12 rounded-2xl border-2 border-purple-200 focus:border-purple-500 outline-none transition-all resize-none mb-4 shadow-inner"
              />
              <button 
                onClick={startVoiceInput}
                className={`absolute right-3 top-3 p-2 rounded-full transition-all ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-purple-100 text-purple-600 hover:bg-purple-200'}`}
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"/></svg>
              </button>
            </div>
            
            <div className="flex gap-4 mb-4">
              <button 
                onClick={openCamera}
                className="flex-1 py-3 bg-white border-2 border-purple-200 rounded-2xl flex items-center justify-center gap-2 font-bold text-purple-700 hover:bg-purple-100 transition-all"
              >
                <span>📷</span> Capture Incident
              </button>
            </div>

            {capturedImage && (
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-4 border-2 border-purple-300 shadow-md">
                <img src={capturedImage} className="w-full h-full object-cover" />
                <button 
                  onClick={() => setCapturedImage(null)}
                  className="absolute top-2 right-2 bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg"
                >
                  ✕
                </button>
              </div>
            )}
            
            <button 
              onClick={checkSymptoms}
              disabled={loading || (!symptomText && !capturedImage)}
              className={`w-full py-4 rounded-2xl font-bold text-white shadow-lg transition-all ${loading ? 'bg-purple-300' : 'bg-purple-600 hover:bg-purple-700 active:scale-95'}`}
            >
              {loading ? 'Analyzing Input...' : 'Analyze Now'}
            </button>
          </div>

          {checkerResult && (
            <div className="bg-white p-6 rounded-3xl border shadow-xl animate-slideUp">
              <div className="flex items-center justify-between mb-4">
                <span className={`px-4 py-1 rounded-full text-xs font-bold uppercase ${
                  checkerResult.severity === 'High' ? 'bg-red-100 text-red-600' : 
                  checkerResult.severity === 'Medium' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'
                }`}>
                  Severity: {checkerResult.severity}
                </span>
                <button onClick={() => setCheckerResult(null)} className="text-gray-400">✕</button>
              </div>
              <h4 className="font-bold text-lg mb-2">AI Advice:</h4>
              <p className="text-gray-600 mb-4 italic leading-relaxed">"{checkerResult.advice}"</p>
              <h4 className="font-bold text-lg mb-2">First Aid Steps:</h4>
              <ul className="space-y-3">
                {checkerResult.steps.map((s: string, i: number) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                    <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">{i+1}</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 p-4 bg-red-50 text-red-700 text-[10px] rounded-xl border border-red-100 font-medium">
                ⚠️ THIS IS AN AI ESTIMATE. Always seek professional help for serious injuries.
              </div>
            </div>
          )}

          {showCamera && (
            <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-4">
              <div className="relative w-full max-w-md bg-gray-900 rounded-3xl overflow-hidden shadow-2xl">
                <video ref={videoRef} autoPlay playsInline className="w-full h-[70vh] object-cover" />
                <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center gap-12">
                  <button onClick={closeCamera} className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full text-white flex items-center justify-center text-xl">✕</button>
                  <button onClick={capturePhoto} className="w-20 h-20 bg-white rounded-full border-4 border-gray-300 shadow-xl active:scale-90 transition-transform"></button>
                  <div className="w-14 h-14"></div>
                </div>
              </div>
              <canvas ref={canvasRef} className="hidden" />
              <p className="text-white mt-6 text-sm font-bold opacity-75">Point camera at the injury/incident</p>
            </div>
          )}
        </div>
      )}

      {/* Directory */}
      {activeTab === 'directory' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {['All', 'Clinic', 'Hospital', 'Volunteer'].map(cat => (
              <button key={cat} className="px-4 py-2 bg-gray-100 rounded-full text-sm font-bold whitespace-nowrap text-gray-600 active:bg-red-600 active:text-white">
                {cat}
              </button>
            ))}
          </div>

          {HEALTH_DIRECTORY.map((place, i) => (
            <div key={i} className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex items-start gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 ${
                place.type === 'Hospital' ? 'bg-red-50 text-red-600' : 
                place.type === 'Clinic' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'
              }`}>
                {place.type === 'Hospital' ? '🏥' : place.type === 'Clinic' ? '🩺' : '🤝'}
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-800">{place.name}</h4>
                <p className="text-xs text-gray-500 mb-2">{place.address} • {place.distance}</p>
                <div className="flex gap-2">
                  <a href={`tel:${place.phone}`} className="px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-lg flex items-center gap-1 shadow-md active:scale-95 transition-all">
                    <span>📞</span> Call
                  </a>
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 text-xs font-bold rounded-lg active:scale-95 transition-all">
                    📍 Directions
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Profile */}
      {activeTab === 'profile' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="text-center p-8 bg-gray-50 rounded-3xl border border-gray-100">
            <div className="w-24 h-24 bg-red-600 text-white text-4xl font-black flex items-center justify-center rounded-full mx-auto mb-4 border-4 border-white shadow-xl">
              {currentUser.fullName.charAt(0)}
            </div>
            <h2 className="text-2xl font-bold">{currentUser.fullName}</h2>
            <p className="text-red-600 font-bold uppercase tracking-wider text-xs">{currentUser.role}</p>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-gray-500 text-xs uppercase px-2 tracking-widest">Medical Details</h3>
            <div className="grid grid-cols-2 gap-3">
              <ProfileItem label="Blood" value={currentUser.bloodGroup} />
              <ProfileItem label="Genotype" value={currentUser.genotype} />
              <ProfileItem label="Age" value={currentUser.age.toString()} />
              <ProfileItem label="Gender" value={currentUser.gender} />
            </div>

            <div className="bg-white p-5 rounded-3xl border border-gray-100 space-y-4 shadow-sm">
              <ProfileSection icon="🏠" label="Address" value={currentUser.address} />
              <ProfileSection icon="⚠️" label="Health Challenges" value={currentUser.healthChallenges || 'None'} />
              <ProfileSection icon="📞" label="Emergency Contact" value={currentUser.emergencyContact} />
              {currentUser.role === UserRole.CAREGIVER && (
                <>
                  <ProfileSection icon="🎓" label="Specialty" value={currentUser.medicalSpecialty || 'General'} />
                  <ProfileSection icon="🤝" label="Communication" value={currentUser.patientInteractionMethod || 'Voice call'} />
                </>
              )}
            </div>
          </div>

          <button onClick={handleLogout} className="w-full py-4 bg-gray-100 text-gray-500 rounded-2xl font-bold mt-8 border-2 border-transparent hover:border-gray-200 transition-all">
            Sign Out
          </button>
        </div>
      )}
    </Layout>
  );
};

const ProfileItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="bg-white p-4 rounded-2xl border border-gray-100 text-center shadow-sm">
    <p className="text-[10px] text-gray-400 font-bold uppercase">{label}</p>
    <p className="text-lg font-bold text-gray-800">{value}</p>
  </div>
);

const ProfileSection: React.FC<{ icon: string; label: string; value: string }> = ({ icon, label, value }) => (
  <div className="flex items-start gap-4">
    <span className="text-xl mt-1">{icon}</span>
    <div>
      <p className="text-[10px] text-gray-400 font-bold uppercase">{label}</p>
      <p className="text-sm font-semibold text-gray-700">{value}</p>
    </div>
  </div>
);

export default App;
