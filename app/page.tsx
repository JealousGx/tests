'use client';

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Mic } from "lucide-react";

export default function Home() {
  const [transcribedText, setTranscribedText] = useState("What you said");
  const [translatedText, setTranslatedText] = useState("What the translation is");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-6 md:p-8">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center p-6">
          <CardTitle className="text-2xl font-bold">Live Translation App</CardTitle>

          <CardDescription className="text-lg">Real time Voice Translation Using AI</CardDescription>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          <div className="space-y-2">
            <h3 className="font-semibold">You said:</h3>

            <p className="border rounded-md p-4 bg-accent/50 text-foreground font-semibold min-h-24">{transcribedText}</p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">Translation</h3>

            <p className="border rounded-md p-4 bg-accent/50 text-foreground font-semibold min-h-24">{translatedText}</p>
          </div>
        </CardContent>

        <CardFooter className="flex items-center justify-center p-6">
          <Button className="w-20 h-20 rounded-full shadow-lg" size="icon"><Mic className="w-8 h-8" /></Button>
        </CardFooter>
      </Card>
    </main>
  );
}
