import { getEncoding } from "js-tiktoken";

let encoderInstance: ReturnType<typeof getEncoding> | null = null;

function getEncoder() {
  if (!encoderInstance) {
    try {
      encoderInstance = getEncoding("cl100k_base");
    } catch (err) {
      console.warn("js-tiktoken initialization failed, falling back to approximation:", err);
    }
  }
  return encoderInstance;
}

export interface TextStats {
  characters: number;
  words: number;
  tokens: number;
}

export interface CompressionComparison {
  original: TextStats;
  compressed: TextStats;
  tokenSavingsPercent: number; // e.g. 64.5
  wordSavingsPercent: number;  // e.g. 58.2
  charSavingsPercent: number;  // e.g. 61.1
}

/**
 * Counts characters, words, and tokens for a given text string.
 */
export function calculateTextStats(text: string): TextStats {
  if (!text || text.trim().length === 0) {
    return { characters: 0, words: 0, tokens: 0 };
  }

  const characters = text.length;

  // Words count: splits on whitespace
  const wordsMatch = text.trim().match(/\S+/g);
  const words = wordsMatch ? wordsMatch.length : 0;

  // Tokens count using js-tiktoken cl100k_base
  let tokens = 0;
  try {
    const enc = getEncoder();
    if (enc) {
      tokens = enc.encode(text).length;
    } else {
      // Fallback approximation (~4 chars per token)
      tokens = Math.ceil(text.length / 4);
    }
  } catch (e) {
    tokens = Math.ceil(text.length / 4);
  }

  return { characters, words, tokens };
}

/**
 * Calculates comparison savings between original and compressed text.
 */
export function calculateComparison(
  originalText: string,
  compressedText: string
): CompressionComparison {
  const original = calculateTextStats(originalText);
  const compressed = calculateTextStats(compressedText);

  const tokenSavingsPercent =
    original.tokens > 0
      ? Math.max(0, Number((((original.tokens - compressed.tokens) / original.tokens) * 100).toFixed(1)))
      : 0;

  const wordSavingsPercent =
    original.words > 0
      ? Math.max(0, Number((((original.words - compressed.words) / original.words) * 100).toFixed(1)))
      : 0;

  const charSavingsPercent =
    original.characters > 0
      ? Math.max(0, Number((((original.characters - compressed.characters) / original.characters) * 100).toFixed(1)))
      : 0;

  return {
    original,
    compressed,
    tokenSavingsPercent,
    wordSavingsPercent,
    charSavingsPercent,
  };
}
