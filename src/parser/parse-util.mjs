import { atEnd, peekToken, getCurrentCursor, skipToken } from './tape.mjs';

export function isLabel(candidate) {
    // if the candidate is a string and starts with a $ or if it is an integer
    if (typeof candidate === 'string' && candidate.startsWith('$')) {
        return true;
    }
    if (!isNaN(parseInt(candidate, 10))) {
        return true;
    }

    return false;
}

export function isIndex(candidate) {
    return !isNaN(parseInt(candidate, 10));
}

export function isString(candidate) {
    return candidate.startsWith('"') && candidate.endsWith('"');
}

export function isNumber(candidate) {
    return (/^-?\d+(\.\d+)?$/.test(candidate) || /^0x[0-9a-fA-F]+$/.test(candidate));
}

export function createError(message) {
    const pos = getCurrentCursor();
    const token = !atEnd() ? `"${peekToken()}"` : "end of input";
    return new Error(`PARSE ERROR: ${message} at line ${pos.line}, column ${pos.column} near ${token}`);
}

export function openParenthesis() {
    const start = getCurrentCursor();

    return _ => {
        if (peekToken() !== ')') {
            const msg = `Missing closing parenthesis to opening at ${start.line} : ${start.column}`;
            throw createError(msg);
        }
        skipToken();
    }
}

export function parseDecimalOrHex(token) {
    if (token.startsWith('0x')) {
        return parseInt(token, 16);
    }
    return parseInt(token, 10);
}

export function parseSigned64BitHex(hexString) {
    // Convert the hex string to a BigInt
    let value = BigInt(hexString);

    // Check if the value is negative in 64-bit signed range
    if (value > 0x7FFFFFFFFFFFFFFFn) {
        value -= 0x10000000000000000n; // Adjust for signed 64-bit range
    }

    return value;
}
