import React, { useState } from 'react';
import { Search, Sparkles, Settings, Monitor, Loader2, FlaskConical, Atom, Dna, Calculator, Check, Upload, FileText, Zap, BookOpen } from 'lucide-react';
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

    const paramsWithFiles: SearchParams = {
      ...formData,
      uploadedFiles: uploadedFiles.length > 0 ? uploadedFiles : undefined,
      topic: inputMode === 'file' && !formData.topic.trim()
        ? `Bài tập từ: ${uploadedFiles.map(f => f.name).join(', ')}`
        : formData.topic
    };

    onCreateAI(paramsWithFiles);
  };

  const getSubjectIcon = (subject: string) => {
    switch (subject) {
      case 'Vật lý': return <Atom size={18} className="text-blue-500" />;
      case 'Hóa học': return <FlaskConical size={18} className="text-green-500" />;
      case 'Sinh học': return <Dna size={18} className="text-pink-500" />;
      case 'Toán học': return <Calculator size={18} className="text-purple-500" />;
      default: return <Atom size={18} className="text-blue-500" />;
    }
  };

  const getSubjectColor = (subject: string) => {
    switch (subject) {
      case 'Vật lý': return 'from-blue-500 to-cyan-500';
      case 'Hóa học': return 'from-green-500 to-emerald-500';
      case 'Sinh học': return 'from-pink-500 to-rose-500';
      case 'Toán học': return 'from-purple-500 to-violet-500';
      default: return 'from-blue-500 to-cyan-500';
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-6 md:p-8 max-w-[1200px] mx-auto relative z-10 overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-teal-100/50 to-cyan-100/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-violet-100/50 to-purple-100/50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="relative">
        {/* Header */}
        <div className="mb-8 border-b border-slate-100 pb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-2xl text-white shadow-lg shadow-teal-200">
              <Monitor size={28} strokeWidth={2} />
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Thiết lập mô phỏng
              </h2>
              <p className="text-sm font-medium text-teal-600 flex items-center gap-1 mt-1">
                <Sparkles size={14} className="text-amber-500" />
                Tìm kiếm thư viện hoặc Tạo mới bằng AI
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmitDB} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT COLUMN */}
          <div className="lg:col-span-7 space-y-6">
            {/* Section Header */}
            <div className="flex items-center gap-3">
              <div className="size-8 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white flex items-center justify-center text-sm font-bold shadow-md shadow-teal-200">
                1
              </div>
              <span className="text-sm font-bold text-slate-700 uppercase tracking-wide">Thông tin cơ bản</span>
            </div>

            {/* Subject & Grade Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <label className="flex flex-col gap-2">
                <span className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
                  <BookOpen size={12} className="text-teal-500" />
                  Môn học
                </span>
                <div className="relative">
                  <select
                    value={formData.subject}
                    onChange={(e) => handleInputChange('subject', e.target.value)}
                    className="w-full rounded-xl border-2 border-slate-200 bg-slate-50 focus:border-teal-400 focus:ring-4 focus:ring-teal-100 transition-all text-sm font-semibold py-3.5 pl-11 pr-4 appearance-none cursor-pointer hover:border-teal-300"
                  >
                    {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2">
                    {getSubjectIcon(formData.subject)}
                  </div>
                  <div className={`absolute right-0 top-0 bottom-0 w-2 rounded-r-xl bg-gradient-to-b ${getSubjectColor(formData.subject)}`} />
                </div>
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
                  <Zap size={12} className="text-amber-500" />
                  Đối tượng
                </span>
                <select
                  value={formData.grade}
                  onChange={(e) => handleInputChange('grade', e.target.value)}
                  className="w-full rounded-xl border-2 border-slate-200 bg-slate-50 focus:border-amber-400 focus:ring-4 focus:ring-amber-100 transition-all text-sm font-semibold py-3.5 px-4 appearance-none cursor-pointer hover:border-amber-300"
                >
                  {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </label>
            </div>

            {/* Input Mode Toggle */}
            <div className="flex gap-1 p-1.5 bg-gradient-to-r from-slate-100 to-slate-50 rounded-2xl border border-slate-200">
              <button
                type="button"
                onClick={() => setInputMode('topic')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold transition-all duration-300 ${inputMode === 'topic'
                    ? 'bg-white text-teal-700 shadow-lg shadow-teal-100 border border-teal-100'
                    : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
                  }`}
              >
                <FileText size={18} className={inputMode === 'topic' ? 'text-teal-500' : ''} />
                Nhập chủ đề
              </button>
              <button
                type="button"
                onClick={() => setInputMode('file')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold transition-all duration-300 ${inputMode === 'file'
                    ? 'bg-white text-violet-700 shadow-lg shadow-violet-100 border border-violet-100'
                    : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
                  }`}
              >
                <Upload size={18} className={inputMode === 'file' ? 'text-violet-500' : ''} />
                Tải file bài tập
              </button>
            </div>

            {/* Conditional Input */}
            {inputMode === 'topic' ? (
              <label className="flex flex-col gap-2">
                <span className="text-xs font-bold text-slate-500 uppercase">
                  Chủ đề chi tiết <span className="text-rose-500">*</span>
                </span>
                <input
                  type="text"
                  value={formData.topic}
                  onChange={(e) => handleInputChange('topic', e.target.value)}
                  placeholder="Ví dụ: Cấu trúc nguyên tử, Định luật Ohm, Quang hợp..."
                  className="w-full rounded-xl border-2 border-slate-200 bg-white focus:border-teal-400 focus:ring-4 focus:ring-teal-100 transition-all text-sm font-medium py-3.5 px-4 shadow-sm hover:border-teal-300"
                />
              </label>
            ) : (
              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-md text-[10px]">NEW</span>
                  Tải file bài tập <span className="text-rose-500">*</span>
                </span>
                <FileUploader
                  files={uploadedFiles}
                  onFilesChange={setUploadedFiles}
                  maxFiles={5}
                  maxSizeMB={10}
                />
                <p className="text-xs text-violet-600 font-medium bg-violet-50 rounded-lg px-3 py-2 border border-violet-100">
                  ✨ AI sẽ phân tích nội dung file và tạo mô phỏng tương ứng
                </p>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:col-span-5 space-y-6 lg:border-l lg:border-slate-100 lg:pl-8">
            <div className="flex items-center gap-3">
              <div className="size-8 rounded-xl bg-gradient-to-br from-slate-400 to-slate-500 text-white flex items-center justify-center text-sm font-bold shadow-md">
                2
              </div>
              <span className="text-sm font-bold text-slate-700 uppercase tracking-wide">Chi tiết nâng cao</span>
            </div>

            <div className="space-y-5">
              <label className="flex flex-col gap-2">
                <span className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
                  <Settings size={12} className="text-slate-400" />
                  Thông số điều chỉnh
                </span>
                <textarea
                  rows={2}
                  value={formData.parameters}
                  onChange={(e) => handleInputChange('parameters', e.target.value)}
                  className="w-full rounded-xl border-2 border-slate-200 bg-slate-50 focus:border-slate-400 focus:ring-4 focus:ring-slate-100 transition-all text-sm py-3 px-4 resize-none hover:border-slate-300"
                  placeholder="Góc tới, điện trở, khối lượng, nhiệt độ..."
                />
              </label>

              <div>
                <span className="text-xs font-bold text-slate-500 uppercase block mb-3">Thiết bị hiển thị</span>
                <div className="grid grid-cols-2 gap-2">
                  {DEVICE_OPTIONS.slice(0, 4).map((device, idx) => {
                    const colors = [
                      'from-blue-500 to-cyan-500',
                      'from-pink-500 to-rose-500',
                      'from-amber-500 to-orange-500',
                      'from-green-500 to-emerald-500'
                    ];
                    const isSelected = formData.devices.includes(device.label);

                    return (
                      <label
                        key={device.id}
                        className={`
                          flex items-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all duration-200
                          ${isSelected
                            ? `bg-gradient-to-r ${colors[idx]} text-white border-transparent shadow-md`
                            : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:shadow-sm'
                          }
                        `}
                      >
                        <div className={`
                          size-5 rounded-md flex items-center justify-center transition-all
                          ${isSelected ? 'bg-white/30' : 'border-2 border-slate-300'}
                        `}>
                          {isSelected && <Check size={14} className="text-white" strokeWidth={3} />}
                        </div>
                        <input
                          type="checkbox"
                          className="hidden"
                          checked={isSelected}
                          onChange={() => handleDeviceChange(device.label)}
                        />
                        <span className="text-xs font-bold">{device.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* FOOTER ACTIONS */}
          <div className="lg:col-span-12 flex flex-col md:flex-row gap-4 pt-6 border-t border-slate-100">
            <button
              type="submit"
              disabled={isLoading || inputMode === 'file'}
              className="flex-1 bg-white border-2 border-teal-500 text-teal-700 hover:bg-teal-50 font-bold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
            >
              {isLoading ? <Loader2 className="animate-spin" /> : <Search size={20} />}
              <span>Tìm kiếm thư viện</span>
            </button>

            <button
              type="button"
              onClick={handleSubmitAI}
              disabled={isLoading}
              className="flex-[1.5] bg-gradient-to-r from-teal-500 via-emerald-500 to-green-500 hover:from-teal-600 hover:via-emerald-600 hover:to-green-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-teal-200 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl hover:-translate-y-0.5"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Sparkles size={22} className="text-yellow-300 drop-shadow-lg" />
              )}
              <span className="text-base">{inputMode === 'file' ? 'Tạo mô phỏng từ file' : 'Tạo mô phỏng AI'}</span>
              <span className="px-2 py-1 bg-white/20 rounded-lg text-[10px] font-mono backdrop-blur-sm">BETA</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SearchForm;
