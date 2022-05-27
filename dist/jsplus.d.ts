declare interface ArrayConstructor {
    range(start: number, end?: number): Array<number>;
    generate<T>(n: number, func: (num: number) => T): Array<T>;
}
declare interface Array<T> {
    groupsOf(n: number): Array<Array<T>>;
    last(): T | null;
    sample(): T;
    sampleAndRemove(): T;
    min(): number;
    max(): number;
    range(): number;
    remove(elem: T): void;
    removeExact(elem: T): void;
}
declare var $: {
    onload: (handler: (e: Event) => void) => void;
    q: (selector: string) => HTMLElement;
    qa: (selector: string) => NodeList;
};
declare const SVGNS = "http://www.w3.org/2000/svg";
declare class Elem {
    tagName: string;
    classes: Array<string>;
    styles: Array<[string, string]>;
    attrs: Array<[string, string]>;
    events: Map<string, Function>;
    parent: HTMLElement | SVGElement | null;
    id: string | null;
    src: string | null;
    text: string | null;
    constructor(tagName: string);
    withStyle(rule: string, value: string): Elem;
    withClass(cls: string, ...more: string[]): Elem;
    withClassIf(predicate: boolean, cls: string, ...more: string[]): Elem;
    childOf(parent: HTMLElement | SVGElement): Elem;
    withId(id: string): Elem;
    withText(text: string): this;
    withHtml(html: string): Elem;
    withSrc(src: string): Elem;
    withAttr(attr: string, value: string): Elem;
    on(event: string, handler: Function): Elem;
    buildNS(ns: string): Element;
    build(): HTMLElement;
}
declare class HTTP {
    verb: string;
    url: string;
    req: XMLHttpRequest;
    onProgress: ((response: any) => void) | null;
    onSuccess: ((response: any) => void) | null;
    onError: ((response: any) => void) | null;
    onComplete: ((response: any) => void) | null;
    constructor(verb: string, url: string);
    static get(url: string): HTTP;
    static post(url: string): HTTP;
    static put(url: string): HTTP;
    static patch(url: string): HTTP;
    static delete(url: string): HTTP;
    success(handler: (response: any) => void): this;
    error(handler: (response: any) => void): this;
    finally(handler: (response: any) => void): this;
    progress(handler: (response: any) => void): this;
    responseType(ty: XMLHttpRequestResponseType): this;
    send(): this;
}
declare interface Math {
    clamp(x: number, min: number, max: number): number;
    lerp(a: number, b: number, x: number): number;
    randomPointInCircle(): [number, number];
    randomNormalDeviate(): number;
    randomGammaDeviate(shape?: number): number;
    betaSample(mean: number, variance: number): number;
    randomIntRangeInclusive(min: number, max: number): number;
}
declare function isFunction(arg: any): boolean;
declare function isNumber(num: any): boolean;
declare function xor(a: boolean, b: boolean): boolean;
declare interface Object {
    deepCopy(obj: any): any;
}
declare class WeightedRandom<T> {
    weights: Array<{
        weight: number;
        value: T;
    }>;
    duped: Array<T> | null;
    constructor(weights: Array<{
        weight: number;
        value: T;
    }>);
    sample(): T;
}
declare interface String {
    toTitleCase(): String;
    toSnakeCase(): String;
    last(): String;
}
