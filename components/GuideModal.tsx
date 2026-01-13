import React from 'react';
import { X, Search, Sparkles, Download } from 'lucide-react';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="bg-[#0066cc] p-4 flex justify-between items-center text-white">
          <h3 className="font-bold text-lg">Hướng dẫn sử dụng</h3>
          <button onClick={onClose} className="hover:bg-blue-600 rounded-full p-1"><X size={20} /></button>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="flex gap-4">
            <div className="bg-blue-100 p-2 rounded-lg h-fit text-[#0066cc]"><Search size={24} /></div>
            <div>
              <h4 className="font-bold text-gray-800">1. Tìm kiếm</h4>
              <p className="text-sm text-gray-600">Nhập môn học và chủ đề bạn cần (ví dụ: "Phản xạ ánh sáng"). Hệ thống sẽ tìm trong kho dữ liệu chọn lọc.</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="bg-yellow-100 p-2 rounded-lg h-fit text-yellow-600"><Sparkles size={24} /></div>
            <div>
              <h4 className="font-bold text-gray-800">2. AI Tạo Mới</h4>
              <p className="text-sm text-gray-600">Nếu không tìm thấy, AI thông minh sẽ tự động lập trình một mô phỏng HTML5 tương tác dành riêng cho bạn trong vài giây.</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="bg-green-100 p-2 rounded-lg h-fit text-green-600"><Download size={24} /></div>
            <div>
              <h4 className="font-bold text-gray-800">3. Sử dụng & Tải về</h4>
              <p className="text-sm text-gray-600">Bạn có thể dùng trực tiếp trên web hoặc tải file HTML về máy để dạy offline.</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 text-center">
          <button onClick={onClose} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-6 rounded-lg transition">
            Đã hiểu
          </button>
        </div>
      </div>
    </div>
  );
};

export default GuideModal;