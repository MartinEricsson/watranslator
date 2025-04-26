// Function to write WASM file in Node.js environment
const writeWASMFileNode = async (filePath, wasmBinary) => {
    try {
        // Use dynamic import for fs in ES module environment
        const { writeFile } = await import('node:fs/promises');
        await writeFile(filePath, Buffer.from(wasmBinary));
        return true;
    } catch (error) {
        console.error(`Error writing file: ${error}`);
        throw error;
    }
}

// Function to download WASM file in browser environment
const writeWASMFileBrowser = (filename, wasmBinary) => {
    const blob = new Blob([wasmBinary], { type: 'application/wasm' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = filename || 'compiled.wasm';
    a.style.display = 'none';

    document.body.appendChild(a);
    a.click();

    setTimeout(() => {
        URL.revokeObjectURL(url);
        document.body.removeChild(a);
    }, 100);

    return true;
}

// Function to get WASM binary as arraybuffer
const getWASMBinary = (wasmBinary) => {
    return wasmBinary.buffer;
}

// Detect environment and export appropriate function
const isNode = typeof process !== 'undefined' &&
    process.versions != null &&
    process.versions.node != null;

const writeWASMFile = isNode ? writeWASMFileNode : writeWASMFileBrowser;

export { writeWASMFile, getWASMBinary }