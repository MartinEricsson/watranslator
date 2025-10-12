/**
 * Source Map Manager for WAT to WASM compilation
 *
 * Manages collection and formatting of source map data according to the plan:
 * - Map one entry per instruction opcode and for structured markers (block/loop/if/else/end)
 * - Offsets as (funcIndex, funcBodyOffset) relative to function body start
 * - 0-based line/column indexing in UTF-16 code units
 * - Schema: { file, line, column, funcIndex, bodyOffset }
 */
export class SourceMapManager {
	constructor() {
		this.mappings = [];
	}

	/**
	 * Add a mapping entry
	 * @param {Object} mapping - The mapping entry
	 * @param {string} mapping.file - Source file name
	 * @param {number} mapping.line - 0-based line number
	 * @param {number} mapping.column - 0-based column number in UTF-16 code units
	 * @param {number} mapping.funcIndex - Function index
	 * @param {number} mapping.bodyOffset - Offset within function body
	 */
	addMapping({ file, line, column, funcIndex, bodyOffset }) {
		this.mappings.push({
			file,
			line,
			column,
			funcIndex,
			bodyOffset,
		});
	}

	/**
	 * Export mappings as JSON string
	 * @returns {string} JSON representation of mappings
	 */
	toJSON() {
		return JSON.stringify(this.mappings, null, 2);
	}

	/**
	 * Export mappings as array
	 * @returns {Array} Array of mapping objects
	 */
	toArray() {
		return [...this.mappings];
	}

	/**
	 * Reset mappings for new compilation
	 */
	reset() {
		this.mappings = [];
	}

	/**
	 * Get current number of mappings
	 * @returns {number} Number of mappings
	 */
	size() {
		return this.mappings.length;
	}
}
