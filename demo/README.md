# WAT Demos

This directory contains demonstration applications for the WAT to WASM compiler.

## Available Demos

### 1. Basic Compiler Demo (`index.html`)
A basic demo showing the WAT to WASM compilation process with predefined examples.

### 2. Source Map Visualizer (`sourcemap-visualizer.html`)
An interactive web application for visualizing source maps generated during WAT to WASM compilation.

#### Features:
- **File Upload**: Load WAT files from your filesystem using the File API
- **Drag & Drop Support**: Drag WAT files directly onto the file input area
- **Interactive Source Map**: Click on source lines or mappings to explore relationships
- **Binary Visualization**: View compiled WASM binary in hexadecimal format
- **Statistics**: Real-time statistics about compilation results
- **Highlighting**: Visual connections between source code, binary, and mappings

#### Usage:
1. Open `sourcemap-visualizer.html` in a modern web browser
2. Click "Click to select a .wat file" or drag & drop a `.wat` file
3. Click "Compile & Generate Source Map" to compile and visualize
4. Explore the relationships by clicking on source lines or mapping entries

#### Technical Details:
- Built with plain JavaScript and CSS (no frameworks)
- Uses the WAT compiler's built-in source map generation
- Source maps include line/column positions, function indices, and binary offsets
- Supports all WAT language features supported by the compiler

## Running the Demos

Start the demo server:
```bash
npm run start:demo
```

Then navigate to:
- http://localhost:9876/demo/index.html (Basic Demo)
- http://localhost:9876/demo/sourcemap-visualizer.html (Source Map Visualizer)