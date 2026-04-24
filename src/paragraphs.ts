import {
  isHeading,
  isIndentedContinuation,
  isListItem,
  isBlockquote,
  isSetextHeadingLine,
  normalizeLines,
} from "./markdown.js";
import type { ParagraphBlock, ParagraphBlockKind } from "./types.js";

export function splitParagraphBlocks(text: string): ParagraphBlock[] {
  if (!text.trim()) {
    return [];
  }

  const normalizedLines = normalizeLines(text);
  const paragraphs: ParagraphBlock[] = [];
  let current: string[] = [];
  let currentStart = -1;
  let currentEnd = -1;
  let mode: "prose" | "list" | "blockquote" | null = null;

  const flushCurrent = (
    kind: ParagraphBlockKind = mode === "list"
      ? "list_item"
      : mode === "blockquote"
      ? "blockquote"
      : "paragraph"
  ) => {
    if (current.length === 0) {
      mode = null;
      currentStart = -1;
      currentEnd = -1;
      return;
    }

    paragraphs.push({
      text: current.join(" ").trim(),
      kind,
      line_start: currentStart,
      line_end: currentEnd,
    });
    current = [];
    mode = null;
    currentStart = -1;
    currentEnd = -1;
  };

  for (let index = 0; index < normalizedLines.length; index += 1) {
    const line = normalizedLines[index];
    const trimmed = line.trim();

    if (!trimmed) {
      flushCurrent();
      continue;
    }

    if (isSetextHeadingLine(trimmed, normalizedLines[index + 1])) {
      flushCurrent();
      paragraphs.push({
        text: trimmed,
        kind: "heading",
        line_start: index,
        line_end: index + 1,
      });
      index += 1;
      continue;
    }

    if (isHeading(trimmed)) {
      flushCurrent();
      paragraphs.push({
        text: trimmed,
        kind: "heading",
        line_start: index,
        line_end: index,
      });
      continue;
    }

    if (isListItem(trimmed)) {
      flushCurrent();
      current = [trimmed];
      currentStart = index;
      currentEnd = index;
      mode = "list";
      continue;
    }

    if (isBlockquote(trimmed)) {
      if (mode !== "blockquote") {
        flushCurrent();
      }
      if (current.length === 0) {
        currentStart = index;
      }
      current.push(trimmed);
      currentEnd = index;
      mode = "blockquote";
      continue;
    }

    if (mode === "list" && isIndentedContinuation(line)) {
      current.push(trimmed);
      currentEnd = index;
      continue;
    }

    if (mode !== "prose") {
      flushCurrent();
      mode = "prose";
    }

    if (current.length === 0) {
      currentStart = index;
    }
    current.push(trimmed);
    currentEnd = index;
  }

  flushCurrent();

  return paragraphs;
}

export function splitParagraphs(text: string): string[] {
  return splitParagraphBlocks(text).map((block) => block.text);
}
