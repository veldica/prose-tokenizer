export function splitWords(text: string): string[] {
  if (!text.trim()) {
    return [];
  }

  // Handle:
  // 1. Contractions: can't, it's
  // 2. Hyphenated words: well-being
  // 3. Decimals: 2.5
  // 4. Numerical commas: 1,000
  // 5. Acronyms: U.S.A.
  const wordRegex = /[a-z0-9]+(?:['’][a-z0-9]+|-[a-z0-9]+|\.[a-z0-9]+|,\d+)*/gi;
  const matches = text.match(wordRegex);
  if (!matches) {
    return [];
  }

  return matches
    .map((word) => word.toLowerCase())
    .filter((word) => /[a-z0-9]/.test(word))
    .map((word) => word.replace(/[.-]+$/g, ""));
}
