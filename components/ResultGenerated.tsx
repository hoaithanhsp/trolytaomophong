import React, { useState } from 'react';
import { Sparkles, Download, Code, Check, FileText, HelpCircle, Play, Rocket } from 'lucide-react';
import { AIResult } from '../types';

interface ResultGeneratedProps {
  data: AIResult;
  topic: string;
}

const ResultGenerated: React.FC<ResultGeneratedProps> = ({ data, topic }) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'questions' | 'guide' | 'code'>('preview');
  
  const handleDownload = () => {
    const blob = new Blob([data.html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mo-phong-${topic.toLowerCase().replace(/\s+/g, '-')}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(data.html);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Success Banner */}
      <div className="bg-gradient-to-r from-[#0D9488] to-[#0F766E] rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="text-teal-200" size={24} />
            <h2 className="font-bold text-xl tracking-tight">Mô phỏng tùy chỉnh đã hoàn tất!</h2>
          </div>
          <p className="text-teal-50/80 text-sm">AI đã tạo một mô hình tương tác HTML5 cho chủ đề "{topic}".</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleDownload}
            className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-white/20 transition-all uppercase tracking-wide"
          >
            <Download size={16} />
            Tải HTML
          </button>
          <button 
            onClick={handleCopy}
            className="bg-white text-[#0D9488] px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-teal-50 transition-all uppercase tracking-wide shadow-lg"
          >
            {copied ? <Check size={16} /> : <Code size={16} />}
            {copied ? 'Đã copy' : 'Copy Code'}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Interactive Preview */}
        <div className="lg:col-span-8">
           <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border-4 border-white relative group">
              {activeTab === 'preview' ? (
                <div className="aspect-video w-full h-[500px] relative">
                  <iframe 
                    title="Generated Simulation"
                    srcDoc={data.html}
                    className="w-full h-full border-0 bg-white"
                    sandbox="allow-scripts allow-same-origin allow-modals"
                  />
                  <div className="absolute bottom-4 left-4">
                     <div className="bg-slate-900/80 backdrop-blur-md text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 border border-white/10 shadow-lg">
                        <span className="size-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        INTERACTIVE READY
                     </div>
                  </div>
                </div>
              ) : activeTab === 'code' ? (
                 <div className="h-[500px] bg-[#1e1e1e] overflow-auto p-4 custom-scrollbar">
                   <pre className="text-[#d4d4d4] font-mono text-xs whitespace-pre-wrap">{data.html}</pre>
                 </div>
              ) : (
                <div className="h-[500px] bg-white overflow-auto p-8 custom-scrollbar">
                   <div className="prose prose-teal max-w-none">
                      {activeTab === 'questions' ? (
                        <div className="whitespace-pre-wrap font-medium text-slate-700">{data.questions}</div>
                      ) : (
                        <div className="whitespace-pre-wrap font-medium text-slate-700">{data.guide}</div>
                      )}
                   </div>
                </div>
              )}
           </div>
        </div>

        {/* Right: Controls & Info */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          
          {/* Navigation Tabs */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-teal-50 flex flex-col gap-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-2">Nội dung</h3>
            <button 
              onClick={() => setActiveTab('preview')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${activeTab === 'preview' ? 'bg-[#0D9488] text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <Play size={18} /> Mô phỏng
            </button>
            <button 
              onClick={() => setActiveTab('questions')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${activeTab === 'questions' ? 'bg-[#0D9488] text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <HelpCircle size={18} /> Câu hỏi thực hành
            </button>
            <button 
              onClick={() => setActiveTab('guide')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${activeTab === 'guide' ? 'bg-[#0D9488] text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <FileText size={18} /> Hướng dẫn GV
            </button>
            <button 
              onClick={() => setActiveTab('code')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${activeTab === 'code' ? 'bg-[#0D9488] text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <Code size={18} /> Source Code
            </button>
          </div>

          {/* AI Analysis Box */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-teal-50 flex-1">
             <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
               <span className="bg-teal-50 text-[#0D9488] p-1.5 rounded-lg"><Rocket size={16}/></span>
               AI Analysis
             </h3>
             <div className="text-xs text-slate-600 space-y-3 leading-relaxed">
                <p>Mô phỏng này được tạo tự động dựa trên các tham số vật lý/hóa học tiêu chuẩn.</p>
                <div className="p-3 bg-teal-50 rounded-xl border-l-4 border-[#0D9488] text-[#0F766E] italic font-medium">
                  "Học sinh có thể tương tác trực tiếp với các biến số để quan sát sự thay đổi của hệ thống trong thời gian thực."
                </div>
                <ul className="space-y-2 mt-4">
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-[#0D9488]" /> 
                    <span className="font-bold text-slate-700">Responsive:</span> Mobile/Tablet
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-[#0D9488]" /> 
                    <span className="font-bold text-slate-700">Offline:</span> Chạy không cần mạng
                  </li>
                </ul>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ResultGenerated;