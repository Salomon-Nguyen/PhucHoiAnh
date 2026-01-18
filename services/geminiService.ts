import { GoogleGenerativeAI } from "@google/generative-ai";

export const restoreImage = async (
  base64Image: string,
  config: any,
  onProgress: any
): Promise<string> => {
  const genAI = new GoogleGenerativeAI("AIzaSyBjg0qsF2HTngglxrCE75u3SHAXnzyJSg");
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  try {
    if (onProgress) onProgress(50, "Đang xử lý với Gemini AI...");
    const imageData = base64Image.split(",")[1];
    const result = await model.generateContent([
      "Phục hồi ảnh cũ, làm nét và khử nhiễu chuyên sâu.",
      { inlineData: { data: imageData, mimeType: "image/jpeg" } }
    ]);
    if (onProgress) onProgress(100, "Thành công!");
    return result.response.text();
  } catch (error) {
    console.error(error);
    throw error;
  }
}
