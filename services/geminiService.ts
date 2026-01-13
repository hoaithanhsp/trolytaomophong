import { GoogleGenAI } from "@google/genai";
import { SearchParams, AIResult, UploadedFile } from "../types";

const SYSTEM_PROMPT = `
Bạn là chuyên gia lập trình web giáo dục và thiết kế bài giảng STEM.
Nhiệm vụ: Tạo nội dung giáo dục gồm 3 phần: Code HTML mô phỏng, Câu hỏi thực hành, Hướng dẫn sử dụng.
Output Format: Bắt buộc sử dụng các separator sau để phân chia nội dung:
|||HTML_START|||
[Code HTML tại đây]
|||HTML_END|||
|||QUESTIONS_START|||
[Câu hỏi thực hành tại đây]
|||QUESTIONS_END|||
|||GUIDE_START|||
[Hướng dẫn sử dụng tại đây]
|||GUIDE_END|||
`;

const SYSTEM_PROMPT_FROM_FILE = `
Bạn là chuyên gia lập trình web giáo dục và thiết kế bài giảng STEM.
Nhiệm vụ: Phân tích nội dung bài tập/tài liệu được cung cấp, sau đó tạo mô phỏng tương tác phù hợp.

Quy trình:
1. Đọc và hiểu nội dung bài tập/tài liệu
2. Xác định chủ đề khoa học chính
3. Tạo mô phỏng HTML/CSS/JS tương tác minh họa cho chủ đề đó
4. Đảm bảo mô phỏng giúp học sinh hiểu rõ bài tập

Output Format: Bắt buộc sử dụng các separator sau để phân chia nội dung:
|||HTML_START|||
[Code HTML tại đây]
|||HTML_END|||
|||QUESTIONS_START|||
[Câu hỏi thực hành tại đây]
|||QUESTIONS_END|||
|||GUIDE_START|||
[Hướng dẫn sử dụng tại đây]
|||GUIDE_END|||
`;

const FALLBACK_ORDER = ["gemini-3-flash-preview", "gemini-3-pro-preview", "gemini-2.5-flash"];

// Build multimodal content from files
const buildContentFromFiles = (files: UploadedFile[], params: SearchParams): any[] => {
  const parts: any[] = [];

  // Add text content first
  let textPrompt = `
YÊU CẦU TẠO MÔ PHỎNG TỪ FILE BÀI TẬP

I. THÔNG TIN CONTEXT:
Môn học: ${params.subject}
Đối tượng: ${params.grade}
Thông số điều chỉnh: ${params.parameters || "Tự động xác định từ bài tập"}
Thiết bị: ${params.devices.length > 0 ? params.devices.join(", ") : "Mặc định"}

II. NỘI DUNG BÀI TẬP/TÀI LIỆU:
`;

  // Add text content from files
  const textFiles = files.filter(f => f.type === 'text' || f.type === 'pdf');
  if (textFiles.length > 0) {
    textPrompt += `\n--- Nội dung văn bản trích xuất ---\n`;
    textFiles.forEach(file => {
      textPrompt += `\n[File: ${file.name}]\n${file.content}\n`;
    });
  }

  textPrompt += `
III. YÊU CẦU OUTPUT:
A. CODE MÔ PHỎNG HTML/CSS/JS
Viết code hoàn chỉnh (Single File) với yêu cầu:
- Giao diện đơn giản, hiện đại, có tiêu đề và nút Reset.
- Sử dụng Canvas/SVG để vẽ.
- Slider/input/checkbox để điều chỉnh thông số đã nêu.
- Hiển thị giá trị real-time (số + hình ảnh).
- Tất cả nhãn bằng tiếng Việt.
- Chạy trên Chrome/Firefox/Edge (không cần plugin).
- Đảm bảo tính chính xác khoa học tương đối.
- MÔ PHỎNG PHẢI LIÊN QUAN TRỰC TIẾP đến bài tập được cung cấp.

B. CÂU HỎI THỰC HÀNH (5-7 câu)
Theo cấu trúc:
- Câu 1-2: Quan sát hiện tượng (Cái gì thay đổi khi...?)
- Câu 3-4: Đo đạc và ghi chép (Điền bảng số liệu...)
- Câu 5-6: Phân tích mối quan hệ (Tỉ lệ thuận/nghịch...)
- Câu 7: Vận dụng thực tế

C. HƯỚNG DẪN SỬ DỤNG CHO GIÁO VIÊN
- Các bước mở và chạy mô phỏng
- Cách chia sẻ với học sinh
- Lưu ý kỹ thuật (internet, thiết bị...)

LƯU Ý QUAN TRỌNG: Hãy wrap các phần nội dung bằng các thẻ delimiter đã định nghĩa trong system prompt để hệ thống có thể tách biệt chúng.
`;

  parts.push({ text: textPrompt });

  // Add images
  const imageFiles = files.filter(f => f.type === 'image');
  imageFiles.forEach(file => {
    parts.push({
      inlineData: {
        mimeType: file.mimeType,
        data: file.content
      }
    });
  });

  return parts;
};

