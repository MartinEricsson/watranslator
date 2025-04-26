let position = 0;
let tokens = [];
let sourceMap = new Map();

export function initTape(tokenList = [], sourceMapList = new Map()) {
    tokens = tokenList;
    sourceMap = sourceMapList;
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
        err.context = {
            position: sourceMap.get(tokens.length - 1),
            token: tokens[tokens.length - 1],
        };
        throw err;
    }
}

export function getCurrentCursor() {
    return sourceMap.get(position);
}
