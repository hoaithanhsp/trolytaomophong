import React from 'react';
import { Microscope, Bell, User, Settings, AlertCircle } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';

interface HeaderProps {
  onOpenGuide: () => void;
  currentView: 'search' | 'library';
  onViewChange: (view: 'search' | 'library') => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenGuide, currentView, onViewChange }) => {
  const { apiKey, setIsSettingsOpen } = useSettings();
  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-teal-100 px-4 md:px-10 py-3 shadow-sm">
      <div className="max-w-[1600px] mx-auto flex items-center justify-between">
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => onViewChange('search')}
        >
          <div className="bg-[#0D9488] text-white p-2 rounded-xl flex items-center justify-center shadow-lg shadow-teal-600/20 group-hover:bg-[#0F766E] transition-colors">
            <Microscope size={24} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold leading-none tracking-tight text-[#0D9488]">SimFinder AI</h1>
            <p className="text-[10px] text-teal-700/70 font-medium uppercase tracking-wider hidden sm:block">App mô phỏng phát triển bởi thầy Trần Hoài Thanh</p>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <button
            onClick={() => onViewChange('search')}
            className={`text-sm font-bold pb-1 transition-all ${currentView === 'search' ? 'text-[#0D9488] border-b-2 border-[#0D9488]' : 'text-teal-700/60 hover:text-[#0D9488]'}`}
          >
            Tìm kiếm
          </button>
          <button
            onClick={() => onViewChange('library')}
            className={`text-sm font-bold pb-1 transition-all ${currentView === 'library' ? 'text-[#0D9488] border-b-2 border-[#0D9488]' : 'text-teal-700/60 hover:text-[#0D9488]'}`}
          >
            Thư viện
          </button>
          <button
            onClick={onOpenGuide}
            className="text-teal-700/60 text-sm font-bold hover:text-[#0D9488] transition-colors"
          >
            Hướng dẫn
          </button>
        </nav>

        import {useSettings} from '../contexts/SettingsContext';
        import {Settings, AlertCircle} from 'lucide-react';

        // ... inside component ...
        const {apiKey, setIsSettingsOpen} = useSettings();

        // ... inside return ...
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsSettingsOpen(true)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${!apiKey ? 'bg-red-50 text-red-600 border border-red-200' : 'text-slate-500 hover:bg-slate-100'}`}
          >
            <Settings size={20} />
            {!apiKey && <span className="text-xs font-bold animate-pulse">Lấy API key để sử dụng app</span>}
          </button>

          <button className="p-2 rounded-full bg-slate-50 text-slate-500 hover:bg-teal-50 hover:text-[#0D9488] transition-all">
            <Bell size={20} />
          </button>
          <div className="size-10 rounded-full border-2 border-[#0D9488]/20 bg-teal-50 flex items-center justify-center text-[#0D9488]">
            <User size={20} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
