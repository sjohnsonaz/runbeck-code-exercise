export default class Connection {
    async call<T>(url: string | Request, init?: RequestInit, noParse: boolean = false): Promise<T> {
        init = this.beforeCall(url, init, noParse);
        let response = await fetch(url, init);
        let result = noParse ?
            await response.text() :
            await response.json();
        if (response.status < 200 || response.status >= 300) {
            throw result;
        }
        return result;
    }

    beforeCall(url: string | Request, init: RequestInit, noParse: boolean): RequestInit {
        // TODO: Suppressing warning
        url;
        noParse;
        return init || {};
    }

    static objectToQueryString(obj: { [index: string]: any; }) {
        var values = [];
        for (var name in obj) {
            if (obj.hasOwnProperty(name)) {
                var value = obj[name];
                if (value instanceof Array) {
                    for (var index = 0, length = value.length; index < length; index++) {
                        values.push(name + '[]=' + encodeURIComponent(value[index]));
                    }
                } else if (value !== undefined) {
                    values.push(name + '=' + encodeURIComponent(value));
                }
            }
        }
        return '?' + values.join('&');
    }

    static objectToUrlString(obj: { [index: string]: any; }) {
        var values = [];
        for (var name in obj) {
            if (obj.hasOwnProperty(name)) {
                var value = obj[name];
                if (value instanceof Array) {
                    for (var index = 0, length = value.length; index < length; index++) {
                        values.push(name + '[]=' + encodeURIComponent(value[index]));
                    }
                } else if (value !== undefined) {
                    values.push(name + '=' + encodeURIComponent(value));
                }
            }
        }
        return values.join('&');
    }

    static join(...parts: any[]) {
        var joined = parts.join('/');
        return this.normalize(joined);
    }

    static normalize(str: string) {

        // make sure protocol is followed by two slashes
        str = str.replace(/:\//g, '://');

        // remove consecutive slashes
        str = str.replace(/([^:\s])\/+/g, '$1/');

        // remove trailing slash before parameters or hash
        str = str.replace(/\/(\?|&|#[^!])/g, '$1');

        // replace ? in parameters with &
        str = str.replace(/(\?.+)\?/g, '$1&');

        return str;
    }
}