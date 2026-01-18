import { GoogleGenerativeAI } from "@google/generative-ai";

export const restoreImage = async (
  base64Image: string,
  config: any,
  onProgress: (progress: number, status: string) => void
): Promise<string> => {
  const genAI = new GoogleGenerativeAI("AIzaSyBjg0qsF2HTngglxrCE75u3SHAXnzyJSg");
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  try {
    onProgress(10, "Đang phân tích ảnh...");
    const imageData = base64Image.split(",")[1];
    const result = await model.generateContent([
      "Phục hồi ảnh cũ, làm nét và khử nhiễu.",
      { inlineData: { data: imageData, mimeType: "image/jpeg" } }
    ]);
    onProgress(100, "Hoàn tất!");
    return result.response.text();
  } catch (error) {
    console.error(error);
    throw error;
  }
};
