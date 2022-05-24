// Array constructor extensions ////////////////////////////////////////////////


declare interface ArrayConstructor {
    range(start: number, end?: number): Array<number>
    generate<T>(n: number, func: (num: number) => T): Array<T>
}


Array.range = function(end: number) {
	return Array.range(0, end)
}


Array.range = function(start: number, end: number): Array<number> {
	let result = []
    if (end < start) {
        [start, end] = [end, start]
    }
    for (let i = start; i < end; ++i) {
        result.push(i)
    }
	return result
}


Array.generate = function<T>(n: number, func: (num: number) => T): Array<T> {
	return Array.range(n).map(func)
}


// Array extensions ////////////////////////////////////////////////////////////


declare interface Array<T> {
    groupsOf(n: number): Array<Array<T>>
    last(): T|null
    sample(): T
    sampleAndRemove(): T
    min(): number
    max(): number
    range(): number
    remove(elem: T): void
    removeExact(elem: T): void
}


Array.prototype.groupsOf = function(n: number) {
	let result = []
	let group = []
	for (let i = 0; i < this.length; ++i) {
		group.push(this[i])
		if (i % n == n-1) {
			result.push(group)
			group = []
		}
	}
	if (group.length > 0) {
		result.push(group)
	}
	return result
}


Array.prototype.last = function() {
	return this.length > 0 ? this[this.length - 1] : null
}


Array.prototype.sample = function() {
	return this[Math.floor(Math.random() * this.length)]
}


Array.prototype.sampleAndRemove = function() {
	let result = this.sample()
	this.remove(result)
	return result
}


Array.prototype.min = function() {
    if (this.length < 1) { throw "Array.min() called on empty array."; }

    let min = this[0];
    for (let i = 1; i < this.length; ++i) {
        if (this[i] < min) {
            min = this[i];
        }
    }

    return min;
}


Array.prototype.max = function() {
    if (this.length < 1) { throw "Array.max() called on empty array."; }

    let max = this[0];
    for (let i = 1; i < this.length; ++i) {
        if (this[i] > max) {
            max = this[i];
        }
    }

    return max;
}


Array.prototype.range = function() {
    return this.length > 0 ? (this.max() - this.min()) : 0
}


Array.prototype.remove = function(elem) {
    let i = 0
    while (i < this.length) {
    	if (this[i] == elem) { this.splice(i, 1) }
    	else { ++i }
    }
}


Array.prototype.removeExact = function(elem) {
    let i = 0
    while (i < this.length) {
    	if (this[i] === elem) { this.splice(i, 1) }
    	else { ++i }
    }
}