import React, { useState } from 'react';
import { Search, Sparkles, Settings, Monitor, Loader2, FlaskConical, Atom, Dna, Calculator, Check, Upload, FileText } from 'lucide-react';
import { SUBJECTS, GRADES, DEVICE_OPTIONS, SearchParams, UploadedFile } from '../types';
import FileUploader from './FileUploader';

interface SearchFormProps {
  isLoading: boolean;
  onSearchDB: (params: SearchParams) => void;
  onCreateAI: (params: SearchParams) => void;
}

type InputMode = 'topic' | 'file';

const SearchForm: React.FC<SearchFormProps> = ({ isLoading, onSearchDB, onCreateAI }) => {
  const [inputMode, setInputMode] = useState<InputMode>('topic');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  const [formData, setFormData] = useState<SearchParams>({
    subject: SUBJECTS[0],
    topic: '',
    grade: GRADES[7],
    parameters: '',
    expectedResult: '',
    devices: []
  });

  const handleInputChange = (field: keyof SearchParams, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDeviceChange = (deviceId: string) => {
    setFormData(prev => {
      const current = prev.devices;
      if (current.includes(deviceId)) {
        return { ...prev, devices: current.filter(d => d !== deviceId) };
      } else {
        return { ...prev, devices: [...current, deviceId] };
      }
    });
  };

  const handleSubmitDB = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.topic.trim()) {
      alert("Vui lòng nhập chủ đề cần tìm!");
      return;
    }
    onSearchDB(formData);
  };

  const handleSubmitAI = () => {
    // Validate based on input mode
    if (inputMode === 'topic') {
      if (!formData.topic.trim()) {
        alert("Vui lòng nhập chủ đề để AI tạo mô phỏng!");
        return;
      }
    } else {
      if (uploadedFiles.length === 0) {
        alert("Vui lòng tải lên ít nhất một file!");
        return;
      }
    }

    // Include files in params
    const paramsWithFiles: SearchParams = {
      ...formData,
      uploadedFiles: uploadedFiles.length > 0 ? uploadedFiles : undefined,
      // If using file mode, generate topic from file names
      topic: inputMode === 'file' && !formData.topic.trim()
        ? `Bài tập từ: ${uploadedFiles.map(f => f.name).join(', ')}`
        : formData.topic
    };

    onCreateAI(paramsWithFiles);
  };

  const getSubjectIcon = (subject: string) => {
    switch (subject) {
      case 'Vật lý': return <Atom size={16} />;
      case 'Hóa học': return <FlaskConical size={16} />;
      case 'Sinh học': return <Dna size={16} />;
      case 'Toán học': return <Calculator size={16} />;
      default: return <Atom size={16} />;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-teal-100 p-6 md:p-8 max-w-[1200px] mx-auto relative z-10 teal-shadow">
      <div className="mb-8 border-b border-teal-50 pb-4">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
          <div className="bg-teal-50 p-2 rounded-lg text-[#0D9488]">
            <Monitor size={24} />
          </div>
          Thiết lập mô phỏng
        </h2>
        <p className="text-teal-600/70 text-xs font-semibold uppercase tracking-wider mt-2 pl-1">Tìm kiếm thư viện hoặc Tạo mới bằng AI</p>
      </div>

      <form onSubmit={handleSubmitDB} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: BASIC INFO */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="size-6 rounded-full bg-[#0D9488] text-white flex items-center justify-center text-[12px] font-bold shadow-md shadow-teal-600/30">1</div>
            <span className="text-sm font-bold text-slate-700 uppercase tracking-wide">Thông tin cơ bản</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-bold text-slate-500 uppercase">Môn học</span>
              <div className="relative">
                <select
                  value={formData.subject}
                  onChange={(e) => handleInputChange('subject', e.target.value)}
                  className="w-full rounded-xl border-slate-200 bg-slate-50 focus:border-[#0D9488] focus:ring-[#0D9488]/20 transition-all text-sm font-medium py-3 pl-10"
                >
                  {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  {getSubjectIcon(formData.subject)}
                </div>
              </div>
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-bold text-slate-500 uppercase">Đối tượng</span>
              <select
                value={formData.grade}
                onChange={(e) => handleInputChange('grade', e.target.value)}
                className="w-full rounded-xl border-slate-200 bg-slate-50 focus:border-[#0D9488] focus:ring-[#0D9488]/20 transition-all text-sm font-medium py-3"
              >
                {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </label>
          </div>

          {/* Input Mode Toggle */}
          <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
            <button
              type="button"
              onClick={() => setInputMode('topic')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-bold transition-all ${inputMode === 'topic'
                  ? 'bg-white text-[#0D9488] shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
                }`}
            >
              <FileText size={16} />
              Nhập chủ đề
            </button>
            <button
              type="button"
              onClick={() => setInputMode('file')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-bold transition-all ${inputMode === 'file'
                  ? 'bg-white text-[#0D9488] shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
                }`}
            >
              <Upload size={16} />
              Tải file bài tập
            </button>
          </div>

          {/* Conditional Input Based on Mode */}
          {inputMode === 'topic' ? (
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-bold text-slate-500 uppercase">Chủ đề chi tiết <span className="text-red-400">*</span></span>
              <input
                type="text"
                value={formData.topic}
                onChange={(e) => handleInputChange('topic', e.target.value)}
                placeholder="Ví dụ: Cấu trúc nguyên tử, Định luật Ohm..."
                className="w-full rounded-xl border-slate-200 bg-white focus:border-[#0D9488] focus:ring-[#0D9488]/20 transition-all text-sm font-medium py-3 shadow-sm"
              />
            </label>
          ) : (
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-500 uppercase block">Tải file bài tập <span className="text-red-400">*</span></span>
              <FileUploader
                files={uploadedFiles}
                onFilesChange={setUploadedFiles}
                maxFiles={5}
                maxSizeMB={10}
              />
              <p className="text-xs text-slate-400">
                AI sẽ phân tích nội dung file và tạo mô phỏng tương ứng
              </p>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: ADVANCED INFO */}
        <div className="lg:col-span-5 space-y-6 lg:border-l lg:border-teal-50 lg:pl-8">
          <div className="flex items-center gap-2 mb-2">
            <div className="size-6 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-[12px] font-bold">2</div>
            <span className="text-sm font-bold text-slate-700 uppercase tracking-wide">Chi tiết nâng cao</span>
          </div>

          <div className="space-y-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1"><Settings size={12} /> Thông số</span>
              <textarea
                rows={2}
                value={formData.parameters}
                onChange={(e) => handleInputChange('parameters', e.target.value)}
                className="w-full rounded-xl border-slate-200 bg-slate-50 focus:border-[#0D9488] focus:ring-[#0D9488]/20 text-sm py-2"
                placeholder="Góc tới, điện trở, khối lượng..."
              ></textarea>
            </label>

            <div>
              <span className="text-xs font-bold text-slate-500 uppercase block mb-2">Thiết bị</span>
              <div className="grid grid-cols-2 gap-2">
                {DEVICE_OPTIONS.slice(0, 4).map(device => (
                  <label key={device.id} className={`
                      flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-all
                      ${formData.devices.includes(device.label)
                      ? 'bg-teal-50 border-[#0D9488] text-[#0D9488]'
                      : 'bg-white border-slate-200 text-slate-500 hover:border-teal-200'}
                    `}>
                    <div className={`size-4 rounded border flex items-center justify-center ${formData.devices.includes(device.label) ? 'bg-[#0D9488] border-[#0D9488]' : 'border-slate-300'}`}>
                      {formData.devices.includes(device.label) && <Check size={12} className="text-white" />}
                    </div>
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={formData.devices.includes(device.label)}
                      onChange={() => handleDeviceChange(device.label)}
                    />
                    <span className="text-[11px] font-bold">{device.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="lg:col-span-12 flex flex-col md:flex-row gap-4 pt-4 border-t border-teal-50">
          <button
            type="submit"
            disabled={isLoading || inputMode === 'file'}
            className="flex-1 bg-white border-2 border-[#0D9488] text-[#0D9488] hover:bg-teal-50 font-bold py-3.5 px-6 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : <Search size={20} />}
            Tìm kiếm thư viện
          </button>

          <button
            type="button"
            onClick={handleSubmitAI}
            disabled={isLoading}
            className="flex-[1.5] bg-[#0D9488] hover:bg-[#0F766E] text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-teal-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 group"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : <Sparkles size={20} className="text-yellow-300" />}
            <span>{inputMode === 'file' ? 'Tạo mô phỏng từ file' : 'Tạo mô phỏng AI'}</span>
            <span className="bg-white/20 px-2 py-0.5 rounded text-[10px] font-mono group-hover:bg-white/30">BETA</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchForm;