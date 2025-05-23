import wasmConstants from "../constants.mjs";
import { encodeULEB128 } from "../compile-utils.mjs";

const {
    SECTION,
    TYPE
} = wasmConstants;

export function tableSection(tables, binary) {
    // Generated by 🤖
    if (tables.length > 0) {
        let tableSection = [SECTION.TABLE]; // Section ID (4)

        // Table count
        const tableEntries = [...encodeULEB128(tables.length)];

        // Add each table
        for (const table of tables) {
            // Determine table element type
            let elemType;
            switch (table.type) {
                case 'funcref':
                    elemType = TYPE.FUNCREF;
                    break;
                case 'externref':
                    elemType = TYPE.EXTERNREF;
                    break;
                case 'anyref':
                    elemType = TYPE.ANYREF;
                    break;
                default:
                    elemType = TYPE.FUNCREF; // Default to funcref
            }

            tableEntries.push(elemType);

            // Limits - if max is specified, set limit flag to 1
            const hasMax = table.max !== null;
            tableEntries.push(hasMax ? 1 : 0);

            // Minimum size
            tableEntries.push(...encodeULEB128(table.min));

            // Maximum size (if specified)
            if (hasMax) {
                tableEntries.push(...encodeULEB128(table.max));
            }
        }

        // Section size
        tableSection.push(...encodeULEB128(tableEntries.length));

        // Section content
        tableSection.push(...tableEntries);

        binary.push(...tableSection);
    }
}