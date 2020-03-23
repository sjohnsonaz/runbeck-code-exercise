import { IListResult } from './IListResult';
import { IDocument } from './IDocument';

import Connection from './Connection';

export default class CrudConnection<U extends IDocument> extends Connection {
    base: string;

    constructor(base: string) {
        super();
        this.base = base;
    }

    list(query: Partial<U>): Promise<IListResult<U>> {
        return this.call<IListResult<U>>(this.base + Connection.objectToQueryString(query || {}), {});
    }

    get(id: string): Promise<U> {
        return this.call<U>(Connection.join(this.base, id), {});
    }

    post(data: U): Promise<string> {
        return this.call<string>(this.base, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
    }

    put(id: string, data: U): Promise<boolean> {
        return this.call<boolean>(Connection.join(this.base, id), {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
    }

    delete(id: string): Promise<boolean> {
        return this.call<boolean>(Connection.join(this.base, id), {
            method: 'DELETE'
        });
    }
}
