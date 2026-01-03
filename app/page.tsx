"use client";

import { LoaderIcon, Mic, Square } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const WEBSOCKET_URL = "ws://localhost:8080";

export default function Home() {
  const [transcribedText, setTranscribedText] = useState("What you said");
  const [translatedText, setTranslatedText] = useState(
    "What the translation is"
  );
  const [hasPermission, setHasPermission] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const socketRef = useRef<WebSocket | null>(null);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }

    if (socketRef.current) {
      socketRef.current.close();
    }

    setIsRecording(false);
    setIsProcessing(false);
    console.log("Recording stopped");
  }, []);

  const connectWebSocket = useCallback(() => {
    if (socketRef.current && socketRef.current.readyState < 2) return;

    socketRef.current = new WebSocket(WEBSOCKET_URL);

    socketRef.current.onopen = () => {
      console.log("WebSocket connected");
    };

    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "translation") {
        if (data.transcribedText) setTranscribedText(data.transcribedText);

        if (data.translatedText) setTranslatedText(data.translatedText);
      } else if (data.type === "error") {
        console.log("Error from server:", data.message);
        setTranscribedText((prev) => `${prev} [Error: ${data.message}]`);
      }
    };

    socketRef.current.onerror = (err) => {
      console.error("WebSocket error:", err);
      if (isRecording) stopRecording();
    };

    socketRef.current.onclose = () => {
      console.log("WebSocket closed");
      if (isRecording) stopRecording();
    };
  }, [isRecording, stopRecording]);

  useEffect(() => {
    connectWebSocket();

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [connectWebSocket]);

  const processAudio = useCallback((blob: Blob) => {
    setIsProcessing(true);

    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      const base64audio = reader.result;

      if (
        socketRef.current &&
        socketRef.current.readyState === WebSocket.OPEN
      ) {
        socketRef.current.send(
          JSON.stringify({
            type: "audio",
            payload: {
              audioDataUri: base64audio,
            },
          })
        );
      } else {
        console.error("WebSocket is not connected");
        setIsProcessing(false);
      }
    };
  }, []);

  const startRecording = useCallback(async () => {
    console.log("Recording started...");
    setTranscribedText("");
    setTranslatedText("");

    try {
      connectWebSocket();

      // Ask for microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setHasPermission(true);

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (
          event.data.size > 0 &&
          socketRef.current?.readyState === WebSocket.OPEN
        ) {
          processAudio(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        stream.getTracks().forEach((track) => {
          track.stop();
        });

        if (socketRef.current?.readyState === WebSocket.OPEN) {
          socketRef.current.send(JSON.stringify({ type: "stop" }));
        }
      };

      mediaRecorder.start(250);
      setIsRecording(true);
    } catch (err) {
      console.error("Microphone access denied or error:", err);
      setHasPermission(false);
    }
  }, [connectWebSocket, processAudio]);

  const handleToggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handleRequstPermission = useCallback(async () => {
    if (hasPermission) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setHasPermission(true);

      // Stop the mic immediately if you only need permission
      stream.getTracks().forEach((track) => {
        track.stop();
      });
    } catch (error) {
      console.error("Microphone permission denied:", error);
      setHasPermission(false);
    }
  }, [hasPermission]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-6 md:p-8">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center p-6">
          <CardTitle className="text-2xl font-bold">
            Live Translation App
          </CardTitle>

          <CardDescription className="text-lg">
            Real time Voice Translation Using AI
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          <div className="space-y-2">
            <h3 className="font-semibold">You said:</h3>

            <p className="border rounded-md p-4 bg-accent/50 text-foreground font-semibold min-h-24">
              {transcribedText}
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">Translation</h3>

            <p className="border rounded-md p-4 bg-accent/50 text-foreground font-semibold min-h-24">
              {translatedText}
            </p>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-4 items-center justify-center p-6">
          <Button
            onClick={
              !hasPermission ? handleRequstPermission : handleToggleRecording
            }
            disabled={isRecording && isProcessing}
            className="w-20 h-20 rounded-full shadow-lg"
            size="icon"
          >
            {isRecording && isProcessing ? (
              <LoaderIcon className="w-8 h-8" />
            ) : isRecording ? (
              <Square className="w-8 h-8" />
            ) : (
              <Mic className="w-8 h-8" />
            )}
          </Button>
          <p text-sm>
            {!hasPermission
              ? "Tap to request mic permission"
              : isRecording
                ? isProcessing
                  ? "Processing..."
                  : "Recording... Tap to stop"
                : "Tap to start recording"}
          </p>
        </CardFooter>
      </Card>
    </main>
  );
}
