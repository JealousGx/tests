import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });

console.log("WebSocket server is running on ws://localhost:8080");

wss.on("connection", function connection(ws) {
  console.log("new client connected");

  ws.on("error", (err) => {
    console.error("WebSocket error:", err);
  });

  ws.on("message", function message(data: Buffer) {
    console.log("received: %s", data);
  });

  ws.on("close", function close() {
    console.log("disconnected");
  });
});
