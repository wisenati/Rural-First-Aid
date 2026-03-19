
import React, { useState } from 'react';
import { User, Stethoscope, Building2, Heart, Mail, Lock, Phone, MapPin, ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { UserRole, UserProfile, Language } from '../types';

interface AuthScreenProps {
  onLogin: (user: UserProfile) => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [role, setRole] = useState<UserRole>(UserRole.PATIENT);
  const [step, setStep] = useState(1);
  const [signInData, setSignInData] = useState({ email: '', password: '' });
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    age: 25,
    gender: 'Male',
    genotype: 'AA',
    bloodGroup: 'O+',
    address: '',
    preferredLanguage: Language.ENGLISH,
    showInHelp: false,
    firmType: 'Clinic',
    sosContacts: [], // Initialized as empty array
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as any;
    const val = type === 'radio' ? (value === 'true') : value;
    setFormData(prev => ({ ...prev, [name]: val }));
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
      if (!formData.email || !formData.password) {
        alert("Please provide an email and a secure password.");
        return;
      }
      const newUser = {
        ...formData,
        sosContacts: formData.sosContacts || [],
        id: Math.random().toString(36).substr(2, 9),
        role,
        fullName: role === UserRole.ORGANIZATION ? formData.organizationName : formData.fullName
      } as UserProfile;
      
      localStorage.setItem(`user_${formData.email}`, JSON.stringify(newUser));
      
      const allUsers = JSON.parse(localStorage.getItem('all_registered_users') || '[]');
      allUsers.push(newUser);
      localStorage.setItem('all_registered_users', JSON.stringify(allUsers));
      
      onLogin(newUser);
    } else {
      const savedUserString = localStorage.getItem(`user_${signInData.email}`);
      if (savedUserString) {
        const savedUser = JSON.parse(savedUserString) as UserProfile;
        if (savedUser.password === signInData.password) {
          // Ensure legacy users without the array don't crash the app
          if (!savedUser.sosContacts) savedUser.sosContacts = [];
          onLogin(savedUser);
        } else {
          alert("Incorrect password.");
        }
      } else {
        alert("Account not found. Please sign up first.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-red-600 flex flex-col items-center justify-center p-6 text-white max-w-md mx-auto relative overflow-hidden">
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-red-500 rounded-full opacity-50 blur-3xl"></div>
      <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white rounded-full opacity-10 blur-3xl"></div>

      <div className="w-full relative z-10 text-center mb-8">
        <div className="w-20 h-20 bg-white rounded-full mx-auto flex items-center justify-center mb-4 shadow-2xl animate-pulse">
          <Heart className="text-red-600" size={40} fill="currentColor" />
        </div>
        <h1 className="text-3xl font-black tracking-tight mb-2">RuralHealth</h1>
        <p className="opacity-80 font-medium text-sm">Safe & Smart Help for Communities</p>
      </div>

      <div className="w-full bg-white text-gray-900 rounded-[40px] p-8 shadow-2xl relative z-10 animate-slideUp">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          {isSignUp ? `Join Community` : 'Welcome Back'}
        </h2>

        {!isSignUp ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Email Address" name="email" type="email" value={signInData.email} onChange={handleSignInChange} placeholder="your@email.com" required />
            <Input label="Password" name="password" type="password" value={signInData.password} onChange={handleSignInChange} placeholder="••••" required />
            <button type="submit" className="w-full py-4 bg-red-600 text-white rounded-2xl font-bold shadow-lg hover:bg-red-700 active:scale-95 transition-all mt-4">
              SIGN IN
            </button>
            <p className="text-center text-sm text-gray-500 mt-4">
              Don't have an account? <button type="button" onClick={() => setIsSignUp(true)} className="text-red-600 font-bold">Sign Up</button>
            </p>
          </form>
        ) : (
          <div className="space-y-4">
            {step === 1 && (
              <div className="space-y-4">
                <p className="text-gray-500 text-center text-xs font-bold uppercase tracking-widest mb-2">Select Account Type</p>
                <div className="grid grid-cols-3 gap-2">
                  <RoleButton active={role === UserRole.PATIENT} onClick={() => setRole(UserRole.PATIENT)} icon={<User size={24} />} label="Patient" />
                  <RoleButton active={role === UserRole.CAREGIVER} onClick={() => setRole(UserRole.CAREGIVER)} icon={<Stethoscope size={24} />} label="Provider" />
                  <RoleButton active={role === UserRole.ORGANIZATION} onClick={() => setRole(UserRole.ORGANIZATION)} icon={<Building2 size={24} />} label="Org" />
                </div>
                
                <div className="space-y-3 mt-4">
                  {role === UserRole.ORGANIZATION ? (
                    <Input label="Organization Name" name="organizationName" value={formData.organizationName} onChange={handleInputChange} placeholder="Name of Hospital/Clinic" required />
                  ) : (
                    <Input label="Full Name" name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="Your Legal Name" required />
                  )}
                  <Input label="Email Address" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="email@provider.com" required />
                  <Input label="Secure Password" name="password" type="password" value={formData.password} onChange={handleInputChange} placeholder="Create a password" required />
                </div>
                <button onClick={handleNext} className="w-full py-4 bg-red-600 text-white rounded-2xl font-bold shadow-md">CONTINUE</button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                {role === UserRole.ORGANIZATION ? (
                  <>
                    <Select label="Firm Type" name="firmType" value={formData.firmType} onChange={handleInputChange} options={['Clinic', 'Hospital', 'Pharmacy', 'Others']} />
                    {formData.firmType === 'Others' && (
                      <Input label="Specify Type" name="otherFirmType" value={formData.otherFirmType} onChange={handleInputChange} placeholder="e.g. Wellness Center" />
                    )}
                  </>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <Input label="Age" name="age" type="number" value={formData.age?.toString()} onChange={handleInputChange} />
                    <Select label="Gender" name="gender" value={formData.gender} onChange={handleInputChange} options={['Male', 'Female', 'Other']} />
                  </div>
                )}
                
                <Input label="Phone Number" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+234..." required />
                <Input label="Address" name="address" value={formData.address} onChange={handleInputChange} placeholder="Physical Location" required />
                
                <div className="flex gap-4 mt-6">
                  <button onClick={handleBack} className="flex-1 py-4 bg-gray-100 text-gray-500 rounded-2xl font-bold">BACK</button>
                  <button onClick={handleNext} className="flex-1 py-4 bg-red-600 text-white rounded-2xl font-bold shadow-lg">NEXT</button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-5">
                {role !== UserRole.ORGANIZATION && (
                  <div className="grid grid-cols-2 gap-3">
                    <Select label="Genotype" name="genotype" value={formData.genotype} onChange={handleInputChange} options={['AA', 'AS', 'SS', 'AC']} />
                    <Select label="Blood Group" name="bloodGroup" value={formData.bloodGroup} onChange={handleInputChange} options={['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']} />
                  </div>
                )}

                {(role === UserRole.ORGANIZATION || role === UserRole.CAREGIVER) && (
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-3">Community Visibility</p>
                    <div className="space-y-3">
                      <p className="text-xs text-gray-600 leading-tight">Appear in the Help section for nearby patients?</p>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="showInHelp" value="true" checked={formData.showInHelp === true} onChange={handleInputChange} className="accent-red-600" />
                          <span className="text-sm font-bold">Yes</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="showInHelp" value="false" checked={formData.showInHelp === false} onChange={handleInputChange} className="accent-red-600" />
                          <span className="text-sm font-bold">No</span>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                <Select label="Language" name="preferredLanguage" value={formData.preferredLanguage} onChange={handleInputChange} options={Object.values(Language)} />
                
                <div className="flex gap-4 mt-6">
                  <button onClick={handleBack} className="flex-1 py-4 bg-gray-100 text-gray-500 rounded-2xl font-bold">BACK</button>
                  <button onClick={handleSubmit} className="flex-1 py-4 bg-red-600 text-white rounded-2xl font-bold shadow-lg uppercase tracking-wider">Finish</button>
                </div>
              </div>
            )}
            
            <p className="text-center text-sm text-gray-500 mt-6">
              Already have an account? <button type="button" onClick={() => setIsSignUp(false)} className="text-red-600 font-bold">Log In</button>
            </p>
          </div>
        )}
      </div>
      <p className="mt-8 text-[10px] opacity-60 font-medium uppercase tracking-[3px]">RuralHealth Connect</p>
    </div>
  );
};

const Input: React.FC<any> = ({ label, ...props }) => (
  <div className="space-y-1">
    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1 tracking-widest">{label}</label>
    <input {...props} className="w-full p-3 rounded-xl border border-gray-200 focus:border-red-600 outline-none text-sm transition-all shadow-sm" />
  </div>
);

const Select: React.FC<any> = ({ label, options, ...props }) => (
  <div className="space-y-1">
    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1 tracking-widest">{label}</label>
    <select {...props} className="w-full p-3 rounded-xl border border-gray-200 focus:border-red-600 outline-none text-sm bg-white shadow-sm">
      {options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
    </select>
  </div>
);

const RoleButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`p-3 rounded-2xl border-2 flex flex-col items-center gap-1 transition-all duration-300 ${active ? 'border-red-600 bg-red-50 text-red-600' : 'border-gray-50 bg-gray-50 text-gray-400 opacity-60'}`}>
    {icon}
    <span className="font-bold uppercase text-[8px]">{label}</span>
  </button>
);

export default AuthScreen;
