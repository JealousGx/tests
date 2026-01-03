import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText, type UserModelMessage } from "ai";
import z from "zod";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

const TranscriptionInputSchema = z.object({
  audioDataUri: z
    .string()
    .describe(
      "Audio data as a data URI that must include MIME type and use base64 encoding. The expected format: 'data:<MIME-type>;base64,<data>'."
    ),
});

const TranscriptionOutputSchema = z.object({
  transcribedText: z.string().describe("The transcribed text from the audio."),
});

type TranscriptionInput = z.infer<typeof TranscriptionInputSchema>;

export async function realTimeTranscription(input: TranscriptionInput) {
  const { audioDataUri } = TranscriptionInputSchema.parse(input);

  const userMessage: UserModelMessage = {
    role: "user",
    content: [
      {
        type: "text",
        text: "Transcribe the following audio data to text.",
      },
      {
        type: "image",
        image: new URL(audioDataUri),
      },
    ],
  };

  const { text: transcription } = await generateText({
    model: google("gemini-2.5-flash"),
    messages: [userMessage],
  });

  return TranscriptionOutputSchema.parse({
    transcribedText: transcription,
  });
}
