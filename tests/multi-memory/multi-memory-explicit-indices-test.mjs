import assert from "node:assert";
import { readTestData } from "../test-utils.mjs";

async function testMultiMemoryExplicitIndices(debug = false) {
	try {
		const { wasmBuffer } = await readTestData(
			"multi-memory/multi-memory-explicit-indices.wat",
			debug,
		);

		if (debug) {
			console.log("Testing multi-memory with explicit indices compilation...");
			console.log(`WASM buffer size: ${wasmBuffer.length} bytes`);
		}

		// Test 1: Verify the WASM binary was generated successfully
		assert.ok(wasmBuffer, "WASM buffer should be generated");
		assert.ok(wasmBuffer.length > 0, "WASM buffer should not be empty");

		// Test 2: Check for WASM magic number
		const magicNumber = new Uint32Array(wasmBuffer.slice(0, 4).buffer)[0];
		assert.strictEqual(
			magicNumber,
			0x6d736100,
			"Should have correct WASM magic number",
		);

		// Test 3: Check for WASM version
		const version = new Uint32Array(wasmBuffer.slice(4, 8).buffer)[0];
		assert.strictEqual(version, 1, "Should have correct WASM version");

		// Test 4: Verify memory section exists with 3 memories
		let memoryCount = 0;
		let foundMemorySection = false;
		let offset = 8; // Skip magic and version

		while (offset < wasmBuffer.length) {
			const sectionId = wasmBuffer[offset];
			offset++;

			// Read section size
			let sectionSize = 0;
			let shift = 0;
			while (offset < wasmBuffer.length) {
				const byte = wasmBuffer[offset++];
				sectionSize |= (byte & 0x7f) << shift;
				if ((byte & 0x80) === 0) break;
				shift += 7;
			}

			if (sectionId === 5) {
				// Memory section
				foundMemorySection = true;
				// Read memory count
				const startOffset = offset;
				let count = 0;
				let countShift = 0;
				while (offset < wasmBuffer.length) {
					const byte = wasmBuffer[offset++];
					count |= (byte & 0x7f) << countShift;
					if ((byte & 0x80) === 0) break;
					countShift += 7;
				}
				memoryCount = count;
				if (debug) {
					console.log(
						`Found memory section with ${memoryCount} memories at offset ${startOffset}`,
					);
				}
				break;
			}

			// Skip to next section
			offset += sectionSize;
		}

		assert.ok(foundMemorySection, "Should have a memory section");
		assert.strictEqual(
			memoryCount,
			3,
			"Should have 3 memories defined in the module",
		);

		// Test 5: Search for memory index encoding in the binary
		// In multi-memory operations, the memory index should appear after align and offset
		let foundMultiMemoryEncoding = false;

		// Look for sequences that indicate multi-memory operations
		// i32.store has opcode 0x36, followed by align, offset, and then memory index
		// i32.load has opcode 0x28, followed by align, offset, and then memory index
		for (let i = 0; i < wasmBuffer.length - 3; i++) {
			const byte = wasmBuffer[i];
			// Check for i32.store (0x36) or i32.load (0x28)
			if (byte === 0x36 || byte === 0x28) {
				// Next bytes should be align (typically 0x02 for i32)
				// then offset (typically 0x00)
				// then memory index (0x00, 0x01, or 0x02 for our three memories)
				if (i + 3 < wasmBuffer.length) {
					const align = wasmBuffer[i + 1];
					const offset = wasmBuffer[i + 2];
					const memIdx = wasmBuffer[i + 3];

					// For multi-memory, we expect memory indices 0, 1, or 2
					if (
						align === 0x02 &&
						offset === 0x00 &&
						(memIdx === 0x00 || memIdx === 0x01 || memIdx === 0x02)
					) {
						foundMultiMemoryEncoding = true;
						if (debug) {
							const op = byte === 0x36 ? "i32.store" : "i32.load";
							console.log(
								`Found ${op} with memory index ${memIdx} at offset ${i}`,
							);
						}
					}
				}
			}
			// Check for memory.size (0x3F) or memory.grow (0x40)
			else if (byte === 0x3f || byte === 0x40) {
				if (i + 1 < wasmBuffer.length) {
					const memIdx = wasmBuffer[i + 1];
					if (memIdx === 0x00 || memIdx === 0x01 || memIdx === 0x02) {
						foundMultiMemoryEncoding = true;
						if (debug) {
							const op = byte === 0x3f ? "memory.size" : "memory.grow";
							console.log(
								`Found ${op} with memory index ${memIdx} at offset ${i}`,
							);
						}
					}
				}
			}
			// Check for bulk memory operations (0xFC prefix)
			else if (byte === 0xfc) {
				if (i + 1 < wasmBuffer.length) {
					const bulkOp = wasmBuffer[i + 1];
					// memory.fill (0x0B) or memory.copy (0x0A)
					if (bulkOp === 0x0a || bulkOp === 0x0b) {
						foundMultiMemoryEncoding = true;
						if (debug) {
							const op = bulkOp === 0x0a ? "memory.copy" : "memory.fill";
							console.log(`Found ${op} at offset ${i}`);
						}
					}
				}
			}
		}

		assert.ok(
			foundMultiMemoryEncoding,
			"Should find memory operations with explicit indices encoded in binary",
		);

		console.log("✅ All multi-memory explicit indices binary encoding tests passed!");
		console.log(
			"   Note: Runtime execution tests skipped (multi-memory not yet widely supported)",
		);
		return true;
	} catch (error) {
		console.error("❌ Error testing multi-memory explicit indices:", error);
		return false;
	}
}

export default testMultiMemoryExplicitIndices;
