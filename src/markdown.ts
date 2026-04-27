export function normalizeLines(text: string): string[] {
  return text.replace(/\r\n/g, "\n").split("\n");
}

export function isHeading(line: string): boolean {
  return /^#{1,6}\s+\S.+$/.test(line.trim());
}

export function isListItem(line: string): boolean {
  return /^[\s\t]*([-*+]|\d+[.)])\s+\S.+$/.test(line.trim());
}

export function isBlockquote(line: string): boolean {
  return /^[\s\t]*>\s*.+$/.test(line.trim());
}

export function isIndentedContinuation(line: string): boolean {
  return /^\s{2,}\S/.test(line);
}

export function isSetextHeadingLine(line: string, nextLine?: string): boolean {
  if (!line.trim() || !nextLine) {
    return false;
  }

  return /^\s{0,3}(=+|-+)\s*$/.test(nextLine.trim());
}

export function getLineMetadata(
  input: string | string[]
): { heading_count: number; list_item_count: number; blockquote_count: number } {
  const lines = Array.isArray(input) ? input : normalizeLines(input);
  let headingCount = 0;
  let listItemCount = 0;
  let blockquoteCount = 0;

  for (let index = 0; index < lines.length; index += 1) {
    const current = lines[index]?.trim() ?? "";
    const next = lines[index + 1]?.trim();

    if (isHeading(current)) {
      headingCount += 1;
    }

    if (isListItem(current)) {
      listItemCount += 1;
    }

    const prev = lines[index - 1]?.trim() ?? "";
    if (isBlockquote(current) && !isBlockquote(prev)) {
      blockquoteCount += 1;
    }

    if (current && next && /^\s{0,3}(=+|-+)\s*$/.test(next)) {
      headingCount += 1;
      index += 1;
    }
  }

  return {
    heading_count: headingCount,
    list_item_count: listItemCount,
    blockquote_count: blockquoteCount,
  };
}
