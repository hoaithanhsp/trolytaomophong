import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, FileText, Image, File, AlertCircle } from 'lucide-react';
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
                // Remove data URL prefix to get pure base64
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
            case 'image': return <Image size={16} className="text-blue-500" />;
            case 'pdf': return <FileText size={16} className="text-red-500" />;
            case 'text': return <File size={16} className="text-gray-500" />;
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
          relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
          ${isDragging
                        ? 'border-teal-500 bg-teal-50'
                        : 'border-slate-200 hover:border-teal-300 hover:bg-slate-50'
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

                <div className="flex flex-col items-center gap-3">
                    <div className={`
            p-4 rounded-full transition-colors
            ${isDragging ? 'bg-teal-100 text-teal-600' : 'bg-slate-100 text-slate-400'}
          `}>
                        <Upload size={32} />
                    </div>

                    <div>
                        <p className="font-bold text-slate-700">
                            {isProcessing ? 'Đang xử lý...' : 'Kéo thả file vào đây'}
                        </p>
                        <p className="text-sm text-slate-500 mt-1">
                            hoặc click để chọn file
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2 justify-center mt-2">
                        <span className="px-2 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded">Hình ảnh</span>
                        <span className="px-2 py-1 bg-red-50 text-red-600 text-xs font-medium rounded">PDF</span>
                        <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded">Text</span>
                    </div>

                    <p className="text-xs text-slate-400">
                        Tối đa {maxFiles} file, mỗi file ≤ {maxSizeMB}MB
                    </p>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm">
                    <AlertCircle size={16} />
                    <span>{error}</span>
                </div>
            )}

            {/* File List */}
            {files.length > 0 && (
                <div className="space-y-2">
                    <p className="text-xs font-bold text-slate-500 uppercase">File đã tải ({files.length}/{maxFiles})</p>
                    <div className="grid gap-2">
                        {files.map((file, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-lg group hover:border-slate-200"
                            >
                                <div className="flex items-center gap-3">
                                    {file.type === 'image' ? (
                                        <div className="w-10 h-10 rounded bg-slate-100 overflow-hidden">
                                            <img
                                                src={`data:${file.mimeType};base64,${file.content}`}
                                                alt={file.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    ) : (
                                        <div className="w-10 h-10 rounded bg-slate-50 flex items-center justify-center">
                                            {getFileIcon(file.type)}
                                        </div>
                                    )}
                                    <div>
                                        <p className="text-sm font-medium text-slate-700 truncate max-w-[200px]">
                                            {file.name}
                                        </p>
                                        <p className="text-xs text-slate-400 capitalize">{file.type}</p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => removeFile(index)}
                                    className="p-1.5 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                                >
                                    <X size={16} />
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
