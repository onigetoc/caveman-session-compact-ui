import React from "react";
import {
  Zap,
  FileCode,
  Sliders,
  Columns,
  Maximize2,
  Minimize2,
  Trash2,
  RotateCcw,
  Sparkles,
  ChevronDown,
  Loader2,
} from "lucide-react";
import { SAMPLE_CONVERSATIONS, SampleConversation } from "../constants/cavemanPrompt";

interface HeaderProps {
  level: "lite" | "full" | "ultra";
  setLevel: (level: "lite" | "full" | "ultra") => void;
  onOpenPromptModal: () => void;
  onCompress: () => void;
  isLoading: boolean;
  onSelectPreset: (preset: SampleConversation) => void;
  onClear: () => void;
  viewMode: "split" | "input" | "output";
  setViewMode: (mode: "split" | "input" | "output") => void;
  isCustomPrompt: boolean;
  transcriptLength: number;
}

export const Header: React.FC<HeaderProps> = ({
  level,
  setLevel,
  onOpenPromptModal,
  onCompress,
  isLoading,
  onSelectPreset,
  onClear,
  viewMode,
  setViewMode,
  isCustomPrompt,
  transcriptLength,
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800/80 px-4 py-3 text-slate-100 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-20 shadow-md">
      {/* Brand & Title */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl text-slate-950 font-black shadow-lg shadow-amber-500/20 flex items-center justify-center">
          <Zap className="w-5 h-5 fill-slate-950" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold text-slate-100 tracking-tight">
              Caveman Conversation Compressor
            </h1>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-amber-400 border border-amber-500/30">
              Gemini AI
            </span>
          </div>
          <p className="text-xs text-slate-400 hidden sm:block">
            Compression haute fidélité sans perte de sens ni de contexte
          </p>
        </div>
      </div>

      {/* Center Controls: Presets & Intensity Level */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Preset Selector */}
        <div className="relative group">
          <select
            onChange={(e) => {
              const selected = SAMPLE_CONVERSATIONS.find(
                (c) => c.id === e.target.value
              );
              if (selected) onSelectPreset(selected);
              e.target.value = "";
            }}
            defaultValue=""
            className="appearance-none bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-medium py-1.5 pl-3 pr-8 rounded-xl cursor-pointer focus:outline-none focus:ring-1 focus:ring-amber-500/50 transition-colors"
          >
            <option value="" disabled>
              ⚡ Charger un exemple...
            </option>
            {SAMPLE_CONVERSATIONS.map((preset) => (
              <option key={preset.id} value={preset.id}>
                {preset.title} ({preset.category})
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Level Selector */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <span className="px-2 text-[10px] font-semibold text-slate-500 uppercase tracking-wider hidden md:inline">
            Niveau:
          </span>
          <button
            onClick={() => setLevel("lite")}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
              level === "lite"
                ? "bg-slate-800 text-amber-300 font-semibold shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
            title="Lite: phrases courtes dépouillées"
          >
            Lite
          </button>
          <button
            onClick={() => setLevel("full")}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
              level === "full"
                ? "bg-amber-500 text-slate-950 font-bold shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
            title="Full: style classique caveman télégraphique (par défaut)"
          >
            Full
          </button>
          <button
            onClick={() => setLevel("ultra")}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
              level === "ultra"
                ? "bg-slate-800 text-amber-300 font-semibold shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
            title="Ultra: ultra-condensé, un mot par fait"
          >
            Ultra
          </button>
        </div>

        {/* View Mode Toggle - 2 buttons total: Columns and Toggle Maximize/Minimize */}
        <div className="hidden lg:flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setViewMode("split")}
            className={`p-1.5 rounded-lg transition-colors ${
              viewMode === "split"
                ? "bg-slate-800 text-amber-400"
                : "text-slate-400 hover:text-slate-200"
            }`}
            title="Vue côte à côte"
          >
            <Columns className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode(viewMode === "split" ? "output" : "split")}
            className={`p-1.5 rounded-lg transition-colors ${
              viewMode !== "split"
                ? "bg-slate-800 text-amber-400"
                : "text-slate-400 hover:text-slate-200"
            }`}
            title={
              viewMode === "split"
                ? "Agrandir la vue (Focus)"
                : "Réduire la vue (Retour côte à côte)"
            }
          >
            {viewMode === "split" ? (
              <Maximize2 className="w-4 h-4" />
            ) : (
              <Minimize2 className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Right Actions: Prompt Config & Compression Button */}
      <div className="flex items-center gap-2">
        {/* Clear Button */}
        {transcriptLength > 0 && (
          <button
            onClick={onClear}
            className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-xl transition-colors"
            title="Effacer le texte"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}

        {/* Edit Prompt Button */}
        <button
          onClick={onOpenPromptModal}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl border transition-colors ${
            isCustomPrompt
              ? "bg-amber-500/10 border-amber-500/40 text-amber-300"
              : "bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white"
          }`}
          title="Consulter ou modifier le prompt système Caveman"
        >
          <FileCode className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">Prompt Caveman</span>
          {isCustomPrompt && (
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          )}
        </button>

        {/* Compression Action Button */}
        <button
          onClick={onCompress}
          disabled={isLoading || transcriptLength === 0}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl shadow-lg transition-all ${
            isLoading || transcriptLength === 0
              ? "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-800"
              : "bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 hover:from-amber-300 hover:to-amber-400 shadow-amber-500/20 active:scale-95"
          }`}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
              <span>Compression...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 fill-slate-950" />
              <span>Compresser (Caveman)</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
};
