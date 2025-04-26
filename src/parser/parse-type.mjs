import { getCurrentCursor, atEnd, peekToken, skipToken, getToken } from './tape.mjs';

export function parseType() {
    const typePos = getCurrentCursor();
    // Parse type declaration: (type $name (func (param i32 i32) (result i32)))
    let name = null;
    let params = [];
    let results = [];

    // Check for type name
    if (!atEnd() && peekToken().startsWith('$')) {
        name = getToken();
    }

    // Parse the function signature
    if (!atEnd() && peekToken() === '(') {
        skipToken() // Skip opening paren

        if (!atEnd() && peekToken() === 'func') {
            skipToken() // Skip 'func' keyword

            // Parse parameters and results
            while (!atEnd() && peekToken() !== ')') {
                if (peekToken() === '(') {
                    skipToken() // Skip opening paren

                    if (!atEnd()) {
                        const keyword = getToken();

                        if (keyword === 'param') {
                            // Parse parameters
                            while (!atEnd() && peekToken() !== ')') {
                                // Skip parameter names if present
                                if (peekToken().startsWith('$')) {
                                    skipToken() // Skip parameter name
                                    if (!atEnd() && peekToken() !== ')') {
                                        params.push(getToken());
                                    }
                                } else {
                                    params.push(getToken());
                                }
                            }
                        } else if (keyword === 'result') {
                            // Parse results
                            while (!atEnd() && peekToken() !== ')') {
                                results.push(getToken());
                            }
                        }

                        // Skip closing paren of param/result
                        if (!atEnd() && peekToken() === ')') {
                            skipToken()
                        }
                    }
                } else {
                    // Skip any unexpected tokens
                    skipToken() // TODO: check this
                }
            }

            // Skip closing paren of func signature
            if (!atEnd() && peekToken() === ')') {
                skipToken()
            }
        } else {
            // Skip unrecognized contents
            while (!atEnd() && peekToken() !== ')') {
                skipToken() // TODO: check this
            }
            skipToken() // Skip closing paren
        }
    }

    return { name, params, results, position: typePos };
}