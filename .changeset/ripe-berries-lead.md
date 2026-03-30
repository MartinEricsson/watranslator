---
"watranslator": minor
---

Improved compiler diagnostics across tokenization, parsing, validation, and code generation.

Errors now include clearer stage-specific messages, line and column information, code frames, and more actionable context such as expected values, found values, and hints where available.

This release also makes invalid WAT fail earlier and more consistently instead of silently skipping unknown syntax and surfacing a less useful downstream error later in compilation.
