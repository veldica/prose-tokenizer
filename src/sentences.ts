import type { ParagraphBlock } from "./types.js";
import { splitParagraphBlocks } from "./paragraphs.js";

const SENTENCE_BREAK_REGEX = /[.!?]+["'”’)\]]*(?=\s+(?:["'“‘(]*[A-Z0-9#*_-])|\s*$)/g;
const DECIMAL_PLACEHOLDER = "\u0000";
const INNER_DOT_PLACEHOLDER = "\u0001";
const INITIAL_PLACEHOLDER = "\u0002";

const PREFIX_ABBREVIATIONS = new Set([
  "mr.",
  "mrs.",
  "ms.",
  "dr.",
  "prof.",
  "sr.",
  "jr.",
  "gen.",
  "adm.",
  "capt.",
  "col.",
  "maj.",
  "sgt.",
  "lt.",
  "st.",
  "rev.",
  "hon.",
  "gov.",
  "pres.",
  "sen.",
  "rep.",
  "mt.",
]);

const AMBIGUOUS_ABBREVIATIONS = new Set([
  "u.s.",
  "u.k.",
  "u.s.a.",
  "e.g.",
  "i.e.",
  "jan.",
  "feb.",
  "mar.",
  "apr.",
  "jun.",
  "jul.",
  "aug.",
  "sep.",
  "sept.",
  "oct.",
  "nov.",
  "dec.",
  "approx.",
  "avg.",
  "dept.",
  "est.",
  "etc.",
  "fig.",
  "inc.",
  "ltd.",
  "min.",
  "max.",
  "vs.",
]);

const SENTENCE_STARTERS = new Set([
  "the",
  "a",
  "an",
  "he",
  "she",
  "it",
  "they",
  "we",
  "i",
  "you",
  "this",
  "that",
  "there",
  "who",
  "when",
  "where",
  "while",
  "but",
  "and",
  "if",
  "then",
  "my",
  "our",
  "his",
  "her",
  "their",
]);

export function splitSentences(text: string): string[] {
  if (!text.trim()) {
    return [];
  }

  return splitSentencesFromBlocks(splitParagraphBlocks(text));
}

export function splitSentencesFromBlocks(blocks: ParagraphBlock[]): string[] {
  const sentences: string[] = [];

  for (const block of blocks) {
    for (const s of splitSentencesFromBlock(block)) { sentences.push(s); }
  }

  return sentences.filter(Boolean);
}

export function splitSentencesFromBlock(block: ParagraphBlock): string[] {
  if (block.kind === "heading") {
    return [block.text];
  }

  if (block.kind === "list_item") {
    const listItemMatch = block.text.match(/^([\s\t]*([-*+]|\d+[.)])\s+)(.*)$/);
    if (listItemMatch) {
      const [, prefix, , content] = listItemMatch;
      const itemSentences = splitSentenceInternal(content);
      if (itemSentences.length > 0) {
        itemSentences[0] = `${prefix}${itemSentences[0]}`;
        return itemSentences;
      }
    }
  }

  if (block.kind === "blockquote") {
    const blockquoteMatch = block.text.match(/^([\s\t]*>\s+)(.*)$/);
    if (blockquoteMatch) {
      const [, prefix, content] = blockquoteMatch;
      const quoteSentences = splitSentenceInternal(content);
      if (quoteSentences.length > 0) {
        quoteSentences[0] = `${prefix}${quoteSentences[0]}`;
        return quoteSentences;
      }
    }
  }

  return splitSentenceInternal(block.text);
}

function splitSentenceInternal(text: string): string[] {
  if (!text.trim()) {
    return [];
  }

  let processed = text;

  processed = processed.replace(/(\d)\.(\d)/g, `$1${DECIMAL_PLACEHOLDER}$2`);
  processed = processed.replace(/\b((?:[A-Za-z]\.){2,})(?=(?:\s|$|["')\]]))/g, (match) =>
    match.replace(/\.(?=.+\.)/g, INNER_DOT_PLACEHOLDER)
  );
  // Only protect initials if they are at the start of a word and not part of an acronym
  processed = processed.replace(/(^|[\s\t(])([A-Z])\.(?=\s+[A-Z][a-z])/g, `$1$2${INITIAL_PLACEHOLDER}`);

  const segments: string[] = [];
  let startIndex = 0;

  for (const match of processed.matchAll(SENTENCE_BREAK_REGEX)) {
    const endIndex = (match.index ?? 0) + match[0].length;
    const candidate = restorePlaceholders(processed.slice(startIndex, endIndex).trim());
    if (candidate) {
      segments.push(candidate);
    }

    startIndex = endIndex;
    while (/\s/.test(processed[startIndex] ?? "")) {
      startIndex += 1;
    }
  }

  const remainder = restorePlaceholders(processed.slice(startIndex).trim());
  if (remainder) {
    segments.push(remainder);
  }

  return mergeFalseBoundaries(segments);
}

function mergeFalseBoundaries(segments: string[]): string[] {
  const merged: string[] = [];

  for (const segment of segments) {
    if (merged.length === 0) {
      merged.push(segment);
      continue;
    }

    const previous = merged[merged.length - 1];
    const previousLastToken = previous.split(/\s+/).at(-1)?.toLowerCase() ?? "";
    const nextFirstToken = segment.split(/\s+/)[0] ?? "";
    const nextFirstTokenLower = nextFirstToken.toLowerCase();

    // 1. Prefix-only abbreviations (Mr., Dr.) should almost always be merged
    // if the next word starts with a capital letter or number.
    if (PREFIX_ABBREVIATIONS.has(previousLastToken)) {
      if (/^[A-Z0-9]/.test(nextFirstToken)) {
        merged[merged.length - 1] = `${previous} ${segment}`;
        continue;
      }
    }

    // 2. Ambiguous abbreviations (U.S.A., Jan.) should only be merged if
    // the next word is NOT a common sentence starter.
    if (AMBIGUOUS_ABBREVIATIONS.has(previousLastToken)) {
      if (!SENTENCE_STARTERS.has(nextFirstTokenLower) && /^[A-Z0-9]/.test(nextFirstToken)) {
        merged[merged.length - 1] = `${previous} ${segment}`;
        continue;
      }
    }

    merged.push(segment);
  }

  return merged;
}

function restorePlaceholders(value: string): string {
  return value
    .replaceAll(DECIMAL_PLACEHOLDER, ".")
    .replaceAll(INNER_DOT_PLACEHOLDER, ".")
    .replaceAll(INITIAL_PLACEHOLDER, ".")
    .trim();
}
