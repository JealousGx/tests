import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });

console.log("WebSocket server is running on ws://localhost:8080");

wss.on("connection", function connection(ws) {
  console.log("new client connected");

  ws.on("error", (err) => {
    console.error("WebSocket error:", err);
  });

  ws.on("message", function message(clientMessage: Buffer) {
    try {
      const data = JSON.parse(clientMessage.toString());

      if (data.type === "audio") {
        const { audioDataUri } = data.payload;

        // Here you would process the audio data (e.g., transcription and translation)
        console.log("Received audio data");

        // For demonstration, we send back a mock translation response
        const response = {
          type: "translation",
          transcribedText: "This is a transcribed text.",
          translatedText: "Ceci est un texte transcrit.",
        };

        ws.send(JSON.stringify(response));
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
    }
  });

  ws.on("close", function close() {
    console.log("disconnected");
  });
});
