import { test } from "node:test";
import assert from "node:assert/strict";
import { tokenize, splitSentences, splitWords, isStopword } from "./index.js";

test("tokenize handles basic prose and markdown", () => {
  const content = `
### Q1 Review
The U.S.A. economy grew by 2.5% in Q1. 

*   Growth was driven by tech.
*   Inflation remains stable at 2.1%.
`;
  const doc = tokenize(content);

  // U.S.A. is now 1 word instead of 3, so count is 20
  assert.strictEqual(doc.counts.word_count, 20);
  assert.strictEqual(doc.blocks[0].kind, "heading");
  assert.strictEqual(doc.sentences[1], "The U.S.A. economy grew by 2.5% in Q1.");
  assert.strictEqual(doc.blocks.length, 4); // Heading, Paragraph, List Item, List Item
});

test("tokenize handles blockquotes", () => {
  const content = `
> This is a blockquote.
> It has two lines.

Normal paragraph.
`;
  const doc = tokenize(content);

  assert.strictEqual(doc.counts.blockquote_count, 1);
  assert.strictEqual(doc.blocks[0].kind, "blockquote");
  // Continuation markers are now stripped
  assert.strictEqual(doc.blocks[0].text, "> This is a blockquote. It has two lines.");
});

test("splitSentences respects abbreviations and decimals", () => {
  const text = "Dr. Smith went to the U.S.A. with Mr. Jones. It was 10.5 miles away.";
  const sentences = splitSentences(text);

  assert.strictEqual(sentences.length, 2);
  assert.strictEqual(sentences[0], "Dr. Smith went to the U.S.A. with Mr. Jones.");
  assert.strictEqual(sentences[1], "It was 10.5 miles away.");
});

test("splitWords handles hyphens and decimals", () => {
  const text = "The high-tech economy grew 2.5% annually.";
  const words = splitWords(text);

  assert.deepStrictEqual(words, ["the", "high-tech", "economy", "grew", "2.5", "annually"]);
});

test("isStopword identifies common stopwords", () => {
  assert.strictEqual(isStopword("the"), true);
  assert.strictEqual(isStopword("Veldica"), false);
});
