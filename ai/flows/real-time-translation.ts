import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText, type UserModelMessage } from "ai";
import z from "zod";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

const TranslationInputSchema = z.object({
  text: z.string().describe("The text to be translated."),
  targetLanguage: z.string().describe("The target language for translation."),
});

const TranslationOutputSchema = z.object({
  translatedText: z.string().describe("The translated text."),
});

type TranslationInput = z.infer<typeof TranslationInputSchema>;

export async function realTimeTranslation(input: TranslationInput) {
  const { text, targetLanguage } = TranslationInputSchema.parse(input);

  const userMessage: UserModelMessage = {
    role: "user",
    content: `Translate the following text to ${targetLanguage}:\n\n${text}`,
  };

  const { text: translation } = await generateText({
    model: google("gemini-2.5-flash"),
    messages: [userMessage],
  });

  return TranslationOutputSchema.parse({
    translatedText: translation,
  });
}
