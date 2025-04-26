import wasmConstants from "../constants.mjs";
import {
    encodeULEB128,
    encodeSLEB128
} from "../compile-utils.mjs";

const {
    INSTR,
    SECTION
} = wasmConstants;

export function dataCountSection(module, binary) {
    if (module.datas && module.datas.length > 0) {
        let dataCountSection = [SECTION.DATA_COUNT]; // Section ID

        // Data count section only has one field: the number of data segments
        const dataCount = module.datas.length;

        // Encode the data count using unsigned LEB128
        const countBytes = [...encodeULEB128(dataCount)];

        // Section size (should be the same as countBytes.length)
        dataCountSection.push(...encodeULEB128(countBytes.length));

        // Section content
        dataCountSection.push(...countBytes);

        binary.push(...dataCountSection);
    }
}

export function dataSection(module, binary) {
    if (module.datas && module.datas.length > 0) {
        let dataSection = [SECTION.DATA]; // Section ID

        // Data entries count
        const dataEntries = [...encodeULEB128(module.datas.length)];

        // Add each data entry
        for (const data of module.datas) {
            if (data.isPassive) {
                // Passive data segment
                dataEntries.push(1); // Segment flags (1 = passive)
                // No memory index or offset for passive segments
            } else {
                // Active data segment
                dataEntries.push(0); // Segment flags (0 = active, memory index 0)
                dataEntries.push(INSTR.I32_CONST); // Offset expression

                // For data section offsets, use signed LEB128 encoding for i32.const values
                // to correctly handle negative offsets
                dataEntries.push(...encodeSLEB128(data.offset));
                dataEntries.push(INSTR.END);
            }

            // Use the pre-processed bytes if available, otherwise encode the raw string
            let bytesArray;
            if (data.bytes && typeof data.bytes === 'object' && Array.isArray(data.bytes.processedBytes)) {
                bytesArray = data.bytes.processedBytes;
            } else {
                // Legacy handling for when bytes is a string
                bytesArray = encodeBytes(data.bytes);
            }

            dataEntries.push(...encodeULEB128(bytesArray.length));
            dataEntries.push(...bytesArray);
        }

        // Section size
        dataSection.push(...encodeULEB128(dataEntries.length));

        // Section content
        dataSection.push(...dataEntries);

        binary.push(...dataSection);
    }
}