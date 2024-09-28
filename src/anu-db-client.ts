import { ApiClient, GET, POST, PUT, DELETE } from './api-client';

type Headers = Record<string, string>;
type Data = Record<string, any>;

class AnuDbClient {
    private _apiClient: ApiClient;
    private _table: string | undefined;
    private _method: GET | POST | PUT | DELETE | undefined;

    constructor(url: string, key: string) {
        this._apiClient = new ApiClient().createClient(url || "");
        this._apiClient.addHeaders({
            "Content-Type": "application/json",
            "X-Api-Key": key || ""
        });
        return this;
    }

    addHeaders(headers: Headers): this {
        this._apiClient.addHeaders(headers);
        return this;
    }

    from(table: string): this {
        this._table = table;
        return this;
    }

    select(...columns: string[]): this | undefined {
        if(this._apiClient.getMethod() && this._apiClient.getMethod() !== "GET") {
            return;
        }
        this._method = this._apiClient.GET(`/${this._table}`);
        let stringBuilder = ""
        columns.forEach((column) => {
            stringBuilder += column + ",";
        });
        this._method.addParam("select", stringBuilder.slice(0, -1));
        return this;
    }

    insert(data: Data): this | undefined {
        if(this._apiClient.getMethod() && this._apiClient.getMethod() !== "POST") {
            return;
        }
        console.log("inserted");
        this._method = this._apiClient.POST(`/${this._table}`);
        this._method.addBody(data);
        return this;
    }

    where(data: Data = {}): this {
        Object.keys(data).forEach((key) => {
            this._method?.addParam(key, `eq.${data[key]}`)
        });
        return this;
    }

    go(): Promise<Response> | undefined {
        console.log(this._apiClient.getUrl())
        if(this._apiClient.getMethod() === "GET") {
            const method = this._method as GET
            return method?.fetch();
        } else {
            const method = this._method as POST | PUT | DELETE
            return method?.send();
        }
    }
}

module.exports = {AnuDbClient}