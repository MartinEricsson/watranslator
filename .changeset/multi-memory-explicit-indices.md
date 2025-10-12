---
"watranslator": minor
---

Add support for explicit memory indices in multi-memory operations according to WebAssembly 2.0 specification. Memory operations now correctly encode memory indices when multiple memories are present, enabling proper multi-memory support while maintaining backward compatibility with single-memory modules.
