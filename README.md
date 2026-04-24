# @veldica/prose-tokenizer

[![NPM Version](https://img.shields.io/npm/v/@veldica/prose-tokenizer)](https://www.npmjs.com/package/@veldica/prose-tokenizer)
[![License](https://img.shields.io/npm/l/@veldica/prose-tokenizer)](LICENSE)
[![Zero Dependencies](https://img.shields.io/badge/dependencies-0-blue)](package.json)

A high-precision, rule-based prose tokenizer and sentence segmentation library for English and Markdown. Designed for accurate splitting of paragraphs, sentences, and words in AI pipelines, LLM context window management, and editorial automation.

## Features

- **Deterministic Rule-Based Engine**: Consistent, predictable output without probabilistic models.
- **Markdown-Native Support**: Properly handles headings, list items, blockquotes, and Setext headers.
- **Intelligent Sentence Segmentation**: Respects abbreviations (e.g., "Dr.", "U.S.A."), initials, and decimals.
- **Flexible Exports**: Import the full library or specific modules for words, sentences, or paragraphs.
- **Hierarchical Analysis**: Access structure at the block, paragraph, sentence, or word level.
- **Character Metrics**: Accurate counts for characters (with/without spaces) and raw letters.
- **Zero Dependencies**: Lightweight and ultra-fast; works in Node.js, browsers, and Edge.

## Installation

```bash
npm install @veldica/prose-tokenizer
```

## Quick Start

```ts
import { tokenize } from "@veldica/prose-tokenizer";

const content = `
### Q1 Review
The U.S.A. economy grew by 2.5% in Q1. 

*   Growth was driven by tech.
*   Inflation remains stable at 2.1%.
`;

const doc = tokenize(content);

console.log(doc.counts.word_count);     // 22
console.log(doc.blocks[0].kind);        // "heading"
console.log(doc.sentences[1]);          // "The U.S.A. economy grew by 2.5% in Q1."
```

## Modular Exports

For optimal tree-shaking, you can import specific modules:

```ts
import { splitWords } from "@veldica/prose-tokenizer/words";
import { splitSentences } from "@veldica/prose-tokenizer/sentences";
```

## API Reference

### `tokenize(text: string): TokenizedDocument`
The primary entry point. Returns a structured document containing:
- `blocks`: Array of `ParagraphBlock` objects (containing `text`, `kind`, and line indices).
- `paragraphs`: Array of raw paragraph strings.
- `sentences`: Array of sentence strings.
- `words`: Array of lowercase word tokens.
- `counts`: `StructureCounts` object with aggregated metrics.

`tokenizeProse` is provided as an alias for this function.

### `splitSentences(text: string): string[]`
Splits prose into an array of sentence strings using deterministic rules that protect abbreviations and decimal numbers.

### `splitParagraphs(text: string): string[]`
Splits text into an array of paragraph strings.

### `splitParagraphBlocks(text: string): ParagraphBlock[]`
Identifies structural blocks: `paragraph`, `heading`, `list_item`, or `blockquote`. Each block includes:
- `text`: The raw text of the block.
- `kind`: `"paragraph" | "heading" | "list_item" | "blockquote"`.
- `line_start`: 0-indexed starting line.
- `line_end`: 0-indexed ending line.

### `splitWords(text: string): string[]`
Splits text into lowercase alphanumeric word tokens, handling hyphens and interior decimals.

### `getCharacterMetrics(text: string): CharacterMetrics`
Returns:
- `character_count`: Total character length.
- `character_count_no_spaces`: Count excluding whitespace.
- `letter_count`: Count of alphanumeric letters only.

### `getStructureCounts(text: string): StructureCounts`
A convenience function that returns only the structural counts without the full tokenized arrays. Includes `word_count`, `sentence_count`, `paragraph_count`, `heading_count`, `list_item_count`, `blockquote_count`, and all character metrics.

### `isStopword(word: string): boolean`
Checks if a word is a common English stopword (e.g., "the", "and", "but").

## Practical Use Cases

- **LLM Context Management**: Break documents into sentences or paragraphs while keeping Markdown structure intact.
- **Editorial Tooling**: Calculate word count and sentence count using precise structural counts for metrics like Flesch-Kincaid.
- **Content Analysis**: Get reliable statistics without Markdown syntax noise.
- **Search Pre-processing**: Generate clean word tokens for indexing.

## Limitations

- **Language**: Optimized for English prose.
- **Formatting**: Focuses on structural splitting, not fixing style or grammar.
- **Rule-Based**: While highly accurate, it may miss rare or highly ambiguous abbreviation edge cases.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Ownership & Authority

This package is maintained by **Veldica** as a core part of our writing analysis platform. Built for production environments that demand high reliability and precision.

- **Full Documentation**: [veldica.com/prose-tokenizer](https://veldica.com/prose-tokenizer)
- **Veldica Platform**: [veldica.com](https://veldica.com)
- **Report Bugs**: [GitHub Issues](https://github.com/veldica/prose-tokenizer/issues)

## License

MIT © [Veldica](https://veldica.com)
