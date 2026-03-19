
import React from 'react';
import { Home, HeartPulse, MapPin, User } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
  onBack?: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, title, onBack, activeTab, setActiveTab }) => {
  return (
    <div className="flex flex-col min-h-screen pb-20 max-w-md mx-auto bg-white shadow-xl relative">
      <header className="sticky top-0 z-[60] bg-red-600 text-white p-5 flex items-center shadow-lg rounded-b-[32px]">
        {onBack && (
          <button onClick={onBack} className="mr-3 p-2 hover:bg-red-700 rounded-full transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        <h1 className="text-xl font-black tracking-tight">{title}</h1>
      </header>

      <main className="flex-1 overflow-y-auto p-5">
        {children}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/90 backdrop-blur-md border-t flex justify-around p-3 z-[60] shadow-[0_-10px_30px_rgba(0,0,0,0.05)] rounded-t-[40px]">
        <TabButton icon={<Home size={24} />} label="Home" active={activeTab === 'home'} onClick={() => setActiveTab('home')} />
        <TabButton icon={<HeartPulse size={24} />} label="First Aid" active={activeTab === 'guides'} onClick={() => setActiveTab('guides')} />
        <TabButton icon={<MapPin size={24} />} label="Help" active={activeTab === 'directory'} onClick={() => setActiveTab('directory')} />
        <TabButton icon={<User size={24} />} label="Me" active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
      </nav>
    </div>
  );
};

const TabButton: React.FC<{ icon: React.ReactNode; label: string; active: boolean; onClick: () => void }> = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick} 
    className={`flex flex-col items-center p-2 rounded-2xl transition-all duration-300 ${active ? 'bg-red-50 text-red-600 scale-105 px-4' : 'text-gray-400'}`}
  >
    {icon}
    <span className="text-[8px] font-black uppercase mt-1 tracking-widest">{label}</span>
  </button>
);

export default Layout;
