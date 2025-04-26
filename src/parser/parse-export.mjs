import { peekToken, skipToken, atEnd, getToken } from './tape.mjs';

export function parseExport() {
    let name = null;
    let kind = null;
    let index = null;

    // Parse export name (string)
    if (!atEnd() && peekToken().startsWith('"') && peekToken().endsWith('"')) {
        const token = getToken();
        name = token.substring(1, token.length - 1); // Remove quotes
    }

    // Parse export definition: (func $name) or (func index)
    if (!atEnd() && peekToken() === '(') {
        skipToken() // Skip opening paren

        if (!atEnd()) {
            kind = getToken();

            if (!atEnd()) {
                // Get function reference (name or index)
                index = getToken();
            }
        }

        // Skip closing paren
        if (!atEnd() && peekToken() === ')') {
            skipToken()
        }
    }

    return { name, kind, index };
}