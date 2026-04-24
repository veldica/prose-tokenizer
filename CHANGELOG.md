# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2026-04-24

### Fixed
- Improved sentence splitting logic to better handle abbreviations (e.g., "U.S.A.") when followed by common sentence starters.
- Updated word tokenization regex to preserve numerical commas (e.g., "1,000") and acronyms with interior periods.
- Refined blockquote normalization to strip continuation markers (`>`) from multiline blocks.
- Fixed `letter_count` metric to include digits.

### Added
- Modular sub-module exports for `@veldica/prose-tokenizer/words`, `sentences`, `paragraphs`, and `markdown`.
- Comprehensive keywords and metadata improvements for better search visibility.
