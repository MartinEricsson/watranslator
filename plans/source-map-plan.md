Okay, here's a plan to implement source map generation for your WAT to WASM compiler (updated with the 13 agreed decisions):

**Plan for Implementing Source Map Generation**

The goal is to create a `.wasm.map` JSON file that maps bytecode offsets in the generated `.wasm` binary to line and column numbers in the original `.wat` source file.

Decisions (locked for v1):
- Map one entry per instruction opcode and for structured markers: block/loop/if/else/end.
- Offsets are recorded as (funcIndex, funcBodyOffset) relative to the start of each function body.
- Mapping position points to the opcode token start in WAT.
- Line/column indexing is 0-based; columns counted in UTF-16 code units.
- Include the WAT source filename in each mapping.
- Source map generation is opt-in via a compile option.
- Storage: keep locations on AST nodes; capture positions for block/loop/if at keyword, else at else token, and end at end token. Collect mappings during code emission via a SourceMapManager.
- Record offsets at the first byte of each emitted opcode (before writing any bytes).
- Scope v1: code section only (no data/elem/names).
- Output schema: minimal flat array of objects with fields { file, line, column, funcIndex, bodyOffset }.
- No embedded custom section; only emit `<file>.wasm.map` externally.
- No compression or delta encoding initially.
- Ensure else and end markers are mapped to improve control-flow debugging.

1.  **Enhance Tokenizer (tokenize.mjs)**
    *   **Action:** Modify the tokenizer to capture and store the starting line and column number for each token it produces.
    *   **Details:** Track 0-based `line` and `column` (UTF-16). This flows into the parser via `tape.getCurrentCursor()`.

2.  **Propagate Source Location Data Through Parser (Mainly parser.mjs and individual `parse-*.mjs` files)**
    *   **Action:** Update the parser functions to associate the source location information (from tokens) with the abstract syntax tree (AST) nodes or other intermediate representations they generate.
    *   **Details:**
        *   Store `{ file, line, column }` on significant nodes (functions, instructions, expressions).
        *   For control structures, also capture `elsePosition` at the `else` token and `endPosition` at the `end` token.
        *   Keep locs on AST; no separate side-channel needed.

3.  **Create a Source Map Manager (New File: `src/sourcemap.mjs`)**
    *   **Action:** Develop a new module responsible for collecting and formatting source map data.
    *   **Details:**
        *   Maintain an internal list of mappings with schema: `{ file, line, column, funcIndex, bodyOffset }` (all 0-based).
        *   Expose:
            *   `addMapping({ file, line, column, funcIndex, bodyOffset })`.
            *   `toJSON()` (string) and/or `toArray()`.
            *   `reset()` for a new compilation.

4.  **Integrate Mapping Collection in the Compiler (Mainly compile.mjs, `src/compile/instructions/*`, `src/compile/sections/*`)**
    *   **Action:** As the compiler generates WASM bytecode, record the original source location and the corresponding bytecode offset.
    *   **Details:**
        *   Instantiate a `SourceMapManager` when `options.sourceMap === true`.
        *   In the code section only, right before emitting any opcode byte, call `addMapping` with:
            *   `file` from `options.filename` (or a sensible default).
            *   `line`/`column` from the AST node: instruction `.position`, `elsePosition`, `endPosition`.
            *   `funcIndex` for the current function.
            *   `bodyOffset = body.length` at opcode start.
        *   Apply to all opcode kinds, including structured markers: BLOCK/LOOP/IF/ELSE/END.

5.  **Modify Main Compilation Orchestration (e.g., index.mjs or build.mjs)**
    *   **Action:** Control the source map generation process from the main compilation function.
    *   **Details:**
        *   Make source maps opt-in: `compile(wat, { sourceMap: true, filename })`.
        *   When enabled, return `{ binary, sourceMap }` (JSON string or array). File writing can be handled by the caller to produce `<out>.wasm.map`.

6.  **Output File Naming and Association**
    *   **Action:** Ensure the source map file is named consistently and can be associated with its `.wasm` file.
    *   **Details:** Use `<filename>.wasm.map`. Do not embed a custom section in v1.

**Future Considerations (Not part of the immediate implementation plan):**

*   **Source Map Consumption:** The generated `.wasm.map` file will later be used by debugging tools or custom error reporting mechanisms to translate WASM runtime information (like instruction pointers in an error stack trace) back to the original `.wat` source code lines and columns.
*   **Source Map Standard:** For wider compatibility, consider adopting a standard (e.g., Source Map v3) later; keep v1 simple.
*   **Compression:** Consider delta-encoding/compaction if size becomes an issue.
