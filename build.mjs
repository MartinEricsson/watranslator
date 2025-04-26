import * as esbuild from 'esbuild';
import { readFileSync, mkdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { gzipSync } from 'node:zlib';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Ensure the dist directory exists
const distDir = resolve(__dirname, 'dist');
if (!existsSync(distDir)) {
  mkdirSync(distDir, { recursive: true });
}

// Check if we're in production mode
const isProd = process.env.NODE_ENV === 'production';

// Common build options
const commonOptions = {
  entryPoints: ['src/index.mjs'],
  platform: 'browser',
  bundle: true,
  target: ['es2020'], // Target modern browsers with ES6+ support
  format: 'esm',      // ES modules
  minify: isProd,
  sourcemap: !isProd,
};

async function build() {
  try {
    console.log(`Building ${isProd ? 'production' : 'development'} bundle...`);

    // Build standard ESM bundle
    const esmResult = await esbuild.build({
      ...commonOptions,
      outfile: 'dist/watranslator.esm.js',
    });

    // Build minified bundle for browsers
    const minResult = await esbuild.build({
      ...commonOptions,
      outfile: 'dist/watranslator.min.js',
      minify: true,
    });

    // Report file sizes
    const esmContent = readFileSync('dist/watranslator.esm.js');
    const minContent = readFileSync('dist/watranslator.min.js');

    const esmSize = esmContent.length;
    const minSize = minContent.length;

    // Calculate gzipped sizes
    const esmGzipSize = gzipSync(esmContent).length;
    const minGzipSize = gzipSync(minContent).length;

    console.log('\n==== Build Complete ====');
    console.log(`ESM Bundle:  ${formatBytes(esmSize)} (${formatBytes(esmGzipSize)} gzipped)`);
    console.log(`Min Bundle:  ${formatBytes(minSize)} (${formatBytes(minGzipSize)} gzipped)`);
    console.log('======================');

    // Create a demo import map to use the new bundle
    updateDemoImportMap();

  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${Number.parseFloat((bytes / k ** i).toFixed(decimals))} ${sizes[i]}`;
}

function updateDemoImportMap() {
  // Check if demo file exists
  const demoPath = resolve(__dirname, 'demo', 'index.html');
  if (!existsSync(demoPath)) {
    console.log('Demo index.html not found - skipping import map update');
    return;
  }

  console.log('Updating demo import map to use the new bundle');
}

// Run the build
build();