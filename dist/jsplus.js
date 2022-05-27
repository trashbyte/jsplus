// Array constructor extensions ////////////////////////////////////////////////
Array.range = function (end) {
    return Array.range(0, end);
};
Array.range = function (start, end) {
    let result = [];
    if (end < start) {
        [start, end] = [end, start];
    }
    for (let i = start; i < end; ++i) {
        result.push(i);
    }
    return result;
};
Array.generate = function (n, func) {
    return Array.range(n).map(func);
};
Array.prototype.groupsOf = function (n) {
    let result = [];
    let group = [];
    for (let i = 0; i < this.length; ++i) {
        group.push(this[i]);
        if (i % n == n - 1) {
            result.push(group);
            group = [];
        }
    }
    if (group.length > 0) {
        result.push(group);
    }
    return result;
};
Array.prototype.last = function () {
    return this.length > 0 ? this[this.length - 1] : null;
};
Array.prototype.sample = function () {
    return this[Math.floor(Math.random() * this.length)];
};
Array.prototype.sampleAndRemove = function () {
    let result = this.sample();
    this.remove(result);
    return result;
};
Array.prototype.min = function () {
    if (this.length < 1) {
        throw "Array.min() called on empty array.";
    }
    let min = this[0];
    for (let i = 1; i < this.length; ++i) {
        if (this[i] < min) {
            min = this[i];
        }
    }
    return min;
};
Array.prototype.max = function () {
    if (this.length < 1) {
        throw "Array.max() called on empty array.";
    }
    let max = this[0];
    for (let i = 1; i < this.length; ++i) {
        if (this[i] > max) {
            max = this[i];
        }
    }
    return max;
};
Array.prototype.range = function () {
    return this.length > 0 ? (this.max() - this.min()) : 0;
};
Array.prototype.remove = function (elem) {
    let i = 0;
    while (i < this.length) {
        if (this[i] == elem) {
            this.splice(i, 1);
        }
        else {
            ++i;
        }
    }
};
Array.prototype.removeExact = function (elem) {
    let i = 0;
    while (i < this.length) {
        if (this[i] === elem) {
            this.splice(i, 1);
        }
        else {
            ++i;
        }
    }
};
// everybody's gotta have a dollar sign shortcut thing right
var $ = {
    onload: (handler) => {
        if (document.readyState === "complete") {
            // ensures the handler runs even if $.onload is called after the window onload event fires
            handler(null);
        }
        else
            window.addEventListener("load", handler);
    },
    q: (selector) => document.querySelector(selector),
    qa: (selector) => document.querySelectorAll(selector)
};
// Element builder /////////////////////////////////////////////////////////////
const SVGNS = "http://www.w3.org/2000/svg";
class Elem {
    constructor(tagName) {
        this.classes = [];
        this.styles = [];
        this.attrs = [];
        this.events = new Map();
        this.parent = null;
        this.id = null;
        this.src = null;
        this.text = null;
        this.tagName = tagName;
    }
    withStyle(rule, value) {
        this.styles.push([rule, value]);
        return this;
    }
    withClass(cls, ...more) {
        this.classes.push(cls);
        more.forEach(c => this.classes.push(c));
        return this;
    }
    withClassIf(predicate, cls, ...more) {
        if (predicate) {
            this.classes.push(cls);
            more.forEach(c => this.classes.push(c));
        }
        return this;
    }
    childOf(parent) {
        this.parent = parent;
        return this;
    }
    withId(id) {
        this.id = id;
        return this;
    }
    withText(text) {
        this.text = text.replaceAll('&', '&amp;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;')
            .replaceAll('"', '&quot;')
            .replaceAll("'", '&#039;');
        return this;
    }
    withHtml(html) {
        this.text = html;
        return this;
    }
    withSrc(src) {
        this.src = src;
        return this;
    }
    withAttr(attr, value) {
        this.attrs.push([attr, value]);
        return this;
    }
    on(event, handler) {
        this.events.set(event, handler);
        return this;
    }
    buildNS(ns) {
        let e = document.createElementNS(ns, this.tagName);
        this.classes.forEach(c => e.classList.add(c));
        this.attrs.forEach(([attr, value]) => e.setAttribute(attr, value));
        this.styles.forEach(([rule, value]) => e.style.setProperty(rule, value));
        if (this.id !== null) {
            e.id = this.id;
        }
        if (this.text !== null) {
            e.textContent = this.text;
        }
        if (this.src !== null) {
            e.src = this.src;
        }
        if (this.parent !== null) {
            this.parent.appendChild(e);
        }
        for (let event in this.events) {
            e.addEventListener(event, this.events.get(event), false);
        }
        return e;
    }
    build() {
        let e = document.createElement(this.tagName);
        this.classes.forEach(c => e.classList.add(c));
        this.attrs.forEach(([attr, value]) => e.setAttribute(attr, value));
        this.styles.forEach(([rule, value]) => e.style.setProperty(rule, value));
        if (this.id !== null) {
            e.id = this.id;
        }
        if (this.text !== null) {
            e.textContent = this.text;
        }
        if (this.src !== null) {
            e.src = this.src;
        }
        if (this.parent !== null) {
            this.parent.appendChild(e);
        }
        for (let event in this.events) {
            e.addEventListener(event, this.events.get(event), false);
        }
        return e;
    }
}
// HTTP ////////////////////////////////////////////////////////////////////////////////////////////
// TODO: status codes, body/params, timeout, headers
//HTTP.get("example.com")
//	.urlParams([["q", "src"], ["id", "0"]])
//	.body({})
//	.contentType("")
//	.header("", "")
//	.header("", "")
//	.timeout(0)
class HTTP {
    constructor(verb, url) {
        this.verb = verb;
        this.url = url;
        this.onProgress = null;
        this.onSuccess = null;
        this.onError = null;
        this.onComplete = null;
        this.req = new XMLHttpRequest();
        let self = this;
        this.req.addEventListener("progress", (evt) => {
            if (self.onProgress !== null && evt.lengthComputable) {
                self.onProgress.apply(self, [evt.loaded / evt.total]);
            }
        });
        this.req.addEventListener("load", (evt) => {
            if (self.onSuccess !== null) {
                self.onSuccess.apply(self, [self.req.response]);
            }
            if (self.onComplete !== null) {
                self.onComplete.apply(self, [self.req.response]);
            }
        });
        let errorHandler = (evt) => {
            if (self.onError !== null) {
                self.onError.apply(self, [self.req.response]);
            }
            if (self.onComplete !== null) {
                self.onComplete.apply(self, [self.req.response]);
            }
        };
        this.req.addEventListener("error", errorHandler);
        this.req.addEventListener("abort", errorHandler);
    }
    static get(url) {
        return new HTTP("GET", url);
    }
    static post(url) {
        return new HTTP("POST", url);
    }
    static put(url) {
        return new HTTP("PUT", url);
    }
    static patch(url) {
        return new HTTP("PATCH", url);
    }
    static delete(url) {
        return new HTTP("DELETE", url);
    }
    success(handler) {
        if (!(handler instanceof Function)) {
            throw new TypeError("HTTP request success handler must be a function.");
        }
        this.onSuccess = handler;
        return this;
    }
    error(handler) {
        if (!(handler instanceof Function)) {
            throw new TypeError("HTTP request error handler must be a function.");
        }
        this.onError = handler;
        return this;
    }
    finally(handler) {
        if (!(handler instanceof Function)) {
            throw new TypeError("HTTP request complete handler must be a function.");
        }
        this.onComplete = handler;
        return this;
    }
    progress(handler) {
        if (!(handler instanceof Function)) {
            throw new TypeError("HTTP request progress handler must be a function.");
        }
        this.onProgress = handler;
        return this;
    }
    responseType(ty) {
        this.req.responseType = ty;
        return this;
    }
    send() {
        this.req.open(this.verb, this.url);
        this.req.send();
        return this;
    }
}
// Math extensions /////////////////////////////////////////////////////////////
Math.clamp = function (x, min, max) {
    return Math.min(Math.max(min, x), max);
};
Math.lerp = function (a, b, x) {
    return (a * (1 - x)) + (b * x);
};
Math.randomPointInCircle = function () {
    let angle = Math.random() * 2.0 * Math.PI;
    let r = Math.random() + Math.random();
    if (r > 1) {
        r = 2 - r;
    }
    return [r * Math.cos(angle), r * Math.sin(angle)];
};
Math.randomNormalDeviate = function () {
    let u, v, q;
    do {
        u = Math.random();
        v = 1.7156 * (Math.random() - 0.5);
        let x = u - 0.449871;
        let y = Math.abs(v) + 0.386595;
        q = x * x + y * (0.19600 * y - 0.25472 * x);
    } while (q > 0.27597 && (q > 0.27846 || v * v > -4 * Math.log(u) * u * u));
    return v / u;
};
Math.randomGammaDeviate = function (shape) {
    if (shape === undefined)
        shape = 1;
    let oalph = shape;
    let u = 0;
    let v = 0;
    let x = 0;
    if (shape < 1)
        shape += 1;
    let a1 = shape - 1 / 3;
    let a2 = 1 / Math.sqrt(9 * a1);
    do {
        do {
            x = Math.randomNormalDeviate();
            v = 1 + a2 * x;
        } while (v <= 0);
        v = v * v * v;
        u = Math.random();
    } while (u > 1 - 0.331 * Math.pow(x, 4) && Math.log(u) > 0.5 * x * x + a1 * (1 - v + Math.log(v)));
    // alpha > 1
    if (shape == oalph)
        return a1 * v;
    // alpha < 1
    do {
        u = Math.random();
    } while (u === 0);
    return Math.pow(u, 1 / oalph) * a1 * v;
};
// Returns a random sample from a beta distribution with the given mean and variance.
// 0 variance is undefined
// v = 0 to 0.35 is a bell curve
// v ~= 0.35 is uniform
// v > 0.35 is an inverse bell curve
Math.betaSample = function (mean, variance) {
    let n = (mean * (1.0 - mean)) / (variance * variance);
    let alpha = mean * n;
    let beta = (1.0 - mean) * n;
    let u = Math.randomGammaDeviate(alpha);
    return u / (u + Math.randomGammaDeviate(beta));
};
Math.randomIntRangeInclusive = function (min, max) {
    min = Math.trunc(min);
    max = Math.trunc(max) + 1;
    return Math.floor(Math.random() * (max - min)) + min;
};
// Free-standing functions /////////////////////////////////////////////////////
function isFunction(arg) {
    return toString.call(arg) === '[object Function]';
}
function isNumber(num) {
    return (typeof num === 'number') ? num - num === 0 : false;
}
function xor(a, b) {
    return (a && !b) || (!a && b);
}
Object.deepCopy = function (obj) {
    if (obj === null || typeof (obj) !== 'object' || '__isActiveClone__' in obj) {
        return obj;
    }
    let temp = obj instanceof Date ? new Date(obj) : obj.constructor();
    for (let key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            obj['__isActiveClone__'] = null;
            temp[key] = Object.deepCopy(obj[key]);
            delete obj['__isActiveClone__'];
        }
    }
    return temp;
};
// Weighted random /////////////////////////////////////////////////////////////
class WeightedRandom {
    constructor(weights) {
        this.weights = weights;
        this.duped = null;
    }
    sample() {
        if (this.duped === null) {
            this.duped = [];
            for (let w of this.weights) {
                for (let _ of [...Array(w.weight)]) {
                    this.duped.push(w.value);
                }
            }
        }
        let roll = Math.floor(Math.random() * this.duped.length);
        return this.duped[roll];
    }
}
// String extensions ///////////////////////////////////////////////////////////
String.prototype.toTitleCase = function () {
    let chars = [...this];
    let result = chars.shift().toUpperCase();
    let afterSpace = false;
    for (let c of chars) {
        if (c === " " || c === "_") {
            afterSpace = true;
            result += " ";
        }
        else {
            if (afterSpace) {
                result += c.toUpperCase();
            }
            else {
                result += c.toLowerCase();
            }
            afterSpace = false;
        }
    }
    return result;
};
String.prototype.toSnakeCase = function () {
    return this.toLowerCase().replaceAll(" ", "_");
};
String.prototype.last = function () { return [...this].last(); };

//# sourceMappingURL=jsplus.js.map
