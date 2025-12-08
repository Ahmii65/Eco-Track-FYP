import axios from "axios";

export const geminiCall = async (input: string) => {
  const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
  try {
    const response = await axios.post(url, {
      model: "gemini-2.5-flash",
      contents: [
        {
          parts: [
            {
              text: input,
            },
          ],
        },
      ],
    });
    return response?.data;
  } catch (error: any) {
    console.log(error);
    throw error;
  }
};
