import React, { useState } from 'react';
import { Simulation, SUBJECTS } from '../types';
import { simulationDatabase } from '../services/simulationData';
import ResultFound from './ResultFound';
import { BookOpen, Filter, Search } from 'lucide-react';

const LibraryView: React.FC = () => {
  const [activeSubject, setActiveSubject] = useState<string>('Tất cả');
  const [searchTerm, setSearchTerm] = useState('');

  // Get unique subjects from DB plus "Tất cả"
  const allSubjects = ['Tất cả', ...SUBJECTS, 'Khoa học tự nhiên'];

  const filteredSimulations = simulationDatabase.filter(sim => {
    const matchSubject = activeSubject === 'Tất cả' || sim.subject === activeSubject;
    const matchSearch = sim.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        sim.topic.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchSubject && matchSearch;
  });

  return (
    <div className="animate-in fade-in duration-500">
      {/* Library Header & Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-teal-100 p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <BookOpen className="text-[#0D9488]" />
              Thư viện mô phỏng
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Khám phá {simulationDatabase.length} tài nguyên đã được kiểm duyệt kỹ lưỡng.
            </p>
          </div>

          <div className="flex-1 max-w-md">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm nhanh theo tên hoặc chủ đề..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border-slate-200 bg-slate-50 focus:border-[#0D9488] focus:ring-[#0D9488]/20 transition-all text-sm"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            </div>
          </div>
        </div>

        {/* Subject Tabs */}
        <div className="mt-6 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {allSubjects.map(sub => (
            <button
              key={sub}
              onClick={() => setActiveSubject(sub)}
              className={`
                whitespace-nowrap px-4 py-2 rounded-lg text-sm font-bold transition-all
                ${activeSubject === sub 
                  ? 'bg-[#0D9488] text-white shadow-md shadow-teal-600/20' 
                  : 'bg-teal-50 text-teal-700 hover:bg-teal-100'}
              `}
            >
              {sub}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Results */}
      {filteredSimulations.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {filteredSimulations.map(sim => (
            <ResultFound key={sim.id} simulation={sim} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-teal-200">
          <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
            <Filter size={32} />
          </div>
          <p className="text-slate-500 font-medium">Không tìm thấy mô phỏng nào phù hợp với bộ lọc.</p>
          <button 
            onClick={() => {setActiveSubject('Tất cả'); setSearchTerm('')}}
            className="mt-4 text-[#0D9488] font-bold hover:underline"
          >
            Xóa bộ lọc
          </button>
        </div>
      )}
    </div>
  );
};

export default LibraryView;