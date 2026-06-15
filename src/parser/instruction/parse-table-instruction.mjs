export function parseTableInstruction(tape, instrToken, position) {
	const { atEnd, getToken } = tape;
	if (atEnd()) return null;

	if (instrToken === "table.size") {
		const tableIndex = getToken();
		return { type: "table.size", tableIndex, position };
	}

	if (instrToken === "table.grow") {
		const tableIndex = getToken();
		return { type: "table.grow", tableIndex, position };
	}

	if (instrToken === "table.get") {
		const tableIndex = getToken();
		return { type: "table.get", tableIndex, position };
	}

	if (instrToken === "table.set") {
		const tableIndex = getToken();
		return { type: "table.set", tableIndex, position };
	}

	if (instrToken === "table.init") {
		const elementIndex = getToken();
		const tableIndex = getToken();
		return { type: "table.init", elementIndex, tableIndex, position };
	}

	if (instrToken === "table.copy") {
		const destTableIndex = getToken();
		const srcTableIndex = getToken();
		return { type: "table.copy", destTableIndex, srcTableIndex, position };
	}

	if (instrToken === "table.fill") {
		const tableIndex = getToken();
		return { type: "table.fill", tableIndex, position };
	}

	return null;
}
