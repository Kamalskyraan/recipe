import axios from "axios";

const TRANSLATION_URL =
  "https://transmodel.skyraantech.com/server/translate";

export const translateText = async (
  text: string,
  target: string
): Promise<string> => {
  if (target === "en") return text;

  try {
    const { data } = await axios.post(
      TRANSLATION_URL,
      {
        text,
        source: "en",
        target,
      },
      {
        timeout: 60000,
      }
    );

    return data.translated;
  } catch (err: any) {
    console.log(err.response?.data || err.message);

    return text;
  }
};