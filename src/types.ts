export type ParagraphBlockKind = "paragraph" | "heading" | "list_item" | "blockquote";

export interface ParagraphBlock {
  text: string;
  kind: ParagraphBlockKind;
  line_start: number;
  line_end: number;
}

export interface CharacterMetrics {
  character_count: number;
  character_count_no_spaces: number;
  letter_count: number;
}

export interface StructureCounts extends CharacterMetrics {
  word_count: number;
  sentence_count: number;
  paragraph_count: number;
  heading_count: number;
  list_item_count: number;
  blockquote_count: number;
}

export interface TokenizedDocument {
  blocks: ParagraphBlock[];
  paragraphs: string[];
  sentences: string[];
  words: string[];
  counts: StructureCounts;
}
