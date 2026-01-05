
import React, { useState } from 'react';

const SOSButton: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [countdown, setCountdown] = useState(5);

  const handleSOS = () => {
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
    // In a real app, this would use SMS/Network APIs
    alert("🚨 EMERGENCY ALERT SENT!\n\nLocation: Latitude: 6.5244, Longitude: 3.3792\nMedical Profile Shared with nearest responder.");
    setIsActive(false);
    setCountdown(5);
  };

  const cancelSOS = () => {
    setIsActive(false);
    setCountdown(5);
  };

  return (
    <>
      <div className="bg-red-50 p-6 rounded-3xl shadow-sm border border-red-100 flex flex-col items-center">
        <button 
          onClick={handleSOS}
          className="w-32 h-32 rounded-full bg-red-600 shadow-[0_0_30px_rgba(220,38,38,0.5)] flex items-center justify-center animate-pulse active:scale-90 transition-transform"
        >
          <span className="text-white text-4xl font-black">SOS</span>
        </button>
        <p className="mt-4 text-red-800 font-bold text-lg">Tap for Emergency</p>
        <p className="text-red-600 text-sm opacity-75">Notifies local responders & family</p>
      </div>

      {isActive && (
        <div className="fixed inset-0 z-[100] bg-red-600 flex flex-col items-center justify-center p-8 text-white text-center">
          <div className="text-6xl mb-8 animate-bounce">🚨</div>
          <h2 className="text-4xl font-black mb-4 uppercase">Sending Emergency Alert</h2>
          <p className="text-xl mb-12 opacity-90">An emergency alert will be sent in</p>
          <div className="text-9xl font-black mb-12">{countdown}</div>
          <button 
            onClick={cancelSOS}
            className="px-12 py-4 bg-white text-red-600 rounded-full font-bold text-xl shadow-2xl hover:bg-gray-100 transition-colors"
          >
            CANCEL ALERT
          </button>
        </div>
      )}
    </>
  );
};

export default SOSButton;
