let position = 0;
let tokens = [];

export function initTape(tokenList = []) {
    tokens = tokenList;
    position = 0;
}

export function atEnd() {
    return position >= tokens.length;
}

export function getToken() {
    if (position >= tokens.length) {
        return null; // TODO: Should this throw an error instead?
    }
    const token = tokens[position];
    position++;
    return token;
}

export function peekToken() {
    if (position >= tokens.length) {
        return null;
    }
    return tokens[position];
}

export function skipToken() {
    if (position < tokens.length) {
        position++;
    } else {
        const err = new Error("No more tokens to skip");
        if (tokens.length > 0) {
            const lastToken = tokens[tokens.length - 1];
            err.context = {
                position: { line: lastToken.line, column: lastToken.column },
                token: lastToken.value,
            };
        } else {
            // Should not happen if skipToken is called on empty tokens, but as a fallback:
            err.context = {
                position: { line: 1, column: 1 }, // Default if no tokens
                token: null,
            };
        }
        throw err;
    }
}

export function getCurrentCursor() {
    if (position < tokens.length && tokens[position]) {
        return { line: tokens[position].line, column: tokens[position].column };
    }
    return null; // Or a sensible default like { line: 1, column: 1 }
}
