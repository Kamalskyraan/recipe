import { translate } from "google-translate-api-x";

export const translateText = async (text: string, targetLang: string) => {
  try {
    const result = await translate(text, {
      to: targetLang,
    });

    return result.text;
  } catch (error) {
    console.log("Translation Error:", error);
    return text;
  }
};
