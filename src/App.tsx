import React, { useState, useMemo, useEffect } from "react";
import { Header } from "./components/Header";
import { MainArea } from "./components/MainArea";
import { StatusBar } from "./components/StatusBar";
import { PromptModal } from "./components/PromptModal";
import {
  DEFAULT_CAVEMAN_PROMPT,
  SAMPLE_CONVERSATIONS,
  SampleConversation,
} from "./constants/cavemanPrompt";
import { calculateComparison } from "./utils/tokenCounter";

export interface ApiUsage {
  promptTokens: number;
  candidatesTokens: number;
  totalTokens: number;
  estimatedCostUsd: number;
}

export default function App() {
  const [transcript, setTranscript] = useState<string>(
    SAMPLE_CONVERSATIONS[0].transcript
  );
  const [compressedText, setCompressedText] = useState<string>("");
  const [apiUsage, setApiUsage] = useState<ApiUsage | null>(null);
  const [prompt, setPrompt] = useState<string>(DEFAULT_CAVEMAN_PROMPT);
  const [level, setLevel] = useState<"lite" | "full" | "ultra">("full");
  const [isPromptModalOpen, setIsPromptModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"split" | "input" | "output">(
    "split"
  );

  // Live Token & Word & Character Calculation
  const stats = useMemo(() => {
    return calculateComparison(transcript, compressedText);
  }, [transcript, compressedText]);

  // Handler for compression request
  const handleCompress = async () => {
    if (!transcript || transcript.trim().length === 0) {
      setErrorMessage("Veuillez saisir ou coller un texte de conversation.");
      setTimeout(() => setErrorMessage(null), 3000);
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/compress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          transcript,
          prompt,
          level,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Erreur lors de la compression par Gemini.");
      }

      setCompressedText(data.compressedText);
      if (data.apiUsage) {
        setApiUsage(data.apiUsage);
      }
    } catch (err: any) {
      console.error("Compression error:", err);
      setErrorMessage(
        err.message || "Une erreur est survenue lors de l'appel à l'API Gemini."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPreset = (preset: SampleConversation) => {
    setTranscript(preset.transcript);
    setCompressedText("");
    setApiUsage(null);
  };

  const handleClear = () => {
    setTranscript("");
    setCompressedText("");
    setApiUsage(null);
  };

  const handleResetPrompt = () => {
    setPrompt(DEFAULT_CAVEMAN_PROMPT);
  };

  // Keyboard shortcut Ctrl+Enter / Cmd+Enter to launch compression
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        handleCompress();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [transcript, prompt, level]);

  const isCustomPrompt = prompt.trim() !== DEFAULT_CAVEMAN_PROMPT.trim();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Top Header */}
      <Header
        level={level}
        setLevel={setLevel}
        onOpenPromptModal={() => setIsPromptModalOpen(true)}
        onCompress={handleCompress}
        isLoading={isLoading}
        onSelectPreset={handleSelectPreset}
        onClear={handleClear}
        viewMode={viewMode}
        setViewMode={setViewMode}
        isCustomPrompt={isCustomPrompt}
        transcriptLength={transcript.length}
      />

      {/* Main Split Section - Fills the entire right/center section */}
      <MainArea
        transcript={transcript}
        setTranscript={setTranscript}
        compressedText={compressedText}
        setCompressedText={setCompressedText}
        isLoading={isLoading}
        viewMode={viewMode}
        onCompress={handleCompress}
        errorMessage={errorMessage}
      />

      {/* Bottom Status & Token Statistics Bar */}
      <StatusBar
        stats={stats}
        compressedText={compressedText}
        apiUsage={apiUsage}
      />

      {/* System Prompt Customization Modal */}
      <PromptModal
        isOpen={isPromptModalOpen}
        onClose={() => setIsPromptModalOpen(false)}
        prompt={prompt}
        setPrompt={setPrompt}
        onReset={handleResetPrompt}
      />
    </div>
  );
}
