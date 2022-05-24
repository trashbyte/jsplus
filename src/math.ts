// Math extensions /////////////////////////////////////////////////////////////


declare interface Math {
    clamp(x: number, min: number, max: number): number
    lerp(a: number, b: number, x: number): number
    randomPointInCircle(): [number, number]
    randomNormalDeviate(): number
    randomGammaDeviate(shape?: number): number
    betaSample(mean: number, variance: number): number
    randomIntRangeInclusive(min: number, max: number): number
}


Math.clamp = function(x: number, min: number, max: number): number {
	return Math.min(Math.max(min, x), max)
}


Math.lerp = function(a: number, b: number, x: number): number {
	return (a * (1-x)) + (b * x)
}


Math.randomPointInCircle = function() {
    let angle = Math.random() * 2.0 * Math.PI
    let r = Math.random() + Math.random()
    if (r > 1) { r = 2 - r; }
    return [r * Math.cos(angle), r * Math.sin(angle)]
}


Math.randomNormalDeviate = function(): number {
	let u, v, q
	do {
		u = Math.random()
		v = 1.7156 * (Math.random() - 0.5)
		let x = u - 0.449871
		let y = Math.abs(v) + 0.386595
		q = x * x + y * (0.19600 * y - 0.25472 * x)
	} while (q > 0.27597 && (q > 0.27846 || v * v > -4 * Math.log(u) * u * u))
	return v / u
}


Math.randomGammaDeviate = function(shape?: number): number {
  if (shape === undefined)
    shape = 1
  let oalph = shape
  let u = 0
  let v = 0
  let x = 0
  if (shape < 1)
    shape += 1
  let a1 = shape - 1 / 3
  let a2 = 1 / Math.sqrt(9 * a1)
  do {
    do {
      x = Math.randomNormalDeviate()
      v = 1 + a2 * x
    } while(v <= 0)
    v = v * v * v
    u = Math.random()
  } while(u > 1 - 0.331 * Math.pow(x, 4) && Math.log(u) > 0.5 * x*x + a1 * (1 - v + Math.log(v)))
  // alpha > 1
  if (shape == oalph)
    return a1 * v
  // alpha < 1
  do {
    u = Math.random()
  } while(u === 0)
  return Math.pow(u, 1 / oalph) * a1 * v
}


// Returns a random sample from a beta distribution with the given mean and variance.
// 0 variance is undefined
// v = 0 to 0.35 is a bell curve
// v ~= 0.35 is uniform
// v > 0.35 is an inverse bell curve
Math.betaSample = function(mean, variance) {
    let n = (mean * (1.0 - mean)) / (variance * variance)
    let alpha = mean * n
    let beta = (1.0 - mean) * n
    let u = Math.randomGammaDeviate(alpha)
    return u / (u + Math.randomGammaDeviate(beta))
}


Math.randomIntRangeInclusive = function(min: number, max: number) {
	min = Math.trunc(min)
	max = Math.trunc(max) + 1
	return Math.floor(Math.random() * (max-min)) + min
}