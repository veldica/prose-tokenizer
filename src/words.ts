export function splitWords(text: string): string[] {
  if (!text.trim()) {
    return [];
  }

  const wordRegex = /[a-z0-9]+(?:['’][a-z0-9]+|-[a-z0-9]+|\.[0-9]+)*/gi;
  const matches = text.match(wordRegex);
  if (!matches) {
    return [];
  }

  return matches
    .map((word) => word.toLowerCase())
    .filter((word) => /[a-z0-9]/.test(word))
    .map((word) => word.replace(/[.-]+$/g, ""));
}
