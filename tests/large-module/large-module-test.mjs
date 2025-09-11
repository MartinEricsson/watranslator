import { readTestData } from '../test-utils.mjs';
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

async function testLargeModule(debug = false) {
    try {
        const rel = 'large-module/large-module.wat';
        const { wasmBuffer, ast } = await readTestData(rel, debug);
        if (debug) console.log('Large module AST node count:', ast?.body?.length);

        // Skip optional wabt validation (not needed and environment may lack network)

        const { instance } = await WebAssembly.instantiate(wasmBuffer, {});
        if (typeof instance.exports['triang-10'] !== 'function') return false;

        const t10 = instance.exports['triang-10'](10);
        // Triangular 10 = 55
        if (t10 !== 55) return false;

        const dispatch = instance.exports.dispatch;
        if (dispatch(5, 5) !== 15) return false; // 1+..+5 =15

        return true;
    } catch (e) {
        console.error('Large module test error:', e);
        return false;
    }
}

export default testLargeModule;
