import { GoogleGenAI } from "@google/genai";
import { SearchParams, AIResult } from "../types";



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

const FALLBACK_ORDER = ["gemini-3-flash-preview", "gemini-3-pro-preview", "gemini-2.5-flash"];

export const generateSimulationContent = async (params: SearchParams, apiKey: string, startModel: string = "gemini-3-flash-preview"): Promise<AIResult> => {
  // Create an execution chain: Start with selected model, then follow the fallback order (removing duplicates)
  const modelChain = [startModel, ...FALLBACK_ORDER.filter(m => m !== startModel)];

  let lastError: any;

  for (const model of modelChain) {
    try {
      console.log(`[AI] Attempting with model: ${model}`);

      const ai = new GoogleGenAI({ apiKey }); // Initialize with provided key

      // Construct user prompt based on specific requirements
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

      // Parsing logic using delimiters
      const htmlMatch = text.match(/\|\|\|HTML_START\|\|\|([\s\S]*?)\|\|\|HTML_END\|\|\|/);
      const questionsMatch = text.match(/\|\|\|QUESTIONS_START\|\|\|([\s\S]*?)\|\|\|QUESTIONS_END\|\|\|/);
      const guideMatch = text.match(/\|\|\|GUIDE_START\|\|\|([\s\S]*?)\|\|\|GUIDE_END\|\|\|/);

      // Fallback if delimiters are missing (try to clean markdown code blocks for HTML)
      let cleanHtml = htmlMatch ? htmlMatch[1].trim() : "";
      if (!cleanHtml) {
        // Try standard markdown extraction as backup
        const codeBlock = text.match(/```html\s*([\s\S]*?)```/);
        cleanHtml = codeBlock ? codeBlock[1] : "";
      }
      // Remove markdown ```html wrap if it exists inside the delimiter content
      cleanHtml = cleanHtml.replace(/^```html\s*/, '').replace(/^```\s*/, '').replace(/```$/, '');

      if (!cleanHtml) {
        throw new Error("Model trả về dữ liệu không hợp lệ (Missing HTML)");
      }

      return {
        html: cleanHtml,
        questions: questionsMatch ? questionsMatch[1].trim() : "Không có câu hỏi được tạo.",
        guide: guideMatch ? guideMatch[1].trim() : "Không có hướng dẫn được tạo."
      };

    } catch (error: any) {
      console.warn(`[AI] Error with model ${model}:`, error);
      lastError = error;
      // Continue to next model in loop
      continue;
    }
  }

  // If we exhaust the loop
  console.error("All models failed.");
  if (lastError?.message?.includes("429") || lastError?.message?.includes("RESOURCE_EXHAUSTED")) {
    throw new Error(`Đã dừng do lỗi quá tải (429 RESOURCE_EXHAUSTED). Hết quota API.`);
  }
  throw new Error(`Không thể tạo mô phỏng. Lỗi: ${lastError?.message || "Unknown error"}`);
};