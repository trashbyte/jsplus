// Free-standing functions /////////////////////////////////////////////////////

function isFunction(arg: any): boolean {
  return toString.call(arg) === '[object Function]';
}


function isNumber(num: any): boolean {
  return (typeof num === 'number') ? num - num === 0 : false;
}

function xor(a: boolean, b: boolean): boolean {
	return (a && !b) || (!a && b);
}


// Object extensions ///////////////////////////////////////////////////////////

declare interface Object {
	deepCopy(obj: any): any
}

Object.deepCopy = function(obj) {
	if (obj === null || typeof (obj) !== 'object' || '__isActiveClone__' in obj) { return obj }

	let temp = obj instanceof Date ? new Date(obj) : obj.constructor()

    for (let key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            obj['__isActiveClone__'] = null
            temp[key] = Object.deepCopy(obj[key])
            delete obj['__isActiveClone__']
        }
    }
    return temp
}


// Weighted random /////////////////////////////////////////////////////////////

class WeightedRandom<T> {
	duped: Array<T>|null = null

	constructor(public weights: Array<{ weight: number, value: T }>) { }

	sample(): T {
		if (this.duped === null) {
			this.duped = []
			for (let w of this.weights) {
				for (let _ of [...Array(w.weight)]) { this.duped.push(w.value) }
			}
		}
		let roll = Math.floor(Math.random() * this.duped.length)
		return this.duped[roll]
	}
}
