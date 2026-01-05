
import React, { useState } from 'react';
import { UserRole, UserProfile, Language } from '../types';

interface AuthScreenProps {
  onLogin: (user: UserProfile) => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [role, setRole] = useState<UserRole>(UserRole.PATIENT);
  const [step, setStep] = useState(1);
  const [signInData, setSignInData] = useState({ fullName: '', password: '' });
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    fullName: '',
    password: '',
    age: 25,
    gender: 'Male',
    genotype: 'AA',
    bloodGroup: 'O+',
    height: '',
    weight: '',
    address: '',
    preferredLanguage: Language.ENGLISH,
    healthChallenges: '',
    emergencyContact: '',
    medicalSpecialty: '',
    patientInteractionMethod: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSignInChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignInData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignUp) {
      if (!formData.fullName || !formData.password) {
        alert("Please provide your name and a secure password.");
        return;
      }
      const newUser = {
        ...formData,
        id: Math.random().toString(36).substr(2, 9),
        role,
      } as UserProfile;
      
      // Save for "authentication" simulation
      localStorage.setItem(`user_${formData.fullName}`, JSON.stringify(newUser));
      onLogin(newUser);
    } else {
      // Check localStorage for simulated login
      const savedUserString = localStorage.getItem(`user_${signInData.fullName}`);
      if (savedUserString) {
        const savedUser = JSON.parse(savedUserString) as UserProfile;
        if (savedUser.password === signInData.password) {
          onLogin(savedUser);
        } else {
          alert("Incorrect password. Please try again.");
        }
      } else {
        // Fallback for first-time or dummy login
        if (signInData.fullName === 'John Doe' && signInData.password === '1234') {
          onLogin({
            id: '1',
            role: UserRole.PATIENT,
            fullName: 'John Doe',
            age: 30,
            gender: 'Male',
            genotype: 'AA',
            bloodGroup: 'O+',
            height: '175cm',
            weight: '70kg',
            address: '123 Village Path, Rural State',
            preferredLanguage: Language.ENGLISH,
            healthChallenges: 'None',
            emergencyContact: '+234 800 000 0000',
          } as UserProfile);
        } else {
          alert("Account not found. Please sign up first.");
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-red-600 flex flex-col items-center justify-center p-6 text-white max-w-md mx-auto relative overflow-hidden">
      {/* Visual background elements */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-red-500 rounded-full opacity-50 blur-3xl"></div>
      <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white rounded-full opacity-10 blur-3xl"></div>

      <div className="w-full relative z-10 text-center mb-8">
        <div className="w-24 h-24 bg-white rounded-full mx-auto flex items-center justify-center mb-4 shadow-2xl animate-pulse">
          <span className="text-4xl">❤️</span>
        </div>
        <h1 className="text-3xl font-black tracking-tight mb-2">RuralHealth</h1>
        <p className="opacity-80 font-medium">Safe & Smart Help for Communities</p>
      </div>

      <div className="w-full bg-white text-gray-900 rounded-3xl p-8 shadow-2xl relative z-10 animate-slideUp">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {isSignUp ? `Join as ${role === UserRole.PATIENT ? 'Patient' : 'Caregiver'}` : 'Welcome Back'}
        </h2>

        {!isSignUp ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input 
              label="Full Name" 
              name="fullName" 
              value={signInData.fullName} 
              onChange={handleSignInChange} 
              placeholder="Enter your name" 
              required 
            />
            <Input 
              label="Pin/Password" 
              name="password" 
              type="password" 
              value={signInData.password} 
              onChange={handleSignInChange} 
              placeholder="••••" 
              required 
            />
            <button type="submit" className="w-full py-4 bg-red-600 text-white rounded-2xl font-bold shadow-lg hover:bg-red-700 active:scale-95 transition-all mt-4">
              SIGN IN
            </button>
            <p className="text-center text-sm text-gray-500 mt-4">
              Don't have an account?{' '}
              <button type="button" onClick={() => setIsSignUp(true)} className="text-red-600 font-bold">Sign Up</button>
            </p>
          </form>
        ) : (
          <div className="space-y-4">
            {step === 1 && (
              <div className="space-y-6">
                <p className="text-gray-500 text-center font-medium">Choose your role to continue</p>
                <div className="grid grid-cols-2 gap-4">
                  <RoleButton 
                    active={role === UserRole.PATIENT} 
                    onClick={() => setRole(UserRole.PATIENT)}
                    icon="👤"
                    label="Patient"
                  />
                  <RoleButton 
                    active={role === UserRole.CAREGIVER} 
                    onClick={() => setRole(UserRole.CAREGIVER)}
                    icon="🩺"
                    label="Caregiver"
                  />
                </div>
                <div className="space-y-4 mt-6">
                  <Input label="Full Name" name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="Full Name" required />
                  <Input label="Secure Password" name="password" type="password" value={formData.password} onChange={handleInputChange} placeholder="Create a password" required />
                  <Input label="Address" name="address" value={formData.address} onChange={handleInputChange} placeholder="House Address" />
                </div>
                <button onClick={handleNext} className="w-full py-4 bg-red-600 text-white rounded-2xl font-bold">NEXT</button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <Input label="Age" name="age" type="number" value={formData.age?.toString()} onChange={handleInputChange} />
                  <Select label="Gender" name="gender" value={formData.gender} onChange={handleInputChange} options={['Male', 'Female', 'Other']} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Select label="Genotype" name="genotype" value={formData.genotype} onChange={handleInputChange} options={['AA', 'AS', 'SS', 'AC']} />
                  <Select label="Blood Group" name="bloodGroup" value={formData.bloodGroup} onChange={handleInputChange} options={['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Input label="Height" name="height" value={formData.height} onChange={handleInputChange} placeholder="e.g. 1.7m" />
                  <Input label="Weight" name="weight" value={formData.weight} onChange={handleInputChange} placeholder="e.g. 65kg" />
                </div>
                <div className="flex gap-4 mt-6">
                  <button onClick={handleBack} className="flex-1 py-4 bg-gray-100 text-gray-500 rounded-2xl font-bold">BACK</button>
                  <button onClick={handleNext} className="flex-1 py-4 bg-red-600 text-white rounded-2xl font-bold shadow-lg">NEXT</button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <Select label="Language" name="preferredLanguage" value={formData.preferredLanguage} onChange={handleInputChange} options={Object.values(Language)} />
                <Input label="Health Challenges" name="healthChallenges" value={formData.healthChallenges} onChange={handleInputChange} placeholder="Any medical conditions?" />
                <Input label="Emergency Contact" name="emergencyContact" value={formData.emergencyContact} onChange={handleInputChange} placeholder="Phone Number" />
                
                {role === UserRole.CAREGIVER && (
                  <>
                    <Input label="Medical Specialty" name="medicalSpecialty" value={formData.medicalSpecialty} onChange={handleInputChange} placeholder="e.g. First Aider, Nurse" />
                    <Input label="Contact Method" name="patientInteractionMethod" value={formData.patientInteractionMethod} onChange={handleInputChange} placeholder="How can patients reach you?" />
                  </>
                )}
                
                <div className="flex gap-4 mt-6">
                  <button onClick={handleBack} className="flex-1 py-4 bg-gray-100 text-gray-500 rounded-2xl font-bold">BACK</button>
                  <button onClick={handleSubmit} className="flex-1 py-4 bg-red-600 text-white rounded-2xl font-bold shadow-lg uppercase tracking-wider">Finish</button>
                </div>
              </div>
            )}
            
            <p className="text-center text-sm text-gray-500 mt-6">
              Already have an account?{' '}
              <button type="button" onClick={() => setIsSignUp(false)} className="text-red-600 font-bold">Log In</button>
            </p>
          </div>
        )}
      </div>
      
      <p className="mt-8 text-xs opacity-60 font-medium">Designed for Rural Communities © 2024</p>
    </div>
  );
};

const Input: React.FC<any> = ({ label, ...props }) => (
  <div className="space-y-1">
    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1 tracking-widest">{label}</label>
    <input 
      {...props} 
      className="w-full p-3 rounded-xl border border-gray-200 focus:border-red-600 outline-none text-sm transition-all"
    />
  </div>
);

const Select: React.FC<any> = ({ label, options, ...props }) => (
  <div className="space-y-1">
    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1 tracking-widest">{label}</label>
    <select 
      {...props} 
      className="w-full p-3 rounded-xl border border-gray-200 focus:border-red-600 outline-none text-sm bg-white"
    >
      {options.map((opt: string) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  </div>
);

const RoleButton: React.FC<{ active: boolean; onClick: () => void; icon: string; label: string }> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`p-6 rounded-3xl border-2 flex flex-col items-center gap-2 transition-all duration-300 ${active ? 'border-red-600 bg-red-50 text-red-600' : 'border-gray-100 bg-gray-50 text-gray-400 opacity-60'}`}
  >
    <span className="text-4xl">{icon}</span>
    <span className="font-bold uppercase text-[10px]">{label}</span>
  </button>
);

export default AuthScreen;
