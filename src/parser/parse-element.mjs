import { atEnd, peekToken, skipToken, getToken } from './tape.mjs';

export function parseElement() {
    // Parse element section: (elem (i32.const <offset>) <funcref> <funcref>...) or (elem passive funcref <funcref>...)
    let offset = 0;
    let functionIndices = [];
    let tableIndex = 0; // Default to the first table
    let mode = 'active'; // 'active' by default
    let type = 'funcref'; // Default type
    let id = null; // Element segment identifier

    // Check for element segment ID, passive segment, or table index
    if (!atEnd()) {
        if (peekToken().startsWith('$')) {
            // This could be either an element segment ID or a table reference
            const token = getToken();
            
            // Check the next token to determine if this was an ID or table reference
            if (!atEnd() && peekToken() === 'func') {
                // If next token is 'func', the $ was an element segment ID
                id = token;
            } else {
                // Otherwise, it was a table reference
                tableIndex = token;
            }
        } else if (peekToken() === 'passive') {
            mode = 'passive';
            skipToken(); // Skip 'passive'
            
            // Check for type declaration
            if (!atEnd() && peekToken() === 'funcref') {
                skipToken(); // Skip type
            }
        }
    }

    // Handle table reference after element ID
    if (id !== null && !atEnd() && peekToken() === '(') {
        skipToken(); // Skip opening paren
        if (!atEnd() && peekToken() === 'table') {
            skipToken(); // Skip 'table'
            if (!atEnd()) {
                tableIndex = getToken(); // Get table reference
            }
            // Skip closing paren
            if (!atEnd() && peekToken() === ')') {
                skipToken();
            }
        } else {
            // Skip unknown expression
            let depth = 1;
            while (!atEnd() && depth > 0) {
                if (peekToken() === '(') depth++;
                else if (peekToken() === ')') depth--;
                skipToken();
            }
        }
    }

    // Parse offset expression for active element segments
    if (mode === 'active' && !atEnd() && peekToken() === '(') {
        skipToken(); // Skip opening paren

        if (!atEnd() && peekToken() === 'i32.const') {
            skipToken(); // Skip i32.const

            if (!atEnd() && /^-?\d+$/.test(peekToken())) {
                offset = parseInt(getToken(), 10);
            }

            // Skip closing paren of the offset expression
            if (!atEnd() && peekToken() === ')') {
                skipToken();
            }
        } else {
            // Skip unknown expression
            let depth = 1; //TODO: Check this
            while (!atEnd() && depth > 0) {
                if (peekToken() === '(') depth++;
                else if (peekToken() === ')') depth--;
                skipToken();
            }
        }
    }

    // Handle 'func' marker before function references
    if (!atEnd() && peekToken() === 'func') {
        skipToken(); // Skip 'func'
    }

    // Parse function references
    while (!atEnd() && peekToken() !== ')') {
        // Function references can be function indices or symbolic names
        functionIndices.push(getToken());
    }

    return { tableIndex, offset, functionIndices, mode, type, id };
}