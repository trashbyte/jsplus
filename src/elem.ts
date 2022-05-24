// Element builder /////////////////////////////////////////////////////////////


const SVGNS = "http://www.w3.org/2000/svg"


class Elem {
	tagName: string
	classes: Array<string> = []
	styles: Array<[string, string]> = []
	attrs: Array<[string, string]> = []
	events: Map<string, Function> = new Map()
	parent: HTMLElement|SVGElement|null = null
	id: string|null = null
	src: string|null = null
	text: string|null = null

	constructor (tagName: string) {
		this.tagName = tagName
	}

	withStyle(rule: string, value: string): Elem {
		this.styles.push([rule, value])
		return this
	}

	withClass(cls: string, ...more: string[]): Elem {
		this.classes.push(cls)
		more.forEach(c => this.classes.push(c))
		return this
	}

	withClassIf(predicate: boolean, cls: string, ...more: string[]): Elem {
		if (predicate) {
			this.classes.push(cls)
			more.forEach(c => this.classes.push(c))
		}
		return this
	}
	
	childOf(parent: HTMLElement|SVGElement): Elem {
		this.parent = parent
		return this
	}
	
	withId(id: string): Elem {
		this.id = id
		return this
	}
	
	withText(text: string) {
		this.text = text.replaceAll('&', '&amp;')
						.replaceAll('<', '&lt;')
						.replaceAll('>', '&gt;')
						.replaceAll('"', '&quot;')
						.replaceAll("'", '&#039;')
		return this
	}
	
	withHtml(html: string): Elem {
		this.text = html
		return this
	}
	
	withSrc(src: string): Elem {
		this.src = src
		return this
	}
	
	withAttr(attr: string, value: string): Elem {
		this.attrs.push([attr, value])
		return this
	}
	
	on(event: string, handler: Function): Elem {
		this.events.set(event, handler)
		return this
	}

	buildNS(ns: string): Element {
		let e = document.createElementNS(ns, this.tagName)
		this.classes.forEach(c => e.classList.add(c))
		this.attrs.forEach(([attr, value]) => e.setAttribute(attr, value))
		this.styles.forEach(([rule, value]) => (e as any).style.setProperty(rule, value))
		if (this.id !== null) { e.id = this.id }
		if (this.text !== null) { e.textContent = this.text }
		if (this.src !== null) { (e as any).src = this.src }
	
		if (this.parent !== null) { this.parent.appendChild(e) }
	
		for (let event in this.events) {
			(e as any).addEventListener(event, this.events.get(event), false)
		}
	
		return e
	}
	
	build(): HTMLElement {
		let e = document.createElement(this.tagName)
		this.classes.forEach(c => e.classList.add(c))
		this.attrs.forEach(([attr, value]) => e.setAttribute(attr, value))
		this.styles.forEach(([rule, value]) => e.style.setProperty(rule, value))
		if (this.id !== null) { e.id = this.id }
		if (this.text !== null) { e.textContent = this.text }
		if (this.src !== null) { (e as any).src = this.src }
	
		if (this.parent !== null) { this.parent.appendChild(e) }
	
		for (let event in this.events) {
			(e as any).addEventListener(event, this.events.get(event), false)
		}
	
		return e
	}
}
