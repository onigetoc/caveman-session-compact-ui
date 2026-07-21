import React from "react";
import { RotateCcw, X, Check, FileCode, Info } from "lucide-react";
import { DEFAULT_CAVEMAN_PROMPT } from "../constants/cavemanPrompt";

interface PromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  prompt: string;
  setPrompt: (value: string) => void;
  onReset: () => void;
}

export const PromptModal: React.FC<PromptModalProps> = ({
  isOpen,
  onClose,
  prompt,
  setPrompt,
  onReset,
}) => {
  if (!isOpen) return null;

  const isDefault = prompt.trim() === DEFAULT_CAVEMAN_PROMPT.trim();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 text-slate-100 rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-lg">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
                Caveman System Prompt
                {!isDefault && (
                  <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Modified
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-400">
                Customize the instructions sent to Gemini for compression
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Info Banner */}
        <div className="bg-slate-800/40 px-6 py-2.5 border-b border-slate-800/60 flex items-center gap-2 text-xs text-slate-300">
          <Info className="w-4 h-4 text-cyan-400 flex-shrink-0" />
          <span>
            This prompt dictates telegraphic style, 100% loss-free fact retention, and output layout.
          </span>
        </div>

        {/* Modal Body / Textarea */}
        <div className="p-6 flex-1 overflow-y-auto">
          <label className="block text-xs font-medium text-slate-400 mb-2">
            Compression Instructions (System Prompt)
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full h-96 p-4 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-slate-200 leading-relaxed focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 resize-y"
            placeholder="Enter system prompt instructions..."
            spellCheck={false}
          />
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/50 flex items-center justify-between gap-4">
          <button
            onClick={onReset}
            disabled={isDefault}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-xl border transition-colors ${
              isDefault
                ? "border-slate-800 text-slate-600 bg-slate-900 cursor-not-allowed"
                : "border-slate-700 text-slate-300 bg-slate-800/80 hover:bg-slate-800 hover:text-white"
            }`}
            title="Restore default Caveman prompt"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset to Original Prompt
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-lg shadow-amber-400/20 transition-all"
            >
              <Check className="w-4 h-4" />
              Apply Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
