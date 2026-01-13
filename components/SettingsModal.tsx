import React, { useState } from 'react';
import { X, Key, ExternalLink, Check, Info } from 'lucide-react';
import { useSettings, AVAILABLE_MODELS } from '../contexts/SettingsContext';

const SettingsModal: React.FC = () => {
    const { apiKey, setApiKey, selectedModel, setSelectedModel, isSettingsOpen, setIsSettingsOpen } = useSettings();
    const [tempKey, setTempKey] = useState(apiKey);
    const [error, setError] = useState('');

    // Sync local state when modal opens
    React.useEffect(() => {
        setTempKey(apiKey);
    }, [apiKey, isSettingsOpen]);

    if (!isSettingsOpen) return null;

    const handleSave = () => {
        if (!tempKey.trim()) {
            setError('Vui lòng nhập API Key để tiếp tục');
            return;
        }
        setApiKey(tempKey.trim());
        setIsSettingsOpen(false);
        setError('');
    };

    const handleClose = () => {
        if (!apiKey) {
            setError('Bạn cần nhập API Key để sử dụng ứng dụng');
            return;
        }
        setIsSettingsOpen(false);
    };

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="bg-gradient-to-r from-teal-600 to-emerald-600 p-6 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-white">
                        <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                            <Key size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">Cấu hình AI & API Key</h2>
                            <p className="text-teal-100 text-sm">Thiết lập kết nối để tạo mô phỏng</p>
                        </div>
                    </div>
                    {apiKey && (
                        <button onClick={handleClose} className="text-teal-100 hover:text-white transition-colors p-1 bg-white/10 rounded-full hover:bg-white/20">
                            <X size={24} />
                        </button>
                    )}
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto custom-scrollbar space-y-8">

                    {/* Section 1: API Key */}
                    <div className="space-y-4">
                        <label className="block text-slate-700 font-bold text-lg mb-2">
                            1. Google Gemini API Key <span className="text-red-500">*</span>
                        </label>

                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-4 items-start">
                            <Info className="text-blue-500 shrink-0 mt-1" size={20} />
                            <div className="text-sm text-blue-800 space-y-2">
                                <p>Bạn chưa có API Key? Hãy lấy key miễn phí từ Google:</p>
                                <div className="flex flex-wrap gap-3">
                                    <a
                                        href="https://aistudio.google.com/api-keys"
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition shadow-sm"
                                    >
                                        Lấy API Key ngay <ExternalLink size={16} />
                                    </a>
                                    <a
                                        href="https://drive.google.com/drive/folders/1G6eiVeeeEvsYgNk2Om7FEybWf30EP1HN?usp=drive_link"
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-blue-200 text-blue-700 font-bold rounded-lg hover:bg-blue-50 transition"
                                    >
                                        Xem hướng dẫn chi tiết <ExternalLink size={16} />
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            <input
                                type="password"
                                value={tempKey}
                                onChange={(e) => {
                                    setTempKey(e.target.value);
                                    setError('');
                                }}
                                placeholder="Dán API Key của bạn vào đây (bắt đầu bằng AIza...)"
                                className="w-full px-5 py-4 border-2 border-slate-200 rounded-xl focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none text-lg font-mono transition-all text-slate-800"
                            />
                            {error && (
                                <p className="absolute -bottom-6 left-0 text-red-500 text-sm font-medium animate-pulse">
                                    {error}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Section 2: Model Selection */}
                    <div className="space-y-4 pt-4 border-t border-slate-100">
                        <label className="block text-slate-700 font-bold text-lg mb-2">
                            2. Chọn Model AI Ưu Tiên
                        </label>
                        <p className="text-slate-500 text-sm mb-4">
                            Hệ thống sẽ tự động chuyển đổi sang model khác nếu model bạn chọn gặp sự cố (Fallback).
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {AVAILABLE_MODELS.map((model) => (
                                <button
                                    key={model.id}
                                    onClick={() => setSelectedModel(model.id)}
                                    className={`
                    relative p-4 rounded-xl border-2 text-left transition-all duration-200 group
                    ${selectedModel === model.id
                                            ? 'border-teal-500 bg-teal-50 shadow-md ring-1 ring-teal-500'
                                            : 'border-slate-200 hover:border-teal-200 hover:bg-slate-50'
                                        }
                  `}
                                >
                                    {selectedModel === model.id && (
                                        <div className="absolute top-2 right-2 text-teal-600 bg-white rounded-full p-0.5 shadow-sm">
                                            <Check size={14} strokeWidth={3} />
                                        </div>
                                    )}
                                    <div className="font-bold text-slate-800 mb-1 group-hover:text-teal-700">{model.name}</div>
                                    <div className="text-xs text-slate-500 leading-tight">{model.desc}</div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
                    {apiKey && (
                        <button
                            onClick={handleClose}
                            className="px-6 py-2.5 text-slate-600 font-bold hover:bg-slate-200 rounded-xl transition"
                        >
                            Đóng
                        </button>
                    )}
                    <button
                        onClick={handleSave}
                        className="px-8 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-teal-600/20 transform hover:-translate-y-0.5 transition-all"
                    >
                        Lưu Cấu Hình
                    </button>
                </div>

            </div>
        </div>
    );
};

export default SettingsModal;
