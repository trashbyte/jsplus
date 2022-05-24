// everybody's gotta have a dollar sign shortcut thing right

declare interface Window {
	$: any
}

window.$ = {
	onload: (handler: (e: Event) => void): void => {
		if (document.readyState === "complete") {
			// ensures the handler runs even if $.onload is called after the window onload event fires
			handler(null)
		}
		else window.addEventListener("load", handler)
	},
	q: (selector: string): HTMLElement => document.querySelector(selector),
	qa: (selector: string): NodeList => document.querySelectorAll(selector)
}
