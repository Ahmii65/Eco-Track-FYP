import axios from "axios";

export const geminiCall = async (input: string) => {
  const apiKey = "AIzaSyDzKoheCegQ1cPaieghJ3I8yH2sEgJkMVE";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
  try {
    const response = await axios.post(url, {
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
    console.log("Gemini API Error:", error.response?.data || error.message);
    throw error;
  }
};
