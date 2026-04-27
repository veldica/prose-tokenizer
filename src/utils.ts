import type { CharacterMetrics } from "./types.js";

export const STOPWORDS = new Set([
  "a", "an", "the", "and", "but", "if", "or", "because", "as", "until", "while",
  "of", "at", "by", "for", "with", "about", "against", "between", "into", "through",
  "during", "before", "after", "above", "below", "to", "from", "up", "down", "in",
  "out", "on", "off", "over", "under", "again", "further", "then", "once", "here",
  "there", "when", "where", "why", "how", "all", "any", "both", "each", "few",
  "more", "most", "other", "some", "such", "no", "nor", "not", "only", "own",
  "same", "so", "than", "too", "very", "s", "t", "can", "will", "just", "don",
  "should", "now"
]);

/**
 * Checks if a word is a common English stopword.
 * Normalized to lowercase and alphanumeric only.
 */
export function isStopword(word: string): boolean {
  const normalized = word.toLowerCase().replace(/[^a-z0-9]/g, "");
  return STOPWORDS.has(normalized);
}

/**
 * Calculates basic character metrics for a string.
 */
export function getCharacterMetrics(text: string): CharacterMetrics {
  return {
    character_count: text.length,
    character_count_no_spaces: text.replace(/\s/g, "").length,
    letter_count: text.replace(/[^a-zA-Z0-9]/g, "").length,
  };
}