// Parse AI response
const parseAIResponse = (text: string): AIResult => {
  const htmlMatch = text.match(/\|\|\|HTML_START\|\|\|([\s\S]*?)\|\|\|HTML_END\|\|\|/);
  const questionsMatch = text.match(/\|\|\|QUESTIONS_START\|\|\|([\s\S]*?)\|\|\|QUESTIONS_END\|\|\|/);
  const guideMatch = text.match(/\|\|\|GUIDE_START\|\|\|([\s\S]*?)\|\|\|GUIDE_END\|\|\|/);

  let cleanHtml = htmlMatch ? htmlMatch[1].trim() : "";
  if (!cleanHtml) {
    const codeBlock = text.match(/```html\s*([\s\S]*?)```/);
    cleanHtml = codeBlock ? codeBlock[1] : "";
  }
  cleanHtml = cleanHtml.replace(/^```html\s*/, '').replace(/^```\s*/, '').replace(/```$/, '');

  if (!cleanHtml) {
    throw new Error("Model trả về dữ liệu không hợp lệ (Missing HTML)");
  }

  return {
    html: cleanHtml,
    questions: questionsMatch ? questionsMatch[1].trim() : "Không có câu hỏi được tạo.",
    guide: guideMatch ? guideMatch[1].trim() : "Không có hướng dẫn được tạo."
  };
};

export const generateSimulationContent = async (
  params: SearchParams,
  apiKey: string,
  startModel: string = "gemini-3-flash-preview"
): Promise<AIResult> => {
  // Check if we have files - use multimodal approach
  if (params.uploadedFiles && params.uploadedFiles.length > 0) {
    return generateFromFiles(params.uploadedFiles, params, apiKey, startModel);
  }

  // Original text-only approach
  const modelChain = [startModel, ...FALLBACK_ORDER.filter(m => m !== startModel)];
  let lastError: any;

  for (const model of modelChain) {
    try {
      console.log(`[AI] Attempting with model: ${model}`);
      const ai = new GoogleGenAI({ apiKey });

      const prompt = `
YÊU CẦU TẠO MÔ PHỎNG KHOA HỌC

I. THÔNG TIN ĐẦU VÀO:
Môn học: ${params.subject}
Chủ đề: ${params.topic}
Đối tượng: ${params.grade}
Thông số điều chỉnh: ${params.parameters || "Không xác định"}
Kết quả mong muốn: ${params.expectedResult || "Quan sát hiện tượng chung"}
Thiết bị: ${params.devices.length > 0 ? params.devices.join(", ") : "Mặc định"}

II. YÊU CẦU OUTPUT:
A. CODE MÔ PHỎNG HTML/CSS/JS
Viết code hoàn chỉnh (Single File) với yêu cầu:
- Giao diện đơn giản, hiện đại, có tiêu đề và nút Reset.
- Sử dụng Canvas/SVG để vẽ.
- Slider/input/checkbox để điều chỉnh thông số đã nêu.
- Hiển thị giá trị real-time (số + hình ảnh).
- Tất cả nhãn bằng tiếng Việt.
- Chạy trên Chrome/Firefox/Edge (không cần plugin).
- Đảm bảo tính chính xác khoa học tương đối.

B. CÂU HỎI THỰC HÀNH (5-7 câu)
Theo cấu trúc:
- Câu 1-2: Quan sát hiện tượng (Cái gì thay đổi khi...?)
- Câu 3-4: Đo đạc và ghi chép (Điền bảng số liệu...)
- Câu 5-6: Phân tích mối quan hệ (Tỉ lệ thuận/nghịch...)
- Câu 7: Vận dụng thực tế

C. HƯỚNG DẪN SỬ DỤNG CHO GIÁO VIÊN
- Các bước mở và chạy mô phỏng
- Cách chia sẻ với học sinh
- Lưu ý kỹ thuật (internet, thiết bị...)

LƯU Ý QUAN TRỌNG: Hãy wrap các phần nội dung bằng các thẻ delimiter đã định nghĩa trong system prompt để hệ thống có thể tách biệt chúng.
      `;

      const response = await ai.models.generateContent({
        model: model,
        contents: prompt,
        config: {
          systemInstruction: SYSTEM_PROMPT,
        }
      });

      const text = response.text || "";
      return parseAIResponse(text);

    } catch (error: any) {
      console.warn(`[AI] Error with model ${model}:`, error);
      lastError = error;
      continue;
    }
  }

  console.error("All models failed.");
  if (lastError?.message?.includes("429") || lastError?.message?.includes("RESOURCE_EXHAUSTED")) {
    throw new Error(`Đã dừng do lỗi quá tải (429 RESOURCE_EXHAUSTED). Hết quota API.`);
  }
  throw new Error(`Không thể tạo mô phỏng. Lỗi: ${lastError?.message || "Unknown error"}`);
};

export const generateFromFiles = async (
  files: UploadedFile[],
  params: SearchParams,
  apiKey: string,
  startModel: string = "gemini-3-flash-preview"
): Promise<AIResult> => {
  const modelChain = [startModel, ...FALLBACK_ORDER.filter(m => m !== startModel)];
  let lastError: any;

  for (const model of modelChain) {
    try {
      console.log(`[AI] Attempting multimodal with model: ${model}`);
      const ai = new GoogleGenAI({ apiKey });

      const contentParts = buildContentFromFiles(files, params);

      const response = await ai.models.generateContent({
        model: model,
        contents: contentParts,
        config: {
          systemInstruction: SYSTEM_PROMPT_FROM_FILE,
        }
      });

      const text = response.text || "";
      return parseAIResponse(text);

    } catch (error: any) {
      console.warn(`[AI] Error with model ${model}:`, error);
      lastError = error;
      continue;
    }
  }

  console.error("All models failed for file processing.");
  if (lastError?.message?.includes("429") || lastError?.message?.includes("RESOURCE_EXHAUSTED")) {
    throw new Error(`Đã dừng do lỗi quá tải (429 RESOURCE_EXHAUSTED). Hết quota API.`);
  }
  throw new Error(`Không thể tạo mô phỏng từ file. Lỗi: ${lastError?.message || "Unknown error"}`);
};