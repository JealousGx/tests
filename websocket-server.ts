import { config } from "dotenv";
import { WebSocketServer } from "ws";

import { processAudioAndTranslate } from "./actions";

config();

const wss = new WebSocketServer({ port: 8080 });

console.log("WebSocket server is running on ws://localhost:8080");

wss.on("connection", function connection(ws) {
  console.log("new client connected");
  let isProcessing = false;

  ws.on("error", (err) => {
    console.error("WebSocket error:", err);
  });

  ws.on("message", async (clientMessage: Buffer) => {
    try {
      const data = JSON.parse(clientMessage.toString());

      if (data.type === "audio") {
        if (isProcessing) {
          ws.send(
            JSON.stringify({
              type: "error",
              message: "Still processing previous audio; please wait.",
            })
          );
          return;
        }

        isProcessing = true;

        const { audioDataUri, targetLanguage } = data.payload;

        console.log("Received audio data");

        const result = await processAudioAndTranslate({
          audioDataUri,
          targetLanguage,
        });

        if (result.error) {
          ws.send(
            JSON.stringify({
              type: "error",
              message: result.error,
            })
          );
          return;
        }

        ws.send(
          JSON.stringify({
            type: "translation",
            data: result.data,
          })
        );
      }
    } catch (err) {
      console.error("Error processing message:", err);
      const errorResponse = {
        type: "error",
        message: "Invalid message format",
      };

      if (err instanceof Error && err.message) {
        errorResponse.message = err.message;
      }

      ws.send(JSON.stringify(errorResponse));
    } finally {
      isProcessing = false;
    }
  });

  ws.on("close", function close() {
    console.log("disconnected");
  });
});
