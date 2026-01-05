
import React from 'react';

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
      <header className="sticky top-0 z-50 bg-red-600 text-white p-4 flex items-center shadow-lg">
        {onBack && (
          <button onClick={onBack} className="mr-3 p-2 hover:bg-red-700 rounded-full transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        <h1 className="text-xl font-bold tracking-tight">{title}</h1>
      </header>

      <main className="flex-1 overflow-y-auto p-4">
        {children}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t flex justify-around p-2 z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <TabButton icon="🏠" label="Home" active={activeTab === 'home'} onClick={() => setActiveTab('home')} />
        <TabButton icon="📖" label="First Aid" active={activeTab === 'guides'} onClick={() => setActiveTab('guides')} />
        <TabButton icon="🔍" label="Check" active={activeTab === 'checker'} onClick={() => setActiveTab('checker')} />
        <TabButton icon="📍" label="Help" active={activeTab === 'directory'} onClick={() => setActiveTab('directory')} />
        <TabButton icon="👤" label="Me" active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
      </nav>
    </div>
  );
};

const TabButton: React.FC<{ icon: string; label: string; active: boolean; onClick: () => void }> = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick} 
    className={`flex flex-col items-center p-2 rounded-xl transition-all duration-200 ${active ? 'text-red-600 scale-110' : 'text-gray-400'}`}
  >
    <span className="text-2xl">{icon}</span>
    <span className="text-[10px] font-semibold uppercase mt-1">{label}</span>
  </button>
);

export default Layout;
