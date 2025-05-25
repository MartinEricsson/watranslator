import { atEnd, peekToken, getToken, getCurrentCursor, skipToken } from './tape.mjs';
import { createError } from './parse-util.mjs';

export function parseMemory(passedKeywordLoc = null) {
    let mainLoc = passedKeywordLoc;
    let firstConsumedTokenLoc = null;

    let id = null, idLoc = null;
    let min = 0, minLoc = null; // Default min to 0 pages
    let max = null, maxLoc = null;
    let shared = false, sharedLoc = null;
    
    let exportName = null, exportNameLoc = null;
    let exportKeywordLoc = null, exportParenLoc = null;
    
    let memoryIdx = 0, memoryIdxLoc = null; // Default memory index is 0. For multi-memory, this can be other numbers.
                                        // This is distinct from min/max limits.
                                        // WAT syntax for memory index is ambiguous: (memory <idx_if_no_$> <min> <max>) vs (memory <min> <max>)

    let nextToken = peekToken();
    if (!mainLoc && nextToken) mainLoc = { line: nextToken.line, column: nextToken.column };
    if (!firstConsumedTokenLoc && nextToken) firstConsumedTokenLoc = { line: nextToken.line, column: nextToken.column };
    
    // Check for memory identifier (e.g., $mem)
    if (nextToken && nextToken.value.startsWith('$')) {
        const idToken = getToken();
        id = idToken.value;
        idLoc = { line: idToken.line, column: idToken.column };
        nextToken = peekToken();
    }

    // Handle inline export: (export "name")
    if (nextToken && nextToken.value === '(') {
        const parenTok = peekToken(); // Keep loc of '('
        skipToken(); // Consume '('
        
        if (peekToken() && peekToken().value === 'export') {
            exportParenLoc = { line: parenTok.line, column: parenTok.column };
            const exportKwdToken = getToken(); // consume 'export'
            exportKeywordLoc = { line: exportKwdToken.line, column: exportKwdToken.column };

            const nameToken = getToken();
            if (!nameToken || !nameToken.value.startsWith('"') || !nameToken.value.endsWith('"')) {
                throw createError('Expected string for memory export name.', exportKeywordLoc.line, exportKeywordLoc.column + 6);
            }
            exportName = nameToken.value.substring(1, nameToken.value.length - 1);
            exportNameLoc = { line: nameToken.line, column: nameToken.column };

            if (!(peekToken() && peekToken().value === ')')) {
                throw createError("Expected ')' after memory export name.", exportNameLoc.line, exportNameLoc.column + exportName.length + 2);
            }
            skipToken(); // Consume ')'
        } else {
            // This was not an export block, so the '(' was unexpected or for something else (e.g. import, not handled here)
            // Or it's an error. For now, assume it's not a standard memory attribute.
            // We need to "put back" the '(' if we had a general purpose putback, or error.
            // Current tape doesn't support putback. Erroring might be too strict if WAT allows other parenthesized forms.
            // However, standard memory syntax after ID is limits or import.
            // Let's assume if it's '(', it must be 'export' or 'import' (latter not handled by this specific parser).
            // Since 'import' for memory is less common directly in (memory) like this vs (import ... (memory ...)),
            // we can be stricter.
            throw createError(`Unexpected parenthesized form starting with '${peekToken().value}' in memory definition. Expected (export ...).`, parenTok.line, parenTok.column);
        }
        nextToken = peekToken();
    }
    
    // Parse memory index, min, max, shared
    // This part is tricky due to ambiguity:
    // (memory $id <N>) -> N is min
    // (memory $id <M> <N>) -> M is min, N is max
    // (memory <idx_val> <N>) -> idx_val is mem index, N is min (multi-memory)
    // (memory <idx_val> <M> <N>) -> idx_val is mem index, M is min, N is max (multi-memory)
    
    const numbers = []; // Store {value, loc} for parsed numbers
    while(nextToken && /^\d+$/.test(nextToken.value)) {
        const numToken = getToken();
        numbers.push({value: Number.parseInt(numToken.value, 10), loc: {line: numToken.line, column: numToken.column}});
        nextToken = peekToken();
    }

    if (numbers.length > 0) {
        if (id === null && numbers.length > 0 && (numbers.length > 2 || (numbers.length > 1 && (peekToken() && peekToken().value === 'shared')) )) { 
            // (memory <idx> <min> ...) or (memory <idx> <min> <max> ...)
            // This implies the first number is a memory index IF no ID was present.
            // And there are enough numbers to be min/max too.
            const memIdxCand = numbers.shift();
            memoryIdx = memIdxCand.value;
            memoryIdxLoc = memIdxCand.loc;
        }
        
        if (numbers.length > 0) {
            const minCand = numbers.shift();
            min = minCand.value;
            minLoc = minCand.loc;
        }
        if (numbers.length > 0) {
            const maxCand = numbers.shift();
            max = maxCand.value;
            maxLoc = maxCand.loc;
        }
        if (numbers.length > 0) { // Too many numbers
            const extraNum = numbers[0];
            throw createError(`Too many numeric limits for memory. Expected at most memory_idx?, min, max. Got extra number '${extraNum.value}'.`, extraNum.loc.line, extraNum.loc.column);
        }
    }


    // Check for 'shared' keyword
    if (nextToken && nextToken.value === 'shared') {
        const sharedToken = getToken();
        shared = true;
        sharedLoc = { line: sharedToken.line, column: sharedToken.column };
        nextToken = peekToken();
    }

    if (min < 0) {
        throw createError("Memory minimum size cannot be negative.", minLoc.line, minLoc.column);
    }
    if (max !== null && max < min) {
        throw createError(`Memory maximum size (${max}) cannot be less than minimum size (${min}).`, maxLoc.line, maxLoc.column);
    }
    
    if (!mainLoc) mainLoc = passedKeywordLoc || firstConsumedTokenLoc || getCurrentCursor();

    return { 
        node_type: 'memory_decl',
        id, 
        idLoc,
        memoryIndex: memoryIdx, // The actual memory index (0 if not multi-memory or if $id used with implicit 0)
        memoryIndexLoc,
        min, 
        minLoc,
        max, 
        maxLoc,
        shared, 
        sharedLoc,
        exportInfo: exportName ? { name: exportName, nameLoc: exportNameLoc, keywordLoc: exportKeywordLoc, parenLoc: exportParenLoc } : null,
        loc: mainLoc
    };
}