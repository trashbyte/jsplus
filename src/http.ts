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
    req: XMLHttpRequest
    onProgress: ((response: any) => void)|null = null
    onSuccess:  ((response: any) => void)|null = null
    onError:    ((response: any) => void)|null = null
    onComplete: ((response: any) => void)|null = null

    constructor(public verb: string, public url: string) {
        this.req = new XMLHttpRequest()

        let self = this;
        this.req.addEventListener("progress", (evt) => {
            if (self.onProgress !== null && evt.lengthComputable) {
                self.onProgress.apply(self, [evt.loaded / evt.total]);
            }
        });
        this.req.addEventListener("load", (evt) => {
            if (self.onSuccess !== null) {
                self.onSuccess.apply(self, [self.req.response])
            }
            if (self.onComplete !== null) {
                self.onComplete.apply(self, [self.req.response])
            }
        });
        let errorHandler = (evt: any) => {
            if (self.onError !== null) {
                self.onError.apply(self, [self.req.response])
            }
            if (self.onComplete !== null) {
                self.onComplete.apply(self, [self.req.response])
            }
        };
        this.req.addEventListener("error", errorHandler)
        this.req.addEventListener("abort", errorHandler)
    }

    static get(url: string) {
        return new HTTP("GET", url)
    }

    static post(url: string) {
        return new HTTP("POST", url)
    }

    static put(url: string) {
        return new HTTP("PUT", url)
    }

    static patch(url: string) {
        return new HTTP("PATCH", url)
    }

    static delete(url: string) {
        return new HTTP("DELETE", url)
    }

    success(handler: (response: any) => void) {
        if (!(handler instanceof Function)) {
            throw new TypeError("HTTP request success handler must be a function.")
        }
        this.onSuccess = handler
        return this
    }

    error(handler: (response: any) => void) {
        if (!(handler instanceof Function)) {
            throw new TypeError("HTTP request error handler must be a function.")
        }
        this.onError = handler
        return this
    }

    finally(handler: (response: any) => void) {
        if (!(handler instanceof Function)) {
            throw new TypeError("HTTP request complete handler must be a function.")
        }
        this.onComplete = handler
        return this
    }

    progress(handler: (response: any) => void) {
        if (!(handler instanceof Function)) {
            throw new TypeError("HTTP request progress handler must be a function.")
        }
        this.onProgress = handler
        return this
    }

    responseType(ty: XMLHttpRequestResponseType) {
        this.req.responseType = ty
        return this
    }

    send() {
        this.req.open(this.verb, this.url)
        this.req.send()
        return this
    }
}
