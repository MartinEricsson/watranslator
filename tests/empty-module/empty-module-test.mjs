import { readTestData } from '../test-utils.mjs';

async function testEmptyModuleCompilation(debug = false) {
    try {
        const { wasmBuffer } = await readTestData('empty-module/empty-module.wat', debug);

        // Verify the Magic and Version numbers (first 8 bytes)
        const magicBytes = wasmBuffer.slice(0, 4);
        const versionBytes = wasmBuffer.slice(4, 8);

        if(debug) console.log('Magic bytes:', Array.from(magicBytes).map(b => b.toString(16).padStart(2, '0')).join(' '));
        if(debug) console.log('Version bytes:', Array.from(versionBytes).map(b => b.toString(16).padStart(2, '0')).join(' '));

        const expectedMagic = [0x00, 0x61, 0x73, 0x6D]; // \0asm
        const expectedVersion = [0x01, 0x00, 0x00, 0x00]; // version 1

        const magicValid = Array.from(magicBytes).every((b, i) => b === expectedMagic[i]);
        const versionValid = Array.from(versionBytes).every((b, i) => b === expectedVersion[i]);

        if (magicValid && versionValid) {
            console.log('✅ Empty module validation: Magic and Version bytes are correct');

            try {
                const {instance} = await WebAssembly.instantiate(wasmBuffer, {});
                console.log('✅ Empty module successfully instantiated');
                console.log('Exports:', Object.keys(instance.exports));
            } catch (error) {
                console.error('❌ Failed to instantiate WebAssembly module:', error);
                return false;
            }

            return true;
        } else {
            console.error('❌ Empty module validation failed: Incorrect Magic or Version bytes');
            return false;
        }
    } catch (error) {
        console.error('Error during empty module test:', error);
        return false;
    }
}

export default testEmptyModuleCompilation;