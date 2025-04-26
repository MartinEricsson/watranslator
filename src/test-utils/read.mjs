// Function to read WAT file content in Node.js environment
const readWATFileNode = async (filePath) => {
    try {
        // Use dynamic import for fs in ES module environment
        const { readFile } = await import('node:fs/promises');
        return await readFile(filePath, 'utf8');
    } catch (error) {
        console.error(`Error reading file from disk: ${error}`);
        throw error;
    }
}

// Function to read WAT file content in browser environment
const readWATFileBrowser = async (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            resolve(event.target.result);
        };
        reader.onerror = (error) => {
            reject(error);
        };
        reader.readAsText(file);
    });
}

// Function to handle string input directly
const readWATString = (watString) => {
    return watString;
}

// Detect environment and export appropriate function
const isNode = typeof process !== 'undefined' &&
    process.versions != null &&
    process.versions.node != null;

const readWATFile = isNode ? readWATFileNode : readWATFileBrowser;

export { readWATFile, readWATString }