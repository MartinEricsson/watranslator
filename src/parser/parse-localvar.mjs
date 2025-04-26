import { atEnd, peekToken, getToken, getCurrentCursor } from './tape.mjs';

export function parseLocalVar() {
    let name = null;
    let type = null;

    // Parse local name if present
    if (!atEnd() && peekToken().startsWith('$')) {
        name = getToken();
    }

    // Parse type if present
    if (!atEnd()) {
        type = getToken();
    }

    const position = getCurrentCursor();

    return { name, type, position };
}