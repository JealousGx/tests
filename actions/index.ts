import z from "zod";

import { realTimeTranscription } from "@/ai/flows/real-time-transcription";
import { realTimeTranslation } from "@/ai/flows/real-time-translation";

const ActionInputSchema = z.object({
  audioDataUri: z.string(),
  targetLanguage: z.string(),
});

type ActionInput = z.infer<typeof ActionInputSchema>;

export async function processAudioAndTranslate(input: ActionInput) {
  const parsed = ActionInputSchema.safeParse(input);

  if (!parsed.success) {
    return {
      error: "Invalid input",
    };
  }

  const { audioDataUri, targetLanguage } = parsed.data;

  try {
    const transcriptionRes = await realTimeTranscription({ audioDataUri });
    console.log("transcriptionRes", transcriptionRes);

    const { transcribedText } = transcriptionRes;

    if (!transcribedText.trim()) {
      return {
        data: {
          transcribedText: "",
          translatedText: "",
        },
      };
    }

    const translationRes = await realTimeTranslation({
      text: transcribedText,
      targetLanguage,
    });
    console.log("translationRes", translationRes);

    const { translatedText } = translationRes;

    return {
      data: {
        transcribedText,
        translatedText,
      },
    };
  } catch (err) {
    console.error("Error in processAudioAndTranslate:", err);
    return {
      error: "Internal server error",
    };
  }
}
