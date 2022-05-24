// String extensions ///////////////////////////////////////////////////////////


declare interface String {
    toTitleCase(): String
    toSnakeCase(): String
    last(): String
}


String.prototype.toTitleCase = function(): String {
	let chars = [...this]
	let result = chars.shift().toUpperCase()
	let afterSpace = false
	for (let c of chars) {
		if (c === " " || c === "_") {
			afterSpace = true
			result += " "
		}
		else {
			if (afterSpace) {
				result += c.toUpperCase()
			}
			else {
				result += c.toLowerCase()
			}
			afterSpace = false
		}
	}
	return result
}

String.prototype.toSnakeCase = function(): String {
	return this.toLowerCase().replaceAll(" ", "_")
}

String.prototype.last = function(): String { return [...this].last() }