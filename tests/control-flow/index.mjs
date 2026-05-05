import testControlFlow from "./control-flow-test.mjs";
import testDeepNestingControlFlow from "./deep-nesting-test.mjs";

Promise.all([testControlFlow(), testDeepNestingControlFlow()]).then(
	(results) => {
		if (results.every(Boolean)) {
			console.log("Control flow test completed successfully!");
			process.exit(0);
		} else {
			console.error("Control flow test failed!");
			process.exit(1);
		}
	},
);
