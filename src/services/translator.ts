import axios from "axios";

const TRANSLATE_API = "https://transmodel.skyraantech.com/server/translate";

export const translateText = async (
  text: string,
  targetLang: string,
  sourceLang: string = "en",
): Promise<string> => {
  try {
    const { data } = await axios.post(
      TRANSLATE_API,
      {
        text,
        source: sourceLang,
        target: targetLang,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 60000,
      },
    );

    if (data?.success) {
      return data.translated;
    }

    return text;
  } catch (err: any) {
    console.error("Translation API Error:", err?.response?.data || err.message);

    return text;
  }
};
