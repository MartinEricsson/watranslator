import { atEnd, getCurrentCursor, peekToken, skipToken, getToken } from './tape.mjs';

export function parseGlobal() {
    // Parse global declaration: (global $name [(mut)] type [init]) or (global $name (import "module" "name") type)
    let name = null;
    let type = null;
    let mutable = false;
    let init = null;
    let importModule = null;
    let importName = null;

    const position = getCurrentCursor();

    // Check for global name
    if (!atEnd() && peekToken().startsWith('$')) {
        name = getToken();
    }

    // Check for mutability or import
    if (!atEnd() && peekToken() === '(') {
        skipToken() // Skip opening paren

        if (!atEnd()) {
            const keyword = peekToken();

            if (keyword === 'mut') {
                mutable = true;
                skipToken() // Skip 'mut'

                // Read the type after 'mut'
                if (!atEnd()) {
                    type = getToken();
                }

                // Skip closing paren of mutability declaration
                if (!atEnd() && peekToken() === ')') {
                    skipToken()
                }
            } else if (keyword === 'import') {
                // Generated by 🤖
                skipToken() // Skip 'import'

                // Parse module name (first string)
                if (!atEnd() && peekToken().startsWith('"') && peekToken().endsWith('"')) {
                    const moduleStr = getToken();
                    importModule = moduleStr.substring(1, moduleStr.length - 1); // Remove quotes
                }

                // Parse field name (second string)
                if (!atEnd() && peekToken().startsWith('"') && peekToken().endsWith('"')) {
                    const fieldStr = getToken();
                    importName = fieldStr.substring(1, fieldStr.length - 1); // Remove quotes
                }

                // Skip closing paren of import declaration
                if (!atEnd() && peekToken() === ')') {
                    skipToken()
                }
            } else {
                // Skip unrecognized expression in parentheses
                while (!atEnd() && peekToken() !== ')') {
                    skipToken()
                }
                skipToken() // Skip closing paren
            }
        }
    }

    // If no mutability was declared, read the type directly
    if (!type && !atEnd()) {
        type = getToken();
    }

    // Parse initialization expression
    if (!atEnd() && peekToken() === '(') {
        skipToken() // Skip opening paren of init expression

        // Currently supporting const expressions like i32.const, f32.const
        if (!atEnd()) {
            const instrType = getToken();

            if (instrType === 'i32.const') {
                if (!atEnd()) {
                    const value = Number.parseInt(getToken(), 10);
                    init = { type: 'i32.const', value };
                }
            } else if (instrType === 'f32.const') {
                if (!atEnd()) {
                    const value = Number.parseFloat(getToken());
                    init = { type: 'f32.const', value };
                }
            } else if (instrType === 'i64.const') {
                if (!atEnd()) {
                    const value = Number.parseInt(getToken(), 10);
                    init = { type: 'i64.const', value };
                }
            } else if (instrType === 'f64.const') {
                if (!atEnd()) {
                    const value = Number.parseFloat(getToken());
                    init = { type: 'f64.const', value };
                }
            }
        }

        // Skip closing paren of init expression
        while (!atEnd() && peekToken() !== ')') {
            skipToken()
        }
        if (!atEnd() && peekToken() === ')') {
            skipToken()
        }
    }

    return {
        name,
        type,
        mutable,
        init,
        position,
        import: importModule && importName ? { module: importModule, field: importName } : null
    };
}