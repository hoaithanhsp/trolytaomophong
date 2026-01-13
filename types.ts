export interface Simulation {
  id: number;
  subject: string;
  topic: string[];
  title: string;
  platform: string;
  url: string;
  language: string;
  preview: string;
  guide: string;
  grade: string[];
}

export interface UploadedFile {
  name: string;
  type: 'image' | 'pdf' | 'text';
  content: string; // base64 for image, text content for pdf/txt
  mimeType: string;
}

export interface SearchParams {
  subject: string;
  topic: string;
  grade: string;
  // Advanced fields
  parameters?: string;
  expectedResult?: string;
  devices: string[];
  // File upload
  uploadedFiles?: UploadedFile[];
}

export interface AIResult {
  html: string;
  questions: string;
  guide: string;
}

export type SearchStatus = 'idle' | 'searching' | 'found' | 'generating' | 'generated' | 'error' | 'no-result';

export const SUBJECTS = [
  "Vật lý",
  "Hóa học",
  "Sinh học",
  "Toán học"
];

export const GRADES = [
  "Lớp 1", "Lớp 2", "Lớp 3", "Lớp 4", "Lớp 5",
  "Lớp 6", "Lớp 7", "Lớp 8", "Lớp 9",
  "Lớp 10", "Lớp 11", "Lớp 12"
];

export const DEVICE_OPTIONS = [
  { id: 'projector', label: 'Máy chiếu + Laptop' },
  { id: 'mobile', label: 'Chỉ có điện thoại' },
  { id: 'offline', label: 'Không có internet' },
  { id: 'online', label: 'Có internet ổn định' }
];