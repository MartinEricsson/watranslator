import { compile } from "../../src/index.mjs";
import { assertBytesEqual } from "../test-utils.mjs";

const GOLDENS = [
	{
		name: "empty module",
		wat: "(module)",
		hex: "0061736d01000000",
	},
	{
		name: "exported add",
		wat: `(module (func (export "a") (param i32 i32) (result i32) local.get 0 local.get 1 i32.add))`,
		hex: "0061736d0100000001070160027f7f017f03020100070501016100000a09010700200020016a0b",
	},
	{
		name: "memory + active data",
		wat: `(module (memory 1) (data (i32.const 0) "hi"))`,
		hex: "0061736d0100000005030100010c01010b08010041000b026869",
	},
];

export default async function testByteExact() {
	try {
		for (const { wat, hex } of GOLDENS) {
			assertBytesEqual(await compile(wat), hex);
		}
		return true;
	} catch (error) {
		console.error("Byte exact test failed:", error);
		return false;
	}
}
