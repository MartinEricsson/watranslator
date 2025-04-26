export function createError(instr, func, module, message) {
    // Get source position by cascading through available sources
    const pos =
        (instr?.position) || // First try instruction position
        (instr?.operand?.position) || // Then operand position
        (instr?.value?.position) || // Then value position
        (func?.position) || // Then function position
        (module?.position) || // Then module position
        { line: 0, column: 0 }; // Fallback default

    // Format a detailed error message with line number information
    const errorMessage = `${message} at line ${pos.line}, column ${pos.column}`;
    const error = new Error(errorMessage);

    // Store detailed context for better error reporting
    error.context = {
        position: pos,
        instruction: instr ? {
            type: instr.type,
            operand: instr.operand,
            value: instr.value,
            position: instr.position
        } : undefined,
        function: func ? {
            name: func.name,
            position: func.position
        } : undefined,
        module: module ? {
            position: module.position
        } : undefined
    };

    return error;
}