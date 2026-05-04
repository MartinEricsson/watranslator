import { decodeWatString } from "../wat-string.mjs";
import { atEnd, getToken, peekToken, skipToken } from "./tape.mjs";

export function parseExport() {
	let name = null;
	let kind = null;
	let index = null;

	// Parse export name (string)
	if (!atEnd() && peekToken().startsWith('"') && peekToken().endsWith('"')) {
		const token = getToken();
		name = decodeWatString(token);
	}

	// Parse export definition: (func $name) or (func index)
	if (!atEnd() && peekToken() === "(") {
		skipToken(); // Skip opening paren

		if (!atEnd()) {
			kind = getToken();

			if (!atEnd()) {
				// Get function reference (name or index)
				index = getToken();
			}
		}

		// Skip closing paren
		if (!atEnd() && peekToken() === ")") {
			skipToken();
		}
	}

	return { name, kind, index };
}
