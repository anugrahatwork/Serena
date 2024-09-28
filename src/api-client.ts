import fetch from './universal-fetch'

class ApiClient {
    private _url: string = "";
    private _method: string = "";
    private _headers: HeadersInit | undefined;

    constructor() {}

    createClient(url: string): this {
        this._url = url || "";
        return this;
    }

    GET(path: string): GET {
        this._method = "GET";
        return new GET(this, path);
    }

    POST(path: string): POST {
        this._method = "POST";
        return new POST(this, path);
    }

    PUT(path: string): PUT {
        this._method = "PUT";
        return new PUT(this, path);
    }

    DELETE(path: string): DELETE  {
        this._method = "DELETE";
        return new DELETE(this, path);
    }

    addHeaders(headers: HeadersInit | undefined): this {
        this._headers = headers;
        return this;
    }

    addUrl(additionalPath: string) {
        this._url += additionalPath;
    }

    getMethod(): string {
        return this._method;
    }

    getUrl(): string {
        return this._url;
    }

    getHeaders(): HeadersInit | undefined {
        return this._headers;
    }
}

class GET extends ApiClient {
    private _lastParam: string | undefined;

    constructor(apiClient: ApiClient, path = "") {
        super();
        super.createClient(apiClient.getUrl() + path);
        this.addHeaders(apiClient.getHeaders());
    }

    fetch(): Promise<Response> {
        return fetch(this.getUrl(), {
            method: 'GET',
            headers: this.getHeaders() || {}
        })
    }

    addParam(param: string, value: string): this {
        this.addUrl(this._lastParam ? `&${param}=${value}` : `?${param}=${value}`);
        this._lastParam = param;
        return this;
    }
}

class POST extends ApiClient {
    private _lastParam: string | undefined;
    private _body: object | undefined;

    constructor(apiClient: ApiClient, path = "") {
        super();
        super.createClient(apiClient.getUrl + path);
        this.addHeaders(apiClient.getHeaders());
    }

    send(): Promise<Response> {
        return fetch(this.getUrl(), {
            method: 'POST',
            headers: this.getHeaders() || {},
            body: JSON.stringify(this._body || {})
        });
    }

    addBody(body: object): this {
        this._body = body;
        return this;
    }

    addParam(param: string, value: string): this {
        this.addUrl(this._lastParam ? `&${param}=${value}` : `?${param}=${value}`);
        this._lastParam = param;
        return this;
    }

}

class PUT extends ApiClient {
    private _lastParam: string | undefined;
    private _body: object | undefined;

    constructor(apiClient: ApiClient, path = "") {
        super();
        super.createClient(apiClient.getUrl() + path);
        this.addHeaders(apiClient.getHeaders());
    }

    send(): Promise<Response> {
        return fetch(this.getUrl(), {
            method: 'PUT',
            headers: this.getHeaders() || {},
            body: JSON.stringify(this._body || {})
        })
    }

    addBody(body: object): this {
        this._body = body;
        return this;
    }

    addParam(param: string, value: string): this {
        this.addUrl(this._lastParam ? `&${param}=${value}` : `?${param}=${value}`);
        this._lastParam = param;
        return this;
    }
}

class DELETE extends ApiClient {
    private _lastParam: string | undefined;

    constructor(apiClient: ApiClient, path = "") {
        super();
        super.createClient(apiClient.getUrl() + path);
        this.addHeaders(apiClient.getHeaders());
    }

    send(): Promise<Response> {
        return fetch(this.getUrl(), {
            method: 'DELETE',
            headers: this.getHeaders() || {}
        })
    }

    addParam(param: string, value: string): this {
        this.addUrl(this._lastParam ? `&${param}=${value}` : `?${param}=${value}`);
        this._lastParam = param;
        return this;
    }
}

export {ApiClient, GET, POST, PUT, DELETE}