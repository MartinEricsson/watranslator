import { createDiagnostic } from "../diagnostics.mjs";

const CONST_INIT_TYPES = new Set([
	"i32.const",
	"i64.const",
	"f32.const",
	"f64.const",
	"v128.const",
	"ref.null",
	"ref.func",
	"global.get",
]);

export function validateGlobalInitExpressions(module) {
	for (const global of module.globals || []) {
		if (global.import) continue;
		if (global.invalidInitExpression) {
			throw createDiagnostic({
				stage: "validate",
				code: "WAT_INVALID_GLOBAL_INIT",
				message: `Global initializer must be a constant expression, got ${global.invalidInitExpression}`,
				position: global.position || module.position,
			});
		}
		if (global.init && !CONST_INIT_TYPES.has(global.init.type)) {
			throw createDiagnostic({
				stage: "validate",
				code: "WAT_INVALID_GLOBAL_INIT",
				message: `Global initializer must be a constant expression, got ${global.init.type}`,
				position: global.position || module.position,
			});
		}
	}
}
