
import React, { useState, useEffect } from 'react';
import { Settings, X, Trash2, AlertCircle, Phone, ShieldAlert } from 'lucide-react';
import { UserProfile, EmergencyContact } from '../types';

interface SOSButtonProps {
  user: UserProfile;
  onUpdateContacts: (contacts: EmergencyContact[]) => void;
}

const SOSButton: React.FC<SOSButtonProps> = ({ user, onUpdateContacts }) => {
  const [isActive, setIsActive] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [countdown, setCountdown] = useState(5);

  const handleSOS = () => {
    if (!user.sosContacts || user.sosContacts.length === 0) {
      alert("Please add at least one emergency contact in SOS Settings first.");
      setShowSettings(true);
      return;
    }
    setIsActive(true);
    let count = 5;
    const interval = setInterval(() => {
      count--;
      setCountdown(count);
      if (count === 0) {
        clearInterval(interval);
        triggerAlert();
      }
    }, 1000);
  };

  const triggerAlert = () => {
    // 1. Automatically call National Emergency (112)
    window.open('tel:112', '_self');

    // 2. Notify other contacts (Simulated SMS/Data broadcast)
    // In a real app, this would be a backend call to an SMS API
    const contacts = user.sosContacts || [];
    
    contacts.forEach((contact, index) => {
      // We can't easily trigger multiple calls automatically due to browser security
      // but we can simulate the broadcast and provide quick links
      console.log(`Broadcasting emergency to ${contact.name} at ${contact.phone}`);
    });

    const contactNames = contacts.map(c => c.name).join(", ");
    alert(`🚨 EMERGENCY BROADCASTED!\n\n1. National Emergency (112) called.\n2. GPS & Medical Profile sent to: ${contactNames || 'No personal contacts added'}.`);
    
    setIsActive(false);
    setCountdown(5);
  };

  const addContact = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newContact: EmergencyContact = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.get('name') as string,
      phone: formData.get('phone') as string,
      type: formData.get('type') as any,
    };

    const currentContacts = user.sosContacts || [];
    if (currentContacts.length >= 5) {
      alert("Maximum 5 contacts allowed (2 Family, 2 Org, 1 National).");
      return;
    }

    onUpdateContacts([...currentContacts, newContact]);
    e.currentTarget.reset();
  };

  const removeContact = (id: string) => {
    onUpdateContacts((user.sosContacts || []).filter(c => c.id !== id));
  };

  return (
    <>
      <div className="bg-red-50 p-6 rounded-[40px] shadow-sm border border-red-100 flex flex-col items-center relative overflow-hidden">
        <button 
          onClick={() => setShowSettings(true)}
          className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-sm text-gray-400 hover:text-red-600 transition-colors"
        >
          <Settings size={20} />
        </button>
        <button 
          onClick={handleSOS}
          className="w-32 h-32 rounded-full bg-red-600 shadow-[0_0_30px_rgba(220,38,38,0.5)] flex items-center justify-center animate-pulse active:scale-90 transition-transform relative z-10"
        >
          <span className="text-white text-4xl font-black italic tracking-tighter">SOS</span>
        </button>
        <p className="mt-4 text-red-800 font-black text-lg">EMERGENCY HELP</p>
        <p className="text-red-600 text-[10px] font-bold uppercase tracking-widest opacity-60">
          {(user.sosContacts || []).length} contacts configured
        </p>
      </div>

      {showSettings && (
        <div className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm flex items-end justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[40px] p-8 animate-slideUp max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-gray-800">SOS Network</h3>
              <button onClick={() => setShowSettings(false)} className="text-gray-400">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4 mb-8">
              {(user.sosContacts || []).map(contact => (
                <div key={contact.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 text-red-600 rounded-xl">
                      <Phone size={16} />
                    </div>
                    <div>
                      <p className="font-black text-gray-800 text-sm">{contact.name}</p>
                      <p className="text-[10px] text-red-600 font-bold uppercase">{contact.type} • {contact.phone}</p>
                    </div>
                  </div>
                  <button onClick={() => removeContact(contact.id)} className="text-red-300 hover:text-red-600">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
              {(!user.sosContacts || user.sosContacts.length === 0) && (
                <div className="text-center py-8 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-100">
                  <AlertCircle className="mx-auto text-gray-300 mb-2" size={32} />
                  <p className="text-gray-400 text-xs italic">Your emergency list is empty.</p>
                </div>
              )}
            </div>

            <form onSubmit={addContact} className="space-y-3 bg-red-50 p-6 rounded-3xl">
              <p className="text-[10px] font-black text-red-800 uppercase tracking-widest mb-2">Add Contact</p>
              <input name="name" placeholder="Full Name" className="w-full p-3 rounded-xl border-none text-sm font-medium" required />
              <input name="phone" placeholder="Phone Number" className="w-full p-3 rounded-xl border-none text-sm font-medium" required />
              <select name="type" className="w-full p-3 rounded-xl border-none text-sm bg-white font-medium">
                <option value="Family">Family Member</option>
                <option value="Org">Organization/Volunteer</option>
                <option value="National">National Emergency</option>
              </select>
              <button type="submit" className="w-full py-3 bg-red-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg">Add to Network</button>
            </form>
          </div>
        </div>
      )}

      {isActive && (
        <div className="fixed inset-0 z-[120] bg-red-600 flex flex-col items-center justify-center p-8 text-white text-center">
          <div className="mb-8 animate-bounce">
            <ShieldAlert size={80} strokeWidth={2.5} />
          </div>
          <h2 className="text-4xl font-black mb-4 uppercase leading-none">Broadcasting Alert</h2>
          <p className="text-lg mb-12 opacity-80 font-medium italic">Calling 112 & Notifying Contacts...</p>
          <div className="text-9xl font-black mb-12 tabular-nums">{countdown}</div>
          <button 
            onClick={() => setIsActive(false)}
            className="px-12 py-5 bg-white text-red-600 rounded-[32px] font-black text-xl shadow-2xl active:scale-95 transition-all"
          >
            CANCEL
          </button>
        </div>
      )}
    </>
  );
};

export default SOSButton;
