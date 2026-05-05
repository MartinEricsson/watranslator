import { encodeSLEB128, encodeULEB128 } from "./compile-utils.mjs";

const DEFAULT_CAPACITY = 1024;
const textEncoder = new TextEncoder();

export class BytesWriter {
	constructor(initialCapacity = DEFAULT_CAPACITY) {
		this.buffer = new Uint8Array(Math.max(1, initialCapacity));
		this.offset = 0;
	}

	get length() {
		return this.offset;
	}

	ensureCapacity(additionalBytes) {
		const required = this.offset + additionalBytes;
		if (required <= this.buffer.length) {
			return;
		}

		let nextLength = this.buffer.length;
		while (nextLength < required) {
			nextLength *= 2;
		}

		const next = new Uint8Array(nextLength);
		next.set(this.buffer.subarray(0, this.offset));
		this.buffer = next;
	}

	writeByte(value) {
		this.ensureCapacity(1);
		this.buffer[this.offset] = value & 0xff;
		this.offset++;
	}

	writeBytes(bytes) {
		if (!bytes || bytes.length === 0) {
			return;
		}

		this.ensureCapacity(bytes.length);
		this.buffer.set(bytes, this.offset);
		this.offset += bytes.length;
	}

	writeULEB128(value) {
		this.writeBytes(encodeULEB128(value));
	}

	writeSLEB128(value) {
		this.writeBytes(encodeSLEB128(value));
	}

	writeName(value) {
		const bytes = textEncoder.encode(value);
		this.writeULEB128(bytes.length);
		this.writeBytes(bytes);
	}

	push(...values) {
		this.ensureCapacity(values.length);
		for (const value of values) {
			this.buffer[this.offset] = value & 0xff;
			this.offset++;
		}
		return this.offset;
	}

	toUint8Array() {
		return this.buffer.slice(0, this.offset);
	}

	toArray() {
		return Array.from(this.buffer.subarray(0, this.offset));
	}
}

export function createBytesWriter(initialCapacity) {
	return new BytesWriter(initialCapacity);
}
