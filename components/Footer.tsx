import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-800 text-slate-300 py-8 px-4 mt-auto border-t border-slate-700 no-print">
      <div className="max-w-5xl mx-auto text-center">
        <div className="mb-6 p-6 bg-gradient-to-r from-blue-900/40 to-indigo-900/40 rounded-2xl border border-blue-500/20 backdrop-blur-sm">
          <p className="font-bold text-lg md:text-xl text-blue-200 mb-3 leading-relaxed">
            ĐĂNG KÝ KHOÁ HỌC THỰC CHIẾN VIẾT SKKN, TẠO APP DẠY HỌC, TẠO MÔ PHỎNG TRỰC QUAN <br className="hidden md:block" />
            <span className="text-yellow-400">CHỈ VỚI 1 CÂU LỆNH</span>
          </p>
          <a
            href="https://forms.gle/19fbZmmHW5rEtxxG7"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-full transition-all transform hover:-translate-y-1 shadow-lg shadow-blue-900/50"
          >
            ĐĂNG KÝ NGAY
          </a>
        </div>

        <div className="space-y-2 text-sm md:text-base">
          <p className="font-medium text-slate-400">Mọi thông tin vui lòng liên hệ:</p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-6">
            <a
              href="https://www.facebook.com/tranhoaithanhvicko/"
              target="_blank"
              rel="noreferrer"
              className="hover:text-blue-400 transition-colors duration-200 flex items-center gap-2"
            >
              <span className="font-bold">Facebook:</span> tranhoaithanhvicko
            </a>
            <div className="hidden md:block w-1.5 h-1.5 rounded-full bg-slate-600"></div>
            <span className="hover:text-emerald-400 transition-colors duration-200 cursor-default flex items-center gap-2">
              <span className="font-bold">Zalo:</span> 0348296773
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;