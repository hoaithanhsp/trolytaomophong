import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, FileText, Image, File, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';
import { UploadedFile } from '../types';
import * as pdfjsLib from 'pdfjs-dist';

// Set worker source for pdf.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface FileUploaderProps {
    files: UploadedFile[];
    onFilesChange: (files: UploadedFile[]) => void;
    maxFiles?: number;
    maxSizeMB?: number;
}

const ACCEPTED_TYPES = {
    'image/jpeg': 'image',
    'image/png': 'image',
    'image/gif': 'image',
    'image/webp': 'image',
    'application/pdf': 'pdf',
    'text/plain': 'text',
} as const;

const FileUploader: React.FC<FileUploaderProps> = ({
    files,
    onFilesChange,
    maxFiles = 5,
    maxSizeMB = 10
}) => {
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const extractTextFromPDF = async (file: File): Promise<string> => {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let fullText = '';

        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items
                .map((item: any) => item.str)
                .join(' ');
            fullText += pageText + '\n';
        }

        return fullText.trim();
    };

    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const result = reader.result as string;
                const base64 = result.split(',')[1];
                resolve(base64);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    const readTextFile = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsText(file);
        });
    };

    const processFile = async (file: File): Promise<UploadedFile | null> => {
        const fileType = ACCEPTED_TYPES[file.type as keyof typeof ACCEPTED_TYPES];

        if (!fileType) {
            throw new Error(`Định dạng file không được hỗ trợ: ${file.type}`);
        }

        if (file.size > maxSizeMB * 1024 * 1024) {
            throw new Error(`File "${file.name}" vượt quá ${maxSizeMB}MB`);
        }

        let content = '';

        if (fileType === 'image') {
            content = await fileToBase64(file);
        } else if (fileType === 'pdf') {
            content = await extractTextFromPDF(file);
        } else if (fileType === 'text') {
            content = await readTextFile(file);
        }

        return {
            name: file.name,
            type: fileType,
            content,
            mimeType: file.type
        };
    };

    const handleFiles = useCallback(async (fileList: FileList | null) => {
        if (!fileList) return;

        setError(null);
        setIsProcessing(true);

        try {
            const remainingSlots = maxFiles - files.length;
            const filesToProcess = Array.from(fileList).slice(0, remainingSlots);

            if (filesToProcess.length < fileList.length) {
                setError(`Chỉ có thể tải tối đa ${maxFiles} file`);
            }

            const processedFiles: UploadedFile[] = [];

            for (const file of filesToProcess) {
                try {
                    const processed = await processFile(file);
                    if (processed) {
                        processedFiles.push(processed);
                    }
                } catch (err: any) {
                    setError(err.message);
                }
            }

            if (processedFiles.length > 0) {
                onFilesChange([...files, ...processedFiles]);
            }
        } catch (err: any) {
            setError(err.message || 'Có lỗi xảy ra khi xử lý file');
        } finally {
            setIsProcessing(false);
        }
    }, [files, maxFiles, onFilesChange]);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        handleFiles(e.dataTransfer.files);
    }, [handleFiles]);

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleFiles(e.target.files);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const removeFile = (index: number) => {
        const newFiles = files.filter((_, i) => i !== index);
        onFilesChange(newFiles);
        setError(null);
    };

    const getFileIcon = (type: UploadedFile['type']) => {
        switch (type) {
            case 'image': return <Image size={18} className="text-pink-500" />;
            case 'pdf': return <FileText size={18} className="text-orange-500" />;
            case 'text': return <File size={18} className="text-indigo-500" />;
        }
    };

    const getFileTypeColor = (type: UploadedFile['type']) => {
        switch (type) {
            case 'image': return 'bg-pink-50 border-pink-200 text-pink-700';
            case 'pdf': return 'bg-orange-50 border-orange-200 text-orange-700';
            case 'text': return 'bg-indigo-50 border-indigo-200 text-indigo-700';
        }
    };

    return (
        <div className="space-y-4">
            {/* Drop Zone */}
            <div
                onClick={handleClick}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`
          relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300
          ${isDragging
                        ? 'border-violet-500 bg-gradient-to-br from-violet-50 to-purple-50 scale-[1.02]'
                        : 'border-violet-200 hover:border-violet-400 hover:bg-gradient-to-br hover:from-violet-50/50 hover:to-purple-50/50'
                    }
          ${isProcessing ? 'opacity-50 pointer-events-none' : ''}
        `}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".jpg,.jpeg,.png,.gif,.webp,.pdf,.txt"
                    onChange={handleInputChange}
                    className="hidden"
                />

                {/* Decorative background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-violet-100/30 via-transparent to-pink-100/30 rounded-2xl pointer-events-none" />

                <div className="relative flex flex-col items-center gap-4">
                    <div className={`
            p-5 rounded-2xl transition-all duration-300 shadow-lg
            ${isDragging
                            ? 'bg-gradient-to-br from-violet-500 to-purple-600 text-white scale-110 shadow-violet-300'
                            : 'bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-violet-200'
                        }
          `}>
                        <Upload size={28} strokeWidth={2.5} />
                    </div>

                    <div>
                        <p className="font-bold text-lg bg-gradient-to-r from-violet-700 to-purple-700 bg-clip-text text-transparent">
                            {isProcessing ? '⏳ Đang xử lý...' : '📤 Kéo thả file vào đây'}
                        </p>
                        <p className="text-sm text-violet-500 mt-1 font-medium">
                            hoặc click để chọn file từ máy tính
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2 justify-center mt-1">
                        <span className="px-3 py-1.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-bold rounded-full shadow-sm shadow-pink-200">
                            🖼️ Hình ảnh
                        </span>
                        <span className="px-3 py-1.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-bold rounded-full shadow-sm shadow-orange-200">
                            📄 PDF
                        </span>
                        <span className="px-3 py-1.5 bg-gradient-to-r from-indigo-500 to-blue-500 text-white text-xs font-bold rounded-full shadow-sm shadow-indigo-200">
                            📝 Text
                        </span>
                    </div>

                    <p className="text-xs text-violet-400 font-medium">
                        Tối đa {maxFiles} file • Mỗi file ≤ {maxSizeMB}MB
                    </p>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="flex items-center gap-2 p-4 bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 rounded-xl text-red-600 text-sm font-medium shadow-sm">
                    <AlertCircle size={18} className="shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            {/* File List */}
            {files.length > 0 && (
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <CheckCircle2 size={16} className="text-emerald-500" />
                        <p className="text-xs font-bold text-emerald-600 uppercase tracking-wide">
                            File đã tải ({files.length}/{maxFiles})
                        </p>
                    </div>
                    <div className="grid gap-2">
                        {files.map((file, index) => (
                            <div
                                key={index}
                                className={`
                  flex items-center justify-between p-4 rounded-xl border-2 group transition-all duration-200
                  hover:shadow-md hover:scale-[1.01]
                  ${getFileTypeColor(file.type)}
                `}
                            >
                                <div className="flex items-center gap-4">
                                    {file.type === 'image' ? (
                                        <div className="w-14 h-14 rounded-xl bg-white shadow-sm overflow-hidden border-2 border-white">
                                            <img
                                                src={`data:${file.mimeType};base64,${file.content}`}
                                                alt={file.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    ) : (
                                        <div className={`
                      w-14 h-14 rounded-xl flex items-center justify-center shadow-sm
                      ${file.type === 'pdf' ? 'bg-gradient-to-br from-orange-100 to-amber-100' : 'bg-gradient-to-br from-indigo-100 to-blue-100'}
                    `}>
                                            {getFileIcon(file.type)}
                                        </div>
                                    )}
                                    <div>
                                        <p className="text-sm font-bold truncate max-w-[200px]">
                                            {file.name}
                                        </p>
                                        <p className="text-xs font-medium opacity-70 capitalize flex items-center gap-1">
                                            <Sparkles size={10} />
                                            {file.type === 'image' ? 'Hình ảnh' : file.type === 'pdf' ? 'Tài liệu PDF' : 'Văn bản'}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => removeFile(index)}
                                    className="p-2 rounded-full text-current opacity-50 hover:opacity-100 hover:bg-white/50 transition-all"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default FileUploader;
