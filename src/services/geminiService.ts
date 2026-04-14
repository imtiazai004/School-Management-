import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const getPredictiveAnalytics = async (studentData: any) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `
        Analyze the following student data and provide predictive insights on their academic performance.
        Data: ${JSON.stringify(studentData)}
        
        Please provide:
        1. Predicted performance trend (Improving, Stable, At Risk).
        2. Specific subjects needing attention.
        3. Actionable recommendations for teachers.
        4. A short motivational message for the student.
        
        Format the response as a clean JSON object.
      `,
      config: {
        responseMimeType: "application/json"
      }
    });
    
    const text = response.text;
    if (text) {
      return JSON.parse(text);
    }
    return { error: "Failed to parse analytics" };
  } catch (error) {
    console.error("Gemini Analytics Error:", error);
    return { error: "Analytics service unavailable" };
  }
};

export const generateSocialPost = async (achievement: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `
        Create an engaging social media post for a school's Facebook and Instagram pages based on this achievement: "${achievement}".
        Include relevant emojis and hashtags. Keep it professional yet exciting.
      `
    });

    return response.text || "Failed to generate social post.";
  } catch (error) {
    console.error("Gemini Social Post Error:", error);
    return "Failed to generate social post.";
  }
};
