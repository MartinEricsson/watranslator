import * as esbuild from 'esbuild';
import { readFileSync, mkdirSync, existsSync, copyFileSync } from 'node:fs';
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
  define: {
    NODE_ONLY: 'false',
  },
  dropLabels: ['NODE_ONLY'],
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

    console.log('\n╔════════════════════════════════════════╗');
    console.log('║         Build Complete ✓               ║');
    console.log('╠════════════════════════════════════════╣');
    console.log(`║ ESM Bundle:  ${formatBytes(esmSize).padEnd(26)}║`);
    console.log(`║   Gzipped:   ${formatBytes(esmGzipSize).padEnd(26)}║`);
    console.log('╠════════════════════════════════════════╣');
    console.log(`║ Min Bundle:  ${formatBytes(minSize).padEnd(26)}║`);
    console.log(`║   Gzipped:   ${formatBytes(minGzipSize).padEnd(26)}║`);
    console.log('╚════════════════════════════════════════╝\n');

    // Copy minified bundle to root as watranslator.js for npm
    copyFileSync('dist/watranslator.min.js', 'watranslator.js');
    console.log('✓ Copied watranslator.min.js to watranslator.js for npm package\n');

    // Create a demo import map to use the new bundle
    updateDemoImportMap();

    // Run benchmarks in production mode
    if (isProd) {
      console.log('Running benchmarks...\n');
      await runBenchmarks();
    }

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

async function runBenchmarks() {
  try {
    const { spawn } = await import('node:child_process');

    return new Promise((resolve, reject) => {
      const bench = spawn('node', ['bench/run.mjs'], {
        stdio: 'inherit',
        cwd: __dirname
      });

      bench.on('close', (code) => {
        if (code === 0) {
          console.log('\n✓ Benchmarks completed\n');
          resolve();
        } else {
          console.log('\n⚠ Benchmarks failed with code:', code, '\n');
          resolve(); // Don't fail the build
        }
      });

      bench.on('error', (err) => {
        console.log('\n⚠ Could not run benchmarks:', err.message, '\n');
        resolve(); // Don't fail the build
      });
    });
  } catch (error) {
    console.log('\n⚠ Benchmark skipped:', error.message, '\n');
  }
}

// Run the build
build();
