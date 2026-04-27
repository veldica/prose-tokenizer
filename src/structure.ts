import { getLineMetadata } from "./markdown.js";
import { splitParagraphBlocks } from "./paragraphs.js";
import { splitSentencesFromBlocks } from "./sentences.js";
import { splitWords } from "./words.js";
import { getCharacterMetrics } from "./utils.js";
import type { StructureCounts, TokenizedDocument } from "./types.js";

export function countHeadings(input: string | string[]): number {
  return getLineMetadata(input).heading_count;
}

export function countListItems(input: string | string[]): number {
  return getLineMetadata(input).list_item_count;
}

export function countBlockquotes(input: string | string[]): number {
  return getLineMetadata(input).blockquote_count;
}

export function getStructureCounts(text: string): StructureCounts {
  const tokenized = tokenize(text);
  return tokenized.counts;
}

/**
 * Primary entry point for tokenizing English prose and Markdown.
 * Returns a structured document with blocks, paragraphs, sentences, and words.
 */
export function tokenize(text: string): TokenizedDocument {
  const blocks = splitParagraphBlocks(text);
  const paragraphs = blocks.map((block) => block.text);
  const sentences = splitSentencesFromBlocks(blocks);
  const words = splitWords(text);

  const charMetrics = getCharacterMetrics(text);

  return {
    blocks,
    paragraphs,
    sentences,
    words,
    counts: {
      word_count: words.length,
      sentence_count: sentences.length,
      paragraph_count: blocks.length,
      heading_count: blocks.filter((block) => block.kind === "heading").length,
      list_item_count: countListItems(text),
      blockquote_count: countBlockquotes(text),
      ...charMetrics,
    },
  };
}

/**
 * Alias for tokenize.
 */
export const tokenizeProse = tokenize;
