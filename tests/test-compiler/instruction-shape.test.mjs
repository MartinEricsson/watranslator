import { parseWAT } from "../../src/parser/parser.mjs";

const fixture = `(module
  (type $binary (func (param i32 i32) (result i32)))
  (table 1 funcref)
  (func $shape (export "shape") (param $x i32) (result i32)
    (local $tmp i32)
    i32.const 1
    local.set $tmp
    block $exit (result i32)
      loop $again
        local.get $x
        i32.eqz
        br_if $exit
        local.get $x
        i32.const 1
        i32.sub
        local.set $x
        br $again
      end
      local.get $tmp
    end
  )
  (func $callee (param i32 i32) (result i32)
    local.get 0
    local.get 1
    i32.add
  )
  (elem (i32.const 0) $callee)
  (func $indirect (export "indirect") (param i32) (result i32)
    i32.const 1
    i32.const 2
    local.get 0
    call_indirect (type $binary)
  )
)`;

function collectInstructions(instructions, out = []) {
	for (const instr of instructions || []) {
		out.push(instr);
		collectInstructions(instr.instructions, out);
		collectInstructions(instr.thenInstructions, out);
		collectInstructions(instr.elseInstructions, out);
	}
	return out;
}

export default async function testInstructionShape() {
	try {
		const [module] = parseWAT(fixture);
		const instructions = module.functions.flatMap((func) =>
			collectInstructions(func.instructions),
		);

		if (instructions.length === 0) {
			throw new Error("Expected fixture to produce instructions");
		}

		for (const instr of instructions) {
			if (Object.hasOwn(instr, "type")) {
				throw new Error(`Instruction ${instr.op || instr.type} still has type`);
			}

			if (typeof instr.op !== "string") {
				throw new Error("Instruction is missing string op");
			}

			if (!instr.immediates || typeof instr.immediates !== "object") {
				throw new Error(`Instruction ${instr.op} is missing immediates`);
			}

			if (!instr.position) {
				throw new Error(`Instruction ${instr.op} is missing position`);
			}
		}

		return true;
	} catch (error) {
		console.error("Instruction shape test failed:", error);
		return false;
	}
}
