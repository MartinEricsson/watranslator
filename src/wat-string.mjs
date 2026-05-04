const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

const isHexDigit = (char) => /^[0-9a-fA-F]$/.test(char);

const appendUtf8 = (bytes, text) => {
	bytes.push(...textEncoder.encode(text));
};

export function stripWatStringQuotes(token) {
	if (token.startsWith('"') && token.endsWith('"')) {
		return token.slice(1, -1);
	}
	return token;
}

export function decodeWatStringToBytes(input) {
	const str = stripWatStringQuotes(input);
	const bytes = [];

	for (let i = 0; i < str.length; i++) {
		const char = str[i];

		if (char !== "\\") {
			const codePoint = str.codePointAt(i);
			const text = String.fromCodePoint(codePoint);
			appendUtf8(bytes, text);
			i += text.length - 1;
			continue;
		}

		if (i + 1 >= str.length) {
			bytes.push("\\".charCodeAt(0));
			continue;
		}

		const next = str[++i];
		const following = str[i + 1];

		if (isHexDigit(next) && following && isHexDigit(following)) {
			bytes.push(Number.parseInt(`${next}${following}`, 16));
			i++;
			continue;
		}

		switch (next) {
			case "t":
				bytes.push(9);
				break;
			case "n":
				bytes.push(10);
				break;
			case "r":
				bytes.push(13);
				break;
			case "\\":
				bytes.push(92);
				break;
			case '"':
				bytes.push(34);
				break;
			case "'":
				bytes.push(39);
				break;
			case "0":
				bytes.push(0);
				break;
			case "u": {
				if (str[i + 1] !== "{") {
					appendUtf8(bytes, next);
					break;
				}
				const end = str.indexOf("}", i + 2);
				if (end === -1) {
					throw new Error(`Invalid unicode escape in WAT string: ${input}`);
				}
				const codePoint = Number.parseInt(str.slice(i + 2, end), 16);
				if (
					!Number.isInteger(codePoint) ||
					codePoint < 0 ||
					codePoint > 0x10ffff
				) {
					throw new Error(
						`Unicode escape out of range in WAT string: ${input}`,
					);
				}
				appendUtf8(bytes, String.fromCodePoint(codePoint));
				i = end;
				break;
			}
			default:
				appendUtf8(bytes, next);
				break;
		}
	}

	return bytes;
}

export function decodeWatString(input) {
	return textDecoder.decode(new Uint8Array(decodeWatStringToBytes(input)));
}
