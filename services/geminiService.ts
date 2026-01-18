import { GoogleGenerativeAI } from "@google/generative-ai";
import { RestorationConfig, PhotoType, OutputMode } from "../types";

export const restoreImage = async (
  base64Image: string,
  config: RestorationConfig,
  onProgress: (progress: number, status: string) => void
): Promise<string> => {
  // Dán trực tiếp API Key vào đây
  const genAI = new GoogleGenerativeAI("AIzaSyBjg0qsF2HTngglxrCE75u3SHAXnzyJSg");
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  try {
    onProgress(10, "Đang khởi tạo AI...");
    const imageData = base64Image.split(",")[1];
    
    const prompt = `Phục hồi ảnh cũ, làm nét và khử nhiễu.`;
    
    const result = await model.generateContent([
      prompt,
      { inlineData: { data: imageData, mimeType: "image/jpeg" } }
    ]);

    onProgress(100, "Hoàn tất!");
    return result.response.text();
  } catch (error) {
    console.error("Lỗi AI:", error);
    throw error;
  }
};
