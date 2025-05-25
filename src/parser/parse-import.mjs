import { peekToken, atEnd, skipToken, getToken, getCurrentCursor } from './tape.mjs';
import { createError } from './parse-util.mjs';

export function parseImport(passedKeywordLoc = null) {
    let firstTokenForLoc = peekToken(); // For the main 'loc' of the import AST node
    const mainLoc = passedKeywordLoc || (firstTokenForLoc ? { line: firstTokenForLoc.line, column: firstTokenForLoc.column } : null);

    let moduleName = null, moduleNameLoc = null;
    let fieldName = null, fieldNameLoc = null;
    let kind = null, kindLoc = null;
    let funcName = null, funcNameLoc = null; // Renamed from 'name' to 'funcName' for clarity
    let params = []; // Array of { value: string, loc: {line, column} }
    let results = []; // Array of { value: string, loc: {line, column} }
    let typeSignatureLoc = null; // Loc for the start of (func...) or (global...)

    // Parse module name (first string)
    let currentToken = peekToken();
    if (currentToken && currentToken.value.startsWith('"') && currentToken.value.endsWith('"')) {
        const token = getToken();
        moduleName = token.value.substring(1, token.value.length - 1);
        moduleNameLoc = { line: token.line, column: token.column };
    } else {
        throw createError(`Expected import module name (string) but got ${currentToken ? currentToken.value : "EOF"}`, 
                          currentToken ? currentToken.line : (mainLoc ? mainLoc.line : 0), 
                          currentToken ? currentToken.column : (mainLoc ? mainLoc.column : 0));
    }

    // Parse field name (second string)
    currentToken = peekToken();
    if (currentToken && currentToken.value.startsWith('"') && currentToken.value.endsWith('"')) {
        const token = getToken();
        fieldName = token.value.substring(1, token.value.length - 1);
        fieldNameLoc = { line: token.line, column: token.column };
    } else {
        throw createError(`Expected import field name (string) but got ${currentToken ? currentToken.value : "EOF"}`,
                          currentToken ? currentToken.line : (moduleNameLoc ? moduleNameLoc.line : 0),
                          currentToken ? currentToken.column : (moduleNameLoc ? moduleNameLoc.column + moduleName.length + 2 : 0));
    }
    
    // Parse the imported entity (func, global, memory, or table)
    currentToken = peekToken();
    if (currentToken && currentToken.value === '(') {
        typeSignatureLoc = { line: currentToken.line, column: currentToken.column };
        skipToken(); // Skip opening paren '('

        const kindToken = getToken();
        if (!kindToken) throw createError("Expected import kind (func, global, etc.)", typeSignatureLoc.line, typeSignatureLoc.column + 1);
        kind = kindToken.value;
        kindLoc = { line: kindToken.line, column: kindToken.column };

        // Handle function import
        if (kind === 'func') {
            currentToken = peekToken();
            if (currentToken && currentToken.value.startsWith('$')) {
                const nameToken = getToken();
                funcName = nameToken.value;
                funcNameLoc = { line: nameToken.line, column: nameToken.column };
                currentToken = peekToken();
            }

            // Parse parameters and results: (param type...) (result type...)
            while (currentToken && currentToken.value !== ')') {
                if (currentToken.value === '(') {
                    skipToken(); // Skip opening paren of (param...) or (result...)
                    const sectionKeywordToken = getToken(); // 'param' or 'result'
                    if (!sectionKeywordToken) throw createError("Expected 'param' or 'result'", currentToken.line, currentToken.column +1);

                    const targetArray = sectionKeywordToken.value === 'param' ? params : (sectionKeywordToken.value === 'result' ? results : null);
                    if (!targetArray) throw createError(`Unexpected keyword '${sectionKeywordToken.value}' in function import signature.`, sectionKeywordToken.line, sectionKeywordToken.column);
                    
                    let typeOrNameToken = peekToken();
                    while (typeOrNameToken && typeOrNameToken.value !== ')') {
                        const consumedToken = getToken();
                        // If param has a name (e.g. $p1 i32), we skip the name for now and take the type
                        if (sectionKeywordToken.value === 'param' && consumedToken.value.startsWith('$')) {
                            // This is a named param, next token should be the type
                            const typeForNamedParam = getToken();
                            if (!typeForNamedParam) throw createError(`Expected type for named param ${consumedToken.value}`, consumedToken.line, consumedToken.column + consumedToken.value.length);
                            targetArray.push({ value: typeForNamedParam.value, loc: {line: typeForNamedParam.line, column: typeForNamedParam.column }});
                        } else {
                             targetArray.push({ value: consumedToken.value, loc: {line: consumedToken.line, column: consumedToken.column }});
                        }
                        typeOrNameToken = peekToken();
                    }

                    if (peekToken() && peekToken().value === ')') { // Closing paren of (param...) or (result...)
                        skipToken();
                    } else {
                         throw createError(`Expected ')' to close ${sectionKeywordToken.value} block`, sectionKeywordToken.line, sectionKeywordToken.column);
                    }
                } else {
                     throw createError(`Expected '(' for param/result block but got ${currentToken.value}`, currentToken.line, currentToken.column);
                }
                currentToken = peekToken();
            }
        } else if (kind === 'global' || kind === 'memory' || kind === 'table') {
            // For global, memory, table, parse their type signature
            // e.g., (global $g1 i32), (memory 1 10), (table 10 anyfunc)
            // These details are not strictly needed by `importedFunc` in parser.mjs for `loc`
            // but good for complete AST. For now, just consume until ')'
            let GTMToken = peekToken();
            while (GTMToken && GTMToken.value !== ')') {
                skipToken(); 
                GTMToken = peekToken();
            }
        } else {
            throw createError(`Unsupported import kind '${kind}'`, kindLoc.line, kindLoc.column);
        }

        // Skip closing paren of the entity type (func, global, memory, table)
        if (peekToken() && peekToken().value === ')') {
            skipToken();
        } else {
            throw createError(`Expected ')' to close import entity definition started with '${kind}'`, kindLoc.line, kindLoc.column);
        }
    } else {
         throw createError(`Expected '(' to start import entity definition but got ${currentToken ? currentToken.value : "EOF"}`, 
                           fieldNameLoc ? fieldNameLoc.line : (moduleNameLoc ? moduleNameLoc.line : 0), 
                           fieldNameLoc ? fieldNameLoc.column + fieldName.length + 2 : (moduleNameLoc ? moduleNameLoc.column + moduleName.length + 2 : 0 ));
    }
    

    const importDecl = {
        type: 'import_decl', // Explicit type for this AST node
        module: moduleName,
        moduleNameLoc,
        field: fieldName,
        fieldNameLoc,
        kind: kind,
        kindLoc,
        typeSignatureLoc, // loc of '(' starting the (func/global/memory/table ...)
        loc: mainLoc // Overall loc for the import statement
    };

    if (kind === 'func') {
        importDecl.name = funcName; // This is the WAT name like $foo
        importDecl.nameLoc = funcNameLoc;
        importDecl.params = params; // Array of {value, loc}
        importDecl.results = results; // Array of {value, loc}
    }
    // TODO: Add specific parsing for global, memory, table types if needed for AST

    return importDecl;
}