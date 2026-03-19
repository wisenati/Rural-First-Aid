
import React from 'react';
import { Shield, Lock, Eye, Trash2, ChevronLeft } from 'lucide-react';

interface PrivacyPolicyProps {
  onBack: () => void;
  onDeleteAccount: () => void;
}

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onBack, onDeleteAccount }) => {
  return (
    <div className="space-y-6 animate-fadeIn pb-20">
      <div className="bg-white p-8 rounded-[40px] border-2 border-gray-50 shadow-sm space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="text-red-600" size={24} />
          <h2 className="text-2xl font-black text-gray-800">Privacy Policy</h2>
        </div>
        
        <p className="text-sm text-gray-600 leading-relaxed">
          At RuralHealth Connect, we prioritize your privacy and the security of your health data. This policy outlines how we handle your information.
        </p>

        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl h-fit">
              <Lock size={20} />
            </div>
            <div>
              <h4 className="font-black text-sm text-gray-800">Data Encryption</h4>
              <p className="text-[11px] text-gray-500 mt-1">All personal and medical data is stored locally on your device and encrypted during transmission to our AI services.</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="p-3 bg-green-50 text-green-600 rounded-2xl h-fit">
              <Eye size={20} />
            </div>
            <div>
              <h4 className="font-black text-sm text-gray-800">Transparency</h4>
              <p className="text-[11px] text-gray-500 mt-1">We only use your data to provide emergency assistance, symptom analysis, and local health connections. We never sell your data.</p>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <h4 className="font-black text-xs text-gray-400 uppercase tracking-widest mb-4">Terms of Service</h4>
          <div className="space-y-3">
            <p className="text-[11px] text-gray-600 leading-relaxed">
              1. <strong>Emergency Use:</strong> This app is a support tool. In life-threatening situations, always contact official emergency services (112) first.
            </p>
            <p className="text-[11px] text-gray-600 leading-relaxed">
              2. <strong>AI Advice:</strong> Symptom analysis is provided by AI and is for informational purposes only. It is not a medical diagnosis.
            </p>
            <p className="text-[11px] text-gray-600 leading-relaxed">
              3. <strong>Data Responsibility:</strong> You are responsible for the accuracy of the medical information you provide in your profile.
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <h4 className="font-black text-xs text-gray-400 uppercase tracking-widest mb-4">Your Rights</h4>
          <ul className="space-y-3">
            <li className="flex items-center gap-2 text-xs text-gray-700 font-medium">
              <span className="w-1.5 h-1.5 bg-red-600 rounded-full"></span>
              Right to access your data
            </li>
            <li className="flex items-center gap-2 text-xs text-gray-700 font-medium">
              <span className="w-1.5 h-1.5 bg-red-600 rounded-full"></span>
              Right to rectify information
            </li>
            <li className="flex items-center gap-2 text-xs text-gray-700 font-medium">
              <span className="w-1.5 h-1.5 bg-red-600 rounded-full"></span>
              Right to data portability
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-red-50 p-8 rounded-[40px] border border-red-100 space-y-4">
        <div className="flex items-center gap-3">
          <Trash2 className="text-red-600" size={20} />
          <h3 className="font-black text-gray-800">Danger Zone</h3>
        </div>
        <p className="text-xs text-red-700 font-medium">
          Deleting your account will permanently remove all your medical profile data, SOS contacts, and custom guides from this device.
        </p>
        <button 
          onClick={() => {
            if (window.confirm("Are you sure you want to permanently delete your account and all associated data? This action cannot be undone.")) {
              onDeleteAccount();
            }
          }}
          className="w-full py-4 bg-red-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg active:scale-95 transition-all"
        >
          Delete My Account & Data
        </button>
      </div>

      <button 
        onClick={onBack}
        className="w-full py-5 bg-gray-100 text-gray-600 rounded-[32px] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2"
      >
        <ChevronLeft size={16} />
        Back to Profile
      </button>
    </div>
  );
};

export default PrivacyPolicy;
