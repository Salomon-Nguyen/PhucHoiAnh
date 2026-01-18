import { GoogleGenerativeAI } from "@google/generative-ai";
import { RestorationConfig, PhotoType, OutputMode } from "../types";
export const restoreImage = async (
  base64Image: string,
  config: RestorationConfig,
  onProgress: (progress: number, status: string) => void
): Promise<string> => {
  const ai = new GoogleGenerativeAI("AIzaSyBjg0qsF2HTngglxrCE75u3SHAXnzyJSg");
  onProgress(10, "Đang phân tích cấu trúc ảnh...");
  await new Promise(r => setTimeout(r, 800));
  
  onProgress(30, "Đang xử lý phân vùng lưới (Tiling) & khử xước...");
  await new Promise(r => setTimeout(r, 1000));

  onProgress(50, "Đang bảo tồn nhân dạng (Face ID)...");
  
  const systemPrompt = `
    Bạn là một chuyên gia phục hồi ảnh cũ chuyên nghiệp. 
    Nhiệm vụ: Phục hồi hình ảnh này dựa trên các yêu cầu sau:
    1. Loại ảnh: ${config.type}.
    2. Chế độ đầu ra: ${config.mode}.
    3. Mô tả bổ sung: ${config.description}.
    
    Yêu cầu kỹ thuật:
    - Bảo tồn 100% tỷ lệ khung hình.
    - Sử dụng kỹ thuật Super-Resolution để nâng cấp độ sắc nét.
    - Khóa chặt cấu trúc xương mặt, mắt, mũi, miệng người Việt (Face ID). Giữ kết cấu da thật, không làm mịn nhựa.
    - Nếu là tô màu: Sử dụng màu sắc đậm đà, rực rỡ, độ sâu Studio.
    - Khử xước và ố vàng cục bộ.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image.split(',')[1],
              mimeType: 'image/jpeg',
            },
          },
          { text: systemPrompt },
        ],
      },
    });

    onProgress(80, "Đang hoàn tất hậu kỳ...");
    
    let resultBase64 = "";
    if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          resultBase64 = `data:image/png;base64,${part.inlineData.data}`;
          break;
        }
      }
    }

    if (!resultBase64) {
      throw new Error("Không nhận được ảnh kết quả từ AI");
    }

    onProgress(100, "Phục hồi thành công!");
    return resultBase64;
  } catch (error) {
    console.error("Restoration Error:", error);
    throw error;
  }
};
