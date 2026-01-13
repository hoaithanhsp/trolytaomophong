import React, { useState } from 'react';
import { Simulation } from '../types';
import { ExternalLink, Copy, ChevronDown, ChevronUp, ImageOff, Play, Globe, CheckCircle } from 'lucide-react';

interface ResultFoundProps {
  simulation: Simulation;
}

const ResultFound: React.FC<ResultFoundProps> = ({ simulation }) => {
  const [imgError, setImgError] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  const copyLink = () => {
    navigator.clipboard.writeText(simulation.url);
    alert("Đã sao chép liên kết!");
  };

  const isVietnamese = simulation.language.toLowerCase().includes('việt') || simulation.language === 'vi';

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-teal-100 overflow-hidden hover:shadow-xl hover:shadow-teal-900/5 transition-all duration-300">
      <div className="flex flex-col lg:flex-row">
        {/* Image Section */}
        <div className="lg:w-5/12 relative group cursor-pointer overflow-hidden bg-teal-50">
           <div className="aspect-video lg:h-full w-full relative">
             {!imgError ? (
               <img 
                src={simulation.preview} 
                alt={simulation.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                onError={() => setImgError(true)}
               />
             ) : (
               <div className="flex flex-col items-center justify-center h-full text-teal-300">
                 <ImageOff size={48} />
               </div>
             )}
             <div className="absolute inset-0 bg-teal-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                <div className="bg-white text-[#0D9488] p-4 rounded-full shadow-2xl scale-75 group-hover:scale-100 transition-transform">
                  <Play size={32} fill="currentColor" className="ml-1" />
                </div>
             </div>
           </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 p-6 md:p-8 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-teal-50 text-[#0D9488] text-[10px] font-bold rounded-full border border-teal-100 flex items-center gap-1.5 uppercase">
                <CheckCircle size={12} /> {simulation.platform}
              </span>
              <span className={`px-3 py-1 text-[10px] font-bold rounded-full border flex items-center gap-1.5 uppercase ${isVietnamese ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                <Globe size={12} /> {isVietnamese ? 'Tiếng Việt' : simulation.language}
              </span>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-teal-950 mb-2">{simulation.title}</h3>
              <p className="text-teal-900/70 text-sm leading-relaxed mb-4">
                Chủ đề: {simulation.topic.join(', ')}. Phù hợp cho {simulation.grade.join(', ')}.
              </p>
            </div>

            {/* Guide Accordion */}
            {simulation.guide && (
              <div className="bg-teal-50/50 rounded-xl border border-teal-100 overflow-hidden">
                <button 
                  onClick={() => setIsGuideOpen(!isGuideOpen)}
                  className="w-full flex items-center justify-between px-4 py-3 text-xs font-bold text-teal-800 uppercase tracking-wider hover:bg-teal-50 transition-colors"
                >
                  <span>Hướng dẫn nhanh</span>
                  {isGuideOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
                
                {isGuideOpen && (
                   <div className="px-4 pb-4 pt-1 text-sm text-teal-900/80 animate-in slide-in-from-top-2">
                     <p className="whitespace-pre-line leading-relaxed border-l-2 border-[#0D9488] pl-3">
                       {simulation.guide}
                     </p>
                   </div>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <a 
              href={simulation.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex-1 bg-[#10B981] hover:bg-emerald-600 text-white font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20"
            >
              <ExternalLink size={18} />
              Mở mô phỏng
            </a>
            <button 
              onClick={copyLink}
              className="bg-teal-50 hover:bg-teal-100 text-[#0D9488] font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 transition-all border border-teal-100"
            >
              <Copy size={18} />
              Sao chép
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultFound;